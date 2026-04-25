/**
 * Gemini Service for SkillPath AI
 * Handles all AI generations using Google's Gemini 1.5 Flash.
 */

import { getEnv } from '../utils/env';

const API_KEY = getEnv('VITE_GEMINI_API_KEY');
const GEMINI_MODEL = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

/**
 * Utility to clean and parse JSON from Gemini's response
 */
const parseGeminiJson = (text) => {
  try {
    // Remove markdown code fences if present (e.g., ```json ... ```)
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse Gemini JSON:", error, "Raw text:", text);
    throw new Error("The AI returned an invalid format. Please try again.");
  }
};

/**
 * Core fetch wrapper for Gemini API
 */
const callGemini = async (prompt, temperature = 0.7) => {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here' || API_KEY === 'your_api_key_here' || API_KEY.includes('your_real_gemini_api_key')) {
    throw new Error("Missing or invalid Gemini API Key. Please check your .env file.");
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: temperature,
          response_mime_type: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error?.message || response.statusText || "Unknown API Error";
      throw new Error(`Gemini API Error: ${message}`);
    }

    const data = await response.json();
    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      throw new Error("Empty response from Gemini API.");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini Call Error:", error);
    throw error;
  }
};

/**
 * 1. Generates a diagnostic question based on the learner's profile
 */
export const generateDiagnostic = async (learnerProfile) => {
  const prompt = `
    You are SkillPath AI, an adaptive learning coach.

    Create one diagnostic question to understand the learner's current knowledge.

    Learner:
    - Concept: ${learnerProfile.concept}
    - Level: ${learnerProfile.level}
    - Pace: ${learnerProfile.pace}
    - Learning style: ${learnerProfile.style}
    - Goal: ${learnerProfile.goal}

    Rules:
    - Ask only one question.
    - Keep it appropriate for the learner level.
    - Return only valid JSON.
    - Do not include markdown.

    JSON:
    {
      "diagnosticQuestion": "",
      "expectedAnswer": "",
      "difficulty": "beginner"
    }
  `;
  const responseText = await callGemini(prompt, 0.5);
  return parseGeminiJson(responseText);
};

/**
 * 2. Evaluates the diagnostic answer
 */
export const evaluateDiagnostic = async ({ learnerProfile, diagnosticQuestion, userAnswer }) => {
  const prompt = `
    You are SkillPath AI, an adaptive learning evaluator.

    Evaluate the learner's diagnostic answer.

    Learner:
    ${JSON.stringify(learnerProfile)}

    Diagnostic:
    ${diagnosticQuestion}

    User answer:
    ${userAnswer}

    Rules:
    - Score from 0 to 2.
    - Identify likely gaps.
    - Explain personalization strategy briefly.
    - Return only valid JSON.

    JSON:
    {
      "diagnosticScore": 0,
      "startingLevel": "",
      "identifiedGaps": ["", ""],
      "personalizationStrategy": ""
    }
  `;
  const responseText = await callGemini(prompt, 0.4);
  return parseGeminiJson(responseText);
};

/**
 * 3. Generates the personalized lesson
 */
export const generateLesson = async ({ learnerProfile, diagnosticEvaluation }) => {
  const prompt = `
    You are SkillPath AI, a friendly adaptive tutor.

    Generate a personalized lesson.

    Learner:
    ${JSON.stringify(learnerProfile)}

    Diagnostic evaluation:
    ${JSON.stringify(diagnosticEvaluation)}

    Rules:
    - Adapt to learner level, pace, and learning style.
    - Address identified gaps.
    - Include simple explanation, analogy, key points, common mistake, and mini example.
    - Return only valid JSON.

    JSON:
    {
      "conceptTitle": "",
      "personalizedExplanation": "",
      "analogy": "",
      "keyPoints": ["", "", ""],
      "commonMistake": "",
      "miniExample": ""
    }
  `;
  const responseText = await callGemini(prompt, 0.7);
  return parseGeminiJson(responseText);
};

/**
 * 4. Generates a 5-question quiz
 */
export const generateQuiz = async ({ learnerProfile, lessonData }) => {
  const prompt = `
    You are SkillPath AI.

    Generate a 5-question multiple-choice quiz for the lesson.

    Learner:
    ${JSON.stringify(learnerProfile)}

    Lesson:
    ${JSON.stringify(lessonData)}

    Rules:
    - Exactly 5 questions.
    - Each question has exactly 4 options.
    - correctAnswer must exactly match one option.
    - Questions should test understanding, not memorization only.
    - Return only valid JSON.

    JSON:
    {
      "quiz": [
        {
          "id": 1,
          "question": "",
          "options": ["", "", "", ""],
          "correctAnswer": ""
        }
      ]
    }
  `;
  const responseText = await callGemini(prompt, 0.6);
  return parseGeminiJson(responseText);
};

/**
 * 5. Evaluates the quiz results
 */
export const evaluateQuiz = async ({ learnerProfile, quiz, userAnswers }) => {
  const prompt = `
    You are SkillPath AI, an adaptive learning evaluator.

    Evaluate the learner's quiz answers.

    Learner:
    ${JSON.stringify(learnerProfile)}

    Quiz:
    ${JSON.stringify(quiz)}

    User answers:
    ${JSON.stringify(userAnswers)}

    Rules:
    - Calculate score out of 5.
    - Identify strengths and weak areas.
    - nextActionType must be:
      - revise if score is 0, 1, or 2
      - practice if score is 3 or 4
      - advance if score is 5
    - Return only valid JSON.

    JSON:
    {
      "score": 0,
      "total": 5,
      "understandingLevel": "",
      "strengths": ["", ""],
      "weakAreas": ["", ""],
      "feedback": "",
      "nextActionType": "revise",
      "recommendedNextStep": ""
    }
  `;
  const responseText = await callGemini(prompt, 0.3);
  return parseGeminiJson(responseText);
};

/**
 * 6. Generates the final learning path
 */
export const generateLearningPath = async ({ learnerProfile, feedback }) => {
  const prompt = `
    You are SkillPath AI, a personalized study planner.

    Create a short learning path based on the learner's performance.

    Learner:
    ${JSON.stringify(learnerProfile)}

    Feedback:
    ${JSON.stringify(feedback)}

    Rules:
    - Recommend exactly 3 next topics.
    - Include one practice task.
    - Include one study strategy.
    - Include confidence level.
    - Return only valid JSON.

    JSON:
    {
      "nextTopics": ["", "", ""],
      "practiceTask": "",
      "studyStrategy": "",
      "confidenceLevel": "",
      "summary": ""
    }
  `;
  const responseText = await callGemini(prompt, 0.5);
  return parseGeminiJson(responseText);
};

// Fallback Mock data for Demo Mode
export const getDemoLesson = (concept) => ({
  conceptTitle: concept || "Quantum Entanglement",
  personalizedExplanation: "Particles connected regardless of distance.",
  analogy: "Magic dice.",
  keyPoints: ["Point 1", "Point 2", "Point 3"],
  commonMistake: "Mistake info.",
  miniExample: "Photon example.",
  quiz: [] // Should populate 5 items in real demo
});

export const getDemoFeedback = () => ({
  score: 5,
  total: 5,
  understandingLevel: "Advanced",
  strengths: ["Logic"],
  weakAreas: ["None"],
  feedback: "Great job!",
  recommendedNextStep: "Next topic.",
  nextActionType: "advance"
});

export const getMockDiagnostic = (concept) => ({
  diagnosticQuestion: `To help me tailor your ${concept} lesson, tell me: What is your current understanding of its core principle?`,
  expectedAnswer: "General understanding of the concept.",
  difficulty: "intermediate"
});
