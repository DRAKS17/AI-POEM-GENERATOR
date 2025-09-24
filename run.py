#!/usr/bin/env python3
"""
Main entry point for the AI Poetry Generator Flask application with Google Gemini AI
"""

import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app import app

if __name__ == '__main__':
    # Run the Flask application
    print("🚀 Starting AI Poetry Generator (Google Gemini Edition)...")
    print("🤖 AI Provider: Gemini 1.5 Flash")
    print("🔑 Get your free API key from: https://aistudio.google.com/app/apikey")
    print("📁 Add it to backend/.env file as: GEMINI_API_KEY=your_api_key_here")
    print("🌐 Server will be available at http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)