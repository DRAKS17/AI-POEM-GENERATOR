// Configuration
const CONFIG = {
    API_BASE_URL: window.location.origin
};

// Initialize variables
let currentPoem = [];
let currentTheme = 'romantic';
let isFirstLine = true;

// DOM elements
const elements = {
    poemDisplay: document.getElementById('poem'),
    userInput: document.getElementById('userInput'),
    generateBtn: document.getElementById('generateBtn'),
    firstLineBtn: document.getElementById('firstLineBtn'),
    newPoemBtn: document.getElementById('newPoemBtn'),
    savePoemBtn: document.getElementById('savePoemBtn'),
    suggestions: document.getElementById('suggestions'),
    loading: document.getElementById('loading'),
    themeButtons: document.querySelectorAll('.theme-btn'),
    serverStatus: document.getElementById('serverStatus'),
    poemStats: document.getElementById('poemStats')
};

// Event listeners
function initializeEventListeners() {
    elements.generateBtn.addEventListener('click', generateLine);
    elements.firstLineBtn.addEventListener('click', generateFirstLine);
    elements.newPoemBtn.addEventListener('click', startNewPoem);
    elements.savePoemBtn.addEventListener('click', savePoem);

    elements.userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') generateLine();
    });

    // Theme selection
    elements.themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            elements.themeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentTheme = this.getAttribute('data-theme');
            updateSuggestions();
        });
    });

    // Suggestion clicks
    elements.suggestions.addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion')) {
            elements.userInput.value = e.target.textContent;
            generateLine();
        }
    });
}

// Check server connection
async function checkServerConnection() {
    try {
        const response = await fetch('/api/health');
        if (response.ok) {
            const data = await response.json();
            const geminiStatus = data.gemini_status === 'Configured' ? '✅' : '⚠️';
            elements.serverStatus.textContent = `${geminiStatus} Server connected (${data.ai_provider})`;
            elements.serverStatus.className = 'server-status connected';
            return true;
        }
    } catch (error) {
        console.error('Server connection failed:', error);
        elements.serverStatus.textContent = '❌ Server connection failed - check if Flask server is running';
        elements.serverStatus.className = 'server-status error';
        return false;
    }
}

// Start a new poem
function startNewPoem() {
    currentPoem = [];
    isFirstLine = true;
    elements.poemDisplay.innerHTML = 'Click "Generate First Line" to start your poetic journey!';
    elements.userInput.value = '';
    updateStats();
    updateSuggestions();
}

// Generate first line using AI
async function generateFirstLine() {
    const userInput = "beginning";
    await generatePoemLine(userInput, true);
}

// Generate next line using AI
async function generateLine() {
    const userInput = elements.userInput.value.trim();
    
    if (!userInput && currentPoem.length > 0) {
        showError('Please enter a word or phrase to inspire the next line');
        return;
    }

    if (currentPoem.length === 0) {
        showError('Please generate a first line first');
        return;
    }

    await generatePoemLine(userInput, false);
}

// Main function to generate poem lines
async function generatePoemLine(userInput, isFirst = false) {
    if (!await checkServerConnection()) {
        showError('Cannot connect to server. Please make sure the Flask server is running.');
        return;
    }

    showLoading();

    try {
        const response = await fetch('/api/generate-poem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                theme: currentTheme,
                userInput: userInput,
                previousLines: isFirst ? [] : currentPoem
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate poem line');
        }

        if (data.success) {
            const newLine = data.line;
            
            if (isFirst) {
                currentPoem = [newLine];
                isFirstLine = false;
            } else {
                currentPoem.push(newLine);
            }

            displayPoem();
            elements.userInput.value = '';
            updateStats();
            updateSuggestions();
            
        } else {
            throw new Error('Failed to generate poem line');
        }

    } catch (error) {
        console.error('Error generating poem line:', error);
        showError(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Display poem with animations
function displayPoem() {
    elements.poemDisplay.innerHTML = '';
    
    currentPoem.forEach((line, index) => {
        const lineElement = document.createElement('div');
        lineElement.className = 'poem-line';
        lineElement.textContent = line;
        lineElement.style.animationDelay = `${index * 0.1}s`;
        elements.poemDisplay.appendChild(lineElement);
    });
}

// Update poem statistics
function updateStats() {
    const lines = currentPoem.length;
    const words = currentPoem.join(' ').split(/\s+/).filter(word => word.length > 0).length;
    const characters = currentPoem.join('').length;
    
    elements.poemStats.textContent = `Lines: ${lines} | Words: ${words} | Characters: ${characters}`;
}

// Update suggestion words based on theme
function updateSuggestions() {
    elements.suggestions.innerHTML = '';
    
    const themeWords = {
        romantic: ['love', 'heart', 'passion', 'embrace', 'eternal', 'desire', 'soul', 'romance'],
        nature: ['forest', 'river', 'mountain', 'breeze', 'horizon', 'sunset', 'ocean', 'wilderness'],
        melancholy: ['memory', 'silence', 'shadow', 'echo', 'fading', 'lonely', 'tears', 'goodbye'],
        inspirational: ['dream', 'hope', 'courage', 'journey', 'believe', 'rise', 'strength', 'victory']
    };
    
    const words = themeWords[currentTheme];
    const selectedWords = [];
    
    // Select 4 unique random words
    while (selectedWords.length < 4 && words.length > 0) {
        const randomIndex = Math.floor(Math.random() * words.length);
        const word = words[randomIndex];
        if (!selectedWords.includes(word)) {
            selectedWords.push(word);
        }
    }
    
    selectedWords.forEach(word => {
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion';
        suggestion.textContent = word;
        elements.suggestions.appendChild(suggestion);
    });
}

// Show loading indicator
function showLoading() {
    elements.loading.style.display = 'flex';
    elements.generateBtn.disabled = true;
    elements.firstLineBtn.disabled = true;
}

// Hide loading indicator
function hideLoading() {
    elements.loading.style.display = 'none';
    elements.generateBtn.disabled = false;
    elements.firstLineBtn.disabled = false;
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 10px;
        margin: 10px 0;
        border: 1px solid #f5c6cb;
    `;
    errorDiv.textContent = message;
    
    elements.poemDisplay.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Save poem to file
async function savePoem() {
    if (currentPoem.length === 0) {
        showError('No poem to save! Generate some lines first.');
        return;
    }
    
    try {
        const response = await fetch('/api/save-poem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                poem: currentPoem,
                theme: currentTheme
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to save poem');
        }

        if (data.success) {
            // Download the file
            window.open(`/download/${data.filename}`, '_blank');
        }
        
    } catch (error) {
        console.error('Error saving poem:', error);
        showError(`Error saving poem: ${error.message}`);
    }
}

// Initialize the application
function init() {
    initializeEventListeners();
    checkServerConnection();
    startNewPoem();
    
    // Display initial instructions
    console.log(`
    🚀 AI Poetry Generator (Google Gemini) Initialized!
    🤖 AI Provider: Gemini 1.5 Flash
    📝 Features:
    - Secure backend API key storage
    - Multiple poetry themes
    - Interactive word suggestions
    - Real-time statistics
    - Poem saving functionality
    
    💡 How to use:
    1. Make sure Flask server is running
    2. Get free API key from: https://aistudio.google.com/app/apikey
    3. Click "Generate First Line" to start
    4. Enter words and click "Generate Next Line"
    5. Use suggestion words for quick input
    6. Save your masterpiece when done!
    `);
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);