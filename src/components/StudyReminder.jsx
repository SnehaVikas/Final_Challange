import React, { useState } from 'react';
import { generateCalendarUrl } from '../services/calendarService';

const StudyReminder = ({ concept, pathData, feedback, onSchedule }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [isScheduled, setIsScheduled] = useState(false);

  const nextStep = feedback?.recommendedNextStep || "Review the core concepts.";
  const practiceTask = pathData?.practiceTask || "Solve 3 practice problems.";
  const nextTopics = pathData?.nextTopics || [];

  const handleAddReminder = () => {
    const url = generateCalendarUrl({
      concept,
      date,
      time,
      nextStep,
      practiceTask,
      nextTopics
    });
    
    // Open Google Calendar in a new tab
    window.open(url, '_blank');
    setIsScheduled(true);
    
    if (onSchedule) {
      onSchedule(`${date} ${time}`);
    }
  };

  return (
    <div className="card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Schedule Your Next Session</h2>
        <span className="badge" style={{ background: '#34A853', color: 'white' }}>Google Calendar</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="form-group">
          <label>Choose Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="form-group">
          <label>Choose Time</label>
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
          />
        </div>
      </div>

      <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '12px', border: '1px solid #dcfce7', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', color: '#166534', marginBottom: '0.75rem' }}>🎯 Your Study Plan</h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Topic:</strong> {concept}</p>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>First Task:</strong> {practiceTask}</p>
        <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>We'll include this plan in your calendar description.</p>
      </div>

      {isScheduled ? (
        <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--primary)', color: 'white', borderRadius: '8px' }}>
          ✓ Calendar link opened! Happy learning.
        </div>
      ) : (
        <button onClick={handleAddReminder} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <span>📅</span> Add to Google Calendar
        </button>
      )}

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        This will open a new tab with your pre-filled Google Calendar event.
      </p>
    </div>
  );
};

export default StudyReminder;
