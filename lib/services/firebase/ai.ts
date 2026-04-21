import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "./base";
import { AI_SYSTEM_PROMPT } from "../../constants";
import { initAppCheck } from "./appCheck";
import { zodToGeminiSchema } from "./schema-utils";

import { toolDeclarations } from "./tools";

initAppCheck();

const ai = getAI(app, { backend: new GoogleAIBackend() });

const tools = [
  {
    functionDeclarations: toolDeclarations,
  },
] as any;


export const AVAILABLE_MODELS = [
  "gemini-3.1-pro-preview", // Cutting edge default
  "gemini-3.1-flash-lite-preview", // Stable, fast fallback
  "gemini-2.5-pro", // High intelligence fallback
  "gemini-2.5-flash", // Reliable pro fallback
  "gemini-2.5-flash-lite", // Very fast, light
];

export const getModel = (modelName: string = AVAILABLE_MODELS[0]) => {
  return getGenerativeModel(ai, {
    model: modelName,
    systemInstruction: AI_SYSTEM_PROMPT,
    tools: tools,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
    },
  });
};

// For backward compatibility while migrating
export const model = getModel(AVAILABLE_MODELS[0]);
