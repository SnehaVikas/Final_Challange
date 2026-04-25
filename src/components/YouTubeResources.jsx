import React from 'react';

const YouTubeResources = ({ resources, onNext }) => {
  const hasResources = resources && resources.length > 0;

  return (
    <div className="card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Recommended YouTube Resources</h2>
        <span className="badge" style={{ background: '#FF0000', color: 'white' }}>YouTube Data API</span>
      </div>

      {!hasResources ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎥</div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            No specific video resources found for this concept right now.
          </p>
          <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
            Ensure your YouTube API key is correctly configured in the .env file.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {resources.map((video) => (
            <a 
              key={video.id} 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="resource-item"
              style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                textDecoration: 'none', 
                color: 'inherit',
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              <div style={{ flexShrink: 0, width: '180px', height: '101px', borderRadius: '8px', overflow: 'hidden', background: '#e2e8f0' }}>
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--primary)', lineHeight: 1.4 }}>
                  {video.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Channel: <strong>{video.channel}</strong>
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', opacity: 0.8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {video.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}

      <button onClick={onNext} style={{ marginTop: '1rem' }}>
        Schedule Next Study Session
      </button>

      <style>{`
        .resource-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default YouTubeResources;
