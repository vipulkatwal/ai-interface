import React from 'react';
import { MessageCircle, Plug as Plugin, Lock, Brain, Sparkles, Command } from 'lucide-react';

const featureColors = [
  {
    bg: 'bg-purple-200',
    icon: 'text-purple-600',
    border: 'border-purple-300',
  },
  {
    bg: 'bg-purple-200',
    icon: 'text-purple-600',
    border: 'border-purple-300',
  },
  {
    bg: 'bg-purple-200',
    icon: 'text-purple-600',
    border: 'border-purple-300',
  },
];

const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Decorative elements (removed blue/purple overlays) */}
      {/* Header */}
      <header className="relative w-full py-6 px-8">
        <nav className="max-w-7xl mx-auto flex justify-between items-center glass rounded-2xl p-4 bg-white border border-purple-200 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-100 rounded-lg blur"></div>
              <MessageCircle className="relative text-purple-600" size={32} />
            </div>
            <span className="text-2xl font-bold text-gray-900 drop-shadow">AI Assistant</span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg font-semibold"
          >
            Launch App
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-purple-100 rounded-full border border-purple-300">
              <Sparkles className="text-purple-600" size={16} />
              <span className="text-purple-700 text-sm">AI-Powered Assistant</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900">
            Your Intelligent
            <span className="block mt-2 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-700 bg-clip-text text-transparent animate-gradient-move">
              Chat Companion
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of conversation with our advanced AI assistant.
            Get instant answers, real-time data, and intelligent insights through
            natural dialogue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-all duration-300 shadow-xl hover:scale-105 font-semibold text-lg flex items-center space-x-2"
            >
              <span>Start Chatting</span>
              <Command className="group-hover:rotate-12 transition-transform text-white" />
            </button>
            <a
              href="#features"
              className="px-8 py-4 text-purple-700 border border-purple-300 rounded-2xl hover:bg-purple-100 transition-all duration-300 font-medium text-lg"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            {
              icon: Brain,
              title: "Natural Language",
              description: "Chat naturally with our AI. No complex commands needed.",
            },
            {
              icon: Plugin,
              title: "Smart Plugins",
              description: "Access weather, calculations, and definitions instantly.",
            },
            {
              icon: Lock,
              title: "Secure & Private",
              description: "Your conversations are always private and protected.",
            }
          ].map((feature, index) => (
            <div
              key={index}
              className={`glass rounded-2xl p-8 border shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${featureColors[index].bg} ${featureColors[index].border}`}
            >
              <div className={`h-14 w-14 rounded-xl flex items-center justify-center mb-6 ${featureColors[index].bg}`}>
                <feature.icon className={`${featureColors[index].icon} h-full w-full`} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-700 leading-relaxed font-medium">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-32 py-8 text-center text-gray-400">
        <p>© 2025 AI Assistant. Crafted with precision.</p>
      </footer>
      <style>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 3s linear infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;