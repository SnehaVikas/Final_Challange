import React from 'react';

const LearningHistory = ({ history }) => {
  return (
    <div className="card animate-in">
      <h2>Learning History</h2>
      <p className="subtitle">Your progress over time.</p>

      <div style={{ marginTop: '1.5rem' }}>
        {history.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No sessions yet. Start your first path!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {history.map((item) => (
              <div key={item.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem',
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}>
                <div>
                  <p style={{ fontWeight: 600, margin: 0 }}>{item.concept}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{item.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-success">Score: {item.score}/{item.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningHistory;
