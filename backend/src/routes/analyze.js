const express = require("express");
const { analyzeContent } = require("../services/claudeService");

const router = express.Router();

router.post("/", async (req, res) => {
  const { content, analysisType, context } = req.body;

  if (!content || typeof content !== "string") {
    return res
      .status(400)
      .json({ error: "Contenuto mancante o non valido." });
  }

  if (!["chat", "situation"].includes(analysisType)) {
    return res
      .status(400)
      .json({ error: "Tipo di analisi non valido. Usa 'chat' o 'situation'." });
  }

  if (content.trim().length < 20) {
    return res
      .status(400)
      .json({ error: "Contenuto troppo breve. Aggiungi più dettagli." });
  }

  if (content.length > 8000) {
    return res
      .status(400)
      .json({ error: "Contenuto troppo lungo. Massimo 8000 caratteri." });
  }

  const result = await analyzeContent(content, analysisType, context || "");
  res.json({ success: true, analysis: result });
});

module.exports = router;
