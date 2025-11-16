// src/components/QuizCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './QuizCard.css';

function QuizCard({ quiz }) {
  return (
    <div className="quiz-card-wrapper">
      <Link to={`/quiz/${quiz.id}`} className="quiz-card-link">
        <div className="quiz-card">
          {/* Quiz Image */}
          <div className="card-image">
            <span className="card-emoji">Question</span>
          </div>

          {/* Quiz Info */}
          <div className="card-content">
            <div className="card-meta">
              <span className="quiz-badge">Quiz {quiz.order}</span>
              <span className="quiz-duration">{quiz.duration || '5 min'}</span>
            </div>

            <h3 className="card-title">{quiz.title}</h3>
            <p className="card-description">{quiz.description}</p>

            {/* Score Progress */}
            {quiz.score !== undefined && (
              <div className="score-section">
                <div className="score-header">
                  <span className="score-label">Score</span>
                  <span className="score-value">{quiz.score}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${quiz.score}%` }}
                  ></div>
                </div>
              </div>
            )}

            <span className="take-quiz-btn">Take Quiz</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default QuizCard;