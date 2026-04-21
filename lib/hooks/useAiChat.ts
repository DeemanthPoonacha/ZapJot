import { useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { getModel, AVAILABLE_MODELS } from "../services/firebase/ai";
import { ChatSession } from "firebase/ai";
import { ChatMessage, ChatRole } from "@/types/ai-chat";
import { useGlobalState } from "./global-state";

export function useAiChat() {
  const [messages, setMessages, resetMessages, updateMessages] = useGlobalState<
    ChatMessage[]
  >("messages", [
    { role: ChatRole.AI, text: "Hello, how can I help you today?" },
  ]);

  const [currentModelIndex, setCurrentModelIndex] = useGlobalState(
    "ai-current-model-index",
    0,
  );

  const clearMessages = () => {
    resetMessages();
  };

  const addMessage = (message: ChatMessage) => {
    updateMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, message];
      return updatedMessages;
    });
  };

  const chatSessionRef = useRef<ChatSession | null>(null);
  const [isSessionActive, setIsSessionActive] = useGlobalState(
    "ai-chat-session-active",
    false,
  );

  const initializeSession = useCallback(
    async (modelIdx = currentModelIndex) => {
      if (!chatSessionRef.current) {
        const model = getModel(AVAILABLE_MODELS[modelIdx]);
        if (!model) {
          console.error("AI model not initialized");
          return null;
        }

        // Convert UI messages to history format if recovering a session
        const history = messages.slice(1).map((m) => ({
          role: m.role === ChatRole.USER ? "user" : "model",
          parts: [{ text: m.text }],
        }));

        chatSessionRef.current = model.startChat({
          history: history as any,
        });

        setIsSessionActive(true);
      }
      return chatSessionRef.current;
    },
    [currentModelIndex, messages],
  );

  const sendMessage = useMutation({
    mutationFn: async (userPrompt: string) => {
      const executeWithRetry = async (
        prompt: string,
        modelIdx: number,
        retryCount = 0,
      ): Promise<string | null> => {
        const modelName = AVAILABLE_MODELS[modelIdx];
        const interactionId = Math.random().toString(36).substring(7);
        
        console.groupCollapsed(`🤖 AI Interaction [${interactionId}] - ${modelName}`);
        console.log("Prompt:", prompt);
        console.log("Model:", modelName);
        console.log("Retry Count:", retryCount);

        try {
          const chat = await initializeSession(modelIdx);
          if (!chat) throw new Error("Chat session not initialized");

          const startTime = performance.now();
          let result = await chat.sendMessage(prompt);
          const endTime = performance.now();
          const initialLatency = (endTime - startTime).toFixed(2);

          console.log(`Response received in ${initialLatency}ms`);

          let functionCallPart =
            result.response.candidates?.[0]?.content?.parts?.find(
              (p) => p.functionCall,
            );

          while (functionCallPart?.functionCall) {
            const call = functionCallPart.functionCall;
            console.group(`🛠️ Tool Call: ${call.name}`);
            console.log("Arguments:", call.args);

            if (call.name === "get_current_time") {
              const timeInfo = {
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
              };
              console.log("Tool Output:", timeInfo);
              
              const toolStartTime = performance.now();
              result = await chat.sendMessage([
                {
                  functionResponse: { name: call.name, response: timeInfo },
                },
              ]);
              const toolEndTime = performance.now();
              console.log(`AI Response after tool in ${(toolEndTime - toolStartTime).toFixed(2)}ms`);

              console.groupEnd();
              
              functionCallPart =
                result.response.candidates?.[0]?.content?.parts?.find(
                  (p) => p.functionCall,
                );
              continue;
            }

            if (call.name === "get_user_info") {
              const { getAuth } = await import("firebase/auth");
              const { app } = await import("../services/firebase/base");
              const auth = getAuth(app);
              const user = auth.currentUser;
              const userInfo = user
                ? { name: user.displayName, email: user.email }
                : { note: "User is not logged in / anonymous" };

              console.log("Tool Output:", userInfo);

              const toolStartTime = performance.now();
              result = await chat.sendMessage([
                {
                  functionResponse: { name: call.name, response: userInfo },
                },
              ]);
              const toolEndTime = performance.now();
              console.log(`AI Response after tool in ${(toolEndTime - toolStartTime).toFixed(2)}ms`);

              console.groupEnd();

              functionCallPart =
                result.response.candidates?.[0]?.content?.parts?.find(
                  (p) => p.functionCall,
                );
              continue;
            }
            
            // For other tools that we handle in the UI
            const actionType =
              call.name.split("_").slice(1).join(" ") || "item";
            const friendlyName =
              actionType.charAt(0).toUpperCase() + actionType.slice(1);

            const command = {
              action: call.name,
              ...call.args,
              message: `Sure! I've prepared that ${friendlyName} for you. Please review and complete the details:`,
            };
            
            console.log("Command Prepared for UI:", command);
            console.groupEnd(); // Close Tool Call group
            console.groupEnd(); // Close AI Interaction group
            
            return JSON.stringify(command);
          }

          const finalResponse = result.response.text();
          console.log("Final AI Response:", finalResponse);
          console.groupEnd();
          
          return finalResponse;
        } catch (error: any) {
          const isRateLimit =
            error.message?.includes("429") || error.status === 429;

          if (isRateLimit) {
            console.warn(
              `Rate limit hit on model: ${modelName}`,
            );

            // Try fallback if available
            if (modelIdx < AVAILABLE_MODELS.length - 1) {
              const nextIdx = modelIdx + 1;
              console.log(
                `Falling back to next model: ${AVAILABLE_MODELS[nextIdx]}`,
              );

              // Increment global model index state
              setCurrentModelIndex(nextIdx);

              // Force session re-initialization on next call
              chatSessionRef.current = null;

              // Small wait before retry
              await new Promise((res) =>
                setTimeout(res, 1000 * Math.pow(2, retryCount)),
              );

              console.groupEnd(); // End current (failed) group before retry
              return executeWithRetry(prompt, nextIdx, retryCount + 1);
            }
          }
          
          console.error("AI Error in executeWithRetry:", error);
          console.groupEnd();
          throw error;
        }
      };

      return executeWithRetry(userPrompt, currentModelIndex);
    },
    onError: (error) => {
      console.error("Firebase AI Chat Error:", error);
    },
  });

  const resetSession = useCallback(() => {
    chatSessionRef.current = null;
    setIsSessionActive(false);
    setCurrentModelIndex(0); // Reset to primary model on manual reset
  }, []);

  return {
    sendMessage,
    resetSession,
    isSessionActive,
    messages,
    setMessages,
    updateMessages,
    clearMessages,
    addMessage,
    currentModel: AVAILABLE_MODELS[currentModelIndex],
  };
}
