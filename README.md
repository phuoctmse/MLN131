<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1anRwNTHUGJ7d_d5VdXwkbOCzoJt4k4Sw

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   # Copy the example file
   cp .env.example .env.local
   
   # Edit .env.local and add your API keys:
   # - GEMINI_API_KEY: Get from https://aistudio.google.com/app/apikey
   # - REACT_APP_GOOGLE_MAPS_API_KEY: Get from https://console.cloud.google.com/apis/credentials
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## 🗺️ Google Maps Setup

This project uses Google Maps for the interactive roadmap view. See [GOOGLE_MAPS_SETUP.md](./GOOGLE_MAPS_SETUP.md) for detailed instructions on:

- Creating Google Maps API key
- Configuring security restrictions  
- Setting up for production deployment

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Gemini AI API key for chat functionality | ✅ Yes |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Google Maps API key for roadmap view | ✅ Yes |
