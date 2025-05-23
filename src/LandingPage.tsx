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

const floatingIcons = [
  { icon: '💡', className: 'left-10 top-16 text-blue-400', delay: 0 },
  { icon: '⚡', className: 'right-16 top-32 text-green-400', delay: 0.2 },
  { icon: '🌐', className: 'left-1/4 bottom-10 text-blue-300', delay: 0.4 },
  { icon: '🤖', className: 'right-1/4 bottom-20 text-green-300', delay: 0.6 },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }
    // Animate floating icons
    iconRefs.current.forEach((el, i) => {
      if (el) {
        gsap.to(el, {
          y: 24,
          repeat: -1,
          yoyo: true,
          duration: 2.5 + i * 0.2,
          ease: 'sine.inOut',
          delay: floatingIcons[i].delay,
        });
      }
    });
  }, []);

  return (
    <div className="font-sora bg-white min-h-screen w-full text-gray-900">
      {/* Premium Nav Bar */}
      <nav className="w-full flex justify-center fixed top-0 left-0 z-20 bg-transparent py-6">
        <div className="w-full max-w-6xl flex items-center justify-between bg-white/90 rounded-2xl shadow-lg px-8 py-3 border border-gray-100 backdrop-blur-md">
          {/* Robot Emoji Logo */}
          <div className="flex items-center">
            <span className="text-3xl md:text-4xl select-none">🤖</span>
          </div>
          {/* Nav Links as Pills */}
          <div className="hidden md:flex gap-3 text-base font-medium">
            <a href="#features" className="rounded-full px-4 py-1 transition bg-transparent hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700">Features</a>
            <a href="#how" className="rounded-full px-4 py-1 transition bg-transparent hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700">How it works</a>
            <a href="#pricing" className="rounded-full px-4 py-1 transition bg-transparent hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700">Pricing</a>
            <a href="#footer" className="rounded-full px-4 py-1 transition bg-transparent hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700">Contact</a>
          </div>
          {/* CTA Button */}
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow hover:scale-105 hover:bg-blue-700 transition-all duration-150"
            onClick={() => navigate('/chat')}
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* HERO SECTION - Clean, premium SaaS style */}
      <section className="pt-48 pb-32 flex flex-col items-center text-center relative z-10 min-h-[70vh] bg-white overflow-hidden">
        {/* Subtle Blurred Glow */}
        <div className="absolute left-1/2 top-44 -translate-x-1/2 -z-10 w-[420px] h-[180px] rounded-full bg-blue-200 opacity-30 blur-3xl" />
        <div ref={heroRef} className="w-full flex flex-col items-center">
          <h1 className="text-6xl sm:text-7xl font-extrabold mb-8 bg-gradient-to-r from-blue-600 via-green-400 to-blue-400 bg-clip-text text-transparent drop-shadow-xl tracking-tight font-[Poppins,Inter,sans-serif]">
            <span className="block">Unleash</span>
            <span className="block">Your AI Superpowers</span>
          </h1>
          <p className="text-2xl text-gray-700 max-w-2xl mx-auto mb-12 font-sora">
            The next-gen chatbot platform with plugins for everything.<br />
            Type, command, and get instant results in style.
          </p>
          {/* Glassmorphic CTA Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center border border-white/60 max-w-md mx-auto">
            <span className="text-lg font-semibold text-gray-800 mb-3">Start chatting for free</span>
            <button
              className="mt-2 px-10 py-4 bg-blue-600 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 flex items-center gap-2"
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