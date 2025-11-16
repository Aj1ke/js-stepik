import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar'

import Home from "./pages/Home"
import Courses from './pages/Courses';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
// import Login from './pages/Login';
// import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
