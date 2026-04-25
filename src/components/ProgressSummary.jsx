import React from 'react';

const ProgressSummary = ({ history }) => {
  const totalConcepts = history.length;
  const avgScore = history.length > 0 
    ? (history.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / history.length * 100).toFixed(0)
    : 0;

  return (
    <div className="card animate-in" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
      <h2>Mastery Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px' }}>
          <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{totalConcepts}</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>Concepts Started</p>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px' }}>
          <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{avgScore}%</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>Avg. Mastery</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
