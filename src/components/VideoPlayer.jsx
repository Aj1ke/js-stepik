// src/components/VideoPlayer.jsx
import React, { useState } from 'react';
import './VideoPlayer.css';

function VideoPlayer({ videoUrl, title }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoaded = () => {
    setIsLoading(false);
  };

  return (
    <div className="video-player-wrapper">
      <div className="video-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
        <iframe
          src={videoUrl}
          title={title}
          className="video-iframe"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleLoaded}
        ></iframe>
      </div>
    </div>
  );
}

export default VideoPlayer;

