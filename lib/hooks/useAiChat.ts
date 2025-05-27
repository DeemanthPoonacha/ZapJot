import { useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { model } from "../services/firebase";
import { ChatSession } from "firebase/ai";
import { ChatMessage, ChatRole } from "@/types/ai-chat";
import { useGlobalState } from "./global-state";

export function useAiChat() {
  const [messages, setMessages, resetMessages, updateMessages] = useGlobalState<
    ChatMessage[]
  >("messages", [
    { role: ChatRole.AI, text: "Hello, how can I help you today?" },
  ]);

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
    false
  );

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
      console.log(`Tokens: ${result.response.usageMetadata?.totalTokenCount}`);

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
    messages,
    setMessages,
    updateMessages,
    clearMessages,
    addMessage,
  };
}
