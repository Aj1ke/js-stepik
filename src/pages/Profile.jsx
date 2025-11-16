// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid);
      } else {
        navigate('/');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const completedLessons = userData?.completedLessons
    ? Object.keys(userData.completedLessons).length
    : 0;

  const averageQuizScore = userData?.quizScores
    ? Math.round(
        Object.values(userData.quizScores).reduce((a, b) => a + b, 0) /
          Object.keys(userData.quizScores).length
      )
    : 0;

  return (
    <div className="profile-main">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="avatar">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'User'}
          </div>
          <div>
            <h1 className="profile-name">
              {user.displayName || 'User'}
            </h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">Check</div>
          <h3 className="stat-title">Lessons Completed</h3>
          <p className="stat-value stat-value-yellow">{completedLessons}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">Chart</div>
          <h3 className="stat-title">Average Quiz Score</h3>
          <p className="stat-value stat-value-blue">
            {averageQuizScore > 0 ? `${averageQuizScore}%` : 'N/A'}
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">Target</div>
          <h3 className="stat-title">Learning Streak</h3>
          <p className="stat-value stat-value-green">
            {userData?.streak || 0} days
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="progress-card">
        <h2 className="section-title">Your Progress</h2>
        <div>
          <div className="progress-bar-container">
            <span className="progress-label">Overall Progress</span>
            <span className="progress-text">
              {completedLessons} of 6 courses
            </span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${(completedLessons / 6) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Completed Lessons */}
      <div className="lessons-card">
        <h2 className="section-title">Completed Lessons</h2>
        {completedLessons > 0 ? (
          <div>
            {userData?.completedLessons &&
              Object.keys(userData.completedLessons).map((lessonId) => (
                <div key={lessonId} className="lesson-item">
                  <div className="lesson-info">
                    <span className="lesson-check">Check</span>
                    <span className="lesson-title">Lesson {lessonId}</span>
                  </div>
                  <span className="lesson-status">Completed</span>
                </div>
              ))}
          </div>
        ) : (
          <p className="no-lessons">
            No lessons completed yet. Start your learning journey!
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="actions">
        <button onClick={handleSignOut} className="btn-signout">
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Profile;
