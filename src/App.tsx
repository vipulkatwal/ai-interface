import React, { useState } from 'react';
import { ChatUI } from './components/ChatUI';
import LandingPage from './components/LandingPage';

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {showChat ? (
        <ChatUI onBackToHome={() => setShowChat(false)} />
      ) : (
        <LandingPage onGetStarted={() => setShowChat(true)} />
      )}
    </div>
  );
}

export default App;