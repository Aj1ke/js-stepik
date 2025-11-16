// src/components/Courses.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import LessonCard from './../components/LessonCard';
import './Courses.css';

function Courses() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const lessonsCollection = collection(db, 'lessons');
      const lessonsSnapshot = await getDocs(lessonsCollection);
      const lessonsData = lessonsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      lessonsData.sort((a, b) => (a.order || 0) - (b.order || 0));
      setLessons(lessonsData);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setLessons([
        {
          id: '1',
          title: 'Introduction to JavaScript',
          description: 'Learn the basics of JavaScript programming language',
          emoji: 'Rocket',
          order: 1,
          duration: '10 min'
        },
        {
          id: '2',
          title: 'Variables and Data Types',
          description: 'Understand how to declare variables and work with different data types',
          emoji: 'Memo',
          order: 2,
          duration: '15 min'
        },
        {
          id: '3',
          title: 'Functions in JavaScript',
          description: 'Master function declarations, expressions, and arrow functions',
          emoji: 'Gear',
          order: 3,
          duration: '20 min'
        },
        {
          id: '4',
          title: 'DOM Manipulation',
          description: 'Learn how to interact with HTML elements using JavaScript',
          emoji: 'Paintbrush',
          order: 4,
          duration: '25 min'
        },
        {
          id: '5',
          title: 'Async Programming',
          description: 'Understand promises, async/await, and asynchronous operations',
          emoji: 'Lightning',
          order: 5,
          duration: '30 min'
        },
        {
          id: '6',
          title: 'Modern ES6+ Features',
          description: 'Explore destructuring, spread operator, and other ES6+ features',
          emoji: 'Sparkles',
          order: 6,
          duration: '25 min'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = filter === 'all' 
    ? lessons 
    : lessons.filter(lesson => lesson.level === filter);

  if (loading) {
    return (
      <div className="courses-container">
        <div className="loading-wrapper">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      {/* Header */}
      <div className="courses-header">
        <h1 className="courses-title">JavaScript Courses</h1>
        <p className="courses-subtitle">
          Master JavaScript with our comprehensive course curriculum
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          onClick={() => setFilter('all')}
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        >
          All Courses
        </button>
      </div>

      {/* Course Grid */}
      {filteredLessons.length > 0 ? (
        <div className="courses-grid">
          {filteredLessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      ) : (
        <div className="no-courses">
          <p className="no-courses-text">
            No courses available yet. Check back soon!
          </p>
        </div>
      )}

      {/* Progress Summary */}
      <div className="progress-summary">
        <h2 className="progress-title">Your Learning Progress</h2>
        <div className="progress-bar-wrapper">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: '0%' }}></div>
          </div>
          <span className="progress-label">
            0 / {lessons.length} courses completed
          </span>
        </div>
      </div>
    </div>
  );
}

export default Courses;