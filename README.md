# AI Poetry Generator - Python Flask Edition 📝

A collaborative poetry generator that uses OpenAI's GPT model to create beautiful poems based on your chosen themes and words, built with Python Flask.

## Features

- 🎭 Multiple poetry themes (Romantic, Nature, Melancholy, Inspirational)
- 🤖 AI-powered poem generation using OpenAI GPT
- 🔒 Secure API key storage (server-side only)
- 💫 Beautiful, responsive design
- 📊 Real-time poem statistics
- 💾 Save your poems as text files
- 🎨 Interactive word suggestions
- 🐍 Python Flask backend

🚀 Quick Start

Prerequisites

Python 3.8 or higher

Google Gemini API key (free from Google AI Studio)


📁 Project Structure
ai-poetry-generator/

├── backend/

│   ├── app.py                 # Main Flask application

│   ├── .env                   # Environment variables (create this)

│   └── __init__.py           # Python package file

├── frontend/

│   ├── templates/

│   │   └── index.html        # Main HTML template

│   └── static/

│       ├── css/

│       │   └── style.css     # Stylesheets

│       ├── js/

│       │   └── script.js     # Frontend JavaScript

│       └── uploads/

│           └── .gitkeep      # Empty directory for saved poems

├── run.py                    # Application entry point

├── requirements.txt          # Python dependencies

├── README.md                # This file

└── .gitignore               # Git ignore rules

🎮 How to Use

Start the Server: Run python run.py and open http://localhost:5000

Choose a Theme: Select from Romantic, Nature, Melancholy, or Inspirational

Generate First Line: Click "Generate First Line" to start your poem

Add More Lines: Enter words and click "Generate Next Line" to continue

Use Suggestions: Click on suggested words for quick inspiration

Save Your Poem: Click "Save Poem" to download your creation
