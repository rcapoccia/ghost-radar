require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const analyzeRouter = require("./src/routes/analyze");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50kb" }));

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    error: "Troppi tentativi. Riprova tra un'ora. Passa a Premium per analisi illimitate.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/analyze", limiter);
app.use("/api/analyze", analyzeRouter);

app.get("/health", (_, res) => res.json({ status: "ok", version: "1.0.0" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message?.includes("JSON")) {
    return res
      .status(500)
      .json({ error: "Errore nell'analisi AI. Riprova." });
  }
  res.status(500).json({ error: err.message || "Errore interno del server." });
});

app.listen(PORT, () => {
  console.log(`GhostRadar backend running on port ${PORT}`);
});
