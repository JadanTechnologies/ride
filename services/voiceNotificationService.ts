// Voice Notification Service
// Provides voice announcements for driver information and service events

interface VoiceMessage {
  id: string;
  text: string;
  language: 'en' | 'yo' | 'ha' | 'ig'; // English, Yoruba, Hausa, Igbo
  voiceGender: 'male' | 'female';
  speed: number; // 0.5 to 2.0
}

class VoiceNotificationService {
  private synth: SpeechSynthesis;
  private isSupported: boolean;

  constructor() {
    this.synth = window.speechSynthesis;
    this.isSupported = 'speechSynthesis' in window;
  }

  /**
   * Announce driver information when found
   */
  announceDriverFound(driverInfo: {
    name: string;
    plateNumber: string;
    carModel: string;
    eta: number;
  }): void {
    if (!this.isSupported) return;

    const message = `Driver found. ${driverInfo.name} driving ${driverInfo.carModel}. Plate number ${this.formatPlateNumber(driverInfo.plateNumber)}. Will arrive in ${driverInfo.eta} minutes.`;
    this.speak(message, 'en', 'female');
  }

  /**
   * Announce ride status updates
   */
  announceRideStatus(status: 'arrived' | 'started' | 'completed' | 'cancelled', details?: string): void {
    if (!this.isSupported) return;

    const messages: Record<string, string> = {
      arrived: 'Your driver has arrived at the pickup location.',
      started: 'Your ride has started. Enjoy your trip!',
      completed: 'Your ride is complete. Thank you for using our service.',
      cancelled: 'Your ride has been cancelled.'
    };

    let message = messages[status];
    if (details) message += ` ${details}`;

    this.speak(message, 'en', 'female');
  }

  /**
   * Announce payment confirmation
   */
  announcePaymentConfirmation(amount: number, method: string): void {
    if (!this.isSupported) return;

    const message = `Payment of ${this.formatCurrency(amount)} via ${method} has been confirmed. Your receipt has been sent to your email.`;
    this.speak(message, 'en', 'female');
  }

  /**
   * Announce promotion or offer
   */
  announcePromotion(title: string, discount: number): void {
    if (!this.isSupported) return;

    const message = `Great news! ${title}. Get ${discount} percent discount on your next ride using code PROMO${discount}.`;
    this.speak(message, 'en', 'male');
  }

  /**
   * Generic voice announcement
   */
  announce(text: string, language: 'en' | 'yo' | 'ha' | 'ig' = 'en', voiceGender: 'male' | 'female' = 'female'): void {
    if (!this.isSupported) return;
    this.speak(text, language, voiceGender);
  }

  /**
   * Core speak function
   */
  private speak(text: string, language: 'en' | 'yo' | 'ha' | 'ig', voiceGender: 'male' | 'female'): void {
    // Stop any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set language
    const langMap: Record<string, string> = {
      en: 'en-US',
      yo: 'yo-NG', // Yoruba
      ha: 'ha-NG', // Hausa
      ig: 'ig-NG'  // Igbo
    };

    utterance.lang = langMap[language] || 'en-US';

    // Set voice pitch and rate for better clarity
    utterance.pitch = voiceGender === 'female' ? 1.2 : 0.8;
    utterance.rate = 1; // Normal speed for clarity

    // Find appropriate voice
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => {
      const lang = v.lang.startsWith(langMap[language].split('-')[0]);
      const genderMatch = voiceGender === 'female' ? v.name.toLowerCase().includes('female') : v.name.toLowerCase().includes('male');
      return lang && genderMatch;
    });

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Add event listeners
    utterance.onstart = () => console.log('Voice notification started');
    utterance.onend = () => console.log('Voice notification ended');
    utterance.onerror = (event) => console.error('Voice notification error:', event.error);

    // Speak
    this.synth.speak(utterance);
  }

  /**
   * Format plate number for clearer pronunciation
   * e.g., "ABC-123" becomes "A B C 1 2 3"
   */
  private formatPlateNumber(plate: string): string {
    return plate.replace(/(-|_)/g, ' ').split('').join(' ');
  }

  /**
   * Format currency for clear announcement
   */
  private formatCurrency(amount: number): string {
    const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    });
    return formatter.format(amount);
  }

  /**
   * Stop all voice announcements
   */
  stop(): void {
    this.synth.cancel();
  }

  /**
   * Pause current announcement
   */
  pause(): void {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused announcement
   */
  resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Check if voice notifications are supported
   */
  isVoiceSupported(): boolean {
    return this.isSupported;
  }
}

// Export singleton instance
export const voiceNotificationService = new VoiceNotificationService();

// Ensure voices are loaded
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    console.log('Voices loaded');
  };
}

export default VoiceNotificationService;
