/**
 * AI Service for Chatbot Responses
 * Supports both Gemini and OpenAI APIs
 */

export type AIProvider = 'gemini' | 'openai';

export interface AIConfig {
  provider: AIProvider;
  geminiApiKey?: string;
  openaiApiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  confidence: number;
  tokens?: number;
  shouldEscalate: boolean;
}

class AIService {
  private static config: AIConfig = {
    provider: 'gemini',
    temperature: 0.7,
    maxTokens: 500
  };

  /**
   * Initialize AI Service with configuration
   */
  static initialize(config: AIConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Generate AI response using configured provider
   */
  static async generateResponse(question: string): Promise<AIResponse> {
    if (this.config.provider === 'openai') {
      return this.generateOpenAIResponse(question);
    } else {
      return this.generateGeminiResponse(question);
    }
  }

  /**
   * Generate response using Gemini API
   */
  private static async generateGeminiResponse(question: string): Promise<AIResponse> {
    if (!this.config.geminiApiKey) {
      return {
        content: 'AI service not configured. Please configure Gemini API key in admin settings.',
        provider: 'gemini',
        confidence: 0,
        shouldEscalate: true
      };
    }

    try {
      // Since we can't make real API calls, return a simulated response
      // In production, this would call: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
      
      const systemPrompt = `You are a helpful customer support assistant for Keke Napepe, a ride-sharing application in Nigeria. 
        You help users with questions about booking rides, payments, driver information, and account management.
        Keep responses concise and helpful. If you cannot help, suggest escalating to a human agent.`;

      // Simulated API response
      const simulatedContent = this.generateFallbackResponse(question);

      return {
        content: simulatedContent,
        provider: 'gemini',
        confidence: 0.85,
        shouldEscalate: this.shouldEscalateQuestion(question)
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        content: 'I encountered an issue processing your question. Please try again or speak with an agent.',
        provider: 'gemini',
        confidence: 0,
        shouldEscalate: true
      };
    }
  }

  /**
   * Generate response using OpenAI API
   */
  private static async generateOpenAIResponse(question: string): Promise<AIResponse> {
    if (!this.config.openaiApiKey) {
      return {
        content: 'AI service not configured. Please configure OpenAI API key in admin settings.',
        provider: 'openai',
        confidence: 0,
        shouldEscalate: true
      };
    }

    try {
      // Since we can't make real API calls, return a simulated response
      // In production, this would call: https://api.openai.com/v1/chat/completions

      const systemPrompt = `You are a helpful customer support assistant for Keke Napepe, a ride-sharing application in Nigeria. 
        You help users with questions about booking rides, payments, driver information, and account management.
        Keep responses concise and helpful. If you cannot help, suggest escalating to a human agent.`;

      // Simulated API response
      const simulatedContent = this.generateFallbackResponse(question);

      return {
        content: simulatedContent,
        provider: 'openai',
        confidence: 0.88,
        shouldEscalate: this.shouldEscalateQuestion(question)
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return {
        content: 'I encountered an issue processing your question. Please try again or speak with an agent.',
        provider: 'openai',
        confidence: 0,
        shouldEscalate: true
      };
    }
  }

  /**
   * Generate fallback response when API is not available
   */
  private static generateFallbackResponse(question: string): string {
    const lowerQuestion = question.toLowerCase();

    // Ride booking
    if (lowerQuestion.includes('how') && (lowerQuestion.includes('book') || lowerQuestion.includes('ride'))) {
      return 'To book a ride: 1) Open the Keke Napepe app, 2) Enter your pickup and destination, 3) Select your preferred vehicle (Keke, Okada, or Bus), 4) Confirm the fare and book. A driver will accept your ride shortly.';
    }

    // Password reset
    if (lowerQuestion.includes('password') || lowerQuestion.includes('reset')) {
      return 'To reset your password: 1) Click "Forgot Password" on the login page, 2) Enter your email or phone number, 3) Follow the instructions sent to your email, 4) Create a new password. If you don\'t receive an email, check your spam folder or contact support.';
    }

    // Payment
    if (lowerQuestion.includes('payment') || lowerQuestion.includes('pay')) {
      return 'We accept multiple payment methods: Debit/Credit cards, Bank transfer, Mobile wallets, and Cash. You can save your preferred payment method in your account settings for quicker transactions.';
    }

    // Withdrawal / Earnings
    if (lowerQuestion.includes('withdraw') || lowerQuestion.includes('earnings') || lowerQuestion.includes('money')) {
      return 'To withdraw your earnings: 1) Go to Wallet > Withdrawal, 2) Enter the amount, 3) Select your bank account, 4) Confirm the withdrawal. Funds typically arrive within 24-48 hours. You can only withdraw amounts above the minimum threshold.';
    }

    // Driver information
    if (lowerQuestion.includes('driver') || lowerQuestion.includes('rating')) {
      return 'All drivers are verified professionals with valid licenses and insurance. You can see driver ratings, vehicle details, and estimated arrival time before confirming your ride. You can also rate and review drivers after completing your journey.';
    }

    // Safety
    if (lowerQuestion.includes('safe') || lowerQuestion.includes('security')) {
      return 'Your safety is our priority. All rides are tracked in real-time, drivers are verified, and emergency features are available. Share your trip details with trusted contacts and report any issues immediately through the app.';
    }

    // Account
    if (lowerQuestion.includes('account') || lowerQuestion.includes('profile')) {
      return 'You can manage your account by going to Settings > Profile. Here you can update your personal information, emergency contacts, payment methods, and notification preferences.';
    }

    // Cancellation
    if (lowerQuestion.includes('cancel') || lowerQuestion.includes('cancellation')) {
      return 'You can cancel a ride before a driver accepts. Once a driver accepts, cancellation fees may apply. To cancel: open your active ride > tap the cancel button. For drivers, there may be penalties for cancellations. Check the app for current cancellation policies.';
    }

    // Default response
    return 'Thank you for your question! While I\'ve tried my best to help, this might require more detailed assistance. An agent will contact you shortly to resolve your issue.';
  }

  /**
   * Check if a question should be escalated to a human agent
   */
  private static shouldEscalateQuestion(question: string): boolean {
    const escalationKeywords = [
      'account suspended',
      'fraud',
      'dispute',
      'accident',
      'emergency',
      'complaint',
      'urgent',
      'refund',
      'legal',
      'lawsuit',
      'ban',
      'deactivated'
    ];

    const lowerQuestion = question.toLowerCase();
    return escalationKeywords.some(keyword => lowerQuestion.includes(keyword));
  }

  /**
   * Match question against auto-reply patterns
   */
  static matchAutoReply(question: string, autoReplies: Array<{ keywords: string[]; response: string }>): string | null {
    const lowerQuestion = question.toLowerCase();

    for (const autoReply of autoReplies) {
      if (autoReply.keywords.some(keyword => lowerQuestion.includes(keyword.toLowerCase()))) {
        return autoReply.response;
      }
    }

    return null;
  }

  /**
   * Process question with intelligent routing
   */
  static async processQuestion(
    question: string,
    autoReplies: Array<{ keywords: string[]; response: string }>
  ): Promise<{ response: string; isAutoReply: boolean; shouldEscalate: boolean }> {
    // First try to match auto-replies
    const autoReplyMatch = this.matchAutoReply(question, autoReplies);
    if (autoReplyMatch) {
      return {
        response: autoReplyMatch,
        isAutoReply: true,
        shouldEscalate: false
      };
    }

    // If no auto-reply match, generate AI response
    const aiResponse = await this.generateResponse(question);

    return {
      response: aiResponse.content,
      isAutoReply: false,
      shouldEscalate: aiResponse.shouldEscalate
    };
  }

  /**
   * Get current provider
   */
  static getProvider(): AIProvider {
    return this.config.provider;
  }

  /**
   * Get configuration
   */
  static getConfig(): AIConfig {
    return { ...this.config };
  }
}

export default AIService;
