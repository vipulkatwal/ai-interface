import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const features = [
  {
    icon: '💬',
    title: 'Modern Chat UI',
    desc: 'Beautiful, responsive, and easy to use chat interface.'
  },
  {
    icon: '🔌',
    title: 'Plugin System',
    desc: 'Weather, Calculator, Dictionary, and more. Easily extensible.'
  },
  {
    icon: '🕒',
    title: 'History & Persistence',
    desc: 'Never lose your conversations. Everything is saved.'
  },
  {
    icon: '✨',
    title: 'Open Source',
    desc: 'Built for the community. Fork and extend as you wish.'
  },
];

const steps = [
  { step: 1, title: 'Type', desc: 'Enter your message or command.' },
  { step: 2, title: 'Plugin Magic', desc: 'The right plugin runs automatically.' },
  { step: 3, title: 'Get Results', desc: 'See rich, interactive responses instantly.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div className="font-sora bg-gradient-to-b from-[#f8fafc] via-[#f6f7fb] to-[#eaf6f3] min-h-screen w-full text-gray-900">
      {/* Nav Bar */}
      <nav className="w-full flex justify-between items-center px-8 py-5 bg-white/80 shadow-sm fixed top-0 left-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-gradient-to-r from-teal-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">AI Chat</span>
        </div>
        <div className="hidden md:flex gap-8 text-base font-medium">
          <a href="#features" className="hover:text-teal-500 transition">Features</a>
          <a href="#how" className="hover:text-teal-500 transition">How it works</a>
          <a href="#pricing" className="hover:text-teal-500 transition">Pricing</a>
          <a href="#footer" className="hover:text-teal-500 transition">Contact</a>
        </div>
        <button
          className="bg-gradient-to-r from-teal-400 via-fuchsia-400 to-indigo-400 text-white px-5 py-2 rounded-xl font-bold shadow hover:scale-105 transition"
          onClick={() => navigate('/chat')}
        >
          Launch App
        </button>
      </nav>

      {/* HERO SECTION - Sophisticated SaaS style */}
      <section className="pt-36 pb-24 flex flex-col items-center text-center relative z-10 min-h-[70vh]">
        {/* Blurred Glow */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -z-10">
          <div className="w-[600px] h-[300px] rounded-full bg-gradient-to-r from-teal-200 via-fuchsia-200 to-indigo-200 opacity-60 blur-3xl" />
        </div>
        <div ref={heroRef} className="w-full flex flex-col items-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-r from-teal-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-xl tracking-tight">
            <span className="block">Unleash</span>
            <span className="block">Your AI Superpowers</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 max-w-2xl mx-auto mb-10">
            The next-gen chatbot platform with plugins for everything.<br />
            Type, command, and get instant results in style.
          </p>
          {/* Glassmorphic CTA Card */}
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center border border-white/40 max-w-md mx-auto">
            <span className="text-lg font-semibold text-gray-800 mb-2">Start chatting for free</span>
            <button
              className="mt-2 px-8 py-3 bg-gradient-to-r from-teal-400 via-fuchsia-400 to-indigo-400 text-white text-lg font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 flex items-center gap-2"
              onClick={() => navigate('/chat')}
            >
              Get Started
              <svg className="w-6 h-6 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white/80">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center hover:shadow-xl transition">
                <div className="text-4xl mb-3">{f.icon}</div>
                <div className="font-bold text-lg mb-1">{f.title}</div>
                <div className="text-gray-600 text-base">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-16 bg-gradient-to-b from-white via-fuchsia-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-400 to-indigo-400 flex items-center justify-center text-2xl font-bold text-white mb-3 shadow">
                  {s.step}
                </div>
                <div className="font-bold text-lg mb-1">{s.title}</div>
                <div className="text-gray-600 text-base text-center max-w-xs">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white/90">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Pricing</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-end">
            <div className="flex-1 bg-white rounded-2xl shadow p-8 flex flex-col items-center border border-gray-100">
              <div className="font-bold text-xl mb-2">Free</div>
              <div className="text-3xl font-extrabold mb-2">$0</div>
              <div className="mb-4 text-gray-600">Unlimited chat, all plugins, history</div>
              <button className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:scale-105 transition">Start Free</button>
            </div>
            <div className="flex-1 bg-gradient-to-br from-fuchsia-100 to-indigo-100 rounded-2xl shadow-lg p-10 flex flex-col items-center border-2 border-fuchsia-400 scale-105">
              <div className="font-bold text-xl mb-2 text-fuchsia-600">Pro (Coming Soon)</div>
              <div className="text-3xl font-extrabold mb-2">$8/mo</div>
              <div className="mb-4 text-gray-600">Priority support, custom plugins, early access</div>
              <button className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:scale-105 transition opacity-60 cursor-not-allowed">Go Pro</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="py-10 bg-gradient-to-t from-purple-50 via-fuchsia-50 to-white text-center text-gray-500 text-sm mt-10">
        <div className="mb-2">
          <span className="font-bold text-fuchsia-500">AI Chat</span> &copy; {new Date().getFullYear()} &middot; All rights reserved.
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <a href="#" className="hover:text-fuchsia-500 transition">Privacy</a>
          <a href="#" className="hover:text-fuchsia-500 transition">Terms</a>
          <a href="#" className="hover:text-fuchsia-500 transition">Contact</a>
        </div>
      </footer>
    </div>
  );
}