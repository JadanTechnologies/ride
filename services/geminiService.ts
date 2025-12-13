import { GoogleGenAI, Type } from "@google/genai";

// Initialize directly with the environment variable as per security guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSupportResponse = async (
  userMessage: string, 
  context: string = "general"
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: `You are 'KekeBot', a helpful support assistant for the 'Keke Napepe Ride' app in Nigeria.
      
        Your personality: Friendly, efficient, and uses Nigerian English nuances occasionally (e.g., "No wahala", "Oga/Madam").
        
        Knowledge Base:
        - We offer Keke (Tricycle), Okada (Bike), and Bus rides.
        - We operate in Lagos, Abuja, and Port Harcourt.
        - Payments can be made via Wallet, Cash, or Card.
        - Current Context: ${context}
        
        Keep response short (under 50 words) and helpful.`,
      }
    });
    
    return response.text || "Sorry, I didn't catch that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the network. Please try again.";
  }
};

export const estimateTripDetails = async (pickup: string, dropoff: string): Promise<{
    duration: string,
    distance: string,
    traffic: string
} | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Estimate the driving distance and time between "${pickup}" and "${dropoff}" in a generic city setting.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    duration: { type: Type.STRING, description: "Estimated time (e.g. '15 mins')" },
                    distance: { type: Type.STRING, description: "Estimated distance (e.g. '5.2 km')" },
                    traffic: { type: Type.STRING, description: "Traffic condition (e.g. 'Light', 'Moderate', 'Heavy')" }
                  },
                  required: ["duration", "distance", "traffic"]
                }
            }
        });

        let text = response.text;
        if (!text) return null;

        // Clean up markdown code blocks if present (common issue with LLM JSON output)
        if (text.startsWith('```')) {
            text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        return JSON.parse(text);

    } catch (e) {
        console.error("Estimation failed", e);
        // Fallback for demo purposes if API fails
        return { duration: "20 mins", distance: "8 km", traffic: "Moderate" }; 
    }
}