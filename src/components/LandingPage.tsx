import React from 'react';
import { MessageCircle, Zap, Plug as Plugin, Lock, Brain, Sparkles, Command } from 'lucide-react';

const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 animate-gradient">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative w-full py-6 px-8">
        <nav className="max-w-7xl mx-auto flex justify-between items-center glass rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-lg blur"></div>
              <MessageCircle className="relative text-white" size={32} />
            </div>
            <span className="text-2xl font-bold text-white">AI Assistant</span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-white/10"
          >
            Launch App
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <Sparkles className="text-yellow-300" size={16} />
              <span className="text-white/90 text-sm">AI-Powered Assistant</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">
            Your Intelligent
            <span className="block mt-2 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Chat Companion
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of conversation with our advanced AI assistant.
            Get instant answers, real-time data, and intelligent insights through
            natural dialogue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold text-lg flex items-center space-x-2"
            >
              <span>Start Chatting</span>
              <Command className="group-hover:rotate-12 transition-transform" />
            </button>
            <a
              href="#features"
              className="px-8 py-4 text-white border border-white/20 rounded-2xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm font-medium text-lg"
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
              color: "from-blue-400 to-blue-600"
            },
            {
              icon: Plugin,
              title: "Smart Plugins",
              description: "Access weather, calculations, and definitions instantly.",
              color: "from-purple-400 to-purple-600"
            },
            {
              icon: Lock,
              title: "Secure & Private",
              description: "Your conversations are always private and protected.",
              color: "from-indigo-400 to-indigo-600"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 shadow-lg mb-6`}>
                <feature.icon className="text-white h-full w-full" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-blue-100 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-32 py-8 text-center text-white/80">
        <p>© 2025 AI Assistant. Crafted with precision.</p>
      </footer>
    </div>
  );
};

export default LandingPage;