/**
 * Shared code between client and server
 * Types and interfaces for the SignBridge application
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Translation API types
 */
export interface TranslationRequest {
  text: string;
  language?: string;
  speed?: "slow" | "normal" | "fast";
}

export interface TranslationResponse {
  success: boolean;
  translatedText: string;
  signSequence: SignGesture[];
  duration: number;
  confidence: number;
}

export interface SignGesture {
  id: string;
  name: string;
  duration: number;
  handPosition: {
    left: { x: number; y: number; z: number };
    right: { x: number; y: number; z: number };
  };
  bodyPosition: {
    rotation: number;
    lean: number;
  };
  facialExpression?: string;
}

/**
 * Voice processing API types
 */
export interface VoiceProcessingRequest {
  audioData?: string; // Base64 encoded audio
  text?: string; // Alternative text input
  language?: string;
  enhanceAudio?: boolean;
}

export interface VoiceProcessingResponse {
  success: boolean;
  transcribedText: string;
  confidence: number;
  audioQuality: {
    volume: number;
    clarity: number;
    backgroundNoise: number;
  };
  suggestions?: string[];
}

/**
 * Application state types
 */
export interface SessionStats {
  translations: number;
  accuracy: number;
  savedTime: string;
}

export interface Visual {
  id: string;
  type: "image" | "icon" | "diagram";
  url: string;
  description: string;
  relevance: number;
  category: string;
}
