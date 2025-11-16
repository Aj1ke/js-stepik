// src/components/Quiz.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import './Quiz.css';

function Quiz() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const quizCollection = collection(db, 'quizzes');
      const quizQuery = query(quizCollection, where('quizId', '==', quizId));
      const quizSnapshot = await getDocs(quizQuery);

      if (!quizSnapshot.empty) {
        const quizData = quizSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(quizData);
      } else {
        setQuestions([
          {
            id: '1',
            question: 'What is the correct way to declare a variable in JavaScript?',
            options: ['var x = 5;', 'variable x = 5;', 'x := 5;', 'x = 5'],
            correctAnswer: 'var x = 5;'
          },
          {
            id: '2',
            question: 'Which of the following is NOT a JavaScript data type?',
            options: ['Number', 'String', 'Boolean', 'Float'],
            correctAnswer: 'Float'
          },
          {
            id: '3',
            question: 'What does DOM stand for?',
            options: ['Document Object Model', 'Data Object Model', 'Digital Object Model', 'Document Oriented Model'],
            correctAnswer: 'Document Object Model'
          },
          {
            id: '4',
            question: 'What is the purpose of the console.log() function?',
            options: ['To create a log file', 'To display output in the browser console', 'To log server errors', 'To create console logs for debugging'],
            correctAnswer: 'To display output in the browser console'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setQuestions([
        {
          id: '1',
          question: 'What is JavaScript?',
          options: ['A coffee brand', 'A programming language', 'A markup language', 'A database'],
          correctAnswer: 'A programming language'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    if (auth.currentUser) {
      saveQuizResult(finalScore);
    }
  };

  const saveQuizResult = async (finalScore) => {
    try {
      const userProgressRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userProgressRef, {
        [`quizScores.${quizId}`]: finalScore,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading-wrapper">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="not-found">
          <h2 className="not-found-title">Quiz not found</h2>
          <Link to="/courses" className="back-link">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="quiz-main">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/courses" className="back-link">
          Back to Courses
        </Link>
      </nav>

      {!showResults ? (
        <>
          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-info">
              <span className="progress-text">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="progress-percent">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="question-card">
            <h2 className="question-title">{currentQ.question}</h2>
            <div className="options">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`option-button ${
                    selectedAnswers[currentQuestion] === option ? 'selected' : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="nav-buttons">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`nav-btn prev-btn ${currentQuestion === 0 ? 'disabled' : ''}`}
            >
              Previous
            </button>
            <button onClick={handleNext} className="nav-btn next-btn">
              {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next'}
            </button>
          </div>
        </>
      ) : (
        /* Results Screen */
        <div className="results-card">
          <div className="result-emoji">
            {score >= 70 ? 'Celebrate' : score >= 50 ? 'Thumbs Up' : 'Book'}
          </div>
          <h2 className="result-title">
            {score >= 70 ? 'Excellent Work!' : score >= 50 ? 'Good Job!' : 'Keep Learning!'}
          </h2>
          <p className="result-score">
            Your Score: <span className="score-value">{score}%</span>
          </p>

          <div className="result-actions">
            <button onClick={resetQuiz} className="action-btn primary">
              Retake Quiz
            </button>
            <Link to="/courses" className="action-btn secondary">
              Back to Courses
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;