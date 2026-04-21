import { useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { getModel, AVAILABLE_MODELS } from "../services/firebase/ai";
import { ChatSession } from "firebase/ai";
import { ChatMessage, ChatRole } from "@/types/ai-chat";
import { useGlobalState } from "./global-state";
import { useSettings } from "./useSettings";

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

  const [aiStatus, setAiStatus] = useGlobalState<string | null>(
    "ai-current-status",
    null,
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

  const { settings } = useSettings();
  const seenItemsRef = useRef<Set<string>>(new Set());

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

        // Reset seen items for a new user prompt
        if (retryCount === 0) seenItemsRef.current.clear();

        setAiStatus("Thinking");

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

            // Update status based on tool call
            const statusMessage = getStatusFromTool(call.name, args);
            if (statusMessage) setAiStatus(statusMessage);

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
                  const { getChapterById } =
                    await import("../services/chapters");
                  const current = await getChapterById(uid, args.chapterId);

                  // If AI hasn't seen current data yet, return it to AI for merging
                  if (current && !seenItemsRef.current.has(args.chapterId)) {
                    seenItemsRef.current.add(args.chapterId);
                    toolResponse = {
                      status: "EXISTING_DATA_RETURNED",
                      currentData: current,
                    };
                  } else {
                    // AI has seen it or it doesn't exist, proceed to UI command
                    toolResponse = null;
                    functionCallPart = {
                      functionCall: {
                        name: "update_chapter",
                        args: { ...current, ...args.data, id: args.chapterId },
                      },
                    } as any;
                  }
                  break;
                }
                case "update_character": {
                  const { getCharacterById } =
                    await import("../services/characters");
                  const current = await getCharacterById(uid, args.characterId);

                  if (current && !seenItemsRef.current.has(args.characterId)) {
                    seenItemsRef.current.add(args.characterId);
                    toolResponse = {
                      status: "EXISTING_DATA_RETURNED",
                      currentData: current,
                    };
                  } else {
                    toolResponse = null;
                    functionCallPart = {
                      functionCall: {
                        name: "update_character",
                        args: {
                          ...current,
                          ...args.data,
                          id: args.characterId,
                        },
                      },
                    } as any;
                  }
                  break;
                }
                case "update_event": {
                  const { getEventById } = await import("../services/events");
                  const current = await getEventById(uid, args.eventId);

                  if (current && !seenItemsRef.current.has(args.eventId)) {
                    seenItemsRef.current.add(args.eventId);
                    toolResponse = {
                      status: "EXISTING_DATA_RETURNED",
                      currentData: current,
                    };
                  } else {
                    toolResponse = null;
                    functionCallPart = {
                      functionCall: {
                        name: "update_event",
                        args: { ...current, ...args.data, id: args.eventId },
                      },
                    } as any;
                  }
                  break;
                }
                case "update_goal": {
                  const { getGoalById } = await import("../services/goals");
                  const current = await getGoalById(uid, args.goalId);

                  if (current && !seenItemsRef.current.has(args.goalId)) {
                    seenItemsRef.current.add(args.goalId);
                    toolResponse = {
                      status: "EXISTING_DATA_RETURNED",
                      currentData: current,
                    };
                  } else {
                    toolResponse = null;
                    functionCallPart = {
                      functionCall: {
                        name: "update_goal",
                        args: { ...current, ...args.data, id: args.goalId },
                      },
                    } as any;
                  }
                  break;
                }
                case "update_itinerary": {
                  const { getItineraryById } =
                    await import("../services/itineraries");
                  const current = await getItineraryById(uid, args.itineraryId);

                  if (current && !seenItemsRef.current.has(args.itineraryId)) {
                    seenItemsRef.current.add(args.itineraryId);
                    toolResponse = {
                      status: "EXISTING_DATA_RETURNED",
                      currentData: current,
                    };
                  } else {
                    toolResponse = null;
                    functionCallPart = {
                      functionCall: {
                        name: "update_itinerary",
                        args: {
                          ...current,
                          ...args.data,
                          id: args.itineraryId,
                        },
                      },
                    } as any;
                  }
                  break;
                }
                case "update_journal": {
                  const { getJournalById } =
                    await import("../services/journals");
                  const current = await getJournalById(
                    uid,
                    args.chapterId,
                    args.journalId,
                  );

                  if (current && !seenItemsRef.current.has(args.journalId)) {
                    seenItemsRef.current.add(args.journalId);
                    toolResponse = {
                      status: "EXISTING_DATA_RETURNED",
                      currentData: current,
                    };
                  } else {
                    toolResponse = null;
                    functionCallPart = {
                      functionCall: {
                        name: "update_journal",
                        args: {
                          ...current,
                          ...args.data,
                          id: args.journalId,
                          chapterId: args.chapterId,
                        },
                      },
                    } as any;
                  }
                  break;
                }
                case "update_task": {
                  const { getTaskById } = await import("../services/tasks");
                  const current = await getTaskById(uid, args.taskId);

                  if (current && !seenItemsRef.current.has(args.taskId)) {
                    seenItemsRef.current.add(args.taskId);
                    toolResponse = {
                      status: "EXISTING_DATA_RETURNED",
                      currentData: current,
                    };
                  } else {
                    toolResponse = null;
                    functionCallPart = {
                      functionCall: {
                        name: "update_task",
                        args: { ...current, ...args.data, id: args.taskId },
                      },
                    } as any;
                  }
                  break;
                }

                // --- CREATION TOOLS (with existence check) ---
                case "create_character": {
                  const { getCharacters } =
                    await import("../services/characters");
                  const all = await getCharacters(uid);
                  const existing = all.find(
                    (c) => c.name.toLowerCase() === args.name?.toLowerCase(),
                  );
                  if (existing) {
                    seenItemsRef.current.add(existing.id);
                    toolResponse = {
                      status: "DUPLICATE_FOUND",
                      message: "A character with this name already exists.",
                      existingData: existing,
                    };
                  } else {
                    // Fall back to UI command for fresh creation
                    break;
                  }
                  break;
                }
                case "create_chapter": {
                  const { getChapters } = await import("../services/chapters");
                  const all = await getChapters(uid);
                  const existing = all.find(
                    (c) => c.title.toLowerCase() === args.title?.toLowerCase(),
                  );
                  if (existing) {
                    seenItemsRef.current.add(existing.id);
                    toolResponse = {
                      status: "DUPLICATE_FOUND",
                      message: "A chapter with this title already exists.",
                      existingData: existing,
                    };
                  } else {
                    break;
                  }
                  break;
                }
                case "create_task": {
                  const { getTasks } = await import("../services/tasks");
                  const all = await getTasks(uid);
                  const existing = all.find(
                    (t) =>
                      t.title.toLowerCase() === args.title?.toLowerCase() &&
                      t.status !== "completed",
                  );
                  if (existing) {
                    seenItemsRef.current.add(existing.id);
                    toolResponse = {
                      status: "DUPLICATE_FOUND",
                      message: "A similar active task already exists.",
                      existingData: existing,
                    };
                  } else {
                    break;
                  }
                  break;
                }
                case "create_goal": {
                  const { getGoals } = await import("../services/goals");
                  const all = await getGoals(uid);
                  const existing = all.find(
                    (g) => g.title.toLowerCase() === args.title?.toLowerCase(),
                  );
                  if (existing) {
                    seenItemsRef.current.add(existing.id);
                    toolResponse = {
                      status: "DUPLICATE_FOUND",
                      message: "A goal with this title already exists.",
                      existingData: existing,
                    };
                  } else {
                    break;
                  }
                  break;
                }
                case "create_event": {
                  const { getEvents } = await import("../services/events");
                  const all = await getEvents(uid);
                  const existing = all.find(
                    (e) => e.title.toLowerCase() === args.title?.toLowerCase(),
                  );
                  if (existing) {
                    seenItemsRef.current.add(existing.id);
                    toolResponse = {
                      status: "DUPLICATE_FOUND",
                      message: "An event with this title already exists.",
                      existingData: existing,
                    };
                  } else {
                    break;
                  }
                  break;
                }
                case "create_itinerary": {
                  const { getItineraries } =
                    await import("../services/itineraries");
                  const all = await getItineraries(uid);
                  const existing = all.find(
                    (i) => i.title.toLowerCase() === args.title?.toLowerCase(),
                  );
                  if (existing) {
                    seenItemsRef.current.add(existing.id);
                    toolResponse = {
                      status: "DUPLICATE_FOUND",
                      message: "An itinerary with this title already exists.",
                      existingData: existing,
                    };
                  } else {
                    break;
                  }
                  break;
                }
                case "create_journal": {
                  const { getJournals } = await import("../services/journals");
                  const chapterId = args.chapterId || "others";
                  const all = await getJournals(uid, chapterId);
                  const existing = all.find(
                    (j) => j.title.toLowerCase() === args.title?.toLowerCase(),
                  );
                  if (existing) {
                    seenItemsRef.current.add(existing.id);
                    toolResponse = {
                      status: "DUPLICATE_FOUND",
                      message:
                        "A journal entry with this title already exists in this chapter.",
                      existingData: existing,
                    };
                  } else {
                    break;
                  }
                  break;
                }

                default:
                  break;
              }

              // After each tool, go back to thinking while processing result
              setAiStatus("Thinking");

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

            setAiStatus("Preparing");
            return JSON.stringify(command);
          }

          const finalResponse = result.response.text();
          console.log("Final AI Response:", finalResponse);
          console.groupEnd();

          setAiStatus("Done! Please wait for the response to load.");
          return finalResponse;
        } catch (error: any) {
          setAiStatus(null);
          const errorMessage = error.message || "";
          const errorStatus = error.status || 0;
          
          const isRateLimit = errorMessage.includes("429") || errorStatus === 429;
          const isHighDemand = errorMessage.includes("high demand") || errorStatus === 500 || errorStatus === 503;

          if (isRateLimit || isHighDemand) {
            console.warn(`${isRateLimit ? "Rate limit" : "High demand"} hit on model: ${modelName}`);

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
    aiStatus,
    currentModel: AVAILABLE_MODELS[currentModelIndex],
  };
}

function getStatusFromTool(toolName: string, args: any): string {
  const parts = toolName.split("_");
  const action = parts[0]; // get, search, create, update, brain
  const type = parts.slice(1).join(" "); // character, characters, task, etc

  if (toolName === "brain_dump") return "Analyzing brain dump";
  if (toolName === "get_current_time") return "Checking time";
  if (toolName === "get_user_info") return "Fetching user profile";

  const friendlyType = type || "data";

  switch (action) {
    case "get":
    case "search":
      return `Searching for ${friendlyType}...`;
    case "create":
      return `Preparing to create ${friendlyType}...`;
    case "update":
      return `Preparing to update ${friendlyType}...`;
    default:
      return "Processing";
  }
}
