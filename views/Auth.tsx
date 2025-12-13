import React, { useState } from 'react';
import { UserRole, VehicleType } from '../types';
import { Button } from '../components/Button';
import { Truck, Globe, Upload, Check, User, Mail, Lock, Phone, Bike, Bus, Key, Sparkles } from 'lucide-react';
import { APP_NAME } from '../constants';

interface AuthProps {
  onLogin: (role: UserRole, userData?: { name: string; email: string; phone: string; vehicleType?: VehicleType; status?: string }) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>(UserRole.PASSENGER);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.KEKE);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [uploadedDoc, setUploadedDoc] = useState<string | null>(null);

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
      } else {
          setEmail('admin@example.com');
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setUploadedDoc(e.target.files[0].name);
      }
  };

  const languages = ['English', 'Pidgin', 'Yoruba', 'Igbo', 'Hausa'];

  const getWelcomeText = () => {
      switch(language) {
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
            : (role === UserRole.DRIVER ? 'Start Driving' : 'Admin Login');
      }
      return 'Create Account';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
       
       {/* Styles for Hologram Animation */}
       <style>{`
          .perspective-1000 { perspective: 1000px; }
          .transform-style-3d { transform-style: preserve-3d; }
          .animate-rotate-3d { animation: rotate3d 10s infinite linear; }
          @keyframes rotate3d {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(360deg); }
          }
          .hologram-item {
             position: absolute;
             width: 100%;
             height: 100%;
             backface-visibility: hidden;
          }
          .neon-glow {
             filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.6));
          }
       `}</style>

       <div className="absolute top-4 right-4 z-20">
          <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-100">
                  <Globe size={16} /> {language}
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl py-1 hidden group-hover:block border border-gray-100 z-50">
                  {languages.map(lang => (
                      <button 
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${language === lang ? 'text-brand-600 font-bold' : 'text-gray-700'}`}
                      >
                          {lang}
                      </button>
                  ))}
              </div>
          </div>
       </div>

       <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 z-10">
          {/* Enhanced Holographic Landing Header */}
          <div className="bg-slate-900 p-10 text-center relative overflow-hidden">
             {/* 3D Stage */}
             <div className="perspective-1000 w-32 h-32 mx-auto mb-6 relative">
                 <div className="w-full h-full relative transform-style-3d animate-rotate-3d">
                    {/* Center Glow */}
                    <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-xl transform translate-z-[-20px]"></div>
                    
                    {/* Floating Icons positioned in 3D circle */}
                    <div className="absolute inset-0 flex items-center justify-center transform translate-z-[60px]" style={{ transform: 'rotateY(0deg) translateZ(60px)' }}>
                       <Truck className="w-12 h-12 text-brand-400 neon-glow" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center transform translate-z-[60px]" style={{ transform: 'rotateY(120deg) translateZ(60px)' }}>
                       <Bike className="w-12 h-12 text-cyan-400 neon-glow" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center transform translate-z-[60px]" style={{ transform: 'rotateY(240deg) translateZ(60px)' }}>
                       <Bus className="w-12 h-12 text-fuchsia-400 neon-glow" />
                    </div>
                 </div>
                 
                 {/* Hologram Base */}
                 <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-brand-500/30 rounded-[100%] blur-md"></div>
             </div>

             <h1 className="text-3xl font-bold text-white mb-2 relative z-10 flex items-center justify-center gap-2">
               {APP_NAME} <Sparkles size={20} className="text-yellow-400 animate-pulse" />
             </h1>
             <p className="text-brand-200 relative z-10 font-medium">
                 {getWelcomeText()}
             </p>
          </div>

          <div className="p-8">
             <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
                {[UserRole.PASSENGER, UserRole.DRIVER, UserRole.ADMIN].map((r) => (
                   <button
                     key={r}
                     onClick={() => setRole(r)}
                     className={`flex-1 py-2 text-[10px] sm:text-xs font-bold rounded-md transition-all uppercase tracking-wide ${role === r ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                   >
                     {r}
                   </button>
                ))}
             </div>

             <form onSubmit={handleAuth} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {view === 'signup' && (
                    <div className="space-y-4">
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
                        placeholder={view === 'login' ? "••••••••" : "Create Password"}
                        required
                        defaultValue={view === 'login' ? "password" : ""}
                    />
                </div>

                {view === 'signup' && role === UserRole.DRIVER && (
                    <>
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
                                <span className="text-sm font-medium">Upload Driver's License / ID</span>
                                <span className="text-xs text-gray-400">(Required for verification)</span>
                            </div>
                        )}
                    </div>
                    </>
                )}

                <Button type="submit" className="w-full mt-2" isLoading={loading}>
                   {getButtonText()}
                </Button>
             </form>
             
             <div className="text-center mt-6">
                 {view === 'login' ? (
                     <p className="text-sm text-gray-500">
                        Don't have an account? <button onClick={() => setView('signup')} className="text-brand-600 font-bold hover:underline">Sign Up</button>
                     </p>
                 ) : (
                    <p className="text-sm text-gray-500">
                        Already have an account? <button onClick={() => setView('login')} className="text-brand-600 font-bold hover:underline">Log In</button>
                    </p>
                 )}
             </div>

             {/* Demo Credentials Helper */}
             <div className="mt-8 pt-6 border-t border-gray-100">
                 <p className="text-xs text-center text-gray-400 mb-3 flex items-center justify-center gap-1">
                     <Key size={12} /> QUICK ACCESS (DEMO ONLY)
                 </p>
                 <div className="flex justify-center gap-2">
                     <button onClick={() => fillDemoCredentials(UserRole.PASSENGER)} className="px-2 py-1 text-[10px] bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium transition-colors">Passenger</button>
                     <button onClick={() => fillDemoCredentials(UserRole.DRIVER)} className="px-2 py-1 text-[10px] bg-green-50 text-green-600 rounded hover:bg-green-100 font-medium transition-colors">Driver</button>
                     <button onClick={() => fillDemoCredentials(UserRole.ADMIN)} className="px-2 py-1 text-[10px] bg-purple-50 text-purple-600 rounded hover:bg-purple-100 font-medium transition-colors">Admin</button>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );
};