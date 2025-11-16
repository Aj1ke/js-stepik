// src/components/LessonCard.jsx  (или src/pages/LessonCard.jsx)
import React from 'react';
import { Link } from 'react-router-dom';
import './LessonCard.css';

function LessonCard({ lesson }) {
  return (
    <Link to={`/lesson/${lesson.id}`} className="lesson-card-link">
      <div className="lesson-card">
        {/* Lesson Image */}
        <div className="card-image">
          <span className="card-emoji">{lesson.emoji || 'Book'}</span>
        </div>

        {/* Lesson Info */}
        <div className="card-content">
          <div className="card-meta">
            <span className="lesson-badge">Lesson {lesson.order}</span>
            <span className="lesson-duration">{lesson.duration || '10 min'}</span>
          </div>

          <h3 className="card-title">{lesson.title}</h3>
          <p className="card-description">{lesson.description}</p>

          {/* Progress Bar */}
          {lesson.progress !== undefined && (
            <div className="progress-bar-wrapper">
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${lesson.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default LessonCard;