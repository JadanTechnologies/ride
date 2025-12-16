import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Activity } from 'lucide-react';
import { voiceCommandService } from '../services/voiceCommandService';

interface VoiceControlProps {
    onCommandDetected?: (command: string) => void;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({ onCommandDetected }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!voiceCommandService.isSupported()) {
            setError("Voice not supported");
            return;
        }

        voiceCommandService.setCallbacks(
            (text, isFinal) => {
                setTranscript(text);
                if (isFinal) {
                    setTimeout(() => setTranscript(''), 2000); // Clear after 2s
                }
            },
            (err) => {
                if (err === 'not-allowed') setError("Mic blocked");
                else setError("Error");
                setIsListening(false);
            },
            (listening) => setIsListening(listening)
        );

        // Initial check
        // setIsListening(false); // Default to off

        return () => {
            voiceCommandService.stop();
        };
    }, []);

    const handleToggle = () => {
        if (error === "Voice not supported") return;
        setError(null);
        voiceCommandService.toggle();
    };

    if (error === "Voice not supported") return null;

    return (
        <div className={`fixed bottom-24 right-4 z-40 transition-all duration-300 ${isListening ? 'scale-110' : 'scale-100'}`}>
            {transcript && (
                <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-black/80 text-white text-sm px-3 py-1 rounded-lg backdrop-blur-sm animate-in slide-in-from-bottom-2">
                    "{transcript}"
                </div>
            )}

            <button
                onClick={handleToggle}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 border-2 ${isListening
                        ? 'bg-red-500 border-red-400 text-white animate-pulse ring-4 ring-red-500/30'
                        : 'bg-indigo-600 border-indigo-400 text-white hover:bg-indigo-700'
                    }`}
                title={isListening ? "Stop Voice Control" : "Start Voice Control"}
            >
                {isListening ? <Activity size={24} className="animate-bounce" /> : <Mic size={24} />}
            </button>

            {error && (
                <div className="absolute top-full right-0 mt-1 text-xs text-red-600 bg-white px-1 rounded shadow border border-red-100 whitespace-nowrap">
                    {error}
                </div>
            )}
        </div>
    );
};
