import React, { useState } from 'react';
import LearnerForm from './components/LearnerForm';
import LessonCard from './components/LessonCard';
import QuizCard from './components/QuizCard';
import FeedbackCard from './components/FeedbackCard';
import { generateLesson, evaluateQuiz, getDemoLesson, getDemoFeedback } from './services/geminiService';

function App() {
  const [step, setStep] = useState('form'); // form, loading, lesson, quiz, feedback
  const [lessonData, setLessonData] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loadingText, setLoadingText] = useState('Analyzing preferences...');

  const steps = [
    { key: 'form', label: 'Setup' },
    { key: 'lesson', label: 'Lesson' },
    { key: 'quiz', label: 'Quiz' },
    { key: 'feedback', label: 'Feedback' }
  ];

  const getCurrentStepIndex = () => {
    if (step === 'loading') {
      // Keep existing active step or determine based on loading context
      if (!lessonData) return 0;
      if (!results) return 2;
      return 3;
    }
    return steps.findIndex(s => s.key === step);
  };

  const handleFormSubmit = async (prefs) => {
    setStep('loading');
    setError(null);
    setPreferences(prefs);
    setLoadingText(`Tailoring your ${prefs.concept} experience...`);
    try {
      let data;
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 800));
        data = getDemoLesson(prefs.concept);
      } else {
        data = await generateLesson(prefs);
      }
      const lesson = {
        title: data.conceptTitle,
        explanation: data.personalizedExplanation,
        analogy: data.analogy,
        keyPoints: data.keyPoints,
        commonMistake: data.commonMistake,
        quiz: data.quiz
      };
      setLessonData(lesson);
      setStep('lesson');
    } catch (err) {
      console.error("Error generating lesson:", err);
      setError(err.message || "Failed to generate lesson. Please try again.");
      setStep('form');
    }
  };

  const handleNextToQuiz = () => {
    setStep('quiz');
  };

  const handleQuizComplete = async (answers) => {
    setStep('loading');
    setLoadingText('Evaluating your performance...');
    try {
      let evaluation;
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 800));
        evaluation = getDemoFeedback();
      } else {
        evaluation = await evaluateQuiz({
          learnerProfile: preferences,
          quiz: lessonData.quiz,
          userAnswers: answers
        });
      }
      setResults(evaluation);
      setStep('feedback');
    } catch (err) {
      console.error("Error evaluating quiz:", err);
      setError("Failed to evaluate quiz. Please try again.");
      setStep('form');
    }
  };

  const handleRestart = () => {
    setLessonData(null);
    setPreferences(null);
    setResults(null);
    setError(null);
    setIsDemoMode(false);
    setStep('form');
  };

  const enableDemoMode = () => {
    setIsDemoMode(true);
    setError(null);
    if (preferences) {
      handleFormSubmit(preferences);
    }
  };

  const currentIdx = getCurrentStepIndex();

  return (
    <div className="container">
      <header>
        <h1 style={{ fontSize: '3rem' }}>LearnMate AI</h1>
        <p className="subtitle">Personalized micro-learning assistant powered by Gemini</p>
      </header>

      <ul className="step-indicator">
        {steps.map((s, i) => (
          <li 
            key={s.key} 
            className={`step-item ${i === currentIdx ? 'active' : ''} ${i < currentIdx ? 'completed' : ''}`}
          >
            {s.label}
          </li>
        ))}
      </ul>

      <main>
        {error && (
          <div className="error-box animate-in">
            <p>Gemini could not respond right now. You can continue with demo mode.</p>
            <button 
              onClick={enableDemoMode} 
              className="secondary" 
              style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', width: 'auto' }}
            >
              Use Demo Mode
            </button>
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.8 }}>Reason: {error}</p>
          </div>
        )}
        
        {step === 'form' && (
          <LearnerForm onSubmit={handleFormSubmit} />
        )}

        {step === 'loading' && (
          <div className="card animate-in" style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="spinner" style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid var(--primary)', 
              borderRadius: '50%', 
              margin: '0 auto 2rem',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.25rem' }}>{loadingText}</p>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Our AI is crafting your personalized content...</p>
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        )}

        {step === 'lesson' && lessonData && (
          <LessonCard 
            lesson={lessonData} 
            preferences={preferences}
            onNext={handleNextToQuiz} 
          />
        )}

        {step === 'quiz' && lessonData && (
          <QuizCard 
            questions={lessonData.quiz} 
            onComplete={handleQuizComplete} 
          />
        )}

        {step === 'feedback' && results && (
          <FeedbackCard 
            results={results} 
            preferences={preferences}
            onRestart={handleRestart} 
          />
        )}
      </main>

      <footer style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} LearnMate AI • Hackathon Edition • Built with Gemini
        </p>
      </footer>
    </div>
  );
}

export default App;
