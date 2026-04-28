// Set this to your deployed backend URL in production
const BASE_URL = __DEV__
  ? "http://192.168.1.100:3000"  // Replace with your local IP
  : ": "https://ghost-radar-production.up.railway.app";

export async function analyzeRelationship({ content, analysisType, context }) {
  const response = await fetch(`${BASE_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, analysisType, context }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Errore nell'analisi. Riprova.");
  }

  return data.analysis;
}
