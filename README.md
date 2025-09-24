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

## Project Structure
# AI Poetry Generator - Google Gemini Edition 📝

A collaborative poetry generator that uses Google's Gemini 1.5 Flash model to create beautiful poems based on your chosen themes and words, built with Python Flask.

## Features

- 🎭 Multiple poetry themes (Romantic, Nature, Melancholy, Inspirational)
- 🤖 AI-powered poem generation using Google Gemini 1.5 Flash
- 🔒 Secure API key storage (server-side only)
- 💫 Beautiful, responsive design with Google-themed colors
- 📊 Real-time poem statistics
- 💾 Save your poems as text files
- 🎨 Interactive word suggestions
- 🐍 Python Flask backend
- 🆓 Free to use (Google AI Studio offers free tier)

## Project Structure
ai-poetry-generator-gemini/
│
├── backend/
│ ├── app.py # Main Flask application
│ ├── requirements.txt # Python dependencies
│ ├── .env # Environment variables (create this)
│ └── .gitignore
│
├── frontend/
│ ├── templates/
│ │ └── index.html # Main HTML template
│ ├── static/
│ │ ├── css/
│ │ │ └── style.css # Stylesheet (Google-themed)
│ │ └── js/
│ │ └── script.js # Frontend JavaScript
│ └── uploads/ # Saved poems directory
│
├── run.py # Application entry point
└── README.md

text

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Google Gemini API key ([Get free key here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone or create the project directory**
   ```bash
   mkdir ai-poetry-generator-gemini
   cd ai-poetry-generator-gemini

Create a virtual environment

bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies

bash
pip install -r backend/requirements.txt
Get your Gemini API key

Visit Google AI Studio
Create a new API key (it's free!)
Copy your API key

Set up environment variables
Create a backend/.env file with your Gemini API key:

text
GEMINI_API_KEY=your_gemini_api_key_here


Run the application
bash
python run.py

Open your browser
Navigate to http://localhost:5000
