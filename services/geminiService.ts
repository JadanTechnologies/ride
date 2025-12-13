// In-browser safe implementation
// Notes:
// - The official @google/genai SDK is server-side only and must not be bundled in the browser.
// - For a production app, implement a small server API that calls Google GenAI with a secret key.
// - This file includes a simple demo/mock logic and a helpful fallback path.

export const generateSupportResponse = async (
  userMessage: string,
  context: string = 'general'
): Promise<string> => {
  // If you have a production backend that proxies the call, call it here.
  const hasApiKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY);
  if (hasApiKey) {
    // Attempt to call a proxy endpoint at /api/genai/support. If you'd like to connect
    // directly to GenAI you'll need a server to hold the API key and handle the request.
    try {
      const res = await fetch('/api/genai/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context })
      });
      if (res.ok) {
        const data = await res.json();
        return data?.text || "Sorry, I didn't catch that.";
      }
    } catch (err) {
      // Ignore and fallback to local fallback
      console.warn('GenAI proxy failed, falling back to local response', err);
    }
  }

  // Local fallback: simple rule-based responses for demo purposes
  const lower = userMessage.toLowerCase();
  if (lower.includes('help') || lower.includes('support')) return "No wahala — send details and we'll help you quickly.";
  if (lower.includes('price') || lower.includes('fare') || lower.includes('how much')) return "Fares depend on distance and vehicle type — choose a ride and we'll estimate the price.";
  if (lower.includes('where') && lower.includes('service')) return "We operate in Lagos, Abuja, and Port Harcourt.";
  if (lower.includes('pay') || lower.includes('payment')) return "You can pay with Wallet, Card, or Cash. Use the Wallet for faster payments.";
  // Default friendly reply
  return `Hi! I'm KekeBot — how can I help with your ride today?`;
};

export const estimateTripDetails = async (pickup: string, dropoff: string): Promise<{
    duration: string,
    distance: string,
    traffic: string
} | null> => {
    // If a server-side API is present, call it. Otherwise provide a sensible mock.
    const hasApiKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY);
    if (hasApiKey) {
      try {
        const res = await fetch('/api/genai/estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pickup, dropoff })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('GenAI estimate proxy failed, using local estimate', err);
      }
    }

    // Local estimation algorithm (very rough): use character lengths as proxy for distance
    const baseDistanceKm = Math.max(1, Math.round(Math.abs(pickup.length - dropoff.length) + 3));
    const durationMins = Math.round(baseDistanceKm * 5 + 10);
    const traffic = durationMins > 30 ? 'Heavy' : durationMins > 15 ? 'Moderate' : 'Light';

    return {
      duration: `${durationMins} mins`,
      distance: `${baseDistanceKm} km`,
      traffic
    };
}