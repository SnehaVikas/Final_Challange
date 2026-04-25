import React from 'react';

const FeedbackCard = ({ results, preferences, onRestart }) => {
  const { score, total, understandingLevel, strengths, gaps, feedbackText, recommendedNextStep, nextActionType } = results;
  const percentage = (score / total) * 100;

  const getStatusLabel = () => {
    switch (nextActionType) {
      case 'revise': return 'Needs Revision';
      case 'practice': return 'Practice More';
      case 'advance': return 'Ready to Advance';
      default: return 'Feedback Received';
    }
  };

  const getStatusColor = () => {
    switch (nextActionType) {
      case 'revise': return '#ef4444';
      case 'practice': return '#f59e0b';
      case 'advance': return '#10b981';
      default: return 'var(--primary)';
    }
  };

  return (
    <div className="card animate-in">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          {percentage >= 80 ? '🌟' : percentage >= 50 ? '📚' : '🌱'}
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Results for {preferences.concept}</h2>
        <div className="badge-group" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
          <span className="badge badge-info">{preferences.level}</span>
          <span className="badge badge-outline">{preferences.pace} Pace</span>
          <span className="badge badge-outline">{preferences.style}</span>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: getStatusColor() }}>
          {score} / {total} Correct • {getStatusLabel()}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '12px', border: '1px solid #dcfce7' }}>
          <h3 style={{ color: '#166534', fontSize: '1.1rem', marginBottom: '0.75rem' }}>✅ Strengths</h3>
          <ul style={{ paddingLeft: '1.25rem', color: '#14532d', fontSize: '0.95rem' }}>
            {strengths.map((s, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{s}</li>)}
          </ul>
        </div>
        <div style={{ background: '#fff7ed', padding: '1.5rem', borderRadius: '12px', border: '1px solid #ffedd5' }}>
          <h3 style={{ color: '#9a3412', fontSize: '1.1rem', marginBottom: '0.75rem' }}>🔍 Gaps</h3>
          <ul style={{ paddingLeft: '1.25rem', color: '#7c2d12', fontSize: '0.95rem' }}>
            {gaps.map((g, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{g}</li>)}
          </ul>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Expert Feedback</h3>
        <p style={{ color: 'var(--text-main)', lineHeight: 1.6, background: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
          {feedbackText}
        </p>
      </div>

      <div style={{ marginBottom: '2.5rem', padding: '1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '5rem', opacity: 0.1 }}>🚀</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h3 style={{ color: 'white', fontSize: '1.1rem', margin: 0 }}>Recommended Next Step</h3>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            {nextActionType.toUpperCase()}
          </span>
        </div>
        <p style={{ opacity: 0.9 }}>{recommendedNextStep}</p>
      </div>

      <button onClick={onRestart} style={{ fontSize: '1.1rem', padding: '1rem' }}>
        Learn Another Concept
      </button>
    </div>
  );
};

export default FeedbackCard;
