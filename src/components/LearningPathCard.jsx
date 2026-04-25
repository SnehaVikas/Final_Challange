import React from 'react';

const LearningPathCard = ({ concept, pathData, onNext }) => {
  const steps = [
    { title: "Foundations", status: "completed", desc: "Basic concepts and definitions" },
    { title: "Core Lesson", status: "completed", desc: "Personalized deep dive into the concept" },
    { title: "Skill Check", status: "completed", desc: "Adaptive quiz and evaluation" },
    { title: "Advanced Mastery", status: "current", desc: "Complex scenarios and applications" },
    { title: "Real-world Project", status: "upcoming", desc: "Build something with your new skill" }
  ];

  const { nextTopics, practiceTask, studyStrategy, confidenceLevel } = pathData || {
    nextTopics: [],
    practiceTask: "No specific task recommended yet.",
    studyStrategy: "Keep practicing consistent micro-learning.",
    confidenceLevel: 50
  };

  return (
    <div className="card animate-in">
      <h2>Your Learning Path: {concept}</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Journey Roadmap</h3>
          {steps.map((step, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '1rem',
              opacity: step.status === 'upcoming' ? 0.5 : 1
            }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                background: step.status === 'completed' ? '#10b981' : (step.status === 'current' ? 'var(--primary)' : 'var(--border)'),
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                flexShrink: 0,
                marginTop: '3px'
              }}>
                {step.status === 'completed' ? '✓' : i + 1}
              </div>
              <div>
                <p style={{ fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>{step.title}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>Next 3 Topics</h3>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              {nextTopics.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>

          <div style={{ background: '#e0f2fe', padding: '1.25rem', borderRadius: '12px', border: '1px solid #bae6fd' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#0369a1' }}>Practice Task</h3>
            <p style={{ fontSize: '0.9rem', color: '#0c4a6e' }}>{practiceTask}</p>
          </div>

          <div style={{ background: '#fef3c7', padding: '1.25rem', borderRadius: '12px', border: '1px solid #fde68a' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#92400e' }}>Study Strategy</h3>
            <p style={{ fontSize: '0.9rem', color: '#78350f' }}>{studyStrategy}</p>
          </div>

          <div style={{ background: '#f5f3ff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #ddd6fe' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#6d28d9' }}>Confidence Level</h3>
            <div style={{ height: '8px', background: '#ddd6fe', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${confidenceLevel}%`, height: '100%', background: '#8b5cf6' }}></div>
            </div>
            <p style={{ textAlign: 'right', fontSize: '0.8rem', marginTop: '0.25rem', fontWeight: 600 }}>{confidenceLevel}%</p>
          </div>
        </div>
      </div>

      <button onClick={onNext} style={{ marginTop: '2rem' }}>
        Explore Supplemental Resources
      </button>
    </div>
  );
};

export default LearningPathCard;
