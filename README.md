# SkillPath AI

## Problem Statement
Traditional education often follows a static, linear approach that fails to account for individual differences in prior knowledge, learning pace, and conceptual gaps. This leads to frustration for learners who are either overwhelmed or under-challenged. **SkillPath AI** solves this by creating an intelligent assistant that helps users learn new concepts effectively through a completely personalized and adaptive journey.

## Chosen Vertical
**Education / Personalized Learning**

## Solution Overview
SkillPath AI is an adaptive learning coach that guides users through a complete mastery cycle. The system:
1. **Diagnoses** current understanding via AI-driven probing questions.
2. **Generates** a personalized lesson tailored to the learner's specific profile and identified gaps.
3. **Quizzes** the learner to verify understanding.
4. **Evaluates** performance with detailed feedback on strengths and weak areas.
5. **Maps** a future learning path with specific roadmap steps.
6. **Extends** learning with curated YouTube resources.
7. **Schedules** momentum with integrated Google Calendar reminders.

## Google Services Used
- **Gemini API (2.5 Flash)**: The core reasoning engine for diagnostics, lesson generation, quiz creation, performance evaluation, and learning path mapping.
- **Google Cloud Firestore**: Persistently stores learning sessions and progress history for anonymous learners.
- **YouTube Data API**: Curates targeted educational resources based on specific learner gaps.
- **Google Calendar (Smart URL Integration)**: A clever, lightweight integration that uses pre-filled Template URLs. This avoids the overhead of OAuth while providing a seamless user experience—a perfect "hackathon trick" for reliability and speed.
- **Google Cloud Run**: Provides a scalable, containerized production environment for the application.

## Key Features
- **Personalized Learner Profile**: Customizes the journey based on level, pace, and learning style.
- **AI-Driven Diagnosis**: A probing question-and-answer stage to find your starting point.
- **Adaptive Coaching**: Lessons that use analogies and examples tailored to your preferences.
- **Mastery Verification**: 5-question AI-generated quizzes that test conceptual understanding.
- **Visual Learning Path**: A roadmap showing where you've been and the next 3 topics to master.
- **Progress History**: Persistent dashboard showing recent learning stats and history.
- **Smart Resource Matching**: Videos targeted at your specific weak areas.
- **One-Click Scheduling**: Deep-linked study reminders for your calendar.
- **Demo Fallback Mode**: A robust simulation mode that allows testing the full UI journey even if API keys are missing.

## Architecture
The application follows a clean, modular architecture:
- **React UI**: Responsive dashboard built with modern CSS and modular components.
- **Service Layer**: A decoupled layer for AI (Gemini), Persistence (Firestore), and External APIs (YouTube/Calendar).
- **Adaptive State Machine**: A central `App.jsx` controller that manages the complex transitions between learning phases.

## Environment Variables
Create a `.env` file with the following variables:
```env
VITE_GEMINI_API_KEY=your_gemini_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_YOUTUBE_API_KEY=your_youtube_key
```

## Local Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` file.
4. Start the development server:
   ```bash
   npm run dev
   ```

## Cloud Run Deployment
Deploy the containerized application to Google Cloud Run:
```bash
gcloud run deploy skillpath-ai --source . --region asia-south1 --allow-unauthenticated
```

## Assumptions
- The application uses anonymous tracking via `localStorage` and Firestore for privacy-first persistence.
- Learning is focused on one concept at a time to ensure micro-mastery.
- YouTube and Calendar integrations are optional and fail gracefully if keys are missing.

## Testing
- **End-to-End**: Verified the flow from setup to scheduling in both "Gemini" and "Demo" modes.
- **Responsive**: Tested on mobile, tablet, and desktop viewports.
- **Resilience**: Verified that the app remains functional even with invalid API keys or network interruptions.

## Security Notes
- API keys are handled via Vite environment variables and are never hardcoded in the source.
- Production builds use a multi-stage Docker build to ensure a minimal attack surface.
- Anonymous IDs are used to avoid handling PII (Personally Identifiable Information).

## Future Scope
- **Interactive Tutoring**: Real-time AI chat during the lesson phase.
- **PDF Analysis**: Allowing users to upload their own study materials for AI to summarize and quiz on.
- **Peer Pathways**: Sharing successful AI-generated learning paths with a community.

---
Built for the Google Gemini Hackathon 🚀
