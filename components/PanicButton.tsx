import React, { useState, useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface PanicButtonProps {
  onPanic: () => void;
  className?: string;
}

export const PanicButton: React.FC<PanicButtonProps> = ({ onPanic, className = '' }) => {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPressing && !activated) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setActivated(true);
            onPanic();
            return 100;
          }
          return prev + 5; // 2 seconds to activate (5% * 20 ticks/sec)
        });
      }, 100);
    } else {
      setProgress(0);
    }

    return () => clearInterval(interval);
  }, [isPressing, activated, onPanic]);

  const handleReset = () => {
    setActivated(false);
    setProgress(0);
  };

  if (activated) {
    return (
      <div className={`flex flex-col items-center justify-center p-4 bg-red-100 border-2 border-red-500 rounded-xl animate-pulse ${className}`}>
        <AlertTriangle className="w-12 h-12 text-red-600 mb-2" />
        <h3 className="font-bold text-red-700 text-lg">EMERGENCY ALERT SENT!</h3>
        <p className="text-xs text-red-600 mb-3 text-center">Help is on the way. Contacts notified.</p>
        <button 
          onClick={handleReset}
          className="px-4 py-1 bg-white border border-red-300 rounded text-red-600 text-sm hover:bg-red-50"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <button
      onMouseDown={() => setIsPressing(true)}
      onMouseUp={() => setIsPressing(false)}
      onMouseLeave={() => setIsPressing(false)}
      onTouchStart={() => setIsPressing(true)}
      onTouchEnd={() => setIsPressing(false)}
      className={`relative group overflow-hidden flex flex-col items-center justify-center p-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-transform active:scale-95 w-24 h-24 sm:w-32 sm:h-32 ${className}`}
    >
      {/* Progress Background */}
      <div 
        className="absolute bottom-0 left-0 w-full bg-red-800 transition-all duration-100 ease-linear opacity-50"
        style={{ height: `${progress}%` }}
      />
      
      <div className="relative z-10 flex flex-col items-center">
        <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 mb-1" />
        <span className="text-xs font-bold uppercase tracking-wider">SOS</span>
        <span className="text-[10px] opacity-80 mt-1">Hold 3s</span>
      </div>
      
      {/* Ripple Effect Ring */}
      <div className="absolute inset-0 rounded-full border-4 border-red-400 opacity-0 group-hover:animate-ping" />
    </button>
  );
};
