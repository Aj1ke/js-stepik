// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import './Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
      setShowMenu(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const closeMenu = () => setShowMenu(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-emoji">Book</span>
            <span className="logo-text">LearnJS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links-desktop">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/courses" className="nav-link">Courses</Link>
            {user && <Link to="/profile" className="nav-link">Profile</Link>}
            {user && <Link to="/admin" className="nav-link">Admin</Link>}
            {user ? (
              <button onClick={handleSignOut} className="btn-signout">
                Sign Out
              </button>
            ) : (
              <Link to="/login" className="btn-signin">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Toggle menu"
          >
            <svg className="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {showMenu ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-link" onClick={closeMenu}>Home</Link>
            <Link to="/courses" className="mobile-link" onClick={closeMenu}>Courses</Link>
            {user && <Link to="/profile" className="mobile-link" onClick={closeMenu}>Profile</Link>}
            {user && <Link to="/admin" className="mobile-link" onClick={closeMenu}>Admin</Link>}
            {user ? (
              <button onClick={handleSignOut} className="mobile-btn-signout">
                Sign Out
              </button>
            ) : (
              <Link to="/login" className="mobile-btn-signin" onClick={closeMenu}>
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;