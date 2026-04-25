import React, { useState } from 'react';

const QuizCard = ({ questions, onComplete }) => {
  const [answers, setAnswers] = useState({}); // { questionIndex: optionIndex }

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const isComplete = Object.keys(answers).length === questions.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComplete) {
      onComplete(answers);
    }
  };

  return (
    <div className="card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Quiz</h2>
        <span className="badge badge-info">{questions.length} Questions</span>
      </div>

      <form onSubmit={handleSubmit}>
        {questions.map((q, qIndex) => (
          <div key={qIndex} style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1.1rem' }}>
              {qIndex + 1}. {q.question}
            </p>
            <div className="option-list">
              {q.options.map((option, oIndex) => (
                <div key={oIndex} className="option-item">
                  <button
                    type="button"
                    className={`option-button ${answers[qIndex] === oIndex ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(qIndex, oIndex)}
                    aria-pressed={answers[qIndex] === oIndex}
                  >
                    {option}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={!isComplete}
          style={{ 
            marginTop: '1rem', 
            opacity: isComplete ? 1 : 0.5,
            cursor: isComplete ? 'pointer' : 'not-allowed',
            fontSize: '1.1rem',
            padding: '1rem'
          }}
        >
          Submit Answers
        </button>
        {!isComplete && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
            Please answer all questions to continue.
          </p>
        )}
      </form>
    </div>
  );
};

export default QuizCard;
