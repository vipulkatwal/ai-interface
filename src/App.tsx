import React, { useState, useEffect } from 'react';
import { ChatProvider } from './context/ChatContext';
import ChatUI from './components/ChatUI';
import LandingPage from './components/LandingPage';

function App() {
  const [showChat, setShowChat] = useState(false);

  // Check if user has visited before
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      setShowChat(true);
    }
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem('hasVisited', 'true');
    setShowChat(true);
  };

  return (
    <ChatProvider>
      {showChat ? (
        <ChatUI />
      ) : (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
    </ChatProvider>
  );
}

export default App;