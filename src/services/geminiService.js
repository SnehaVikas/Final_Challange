/**
 * Gemini Service to handle AI requests using fetch API.
 * This keeps the bundle size minimal.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

/**
 * Static Fallback Data for Demo Mode
 */
const MOCK_LESSON = (concept) => ({
  conceptTitle: concept || "Sample Topic",
  personalizedExplanation: "This is a demo lesson. In a live environment, Gemini would generate a detailed explanation tailored to your level and style. For now, understand that most complex systems are built from simple, repeatable patterns.",
  analogy: "It's like building with LEGO bricks - small, simple pieces combine to create something amazing.",
  keyPoints: [
    "Simplicity is the foundation of complexity.",
    "Patterns allow for scalability and growth.",
    "Consistency ensures reliability across the system."
  ],
  commonMistake: "Over-complicating the initial design instead of focusing on core principles.",
  quiz: [
    { id: 1, question: "What is the foundation of complexity in this demo?", options: ["Luck", "Simplicity", "Heavy machinery", "Infinite resources"], correctAnswer: "Simplicity" },
    { id: 2, question: "What do patterns allow for?", options: ["Confusion", "Slower progress", "Scalability and growth", "System failure"], correctAnswer: "Scalability and growth" },
    { id: 3, question: "What is the common mistake mentioned?", options: ["Using too many colors", "Over-complicating initial design", "Focusing on core principles", "Building too fast"], correctAnswer: "Over-complicating initial design" }
  ]
});

const MOCK_FEEDBACK = {
  score: 3,
  total: 3,
  understandingLevel: "Excellent (Demo Mode)",
  strengths: ["Fast learner", "Great attention to detail"],
  gaps: ["None identified in this demo"],
  feedback: "Great job! You've mastered the demo lesson. In the live version, this feedback would be uniquely crafted based on your specific quiz performance.",
  recommendedNextStep: "Try connecting your real Gemini API key to see dynamic content generation.",
  nextActionType: "advance"
};

export const getDemoLesson = (concept) => MOCK_LESSON(concept);
export const getDemoFeedback = () => MOCK_FEEDBACK;

/**
 * Utility to clean and parse JSON from Gemini's response
 */
const parseGeminiJson = (text) => {
  try {
    // Remove markdown code fences if present
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse Gemini JSON:", error, "Raw text:", text);
    throw new Error("The AI returned an invalid format. Please try again.");
  }
};

/**
 * Generates a personalized lesson and quiz
 */
export const generateLesson = async (learnerProfile) => {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error("Missing Gemini API Key. Please check your .env file.");
  }

  const prompt = `
You are LearnMate AI, a friendly and adaptive learning assistant.

Create a personalized micro-lesson for the learner.

Learner details:
- Concept: ${learnerProfile.concept}
- Current level: ${learnerProfile.level}
- Preferred pace: ${learnerProfile.pace}
- Learning style: ${learnerProfile.style}
- Goal: ${learnerProfile.goal || 'General understanding'}

Rules:
- Keep the explanation suitable for the learner's level.
- If pace is Slow, explain gently with simpler steps.
- If pace is Fast, keep it concise and focused.
- If learning style is Example-based, use a practical example.
- If learning style is Step-by-step, break the explanation into ordered steps.
- Include one real-world analogy.
- Include exactly three key points.
- Include one common mistake.
- Generate exactly 3 multiple-choice quiz questions.
- Each quiz question must have exactly 4 options.
- The correctAnswer must exactly match one of the options.
- Return only valid JSON.
- Do not include markdown.
- Do not include explanations outside JSON.

JSON format:
{
  "conceptTitle": "",
  "personalizedExplanation": "",
  "analogy": "",
  "keyPoints": ["", "", ""],
  "commonMistake": "",
  "quiz": [
    {
      "id": 1,
      "question": "",
      "options": ["", "", "", ""],
      "correctAnswer": ""
    },
    {
      "id": 2,
      "question": "",
      "options": ["", "", "", ""],
      "correctAnswer": ""
    },
    {
      "id": 3,
      "question": "",
      "options": ["", "", "", ""],
      "correctAnswer": ""
    }
  ]
}
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          response_mime_type: "application/json"
        }
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    return parseGeminiJson(text);
  } catch (error) {
    console.error("Lesson generation error:", error);
    throw error;
  }
};

/**
 * Evaluates quiz results and provides adaptive feedback
 */
export const evaluateQuiz = async ({ learnerProfile, quiz, userAnswers }) => {
  const prompt = `
You are LearnMate AI, an adaptive learning evaluator.

Evaluate the learner's quiz answers and decide the next learning step.

Learner details:
- Concept: ${learnerProfile.concept}
- Level: ${learnerProfile.level}
- Pace: ${learnerProfile.pace}
- Learning style: ${learnerProfile.style}

Quiz:
${JSON.stringify(quiz)}

User answers:
${JSON.stringify(userAnswers)}

Rules:
- Compare user answers with correct answers.
- Calculate score out of 3.
- Identify strengths and gaps.
- Recommend next action:
  - revise: if score is 0 or 1
  - practice: if score is 2
  - advance: if score is 3
- Keep feedback encouraging, specific, and short.
- Return only valid JSON.
- Do not include markdown.
- Do not include explanations outside JSON.

JSON format:
{
  "score": 0,
  "total": 3,
  "understandingLevel": "",
  "strengths": [""],
  "gaps": [""],
  "feedback": "",
  "recommendedNextStep": "",
  "nextActionType": "revise"
}
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          response_mime_type: "application/json"
        }
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    return parseGeminiJson(text);
  } catch (error) {
    console.error("Evaluation error:", error);
    throw error;
  }
};
