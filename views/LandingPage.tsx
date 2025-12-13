import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Star, Zap, Shield, Users } from 'lucide-react';
import { Button } from '../components/Button';

export const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [scrollY, setScrollY] = useState(0);
  const vehicleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3D Holographic Vehicle Animation
  const HolographicVehicle = ({ 
    type, 
    delay 
  }: { 
    type: 'keke' | 'okada' | 'bus'; 
    delay: number;
  }) => {
    const position = (scrollY / 10 + delay) % 360;

    const vehicles = {
      keke: { emoji: '🚐', label: 'Keke (Tricycle)', color: 'from-blue-500 to-cyan-500' },
      okada: { emoji: '🏍️', label: 'Okada (Bike)', color: 'from-green-500 to-emerald-500' },
      bus: { emoji: '🚌', label: 'Bus (Danfo)', color: 'from-orange-500 to-yellow-500' },
    };

    const v = vehicles[type];

    return (
      <div
        ref={(el) => {
          if (el) vehicleRefs.current[delay] = el;
        }}
        className={`absolute w-24 h-24 rounded-2xl bg-gradient-to-br ${v.color} 
          shadow-2xl transform-gpu transition-all duration-100
          flex items-center justify-center text-6xl font-bold text-white
          hover:scale-110 cursor-pointer`}
        style={{
          left: `${20 + Math.sin(position * Math.PI / 180) * 15}%`,
          top: `${30 + Math.cos(position * Math.PI / 180) * 10}%`,
          transform: `
            rotateX(${Math.sin(position * Math.PI / 180) * 10}deg)
            rotateY(${Math.cos(position * Math.PI / 180) * 15}deg)
            translateZ(${Math.sin(position * Math.PI / 180) * 50}px)
            scale(${1 + Math.cos(position * Math.PI / 180) * 0.1})
          `,
          opacity: 0.9 + Math.sin(position * Math.PI / 180) * 0.1,
        }}
      >
        {/* Holographic glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
        {/* Vehicle display */}
        <div className="relative z-10">{v.emoji}</div>
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-2xl border-2 border-white/50 animate-pulse" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float animation-delay-2000" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* 3D Vehicle Scene */}
        <div
          className="absolute inset-0 perspective"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          <HolographicVehicle type="keke" delay={0} />
          <HolographicVehicle type="okada" delay={120} />
          <HolographicVehicle type="bus" delay={240} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30">
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              🚀 The Future of Urban Mobility
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-green-400 bg-clip-text text-transparent">
              Keke Napepe Ride
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Experience seamless urban transportation with Nigeria's most innovative ride-sharing platform.
            Choose from Keke, Okada, or Bus rides at your convenience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={onGetStarted}
              className="px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-2xl"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>
            <button className="px-8 py-4 text-lg border border-cyan-400/50 rounded-lg hover:bg-cyan-400/10 transition-colors font-semibold">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg border border-blue-500/20">
              <div className="text-2xl font-bold text-cyan-400">50K+</div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">15K+</div>
              <div className="text-sm text-gray-400">Drivers</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-400">250K+</div>
              <div className="text-sm text-gray-400">Rides Daily</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex items-center justify-center">
            <div className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose <span className="text-cyan-400">Keke Napepe</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Fast',
                description: 'Get a ride in seconds. Our AI dispatch system finds the best match instantly.',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Safe & Secure',
                description: 'Verified drivers, real-time tracking, and 24/7 customer support.',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Community Driven',
                description: 'Support local drivers and be part of the mobility revolution.',
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: 'Best Prices',
                description: 'Dynamic pricing ensures fair rates for both passengers and drivers.',
              },
              {
                icon: <ArrowRight className="w-8 h-8" />,
                title: 'Multiple Options',
                description: 'Choose from Keke, Okada, or Bus based on your journey and budget.',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Eco-Friendly',
                description: 'Contributing to cleaner air and a sustainable Lagos future.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/30 rounded-xl hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="text-cyan-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            How It <span className="text-cyan-400">Works</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Enter Location', desc: 'Tell us where you are and where you want to go' },
              { num: '2', title: 'Choose Vehicle', desc: 'Pick from Keke, Okada, or Bus options' },
              { num: '3', title: 'Meet Driver', desc: 'Real-time tracking of your driver\'s arrival' },
              { num: '4', title: 'Enjoy Ride', desc: 'Relax and get to your destination safely' },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-2xl font-bold mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-1 bg-gradient-to-r from-cyan-400 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-cyan-500/30 rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-6">Ready to Move Forward?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of Nigerians experiencing the future of urban transportation.
          </p>
          <Button
            onClick={onGetStarted}
            className="px-8 py-4 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-2xl"
          >
            Download App Now <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/50 py-12 px-4 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-bold mb-4">Keke Napepe</h3>
              <p className="text-gray-400">Moving Nigeria Forward</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400">Features</a></li>
                <li><a href="#" className="hover:text-cyan-400">Pricing</a></li>
                <li><a href="#" className="hover:text-cyan-400">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400">About</a></li>
                <li><a href="#" className="hover:text-cyan-400">Blog</a></li>
                <li><a href="#" className="hover:text-cyan-400">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400">Privacy</a></li>
                <li><a href="#" className="hover:text-cyan-400">Terms</a></li>
                <li><a href="#" className="hover:text-cyan-400">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2025 Keke Napepe Ride. All rights reserved. Moving Naija Forward 🚀</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
          }
          25% { 
            transform: translateY(-20px) translateX(10px);
          }
          50% { 
            transform: translateY(0px) translateX(20px);
          }
          75% { 
            transform: translateY(20px) translateX(10px);
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .perspective {
          perspective: 1200px;
        }
      `}</style>
    </div>
  );
};
