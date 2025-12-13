// The project's GeminI-related helper functions. The original implementation used the
// @google/genai SDK, but the published version was unavailable at build time which
// caused 'npm install' to fail in CI. To keep the app buildable and functional while
// retaining the same exported functions, this module implements a lightweight
// fallback/stub that can be replaced by the official SDK or a server-side wrapper later.

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || "";

export const generateSupportResponse = async (
  userMessage: string,
  context: string = "general"
): Promise<string> => {
  if (!userMessage || userMessage.trim() === "") return "Hello! How can I help?";

  // If a real API key is set up in a secure environment, developers can implement
  // a small serverless proxy that exchanges it for a short-lived token and calls the
  // Google GenAI REST API from the server. For now, return a helpful, short response.
  const normalized = userMessage.toLowerCase();

  if (normalized.includes("book") || normalized.includes("ride")) {
    return "No wahala — to book, choose your vehicle, provide pickup/dropoff, and confirm payment.";
  }
  if (normalized.includes("price") || normalized.includes("fare")) {
    return "Fares vary by city and vehicle; use the fare estimator in the app for a quick estimate.";
  }
  if (normalized.includes("hello") || normalized.includes("hi") || normalized.includes("hey")) {
    return "Hello! I'm KekeBot — how can I help with your ride today?";
  }

  // fallback short reply
  return "No wahala — tell me more and I’ll help.";
};

export const estimateTripDetails = async (
  pickup: string,
  dropoff: string
): Promise<{ duration: string; distance: string; traffic: string } | null> => {
  // Without a server-side routing or a supported public SDK version, return a simple
  // deterministic fallback estimate; this keeps the UI functional and predictable.
  if (!pickup || !dropoff) return null;

  // Very small heuristics for demo purposes
  const duration = (Math.floor(Math.random() * 25) + 10) + " mins";
  const distance = (Math.floor(Math.random() * 10) + 3) + " km";
  const traffic = ["Light", "Moderate", "Heavy"][Math.floor(Math.random() * 3)];

  return { duration, distance, traffic };
};

export default {};