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

        console.groupCollapsed(
          `🤖 AI Interaction [${interactionId}] - ${modelName}`,
        );
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
            const args = call.args as any;
            console.group(`🛠️ Tool Call: ${call.name}`);
            console.log("Arguments:", args);

            // --- UTILITY TOOLS ---

            if (call.name === "get_current_time") {
              const timeInfo = {
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
              };
              console.log("Tool Output:", timeInfo);

              const toolStartTime = performance.now();
              result = await chat.sendMessage([
                {
                  functionResponse: {
                    name: call.name,
                    response: { result: timeInfo },
                  },
                },
              ]);
              const toolEndTime = performance.now();
              console.log(
                `AI Response after tool in ${(toolEndTime - toolStartTime).toFixed(2)}ms`,
              );

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
                ? { name: user.displayName, email: user.email, uid: user.uid }
                : { note: "User is not logged in / anonymous" };

              console.log("Tool Output:", userInfo);

              const toolStartTime = performance.now();
              result = await chat.sendMessage([
                {
                  functionResponse: {
                    name: call.name,
                    response: { result: userInfo },
                  },
                },
              ]);
              const toolEndTime = performance.now();
              console.log(
                `AI Response after tool in ${(toolEndTime - toolStartTime).toFixed(2)}ms`,
              );

              console.groupEnd();

              functionCallPart =
                result.response.candidates?.[0]?.content?.parts?.find(
                  (p) => p.functionCall,
                );
              continue;
            }

            // --- DATA FETCHING TOOLS ---

            const { getAuth } = await import("firebase/auth");
            const { app } = await import("../services/firebase/base");
            const auth = getAuth(app);
            const user = auth.currentUser;
            const uid = user?.uid;

            if (!uid) {
              const errorResponse = {
                error: "User not authenticated. Please log in to access data.",
              };
              result = await chat.sendMessage([
                {
                  functionResponse: {
                    name: call.name,
                    response: { result: errorResponse },
                  },
                },
              ]);
              functionCallPart =
                result.response.candidates?.[0]?.content?.parts?.find(
                  (p) => p.functionCall,
                );
              continue;
            }

            let toolResponse: any = null;

            try {
              switch (call.name) {
                // Chapters
                case "get_chapters": {
                  const { getChapters } = await import("../services/chapters");
                  toolResponse = await getChapters(uid);
                  break;
                }
                case "get_chapter_by_id": {
                  const { getChapterById } =
                    await import("../services/chapters");
                  toolResponse = await getChapterById(
                    uid,
                    args.chapterId as string,
                  );
                  break;
                }

                // Characters
                case "get_characters": {
                  const { getCharacters } =
                    await import("../services/characters");
                  toolResponse = await getCharacters(uid);
                  break;
                }
                case "get_character_by_id": {
                  const { getCharacterById } =
                    await import("../services/characters");
                  toolResponse = await getCharacterById(
                    uid,
                    args.characterId as string,
                  );
                  break;
                }
                case "search_characters": {
                  const { searchByName } =
                    await import("../services/characters");
                  toolResponse = await searchByName(
                    uid,
                    args.searchString as string,
                  );
                  break;
                }

                // Events
                case "get_events": {
                  const { getEvents } = await import("../services/events");
                  toolResponse = await getEvents(uid, args.filter as any);
                  break;
                }
                case "get_event_by_id": {
                  const { getEventById } = await import("../services/events");
                  toolResponse = await getEventById(
                    uid,
                    args.eventId as string,
                  );
                  break;
                }

                // Goals
                case "get_goals": {
                  const { getGoals } = await import("../services/goals");
                  toolResponse = await getGoals(uid);
                  break;
                }
                case "get_goal_by_id": {
                  const { getGoalById } = await import("../services/goals");
                  toolResponse = await getGoalById(uid, args.goalId as string);
                  break;
                }

                // Itineraries
                case "get_itineraries": {
                  const { getItineraries } =
                    await import("../services/itineraries");
                  toolResponse = await getItineraries(uid);
                  break;
                }
                case "get_itinerary_by_id": {
                  const { getItineraryById } =
                    await import("../services/itineraries");
                  toolResponse = await getItineraryById(
                    uid,
                    args.itineraryId as string,
                  );
                  break;
                }

                // Journals
                case "get_journals": {
                  const { getJournals } = await import("../services/journals");
                  toolResponse = await getJournals(
                    uid,
                    args.chapterId as string,
                  );
                  break;
                }
                case "get_journal_by_id": {
                  const { getJournalById } =
                    await import("../services/journals");
                  toolResponse = await getJournalById(
                    uid,
                    args.chapterId as string,
                    args.journalId as string,
                  );
                  break;
                }

                // Tasks
                case "get_tasks": {
                  const { getTasks } = await import("../services/tasks");
                  toolResponse = await getTasks(uid, args.filter as any);
                  break;
                }
                case "get_task_by_id": {
                  const { getTaskById } = await import("../services/tasks");
                  toolResponse = await getTaskById(uid, args.taskId as string);
                  break;
                }

                // --- UPDATE TOOLS ---
                case "update_chapter": {
                  const { updateChapter } =
                    await import("../services/chapters");
                  await updateChapter(uid, args.chapterId, args.data);
                  toolResponse = {
                    success: true,
                    message: `Chapter ${args.chapterId} updated successfully.`,
                  };
                  break;
                }
                case "update_character": {
                  const { updateCharacter } =
                    await import("../services/characters");
                  await updateCharacter(uid, args.characterId, args.data);
                  toolResponse = {
                    success: true,
                    message: `Character ${args.characterId} updated successfully.`,
                  };
                  break;
                }
                case "update_event": {
                  const { updateEvent } = await import("../services/events");
                  await updateEvent(uid, args.eventId, args.data);
                  toolResponse = {
                    success: true,
                    message: `Event ${args.eventId} updated successfully.`,
                  };
                  break;
                }
                case "update_goal": {
                  const { updateGoal } = await import("../services/goals");
                  await updateGoal(uid, args.goalId, args.data);
                  toolResponse = {
                    success: true,
                    message: `Goal ${args.goalId} updated successfully.`,
                  };
                  break;
                }
                case "update_itinerary": {
                  const { updateItinerary } =
                    await import("../services/itineraries");
                  await updateItinerary(uid, args.itineraryId, args.data);
                  toolResponse = {
                    success: true,
                    message: `Itinerary ${args.itineraryId} updated successfully.`,
                  };
                  break;
                }
                case "update_journal": {
                  const { updateJournal } =
                    await import("../services/journals");
                  await updateJournal(
                    uid,
                    args.chapterId,
                    args.journalId,
                    args.data,
                  );
                  toolResponse = {
                    success: true,
                    message: `Journal ${args.journalId} in chapter ${args.chapterId} updated successfully.`,
                  };
                  break;
                }
                case "update_task": {
                  const { updateTask } = await import("../services/tasks");
                  await updateTask(uid, args.taskId, args.data);
                  toolResponse = {
                    success: true,
                    message: `Task ${args.taskId} updated successfully.`,
                  };
                  break;
                }

                default:
                  // Handle other tools (Creation tools) via UI command logic below
                  break;
              }

              if (toolResponse !== null) {
                console.log(`Tool ${call.name} response:`, toolResponse);
                const toolStartTime = performance.now();
                result = await chat.sendMessage([
                  {
                    functionResponse: {
                      name: call.name,
                      response: { result: toolResponse },
                    },
                  },
                ]);
                const toolEndTime = performance.now();
                console.log(
                  `AI Response after ${call.name} in ${(toolEndTime - toolStartTime).toFixed(2)}ms`,
                );
                console.groupEnd();

                functionCallPart =
                  result.response.candidates?.[0]?.content?.parts?.find(
                    (p) => p.functionCall,
                  );
                continue;
              }
            } catch (err: any) {
              console.error(`Error executing tool ${call.name}:`, err);
              const errorResponse = {
                error:
                  err.message || "Unknown error occurred while fetching data.",
              };
              result = await chat.sendMessage([
                {
                  functionResponse: {
                    name: call.name,
                    response: { result: errorResponse },
                  },
                },
              ]);
              functionCallPart =
                result.response.candidates?.[0]?.content?.parts?.find(
                  (p) => p.functionCall,
                );
              console.groupEnd();
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
            console.warn(`Rate limit hit on model: ${modelName}`);

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
