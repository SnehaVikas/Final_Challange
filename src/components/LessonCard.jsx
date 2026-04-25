import React from 'react';

const LessonCard = ({ lesson, preferences, onNext }) => {
  if (!lesson) return null;

  return (
    <div className="card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{lesson.title}</h2>
          <div className="badge-group">
            <span className="badge badge-info">{preferences.level}</span>
            <span className="badge badge-outline">{preferences.pace} Pace</span>
            <span className="badge badge-outline">{preferences.style}</span>
          </div>
        </div>
        <span className="badge badge-success">Lesson Active</span>
      </div>
      
      <div className="lesson-section" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--accent)', marginBottom: '2rem' }}>
        <p style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          💡 Practical Example
        </p>
        <p style={{ fontStyle: 'italic', color: 'var(--text-main)' }}>{lesson.miniExample}</p>
      </div>
      
      <div className="lesson-content">
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Personalized Explanation</h3>
          <p>{lesson.explanation}</p>
        </section>

        <section style={{ marginBottom: '2rem', background: '#f0f9ff', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #0ea5e9' }}>
          <h3 style={{ color: '#0369a1', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Real-World Analogy</h3>
          <p style={{ fontStyle: 'italic', color: '#0c4a6e' }}>{lesson.analogy}</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Three Key Points</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            {lesson.keyPoints.map((point, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>{point}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: '2rem', background: '#fff1f2', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #f43f5e' }}>
          <h3 style={{ color: '#9f1239', marginBottom: '0.5rem', fontSize: '1.1rem' }}>⚠️ Common Mistake</h3>
          <p style={{ color: '#881337' }}>{lesson.commonMistake}</p>
        </section>
      </div>

      <button onClick={onNext} style={{ marginTop: '1rem', fontSize: '1.1rem', padding: '1rem' }}>
        Take Quiz
      </button>
    </div>
  );
};

export default LessonCard;
