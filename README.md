
# AI HS Code Predictor

An intelligent tool that analyzes product images to suggest potential Harmonized System (HS) codes, simplifying customs classification for international trade. This application uses the power of the Google Gemini API to provide accurate, multi-step predictions.

![HS Code Predictor Screenshot](https://storage.googleapis.com/aistudio-project-marketplace-public/2192135_5_1_908332/screely.png)

## ✨ Features

- **Image-Based Analysis**: Simply upload a product image to get HS code suggestions.
- **Drag & Drop Interface**: Easy-to-use file uploader supports both clicking and drag-and-drop.
- **Top Suggestions**: Receives the three most likely HS codes, complete with detailed descriptions and reasoning for each.
- **Interactive Refinement**: If the initial analysis is ambiguous, the app asks a targeted clarification question to narrow down the results.
- **Final Confirmation**: Provides a single, refined prediction based on user feedback.
- **Multi-Language Support**: Fully internationalized UI supporting English, Indonesian (Bahasa Indonesia), and Japanese.
- **Dynamic Loading Animation**: Displays the AI's "thinking process" during analysis for an enhanced user experience.
- **Responsive Design**: Works seamlessly on both desktop and mobile devices.

## ⚙️ How It Works

The application follows a logical flow to provide the most accurate HS code possible:

1.  **Image Upload**: The user uploads a product image (PNG, JPG, or WEBP).
2.  **Initial Prediction**: The image is sent to the Gemini API, which returns the three most probable HS code predictions.
3.  **Clarification (If Needed)**: If the initial predictions are distinct enough (e.g., a shoe could be for sports or formal wear), the Gemini API generates a clarifying question with multiple-choice options.
4.  **User Feedback**: The user selects the option that best describes the product.
5.  **Refined Prediction**: The user's answer, along with the original image and initial predictions, is sent back to the Gemini API.
6.  **Final Result**: The API returns a single, highly accurate HS code based on all available information.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI Model**: Google Gemini API (`gemini-2.5-flash`)
- **Icons**: Lucide React

## 🔧 Getting Started

### Prerequisites

You need a Google Gemini API key to run this application.

### Running the Application

1.  **Set up the API Key**: The application is configured to read the API key from an environment variable named `API_KEY`. Ensure this variable is available in the environment where you are running the app.
    ```
    process.env.API_KEY
    ```
2.  **Open the App**: Open the `index.html` file in a modern web browser. The application is self-contained and will start running immediately.

## 📂 File Structure

The project is organized into the following main directories and files:

```
.
├── README.md                 # Project documentation
├── index.html                # HTML entry point
├── index.tsx                 # Main React render entry
├── App.tsx                   # Root application component (state management & layout)
├── metadata.json             # Application metadata
├── translations.ts           # i18n language strings (EN, ID, JA)
├── types.ts                  # Core TypeScript type definitions
├── components/               # Reusable React components
│   ├── ClarificationPrompt.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ImageUploader.tsx
│   ├── Loader.tsx
│   ├── RefinedResultDisplay.tsx
│   └── ResultsDisplay.tsx
└── services/                 # API communication layer
    └── geminiService.ts      # Functions for interacting with the Gemini API
```

## ⚖️ Disclaimer

The suggestions provided are not legally binding. Always consult with a customs professional for official classification.