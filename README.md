# LearnMate AI

## Problem Statement
Traditional learning methods often follow a one-size-fits-all approach, leaving many learners frustrated by content that is either too complex or too basic for their current level. LearnMate AI solves this by creating an intelligent assistant that helps users learn new concepts effectively, personalizing content based on user pace, level, and preferred learning style.

## Chosen Vertical
Education / Personalized Learning

## Solution Overview
LearnMate AI leverages the power of Google's Gemini 1.5 Flash to provide a tailored learning experience:
- **User Input**: Captures the concept to learn, current expertise level, preferred pace, and learning style.
- **Personalized Lesson**: Gemini generates a custom micro-lesson with explanations, analogies, and key points specifically designed for the user.
- **Interactive Quiz**: An AI-generated 3-question quiz tests the user's understanding immediately after the lesson.
- **Adaptive Evaluation**: Gemini evaluates quiz answers and provides encouraging feedback with a recommended next step (Revise, Practice, or Advance).
- **Demo Mode**: Includes a fallback mechanism that ensures a smooth experience even if API limits are reached.

## Key Features
- **Personalized learning**: Content tailored to your unique profile.
- **Adaptive quiz**: Questions that match the lesson complexity.
- **Understanding evaluation**: Real-time feedback on your performance.
- **Next-step recommendation**: Clear guidance on what to do next.
- **Demo fallback mode**: Continuous availability for testing and presentation.

## Google Services Used
- **Gemini API**: Used as the core reasoning engine for lesson generation, quiz creation, and performance evaluation.

## How It Works
1. **Setup**: User enters their learning preferences.
2. **Gemini Lesson**: The app sends a structured prompt to Gemini to generate a JSON-formatted lesson.
3. **Quiz**: User takes the generated quiz.
4. **Gemini Evaluation**: The app sends the user's answers back to Gemini for evaluation.
5. **Adaptive Feedback**: User receives a score and a personalized recommendation for their next learning step.

## Setup Instructions
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Add your Gemini API key to the `.env` file.
5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variable
```env
VITE_GEMINI_API_KEY=your_key_here
```

## Deployment (Cloud Run)
To deploy this application to Google Cloud Run:

1. **Install Google Cloud CLI**: Download and install from [cloud.google.com/sdk](https://cloud.google.com/sdk).
2. **Login**: 
   ```bash
   gcloud auth login
   ```
3. **Set project**: 
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```
4. **Deploy**:
   ```bash
   gcloud run deploy learnmate-ai --source . --region asia-south1 --allow-unauthenticated
   ```
5. Once complete, the command will return a **public URL** where your app is live!

## Assumptions
- **Focused Learning**: The app is designed for learning one concept at a time for maximum focus.
- **Quick Assessment**: A 3-question quiz is assumed to be a sufficient initial check for micro-learning sessions.

## Testing
- **Flow Validation**: Test the end-to-end flow from form submission to feedback.
- **Fallback Verification**: Disconnect the API key to verify that "Demo Mode" triggers correctly.

## Security
- **Secure Keys**: API keys are managed via environment variables.
- **Protection**: The `.env` file is included in `.gitignore` to prevent accidental commits to public repositories.

## Future Scope
- **Firestore Integration**: Persist learning history and progress across sessions.
- **YouTube API**: Automatically suggest relevant videos based on the concept.
- **User Accounts**: Personalized profiles with cumulative learning stats.

---
Built for the Google Gemini Hackathon 🚀
