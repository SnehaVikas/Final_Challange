import React, { useState } from 'react';

const LearnerForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    concept: '',
    level: 'Beginner',
    pace: 'Normal',
    style: 'Simple explanation',
    goal: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card animate-in">
      <h2>Learning Setup</h2>
      <p className="subtitle">Customize your AI-powered learning journey.</p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="concept">Concept to learn</label>
          <input
            type="text"
            id="concept"
            name="concept"
            placeholder="e.g. Quantum Computing, React Hooks"
            value={formData.concept}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="level">Current Level</label>
            <select id="level" name="level" value={formData.level} onChange={handleChange}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="pace">Learning Pace</label>
            <select id="pace" name="pace" value={formData.pace} onChange={handleChange}>
              <option value="Slow">Slow</option>
              <option value="Normal">Normal</option>
              <option value="Fast">Fast</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="style">Learning Style</label>
          <select id="style" name="style" value={formData.style} onChange={handleChange}>
            <option value="Simple explanation">Simple explanation</option>
            <option value="Example-based">Example-based</option>
            <option value="Step-by-step">Step-by-step</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="goal">Learning Goal (Optional)</label>
          <textarea
            id="goal"
            name="goal"
            placeholder="What do you want to achieve?"
            rows="2"
            value={formData.goal}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit">Generate Lesson</button>
      </form>
    </div>
  );
};

export default LearnerForm;
