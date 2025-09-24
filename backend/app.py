from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import logging
from datetime import datetime
import json

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, 
           template_folder='../frontend/templates',
           static_folder='../frontend/static')

# Configure CORS
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY not found in environment variables")

def create_prompt(theme, user_input, previous_lines=None):
    """Create the prompt for Gemini AI based on theme and user input"""
    if previous_lines is None:
        previous_lines = []
    
    prompt = f"You are a creative poet. Generate beautiful, meaningful poetry lines. Always respond with just the poetic line, no explanations or additional text.\n\n"
    prompt += f"Generate a {theme} poem line"
    
    if previous_lines:
        prompt += f" that continues this poem:\n\"{'\\n'.join(previous_lines)}\"\n\n"
        prompt += f"The previous line was: \"{previous_lines[-1]}\"\n"
    else:
        prompt += " as a starting line.\n"
    
    prompt += f"Incorporate the word or theme: \"{user_input}\".\n"
    prompt += "Make it creative, poetic, and ensure it flows naturally. Respond with only the poetic line."
    
    return prompt

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    gemini_status = "Configured" if GEMINI_API_KEY else "Not configured"
    return jsonify({
        'status': 'Server is running',
        'timestamp': datetime.now().isoformat(),
        'python_version': os.sys.version,
        'gemini_status': gemini_status,
        'ai_provider': 'Google Gemini 1.5 Flash'
    })

@app.route('/api/generate-poem', methods=['POST'])
def generate_poem():
    """Generate a poem line using Gemini AI"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data received'}), 400
        
        theme = data.get('theme')
        user_input = data.get('userInput')
        previous_lines = data.get('previousLines', [])
        
        if not theme or not user_input:
            return jsonify({'error': 'Theme and user input are required'}), 400
        
        # Check if Gemini API key is configured
        if not GEMINI_API_KEY:
            return jsonify({
                'error': 'Gemini API key not configured. Please set GEMINI_API_KEY in your .env file.'
            }), 500
        
        # Create the prompt
        prompt = create_prompt(theme, user_input, previous_lines)
        
        logger.info(f"Generating poem for theme: {theme}, input: {user_input}")
        
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Generate content
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=100,
                temperature=0.8
            )
        )
        
        generated_line = response.text.strip()
        
        # Clean up the response (remove any markdown formatting or quotes)
        if generated_line.startswith('"') and generated_line.endswith('"'):
            generated_line = generated_line[1:-1]
        
        logger.info(f"Generated line: {generated_line}")
        
        # Estimate token usage (Gemini doesn't provide exact token counts in response)
        # Rough estimation: 1 token ≈ 4 characters for English text
        input_chars = len(prompt)
        output_chars = len(generated_line)
        estimated_input_tokens = input_chars // 4
        estimated_output_tokens = output_chars // 4
        
        return jsonify({
            'success': True,
            'line': generated_line,
            'usage': {
                'total_tokens': estimated_input_tokens + estimated_output_tokens,
                'prompt_tokens': estimated_input_tokens,
                'completion_tokens': estimated_output_tokens
            }
        })
        
    except Exception as e:
        error_message = str(e)
        logger.error(f"Gemini AI error: {error_message}")
        
        # Handle specific Gemini errors
        if "API_KEY_INVALID" in error_message:
            return jsonify({'error': 'Invalid Gemini API key. Please check your .env file.'}), 401
        elif "quota" in error_message.lower():
            return jsonify({'error': 'API quota exceeded. Please check your Google AI Studio account.'}), 429
        elif "rate limit" in error_message.lower():
            return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429
        else:
            return jsonify({'error': f'Gemini AI error: {error_message}'}), 500

@app.route('/api/save-poem', methods=['POST'])
def save_poem():
    """Save poem to a text file"""
    try:
        data = request.get_json()
        poem_lines = data.get('poem', [])
        theme = data.get('theme', 'unknown')
        
        if not poem_lines:
            return jsonify({'error': 'No poem data to save'}), 400
        
        # Create filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"poem_{theme}_{timestamp}.txt"
        filepath = os.path.join('frontend', 'uploads', filename)
        
        # Ensure uploads directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        # Write poem to file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"AI Generated Poem ({theme.capitalize()})\n")
            f.write("Powered by Google Gemini 1.5 Flash\n\n")
            f.write("\n".join(poem_lines))
            f.write(f"\n\nGenerated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            f.write(f"\nTotal lines: {len(poem_lines)}")
        
        return jsonify({
            'success': True,
            'filename': filename,
            'message': 'Poem saved successfully'
        })
        
    except Exception as e:
        logger.error(f"Error saving poem: {str(e)}")
        return jsonify({'error': f'Failed to save poem: {str(e)}'}), 500

@app.route('/download/<filename>')
def download_poem(filename):
    """Download saved poem file"""
    try:
        return send_from_directory(
            os.path.join('frontend', 'uploads'),
            filename,
            as_attachment=True
        )
    except Exception as e:
        logger.error(f"Error downloading file: {str(e)}")
        return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    # Check if Gemini API key is set
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not found in environment variables")
        print("⚠️  WARNING: GEMINI_API_KEY not configured!")
        print("💡 Get your API key from: https://aistudio.google.com/app/apikey")
        print("📁 Add it to backend/.env file as: GEMINI_API_KEY=your_api_key_here")
    
    # Run the application
    print("🚀 Starting AI Poetry Generator (Google Gemini Edition)...")
    print("🤖 AI Provider: Gemini 1.5 Flash")
    print("🌐 Server will be available at http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)