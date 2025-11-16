// src/components/Lesson.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import VideoPlayer from './../components/VideoPlayer';
import './Lesson.css';

function Lesson() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const lessonDoc = await getDoc(doc(db, 'lessons', lessonId));
      
      if (lessonDoc.exists()) {
        setLesson({ id: lessonDoc.id, ...lessonDoc.data() });
      } else {
        setLesson({
          id: lessonId,
          title: 'Introduction to JavaScript',
          description: 'Learn the basics of JavaScript programming language including syntax, variables, and basic operations.',
          videoUrl: 'https://www.youtube.com/embed/BXqUH86F-kA',
          order: 1,
          content: 'JavaScript is a high-level, interpreted programming language. In this lesson, you will learn the fundamentals.'
        });
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
      setLesson({
        id: lessonId,
        title: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript programming language.',
        videoUrl: 'https://www.youtube.com/embed/BXqUH86F-kA',
        order: 1
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async () => {
    if (!auth.currentUser) {
      alert('Please sign in to track your progress');
      return;
    }

    try {
      const userProgressRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userProgressRef, {
        [`completedLessons.${lessonId}`]: true,
        lastUpdated: new Date()
      });
      setCompleted(true);
      alert('Lesson marked as completed!');
    } catch (error) {
      console.error('Error updating progress:', error);
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="lesson-container">
        <div className="loading-wrapper">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="lesson-container">
        <div className="not-found">
          <h2 className="not-found-title">Lesson not found</h2>
          <Link to="/courses" className="back-link">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/courses" className="back-link">
          Back to Courses
        </Link>
      </nav>

      {/* Lesson Header */}
      <div className="lesson-header">
        <span className="lesson-badge">Lesson {lesson.order}</span>
        <h1 className="lesson-title">{lesson.title}</h1>
        <p className="lesson-description">{lesson.description}</p>
      </div>

      {/* Video Player */}
      <div className="video-section">
        <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} />
      </div>

      {/* Lesson Content */}
      {lesson.content && (
        <div className="content-card">
          <h2 className="content-title">Lesson Content</h2>
          <div className="content-text">
            <p>{lesson.content}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="actions-card">
        <div className="actions-wrapper">
          <button
            onClick={markAsCompleted}
            disabled={completed}
            className={`action-btn complete-btn ${completed ? 'completed' : ''}`}
          >
            {completed ? 'Completed' : 'Mark as Completed'}
          </button>
          <Link to="/courses" className="action-btn back-btn">
            Back to Courses
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Lesson;