import React, { useState } from 'react';

const LearnerProfileForm = ({ onSubmit }) => {
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
      <h2>Start Your Learning Path</h2>
      <p className="subtitle">SkillPath AI will craft a personalized journey for you.</p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="concept">What do you want to master?</label>
          <input
            type="text"
            id="concept"
            name="concept"
            placeholder="e.g. Deep Learning, French Cooking, React Hooks"
            value={formData.concept}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="level">Experience Level</label>
            <select id="level" name="level" value={formData.level} onChange={handleChange}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="pace">Preferred Pace</label>
            <select id="pace" name="pace" value={formData.pace} onChange={handleChange}>
              <option value="Slow">Slow & Deep</option>
              <option value="Normal">Balanced</option>
              <option value="Fast">Fast Track</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="style">Learning Style</label>
          <select id="style" name="style" value={formData.style} onChange={handleChange}>
            <option value="Simple explanation">Clear & Conceptual</option>
            <option value="Example-based">Practical & Real-world</option>
            <option value="Step-by-step">Structured & Analytical</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="goal">Your Learning Goal</label>
          <textarea
            id="goal"
            name="goal"
            placeholder="e.g. Build a quantum computer, Pass my exam, Just curious"
            rows="2"
            value={formData.goal}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit">Initialize SkillPath</button>
      </form>
    </div>
  );
};

export default LearnerProfileForm;
