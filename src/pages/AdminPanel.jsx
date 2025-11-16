// src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import './AdminPanel.css';

function AdminPanel() {
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('lessons');

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    order: 1,
    emoji: 'Book'
  });

  // Quiz form state
  const [quizForm, setQuizForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    lessonId: '',
    order: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const lessonsSnapshot = await getDocs(collection(db, 'lessons'));
      const lessonsData = lessonsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLessons(lessonsData.sort((a, b) => (a.order || 0) - (b.order || 0)));

      const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
      const quizzesData = quizzesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQuizzes(quizzesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'lessons'), lessonForm);
      alert('Lesson added successfully!');
      setLessonForm({ title: '', description: '', videoUrl: '', order: 1, emoji: 'Book' });
      fetchData();
    } catch (error) {
      console.error('Error adding lesson:', error);
      alert('Error adding lesson');
    }
  };

  const handleDeleteLesson = async (id) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await deleteDoc(doc(db, 'lessons', id));
        alert('Lesson deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting lesson:', error);
        alert('Error deleting lesson');
      }
    }
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'quizzes'), quizForm);
      alert('Quiz added successfully!');
      setQuizForm({ question: '', options: ['', '', '', ''], correctAnswer: '', lessonId: '', order: 1 });
      fetchData();
    } catch (error) {
      console.error('Error adding quiz:', error);
      alert('Error adding quiz');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteDoc(doc(db, 'quizzes', id));
        alert('Quiz deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Error deleting quiz');
      }
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel</h1>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
        >
          Lessons ({lessons.length})
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
        >
          Quizzes ({quizzes.length})
        </button>
      </div>

      {loading ? (
        <div className="loading-wrapper">
          <div className="spinner"></div>
        </div>
      ) : activeTab === 'lessons' ? (
        <>
          {/* Add Lesson Form */}
          <div className="form-card">
            <h2 className="form-title">Add New Lesson</h2>
            <form onSubmit={handleAddLesson} className="lesson-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Video URL</label>
                  <input
                    type="text"
                    value={lessonForm.videoUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Order</label>
                  <input
                    type="number"
                    value={lessonForm.order}
                    onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) || 1 })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Emoji</label>
                  <input
                    type="text"
                    value={lessonForm.emoji}
                    onChange={(e) => setLessonForm({ ...lessonForm, emoji: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  className="form-textarea"
                  rows="3"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Add Lesson
              </button>
            </form>
          </div>

          {/* Lessons List */}
          <div className="items-list">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="item-card">
                <div className="item-content">
                  <div className="item-header">
                    <span className="item-emoji">{lesson.emoji || 'Book'}</span>
                    <div>
                      <h3 className="item-title">{lesson.title}</h3>
                      <p className="item-desc">{lesson.description}</p>
                    </div>
                  </div>
                  <p className="item-meta">Order: {lesson.order}</p>
                </div>
                <button
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Add Quiz Form */}
          <div className="form-card">
            <h2 className="form-title">Add New Quiz</h2>
            <form onSubmit={handleAddQuiz} className="quiz-form">
              <div className="form-group full-width">
                <label className="form-label">Question</label>
                <textarea
                  value={quizForm.question}
                  onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })}
                  className="form-textarea"
                  rows="2"
                  required
                />
              </div>
              <div className="form-grid">
                {quizForm.options.map((option, index) => (
                  <div key={index} className="form-group">
                    <label className="form-label">Option {index + 1}</label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...quizForm.options];
                        newOptions[index] = e.target.value;
                        setQuizForm({ ...quizForm, options: newOptions });
                      }}
                      className="form-input"
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Correct Answer</label>
                  <input
                    type="text"
                    value={quizForm.correctAnswer}
                    onChange={(e) => setQuizForm({ ...quizForm, correctAnswer: e.target.value })}
                    className="form-input"
                    placeholder="Must match one of the options exactly"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Order</label>
                  <input
                    type="number"
                    value={quizForm.order}
                    onChange={(e) => setQuizForm({ ...quizForm, order: parseInt(e.target.value) || 1 })}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                Add Quiz
              </button>
            </form>
          </div>

          {/* Quizzes List */}
          <div className="items-list">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="item-card">
                <div className="item-content">
                  <h3 className="item-title">{quiz.question}</h3>
                  <div className="quiz-options">
                    <p className="options-label">Options:</p>
                    <ul className="options-list">
                      {quiz.options?.map((opt, idx) => (
                        <li key={idx}>{opt}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="item-meta">
                    Correct: <span className="correct-answer">{quiz.correctAnswer}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPanel;