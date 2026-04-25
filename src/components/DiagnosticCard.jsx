import React, { useState } from 'react';

const DiagnosticCard = ({ diagnostic, onSubmit }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer);
    }
  };

  return (
    <div className="card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Skill Diagnosis</h2>
        <span className="badge badge-info">{diagnostic.difficulty?.toUpperCase()}</span>
      </div>

      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
        <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.75rem' }}>AI Diagnostic Question:</p>
        <p style={{ marginBottom: '1.25rem', fontSize: '1.1rem', lineHeight: 1.5 }}>{diagnostic.diagnosticQuestion}</p>
        <textarea 
          placeholder="Type your answer here to help me personalize your lesson..." 
          style={{ 
            width: '100%', 
            padding: '1rem', 
            borderRadius: '8px', 
            border: '1px solid var(--border)',
            fontSize: '1rem',
            fontFamily: 'inherit'
          }}
          rows="4"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        ></textarea>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, padding: '1rem', background: '#f1f5f9', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Accuracy Matters</p>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Be as detailed as possible</p>
        </div>
        <div style={{ flex: 1, padding: '1rem', background: '#f1f5f9', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Est. Evaluation</p>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>30 Seconds</p>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!answer.trim()} style={{ opacity: answer.trim() ? 1 : 0.5 }}>
        Submit for AI Evaluation
      </button>
    </div>
  );
};

export default DiagnosticCard;
