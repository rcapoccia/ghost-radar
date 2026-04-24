const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sei GhostRadar, un esperto analista di relazioni basato su AI con anni di esperienza in psicologia comportamentale e comunicazione interpersonale.

Il tuo compito è analizzare conversazioni e situazioni relazionali con precisione chirurgica per identificare segnali di disinteresse, ghosting, manipolazione, o al contrario di interesse genuino.

Sei diretto, onesto, empatico. Non dai false speranze ma non sei crudele. Usi evidenze specifiche dal testo fornito.

RISPONDI SEMPRE E SOLO con JSON valido nel formato esatto specificato. Non aggiungere testo fuori dal JSON.`;

const ANALYSIS_SCHEMA = `{
  "ghostScore": <numero 0-100: probabilità di essere ghostati, 100=certezza>,
  "interestScore": <numero 0-100: interesse genuino dell'altra persona, 100=massimo>,
  "redFlags": [<array di stringhe: segnali negativi specifici rilevati nel testo>],
  "greenFlags": [<array di stringhe: segnali positivi rilevati nel testo>],
  "manipulationSigns": [<array di stringhe: possibili comportamenti manipolativi>],
  "behaviorPatterns": [<array di stringhe: pattern comportamentali identificati>],
  "recommendation": {
    "action": <"scrivi_ora" | "aspetta" | "vai_avanti" | "blocca_e_sparisci">,
    "title": <titolo breve dell'azione consigliata>,
    "text": <consiglio specifico dettagliato, massimo 2 frasi>
  },
  "summary": <analisi riassuntiva in 2-3 frasi dirette e oneste>,
  "urgency": <"bassa" | "media" | "alta" | "critica">,
  "verdict": <una frase secca e diretta tipo "Sta sparendo piano piano" o "È interessato ma ha paura">
}`;

async function analyzeContent(content, analysisType, context) {
  const userPrompt = `Analizza questo contenuto e rispondi SOLO con JSON valido nel formato seguente:
${ANALYSIS_SCHEMA}

TIPO DI ANALISI: ${analysisType === "chat" ? "Conversazione chat" : "Descrizione situazione relazionale"}

${context ? `CONTESTO AGGIUNTIVO: ${context}\n` : ""}
CONTENUTO DA ANALIZZARE:
---
${content}
---

Cerca specificamente: frequenza messaggi, lunghezza risposte, tempi di risposta (se menzionati), emoji usate, tono emotivo, iniziativa nelle conversazioni, coerenza tra parole e azioni, segnali di interesse o distanza emotiva.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  const rawText = response.content[0].text.trim();

  // Strip markdown code blocks if present
  const jsonText = rawText
    .replace(/^```(?:json)?\n?/i, "")
    .replace(/\n?```$/i, "")
    .trim();

  return JSON.parse(jsonText);
}

module.exports = { analyzeContent };
