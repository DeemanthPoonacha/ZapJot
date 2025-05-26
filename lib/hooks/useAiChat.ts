import { useState, useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { model } from "../services/firebase";
import { ChatSession } from "firebase/ai";

export function useAiChat() {
  const chatSessionRef = useRef<ChatSession | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const initializeSession = useCallback(async () => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = model.startChat({
        history: [],
      });

      setIsSessionActive(true);
    }
    return chatSessionRef.current;
  }, []);

  const sendMessage = useMutation({
    mutationFn: async (userPrompt: string) => {
      const chat = await initializeSession();

      const result = await chat.sendMessage(userPrompt);
      console.log("🚀 ~ mutationFn: ~ result:", result);
      const response = result.response;

      return response.text();
    },
    onError: (error) => {
      console.error("Firebase AI Chat Error:", error);
    },
  });

  const resetSession = useCallback(() => {
    chatSessionRef.current = null;
    setIsSessionActive(false);
  }, []);

  return {
    sendMessage,
    resetSession,
    isSessionActive,
  };
}
