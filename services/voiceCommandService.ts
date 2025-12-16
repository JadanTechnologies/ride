/**
 * Voice Command Service
 * Handles speech recognition for driver commands
 */

export interface VoiceCommand {
    command: string;
    action: () => void;
    keywords: string[];
}

class VoiceCommandService {
    private recognition: any;
    private isListening: boolean = false;
    private commands: VoiceCommand[] = [];
    private onResultCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
    private onErrorCallback: ((error: string) => void) | null = null;
    private onStateChangeCallback: ((isListening: boolean) => void) | null = null;

    constructor() {
        if ('webkitSpeechRecognition' in window) {
            // @ts-ignore
            this.recognition = new window.webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            // @ts-ignore
            this.recognition = new window.SpeechRecognition();
        } // else: Browser not supported, handled in isSupported()

        if (this.recognition) {
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.notifyStateChange();
            };

            this.recognition.onend = () => {
                // Auto-restart if it was supposed to be listening (silence timeout)
                if (this.isListening) {
                    try {
                        this.recognition.start();
                    } catch (e) {
                        this.isListening = false;
                        this.notifyStateChange();
                    }
                } else {
                    this.isListening = false;
                    this.notifyStateChange();
                }
            };

            this.recognition.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                        this.processCommand(finalTranscript);
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (this.onResultCallback) {
                    this.onResultCallback(finalTranscript || interimTranscript, !!finalTranscript);
                }
            };

            this.recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                if (this.onErrorCallback) this.onErrorCallback(event.error);
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    this.isListening = false;
                    this.notifyStateChange();
                }
            };
        }
    }

    public isSupported(): boolean {
        return !!this.recognition;
    }

    public registerCommand(command: VoiceCommand) {
        this.commands.push(command);
    }

    public clearCommands() {
        this.commands = [];
    }

    public start() {
        if (!this.recognition) return;
        if (this.isListening) return;

        try {
            this.recognition.start();
            this.isListening = true; // Optimistic update
            this.notifyStateChange();
        } catch (e) {
            console.error("Failed to start recognition:", e);
        }
    }

    public stop() {
        if (!this.recognition) return;
        this.isListening = false;
        this.notifyStateChange(); // Optimistic update
        this.recognition.stop();
    }

    public toggle() {
        if (this.isListening) {
            this.stop();
        } else {
            this.start();
        }
    }

    public setCallbacks(
        onResult: (transcript: string, isFinal: boolean) => void,
        onError: (error: string) => void,
        onStateChange: (isListening: boolean) => void
    ) {
        this.onResultCallback = onResult;
        this.onErrorCallback = onError;
        this.onStateChangeCallback = onStateChange;
    }

    private notifyStateChange() {
        if (this.onStateChangeCallback) {
            this.onStateChangeCallback(this.isListening);
        }
    }

    private processCommand(transcript: string) {
        const lowerTranscript = transcript.toLowerCase().trim();
        console.log("Processing command:", lowerTranscript);

        // Check for exact matches or keyword containment
        for (const cmd of this.commands) {
            if (cmd.keywords.some(keyword => lowerTranscript.includes(keyword.toLowerCase()))) {
                console.log("Matched command:", cmd.command);
                cmd.action();
                return; // Execute only first match
            }
        }
    }
}

export const voiceCommandService = new VoiceCommandService();
