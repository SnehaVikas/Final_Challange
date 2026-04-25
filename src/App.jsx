import React, { useState, useEffect, useRef } from 'react';
import LearnerProfileForm from './components/LearnerProfileForm';
import DiagnosticCard from './components/DiagnosticCard';
import LessonCard from './components/LessonCard';
import QuizCard from './components/QuizCard';
import FeedbackCard from './components/FeedbackCard';
import LearningPathCard from './components/LearningPathCard';
import YouTubeResources from './components/YouTubeResources';
import StudyReminder from './components/StudyReminder';
import LearningHistory from './components/LearningHistory';
import ProgressSummary from './components/ProgressSummary';

import { 
  generateDiagnostic, 
  evaluateDiagnostic, 
  generateLesson, 
  generateQuiz, 
  evaluateQuiz, 
  generateLearningPath,
  getDemoLesson,
  getDemoFeedback,
  getMockDiagnostic
} from './services/geminiService';
import { getYouTubeResources } from './services/youtubeService';
import { 
  saveLearningSession, 
  getRecentLearningSessions, 
  isFirebaseConfigured 
} from './services/firebaseService';
import { scheduleStudySession } from './services/calendarService';

function App() {
  const [step, setStep] = useState('form'); // form, diagnostic, lesson, quiz, feedback, path, resources, reminder
  const [learnerProfile, setLearnerProfile] = useState(null);
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [diagnosticEvaluation, setDiagnosticEvaluation] = useState(null);
  const [lessonData, setLessonData] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [pathData, setPathData] = useState(null);
  const [resources, setResources] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'
  const [toast, setToast] = useState(null);

  // Refs for interactive badges
  const sidebarRef = useRef(null);
  const youtubeRef = useRef(null);
  const reminderRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getRecentLearningSessions();
      setHistory(data || []);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleProfileSubmit = async (profile) => {
    setIsLoading(true);
    setError(null);
    setLearnerProfile(profile);
    try {
      let diag;
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 800));
        diag = getMockDiagnostic(profile.concept);
      } else {
        diag = await generateDiagnostic(profile);
      }
      setDiagnosticData(diag);
      setStep('diagnostic');
    } catch (err) {
      setError(err.message || "Failed to initialize diagnostic.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiagnosticSubmit = async (userAnswer) => {
    setIsLoading(true);
    setError(null);
    try {
      let evaluation, lesson, quiz;
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 1000));
        evaluation = { diagnosticScore: 1, identifiedGaps: ["Basic patterns"], personalizationStrategy: "Demo strategy", startingLevel: "Beginner" };
        lesson = getDemoLesson(learnerProfile.concept);
        quiz = { quiz: [
          { id: 1, question: "Demo Question 1", options: ["A", "B", "C", "D"], correctAnswer: "A" },
          { id: 2, question: "Demo Question 2", options: ["A", "B", "C", "D"], correctAnswer: "B" },
          { id: 3, question: "Demo Question 3", options: ["A", "B", "C", "D"], correctAnswer: "C" },
          { id: 4, question: "Demo Question 4", options: ["A", "B", "C", "D"], correctAnswer: "D" },
          { id: 5, question: "Demo Question 5", options: ["A", "B", "C", "D"], correctAnswer: "A" }
        ]};
      } else {
        evaluation = await evaluateDiagnostic({
          learnerProfile,
          diagnosticQuestion: diagnosticData.diagnosticQuestion,
          userAnswer
        });
        
        lesson = await generateLesson({ 
          learnerProfile, 
          diagnosticEvaluation: evaluation 
        });
        
        quiz = await generateQuiz({
          learnerProfile,
          lessonData: lesson
        });
      }
      
      setDiagnosticEvaluation(evaluation);
      setLessonData({ ...lesson, quiz: quiz.quiz });
      setStep('lesson');
    } catch (err) {
      setError(err.message || "Failed to process diagnosis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = async (answers) => {
    setIsLoading(true);
    setError(null);
    try {
      let evaluation, path;
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 1000));
        evaluation = getDemoFeedback();
        path = { nextTopics: ["Topic A", "Topic B", "Topic C"], practiceTask: "Demo Task", studyStrategy: "Demo strategy", confidenceLevel: 80 };
      } else {
        evaluation = await evaluateQuiz({
          learnerProfile,
          quiz: lessonData.quiz,
          userAnswers: answers
        });
        
        path = await generateLearningPath({
          learnerProfile,
          feedback: evaluation
        });
      }
      
      setQuizResults(evaluation);
      setPathData(path);
      setStep('feedback');
      setIsLoading(false);

      if (isFirebaseConfigured()) {
        setSaveStatus('saving');
        try {
          await saveLearningSession({
            concept: learnerProfile.concept,
            level: learnerProfile.level,
            pace: learnerProfile.pace,
            learningStyle: learnerProfile.style,
            goal: learnerProfile.goal,
            diagnosticScore: diagnosticEvaluation.diagnosticScore,
            quizScore: evaluation.score,
            quizTotal: evaluation.total,
            understandingLevel: evaluation.understandingLevel,
            strengths: evaluation.strengths,
            weakAreas: evaluation.weakAreas,
            nextTopics: path.nextTopics,
            recommendedNextStep: evaluation.recommendedNextStep
          });
          setSaveStatus('saved');
          loadHistory();
        } catch (saveErr) {
          console.error("Firestore save failed", saveErr);
          setSaveStatus('error');
        }
      }
    } catch (err) {
      console.error("Quiz evaluation error:", err);
      setError(err.message || "Failed to evaluate quiz.");
      setIsLoading(false);
    }
  };

  const handleViewResources = async () => {
    setIsLoading(true);
    try {
      const res = await getYouTubeResources({ 
        concept: learnerProfile.concept,
        weakAreas: quizResults?.weakAreas || [],
        nextTopics: pathData?.nextTopics || []
      });
      setResources(res);
      setStep('resources');
    } catch (err) {
      console.error("Resource error:", err);
      setError("Failed to fetch YouTube resources.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToReminder = () => setStep('reminder');

  const handleSchedule = async (date) => {
    try {
      await scheduleStudySession(learnerProfile.concept, date);
    } catch (err) {
      setError("Failed to schedule reminder.");
    }
  };

  const handleReset = () => {
    setStep('form');
    setLearnerProfile(null);
    setDiagnosticData(null);
    setDiagnosticEvaluation(null);
    setLessonData(null);
    setQuizResults(null);
    setPathData(null);
    setError(null);
    setIsDemoMode(false);
    setSaveStatus(null);
  };

  const enableDemoMode = () => {
    setIsDemoMode(true);
    setError(null);
    if (learnerProfile) {
      if (step === 'form') handleProfileSubmit(learnerProfile);
    }
  };

  const renderLoading = () => (
    <div className="card animate-in" style={{ textAlign: 'center', padding: '4rem' }}>
      <div className="spinner"></div>
      <p style={{ fontWeight: 600, marginTop: '2rem', fontSize: '1.25rem' }}>SkillPath AI is thinking...</p>
      <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
        {isDemoMode ? "Simulating adaptive journey (Demo Mode)" : "Personalizing your learning journey with Gemini 2.5 Flash"}
      </p>
    </div>
  );

  const steps = [
    { key: 'form', label: 'Setup' },
    { key: 'diagnostic', label: 'Diagnosis' },
    { key: 'lesson', label: 'Lesson' },
    { key: 'quiz', label: 'Quiz' },
    { key: 'feedback', label: 'Results' },
    { key: 'path', label: 'Journey' },
    { key: 'resources', label: 'Extend' },
    { key: 'reminder', label: 'Schedule' }
  ];

  const currentIdx = steps.findIndex(s => s.key === step);

  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', maxWidth: '1400px' }}>
      <div className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ cursor: 'pointer' }} onClick={handleReset}>
            <h1 style={{ textAlign: 'left', marginBottom: '0.25rem', fontSize: '2.5rem' }}>SkillPath AI</h1>
            <p className="subtitle" style={{ textAlign: 'left' }}>Your Adaptive Learning Coach</p>
          </div>
        </header>

        <ul className="step-indicator" style={{ marginBottom: '3rem', marginTop: '1rem' }}>
          {steps.map((s, i) => (
            <li 
              key={s.key} 
              className={`step-item ${i === currentIdx ? 'active' : ''} ${i < currentIdx ? 'completed' : ''}`}
            >
              {s.label}
            </li>
          ))}
        </ul>

        {toast && (
          <div className="toast animate-in">
            {toast}
          </div>
        )}

        {saveStatus === 'saved' && (
          <div className="badge badge-success animate-in" style={{ marginBottom: '1rem', width: 'auto' }}>
            ✓ Progress saved to Firestore
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="badge badge-warning animate-in" style={{ marginBottom: '1rem', width: 'auto' }}>
            ⚠ Progress history unavailable, but learning mode still works
          </div>
        )}

        {error && (
          <div className="error-box animate-in" style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>AI could not respond right now.</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1rem' }}>{error}</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={enableDemoMode} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                Use Demo Mode
              </button>
              <button onClick={handleReset} className="secondary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {isLoading ? renderLoading() : (
          <>
            {step === 'form' && <LearnerProfileForm onSubmit={handleProfileSubmit} />}
            {step === 'diagnostic' && <DiagnosticCard diagnostic={diagnosticData} onSubmit={handleDiagnosticSubmit} />}
            {step === 'lesson' && <LessonCard lesson={lessonData} preferences={learnerProfile} onNext={() => setStep('quiz')} />}
            {step === 'quiz' && <QuizCard questions={lessonData.quiz} onComplete={handleQuizComplete} />}
            {step === 'feedback' && <FeedbackCard results={quizResults} preferences={learnerProfile} onRestart={() => setStep('path')} />}
            {step === 'path' && <LearningPathCard concept={learnerProfile.concept} pathData={pathData} onNext={handleViewResources} />}
            
            <div ref={youtubeRef}>
              {step === 'resources' && <YouTubeResources resources={resources} onNext={handleGoToReminder} />}
            </div>
            
            <div ref={reminderRef}>
              {step === 'reminder' && <StudyReminder concept={learnerProfile.concept} pathData={pathData} feedback={quizResults} onSchedule={handleSchedule} />}
            </div>
          </>
        )}
      </div>

      <aside className="sidebar" ref={sidebarRef}>
        <ProgressSummary history={history} />
        <LearningHistory history={history} />
      </aside>

      <style>{`
        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid var(--primary);
          borderRadius: 50%;
          margin: 0 auto;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-top: 5.5rem;
        }

        .toast {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: #1e293b;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          z-index: 1000;
          font-size: 0.85rem;
          font-weight: 500;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.1);
        }

        @media (max-width: 1024px) {
          .container { grid-template-columns: 1fr !important; }
          .sidebar { padding-top: 0; }
          .badge-group { justify-content: flex-start; margin-top: 1rem; }
        }
      `}</style>
    </div>
  );
}

export default App;
