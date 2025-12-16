import React, { useState, useEffect } from 'react';
import { UserRole, VehicleType } from '../types';
import { Button } from '../components/Button';
import { Truck, Globe, Upload, Check, User, Mail, Lock, Phone, Bike, Bus, Key, Sparkles, MapPin, Shield, Clock, ChevronDown, ChevronUp, Facebook, Twitter, Instagram, X as XIcon, HelpCircle, ArrowRight, Download } from 'lucide-react';
import { APP_NAME, CURRENCY } from '../constants';

interface AuthProps {
    onLogin: (role: UserRole, userData?: { name: string; email: string; phone: string; vehicleType?: VehicleType; status?: string }) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [view, setView] = useState<'login' | 'signup'>('login');
    const [role, setRole] = useState<UserRole>(UserRole.PASSENGER);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.KEKE);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('English');
    const [uploadedDoc, setUploadedDoc] = useState<string | null>(null);

    // Policy Modal States
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showRefund, setShowRefund] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const openAuth = (mode: 'login' | 'signup', targetRole: UserRole = UserRole.PASSENGER) => {
        setView(mode);
        setRole(targetRole);
        setShowAuthModal(true);
        // Reset form on open
        if (!email) setEmail('');
        if (!password) setPassword('');
    };

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            if (view === 'signup' && role === UserRole.DRIVER) {
                if (!uploadedDoc) {
                    alert("Please upload your driver's license.");
                    return;
                }
            }

            const userData = view === 'signup' ? {
                name,
                email,
                phone,
                vehicleType: role === UserRole.DRIVER ? vehicleType : undefined,
                status: role === UserRole.DRIVER ? 'Pending' : 'Active'
            } : undefined;

            onLogin(role, userData);
        }, 1500);
    };

    const fillDemoCredentials = (roleType: UserRole) => {
        setRole(roleType);
        setView('login');
        setPassword('password');
        if (roleType === UserRole.PASSENGER) {
            setEmail('chioma@example.com');
        } else if (roleType === UserRole.DRIVER) {
            setEmail('driver@example.com');
        } else if (roleType === UserRole.ADMIN) {
            setEmail('admin@example.com');
        } else if (roleType === UserRole.LOGISTICS) {
            setEmail('logistics@example.com');
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedDoc(e.target.files[0].name);
        }
    };

    const languages = ['English', 'Pidgin', 'Yoruba', 'Igbo', 'Hausa'];

    const getWelcomeText = () => {
        switch (language) {
            case 'Pidgin': return 'Moving Naija Forward no be lie.';
            case 'Yoruba': return 'Gbigbe Naija siwaju.';
            case 'Igbo': return 'Na-aga n\'ihu Naija.';
            case 'Hausa': return 'Matsar da Naija gaba.';
            default: return 'Moving Naija Forward.';
        }
    };

    const getButtonText = () => {
        if (loading) return 'Please wait...';
        if (view === 'login') {
            return role === UserRole.PASSENGER
                ? (language === 'Pidgin' ? 'Oya make we go' : 'Get Moving')
                : 'Start Driving';
        }
        return 'Create Account';
    };

    const faqs = [
        { q: "How do I book a ride?", a: "Simply download the app or log in here, choose your destination, select your preferred vehicle (Keke, Okada, or Bus), and confirm!" },
        { q: "Is it safe?", a: "Yes! All our drivers are verified with biometric IDs and we track all rides in real-time." },
        { q: "Can I pay with cash?", a: "Absolutely. We accept Cash, Wallet transfers, and Card payments." },
        { q: "How do I become a driver?", a: "Sign up as a driver, upload your license and vehicle papers. Once verified (usually 24hrs), you can start earning." }
    ];

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-x-hidden font-sans">

            {/* Global Styles for 3D Animation */}
            <style>{`
          .perspective-container { perspective: 1200px; }
          .road-scene {
            position: relative;
            transform-style: preserve-3d;
            transform: rotateX(20deg);
          }
          .traffic-lane {
            position: absolute;
            width: 100%;
            display: flex;
            align-items: center;
          }
          
          /* Keke Animation */
          .vehicle-keke {
            animation: drive-right 8s infinite linear;
          }
          @keyframes drive-right {
            0% { transform: translateX(-20%) scale(0.8); opacity: 0; }
            10% { opacity: 1; }
            45% { transform: translateX(120%) scale(1); opacity: 1; }
            50% { transform: translateX(120%) rotateY(180deg); opacity: 0; }
            55% { transform: translateX(120%) rotateY(180deg); opacity: 0; }
            100% { transform: translateX(120%) rotateY(180deg); opacity: 0; }
          }

          /* Okada Animation */
          .vehicle-okada {
            animation: drive-left 6s infinite linear;
            animation-delay: 1s;
          }
          @keyframes drive-left {
            0% { transform: translateX(120%) scale(0.9); opacity: 0; }
            10% { opacity: 1; }
            45% { transform: translateX(-20%) scale(1.1); opacity: 1; }
            50% { transform: translateX(-20%) rotateY(180deg); opacity: 0; }
            100% { transform: translateX(-20%) rotateY(180deg); opacity: 0; }
          }

          /* Bus Animation */
          .vehicle-bus {
            animation: drive-right-slow 12s infinite linear;
            animation-delay: 2s;
          }
          @keyframes drive-right-slow {
            0% { transform: translateX(-30%) scale(0.7); opacity: 0; }
            10% { opacity: 1; }
            45% { transform: translateX(130%) scale(1); opacity: 1; }
            100% { transform: translateX(130%) rotateY(180deg); opacity: 0; }
          }

          .neon-glow {
             filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.6));
          }
       `}</style>

            {/* --- HERO SECTION --- */}
            <div className="bg-slate-900 relative overflow-hidden pb-32">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                {/* Header */}
                <header className="relative z-20 container mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-500/50"><Bike size={24} /></div>
                        <span className="text-white font-bold text-xl tracking-tight hidden sm:block">{APP_NAME}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group z-30 hidden sm:block">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-full text-sm hover:bg-slate-700 transition-colors">
                                <Globe size={14} /> {language} <ChevronDown size={14} />
                            </button>
                            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl py-1 hidden group-hover:block border border-gray-100">
                                {languages.map(lang => (
                                    <button key={lang} onClick={() => setLanguage(lang)} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

                        <button
                            onClick={() => openAuth('login')}
                            className="text-white font-medium hover:text-brand-300 transition-colors text-sm"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => openAuth('signup')}
                            className="bg-white text-brand-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-brand-50 transition-colors"
                        >
                            Sign Up
                        </button>
                    </div>
                </header>

                <div className="container mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20">
                    {/* Left Column: Text & CTA */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold mb-6 animate-bounce">
                            <Sparkles size={12} /> #1 Ride App in Nigeria
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
                            Move around <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-200">Naija</span> with ease.
                        </h1>
                        <p className="text-slate-300 text-xl mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            {getWelcomeText()} Experience fast Keke, safe Okada, and comfortable Bus rides. No haggling, just moving.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button
                                onClick={() => openAuth('signup', UserRole.PASSENGER)}
                                className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-bold text-lg shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
                            >
                                Book a Ride <ArrowRight size={20} />
                            </button>
                            <button
                                onClick={() => openAuth('signup', UserRole.DRIVER)}
                                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
                            >
                                Become a Driver
                            </button>
                        </div>

                        {/* Download App Section */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <a
                                href="/downloads/keke-app-latest.apk"
                                download
                                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white border border-slate-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-sm"
                            >
                                <Download size={18} />
                                Download APK
                            </a>
                            <p className="text-slate-400 text-xs flex items-center justify-center lg:justify-start">
                                Available on Android 8.0+ • ~45 MB
                            </p>
                        </div>

                        <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                            <p className="text-slate-500 text-sm font-bold">TRUSTED BY</p>
                            <div className="font-bold text-white text-xl">Paystack</div>
                            <div className="font-bold text-white text-xl">Flutterwave</div>
                            <div className="font-bold text-white text-xl">Interswitch</div>
                        </div>
                    </div>
                    {/* Right Column: Professional 3D Hologram Animation */}
                    <div className="hidden lg:flex items-center justify-center h-full">
                        <div className="relative w-[400px] h-[500px]">
                            {/* Hologram container */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-64 h-64">
                                    {/* Glowing rings */}
                                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-spin" style={{ animationDuration: '8s' }}></div>
                                    <div className="absolute inset-4 rounded-full border-2 border-purple-400/30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
                                    <div className="absolute inset-8 rounded-full border-2 border-blue-400/30 animate-pulse"></div>

                                    {/* Central hologram sphere */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-blue-600 opacity-20 blur-2xl animate-pulse"></div>
                                        <div className="absolute w-32 h-32 rounded-full bg-gradient-to-t from-cyan-400 to-transparent opacity-30 animate-spin" style={{ animationDuration: '4s' }}></div>
                                    </div>

                                    {/* Floating vehicles inside hologram */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative w-40 h-40">
                                            {/* Keke - top right */}
                                            <div className="absolute top-2 right-4 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0s' }}>
                                                <Truck className="w-8 h-8 text-yellow-300 drop-shadow-lg" />
                                            </div>
                                            {/* Okada - bottom left */}
                                            <div className="absolute bottom-2 left-4 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.6s' }}>
                                                <Bike className="w-7 h-7 text-red-400 drop-shadow-lg" />
                                            </div>
                                            {/* Bus - top left */}
                                            <div className="absolute top-4 left-2 animate-bounce" style={{ animationDuration: '2s', animationDelay: '1.2s' }}>
                                                <Bus className="w-8 h-8 text-blue-300 drop-shadow-lg" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data visualization particles */}
                                    <div className="absolute inset-0">
                                        {[...Array(8)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                                                style={{
                                                    left: `${50 + 35 * Math.cos((i * Math.PI) / 4)}%`,
                                                    top: `${50 + 35 * Math.sin((i * Math.PI) / 4)}%`,
                                                    animationDelay: `${i * 0.2}s`
                                                }}
                                            ></div>
                                        ))}
                                    </div>

                                    {/* Text label */}
                                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                                        <p className="text-sm font-bold text-cyan-400">Real-time Tracking</p>
                                        <p className="text-xs text-gray-400">Live Fleet Management</p>
                                    </div>
                                </div>
                            </div>

                            {/* Glow effect background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-500/10 blur-3xl rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ABOUT US SECTION --- */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Moving Nigeria, One Ride at a Time</h2>
                        <p className="text-gray-600">
                            Founded with the vision to solve the urban mobility challenge in Nigeria's busiest cities. We connect you with reliable Keke, Okada, and Bus drivers instantly. No haggling, no stress.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-gray-100 group">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Safety First</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Every driver passes a rigorous background check. We use GPS tracking to ensure your safety from pickup to dropoff.
                            </p>
                        </div>
                        <div className="p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-gray-100 group">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                                <Clock size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Always On Time</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Our smart algorithm matches you with the nearest driver in seconds, reducing wait times by up to 40%.
                            </p>
                        </div>
                        <div className="p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-gray-100 group">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Everywhere You Go</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                From Lagos Island to Abuja Central, we have drivers in all major hubs ready to move you.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="py-20 bg-slate-50 border-y border-gray-200">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                    className="w-full flex justify-between items-center p-5 text-left font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                                >
                                    {faq.q}
                                    {activeFaq === idx ? <ChevronUp size={20} className="text-brand-600" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </button>
                                {activeFaq === idx && (
                                    <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-50">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CONTACT US SECTION --- */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">We're Here for You</h2>
                        <p className="text-gray-600 mb-8">
                            Have an issue with a ride? Lost an item? Or just want to say hello? Our 24/7 support team is ready to help.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-gray-700">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600"><Phone size={18} /></div>
                                <span className="font-medium">0800-KEKE-RIDE</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-700">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600"><Mail size={18} /></div>
                                <span className="font-medium">support@kekenapepe.ng</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-700">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600"><MapPin size={18} /></div>
                                <span className="font-medium">21 Adeola Odeku St, VI, Lagos</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-brand-600 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle size={120} /></div>
                        <h3 className="text-xl font-bold mb-4">Send us a message</h3>
                        <form className="space-y-4 relative z-10" onSubmit={(e) => { e.preventDefault(); alert("Message sent!"); }}>
                            <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-lg bg-brand-700 border border-brand-500 text-white placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-white" />
                            <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-lg bg-brand-700 border border-brand-500 text-white placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-white" />
                            <textarea placeholder="How can we help?" rows={3} className="w-full px-4 py-3 rounded-lg bg-brand-700 border border-brand-500 text-white placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-white"></textarea>
                            <button className="w-full py-3 bg-white text-brand-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">Send Message</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-brand-600 rounded flex items-center justify-center text-white"><Bike size={20} /></div>
                                <span className="text-white font-bold text-lg">{APP_NAME}</span>
                            </div>
                            <p className="text-sm">Reliable rides for everyday people.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><button onClick={() => setShowPrivacy(true)} className="hover:text-white transition-colors text-left">Privacy Policy</button></li>
                                <li><button onClick={() => setShowRefund(true)} className="hover:text-white transition-colors text-left">Refund Policy</button></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Follow Us</h4>
                            <div className="flex gap-4">
                                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-600 hover:text-white transition-all"><Facebook size={18} /></a>
                                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-600 hover:text-white transition-all"><Twitter size={18} /></a>
                                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-600 hover:text-white transition-all"><Instagram size={18} /></a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center text-xs">
                        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
                        <p className="mt-2 text-slate-600 font-medium">Developed By Jadan Technologies</p>
                    </div>
                </div>
            </footer>

            {/* --- AUTH MODAL --- */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-200 my-8">
                        <button
                            onClick={() => setShowAuthModal(false)}
                            className="absolute top-4 right-4 z-20 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
                        >
                            <XIcon size={20} />
                        </button>

                        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                            {/* Animated Vehicles on Login Card */}
                            <div className="absolute bottom-0 left-0 w-full h-20 pointer-events-none overflow-hidden">
                                {/* Keke driving right */}
                                <div className="absolute bottom-2 left-0 vehicle-keke opacity-80">
                                    <Truck className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                                </div>
                                {/* Okada driving left */}
                                <div className="absolute bottom-6 right-0 vehicle-okada opacity-80">
                                    <Bike className="w-6 h-6 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                                </div>
                                {/* Bus driving right slower */}
                                <div className="absolute bottom-8 left-0 vehicle-bus opacity-60">
                                    <Bus className="w-10 h-10 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white relative z-10">
                                {view === 'login' ? 'Welcome Back!' : 'Join the Movement'}
                            </h2>
                            <p className="text-brand-200 text-sm relative z-10 mt-1">
                                {view === 'login' ? 'Log in to continue riding.' : 'Create an account to get started.'}
                            </p>
                        </div>

                        <div className="p-8">
                            {/* Role Selector */}
                            <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
                                {[UserRole.PASSENGER, UserRole.DRIVER].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setRole(r)}
                                        className={`flex-1 py-2 text-[10px] sm:text-xs font-bold rounded-md transition-all uppercase tracking-wide ${role === r ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {r === UserRole.PASSENGER ? 'Passenger' : r}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleAuth} className="space-y-4">
                                {view === 'signup' && (
                                    <div className="space-y-4 animate-in slide-in-from-left fade-in duration-300">
                                        <div className="relative">
                                            <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                                placeholder="Full Name"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                                placeholder="Phone Number"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder={role === UserRole.DRIVER ? "driver@example.com" : "user@example.com"}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder="••••••••"
                                        required
                                        defaultValue={view === 'login' ? "password" : ""}
                                    />
                                </div>

                                {view === 'signup' && role === UserRole.DRIVER && (
                                    <div className="animate-in slide-in-from-right fade-in duration-300 space-y-4">
                                        <div className="grid grid-cols-3 gap-2">
                                            {[VehicleType.KEKE, VehicleType.OKADA, VehicleType.BUS].map((v) => {
                                                const Icon = v === VehicleType.KEKE ? Truck : v === VehicleType.OKADA ? Bike : Bus;
                                                return (
                                                    <div
                                                        key={v}
                                                        onClick={() => setVehicleType(v)}
                                                        className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all ${vehicleType === v ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                                    >
                                                        <Icon size={20} />
                                                        <span className="text-[10px] font-bold uppercase">{v}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                onChange={handleFileUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept="image/*,.pdf"
                                            />
                                            {uploadedDoc ? (
                                                <div className="flex items-center justify-center gap-2 text-green-600">
                                                    <Check size={20} />
                                                    <span className="text-sm font-medium truncate max-w-[200px]">{uploadedDoc}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1 text-gray-500">
                                                    <Upload size={24} />
                                                    <span className="text-sm font-medium">Upload Driver's License</span>
                                                    <span className="text-xs text-gray-400">(Required)</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <Button type="submit" className="w-full mt-4" isLoading={loading}>
                                    {getButtonText()}
                                </Button>
                            </form>

                            <div className="text-center mt-6">
                                {view === 'login' ? (
                                    <p className="text-sm text-gray-500">
                                        New here? <button onClick={() => setView('signup')} className="text-brand-600 font-bold hover:underline">Create Account</button>
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Have an account? <button onClick={() => setView('login')} className="text-brand-600 font-bold hover:underline">Log In</button>
                                    </p>
                                )}
                            </div>

                            {/* Demo Credentials Helper */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <p className="text-xs text-center text-gray-400 mb-2 flex items-center justify-center gap-1 uppercase font-bold tracking-wider">
                                    <Key size={10} /> Test Accounts
                                </p>
                                <div className="flex justify-center gap-2 flex-wrap">
                                    <button onClick={() => fillDemoCredentials(UserRole.PASSENGER)} className="px-2 py-1 text-[10px] bg-blue-50 text-blue-600 rounded border border-blue-100 hover:bg-blue-100 font-bold transition-colors">Passenger</button>
                                    <button onClick={() => fillDemoCredentials(UserRole.DRIVER)} className="px-2 py-1 text-[10px] bg-green-50 text-green-600 rounded border border-green-100 hover:bg-green-100 font-bold transition-colors">Driver</button>
                                    <button onClick={() => fillDemoCredentials(UserRole.LOGISTICS)} className="px-2 py-1 text-[10px] bg-orange-50 text-orange-600 rounded border border-orange-100 hover:bg-orange-100 font-bold transition-colors">Logistics</button>
                                    <button onClick={() => fillDemoCredentials(UserRole.ADMIN)} className="px-2 py-1 text-[10px] bg-purple-50 text-purple-600 rounded border border-purple-100 hover:bg-purple-100 font-bold transition-colors">Admin</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- PRIVACY MODAL --- */}
            {showPrivacy && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
                            <button onClick={() => setShowPrivacy(false)} className="p-2 hover:bg-gray-100 rounded-full"><XIcon size={24} /></button>
                        </div>
                        <div className="p-8 overflow-y-auto prose text-gray-600">
                            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
                            <p>At {APP_NAME}, we take your privacy seriously. This policy describes how we collect and use your data.</p>
                            <h3>1. Information We Collect</h3>
                            <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
                            <h3>2. How We Use Your Information</h3>
                            <p>We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users and Drivers, develop safety features, authenticate users, and send product updates and administrative messages.</p>
                            <h3>3. Data Security</h3>
                            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.</p>
                        </div>
                        <div className="p-6 border-t border-gray-100 text-right">
                            <Button onClick={() => setShowPrivacy(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- REFUND MODAL --- */}
            {showRefund && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Refund Policy</h2>
                            <button onClick={() => setShowRefund(false)} className="p-2 hover:bg-gray-100 rounded-full"><XIcon size={24} /></button>
                        </div>
                        <div className="p-8 overflow-y-auto prose text-gray-600">
                            <p><strong>Your satisfaction is our priority.</strong></p>
                            <h3>1. Cancellation Fees</h3>
                            <p>If you cancel a ride more than 5 minutes after a driver has accepted, a cancellation fee may apply. This fee goes to the driver for their time and fuel.</p>
                            <h3>2. Refund Eligibility</h3>
                            <p>Refunds are processed for the following reasons:</p>
                            <ul className="list-disc pl-5">
                                <li>Driver did not show up.</li>
                                <li>Driver refused to go to the destination.</li>
                                <li>Significant overcharge due to GPS error.</li>
                            </ul>
                            <h3>3. Processing Time</h3>
                            <p>Approved refunds are credited back to your {APP_NAME} Wallet instantly, or to your original payment method within 5-10 business days depending on your bank.</p>
                        </div>
                        <div className="p-6 border-t border-gray-100 text-right">
                            <Button onClick={() => setShowRefund(false)}>Understood</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Auth;