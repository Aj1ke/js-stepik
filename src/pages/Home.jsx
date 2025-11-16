import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero">
        <h1>
          Learn JavaScript
          <span>From Scratch</span>
        </h1>
        <p>
          Master JavaScript with interactive lessons, hands-on quizzes, and track your progress in real-time
        </p>
        <Link to="/courses" className="btn-yellow">
          Start Learning →
        </Link>
      </div>

      {/* Features Section */}
      <div className="features">
        <div className="feature-card">
          <div>🎥</div>
          <h3>Video Lessons</h3>
          <p>Learn from comprehensive video tutorials that cover everything from basics to advanced topics</p>
        </div>

        <div className="feature-card">
          <div>✅</div>
          <h3>Interactive Quizzes</h3>
          <p>Test your knowledge with multiple-choice quizzes and get instant feedback</p>
        </div>

        <div className="feature-card">
          <div>📊</div>
          <h3>Track Progress</h3>
          <p>Monitor your learning journey and see how far you've come</p>
        </div>
      </div>

      {/* Why Learn JavaScript */}
      <div className="why-js">
        <h2>Why Learn JavaScript?</h2>
        <div className="grid">
          <div>
            <h3>✓ Most Popular Language</h3>
            <p>JavaScript is the #1 programming language used worldwide</p>
          </div>
          <div>
            <h3>✓ Versatile</h3>
            <p>Build web apps, mobile apps, desktop apps, and even games</p>
          </div>
          <div>
            <h3>✓ High Demand</h3>
            <p>Thousands of job opportunities for JavaScript developers</p>
          </div>
          <div>
            <h3>✓ Easy to Start</h3>
            <p>Begin your coding journey with just a browser</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="call-to-action">
        <h2>Ready to Start?</h2>
        <p>Join thousands of students already learning JavaScript</p>
        <Link to="/courses" className="btn-dark">
          Browse Courses →
        </Link>
      </div>
    </div>
  );
}

export default Home;
