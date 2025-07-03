import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleTranslation,
  handleTranslationStatus,
} from "./routes/translation";
import {
  handleVoiceProcessing,
  handleVoiceSettings,
} from "./routes/voice-processing";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" })); // Increased limit for audio data
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Health check routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "SignBridge API is running!" });
  });

  app.get("/api/demo", handleDemo);

  // Translation API routes
  app.post("/api/translate", handleTranslation);
  app.get("/api/translation-status", handleTranslationStatus);

  // Voice processing API routes
  app.post("/api/voice/process", handleVoiceProcessing);
  app.get("/api/voice/settings", handleVoiceSettings);
  app.post("/api/voice/settings", handleVoiceSettings);

  // Placeholder image endpoint for development
  app.get("/api/placeholder/:width/:height", (req, res) => {
    const { width, height } = req.params;
    res.redirect(
      `https://via.placeholder.com/${width}x${height}/E5E5E5/666666?text=Visual+Context`,
    );
  });

  return app;
}
