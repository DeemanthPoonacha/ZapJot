import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "./base";
import { AI_SYSTEM_PROMPT } from "../../constants";
import { initAppCheck } from "./appCheck";

initAppCheck();

const ai = getAI(app, { backend: new GoogleAIBackend() });

export const model = getGenerativeModel(ai, {
  model: "gemini-2.0-flash",
  systemInstruction: AI_SYSTEM_PROMPT,
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
  },
});
