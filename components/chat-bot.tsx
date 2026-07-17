"use client";
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  X,
  RotateCcw,
  ArrowDown,
  SendHorizonal,
  Maximize2,
  Minimize2,
  History,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAiChat } from "@/lib/hooks/useAiChat";
import { useAuth } from "@/lib/context/AuthProvider";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import EventForm from "./planner/events/EventForm";
import TaskForm from "./planner/tasks/TaskForm";
import CharacterForm from "./characters/CharacterForm";
import GoalForm from "./planner/goals/GoalForm";
import ChapterForm from "./chapters/ChapterForm";
import JournalForm from "./journals/JournalForm";
import { DEFAULT_CHAPTER_ID } from "@/lib/constants";
import ItineraryForm from "./planner/itineraries/ItineraryForm";
import { ChatRole } from "@/types/ai-chat";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "react-responsive";
import ThemedCanvasImage from "./layout/themed-image";
import BrainDumpConfirmation from "./ai/BrainDumpConfirmation";
import { BrainDump } from "@/types/brain-dump";

export default function ChatBotUI() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { user } = useAuth();

  const [isMaximized, setIsMaximized] = useState(isMobile);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [brainDumpData, setBrainDumpData] = useState<BrainDump | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const {
    sendMessage: askAI,
    resetSession,
    isSessionActive,
    messages,
    addMessage,
    clearMessages,
    aiStatus,
    sessions,
    currentSessionId,
    switchSession,
    startNewSession,
    deleteSession,
  } = useAiChat();

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = { role: ChatRole.USER, text: input.trim() };
    addMessage(userMessage);
    setInput("");

    askAI.mutate(userMessage.text, {
      onSuccess: (responseText) => {
        if (!responseText) {
          addMessage({
            role: ChatRole.AI,
            text: "Sorry, I encountered an error. Please try again.",
          });
          return;
        }
        const command = tryParseCommand(responseText);
        if (command?.action) {
          executeAICommand(command);
        }
      },
      onError: (error) => {
        console.error("AI Error:", error);
        addMessage({
          role: ChatRole.AI,
          text: "Sorry, I encountered an error. Please try again.",
        });
      },
    });
  };

  const getSuggestedPrompts = () => {
    const hour = new Date().getHours();
    const prompts = [];

    if (hour >= 5 && hour < 12) {
      prompts.push(
        {
          text: "☀️ Morning briefing?",
          query: "How is my morning looking? Give me a daily briefing.",
        },
        { text: "🎯 Today's focus?", query: "What should I focus on today?" },
      );
    } else if (hour >= 12 && hour < 17) {
      prompts.push(
        {
          text: "🌤️ What's next?",
          query: "What events and tasks do I have left for today?",
        },
        {
          text: "📊 Check goals",
          query: "Show me my active goals and how I'm progressing.",
        },
      );
    } else {
      prompts.push(
        {
          text: "🌙 Summarize my day",
          query:
            "Help me summarize what I did today and write a journal entry.",
        },
        { text: "📝 Done today?", query: "What did I get done today?" },
      );
    }

    prompts.push(
      {
        text: "💭 Quick Brain Dump",
        query: "I want to do a brain dump of some thoughts.",
      },
      {
        text: "🛫 Travel itineraries?",
        query: "Show me my upcoming travel itineraries.",
      },
    );

    return prompts;
  };

  const renderSuggestions = () => (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-xs text-muted-foreground font-semibold px-1">
        Suggested prompts:
      </p>
      <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto pr-1">
        {getSuggestedPrompts().map((p, index) => (
          <Button
            size="sm"
            variant="outline"
            key={index}
            className="rounded-full text-xs py-1 px-3 border border-primary/20 hover:border-primary/50 transition-colors"
            onClick={() => {
              setInput(p.query);
            }}
          >
            {p.text}
          </Button>
        ))}
      </div>
    </div>
  );

  const [actionModal, setActionModal] = useState<React.ReactElement | null>(null);

  const resetModal = () => {
    setActionModal(renderSuggestions());
  };

  useEffect(() => {
    setActionModal(renderSuggestions());
  }, [input]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [showBottomButton, setShowBottomButton] = useState(false);

  const checkIfAtBottom = () => {
    const el = containerRef.current;
    if (!el) return;

    const isAtBottom = el.scrollHeight - el.scrollTop - 50 <= el.clientHeight;
    setShowBottomButton(!isAtBottom);
  };

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkIfAtBottom();
    el.addEventListener("scroll", checkIfAtBottom);
    return () => el.removeEventListener("scroll", checkIfAtBottom);
  }, [open, isMaximized]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Only scroll if the user is already near the bottom, or if this is the user's own message,
    // or if it's the start of an AI stream response
    const isNearBottom = el.scrollHeight - el.scrollTop - 150 <= el.clientHeight;
    const lastMsg = messages[messages.length - 1];
    const isUserLast = lastMsg?.role === ChatRole.USER;

    if (isNearBottom || isUserLast) {
      const isStreaming = lastMsg?.isStreaming;
      el.scrollTo({
        top: el.scrollHeight,
        behavior: isStreaming ? "auto" : "smooth",
      });
    }
  }, [open, messages]);

  const handleResetSession = () => {
    resetSession();
    clearMessages();
    resetModal();
  };

  function tryParseCommand(rawText: string) {
    if (!rawText) return null;

    const startIdx = rawText.indexOf("{");
    const endIdx = rawText.lastIndexOf("}");

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const jsonCandidate = rawText.substring(startIdx, endIdx + 1);
      try {
        const result = JSON.parse(jsonCandidate);
        if (result && result.action) return result;
      } catch {}
    }

    const fallbackCleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    if (fallbackCleaned.startsWith("{") && fallbackCleaned.endsWith("}")) {
      try {
        return JSON.parse(fallbackCleaned);
      } catch {
        return null;
      }
    }

    return null;
  }

  function executeAICommand(command: any) {
    switch (command.action) {
      case "create_chapter":
        setActionModal(
          <ChapterForm
            chapter={command}
            onAdd={(id: string, name?: string) => {
              addMessage({
                role: ChatRole.AI,
                text: `Chapter created: [${name || command.title || "New Chapter"}](/chapters/${id})`,
              });
              resetModal();
            }}
            onUpdate={() => resetModal()}
            onCancel={() => resetModal()}
          />,
        );
        break;

      case "update_chapter":
        setActionModal(
          <ChapterForm
            chapter={command}
            onUpdate={() => {
              addMessage({
                role: ChatRole.AI,
                text: `Chapter updated: [${command.title}](/chapters/${command.id})`,
              });
              resetModal();
            }}
            onCancel={() => resetModal()}
          />,
        );
        break;

      case "create_journal":
        setActionModal(
          <JournalForm
            journal={command}
            chapterId={DEFAULT_CHAPTER_ID}
            onFinish={(id: string, chapterId?: string, name?: string) => {
              addMessage({
                role: ChatRole.AI,
                text: `Journal created: [${name || command.title || "New Journal"}](/chapters/${
                  chapterId || DEFAULT_CHAPTER_ID
                }/journals/${id})`,
              });
              resetModal();
            }}
            onCancel={() => resetModal()}
          />,
        );
        break;

      case "update_journal":
        setActionModal(
          <JournalForm
            journal={command}
            chapterId={command.chapterId || DEFAULT_CHAPTER_ID}
            onFinish={(id, chId, name) => {
              addMessage({
                role: ChatRole.AI,
                text: `Journal updated: [${name || command.title}](/chapters/${
                  chId || DEFAULT_CHAPTER_ID
                }/journals/${id})`,
              });
              resetModal();
            }}
            onCancel={() => resetModal()}
          />,
        );
        break;

      case "create_event":
        setActionModal(
          <EventForm
            eventData={command}
            onClose={() => resetModal()}
            onSave={() => {
              addMessage({
                role: ChatRole.AI,
                text: `Event created: [${command.title}](/planner)`,
              });
              resetModal();
            }}
          />,
        );
        break;

      case "update_event":
        setActionModal(
          <EventForm
            eventData={command}
            onClose={() => resetModal()}
            onSave={() => {
              addMessage({
                role: ChatRole.AI,
                text: `Event updated: [${command.title}](/planner)`,
              });
              resetModal();
            }}
          />,
        );
        break;

      case "create_task":
        setActionModal(
          <TaskForm
            taskData={command}
            onClose={() => resetModal()}
            onSave={() => {
              addMessage({
                role: ChatRole.AI,
                text: `Task created: [${command.title}](/planner)`,
              });
              resetModal();
            }}
          />,
        );
        break;

      case "update_task":
        setActionModal(
          <TaskForm
            taskData={command}
            onClose={() => resetModal()}
            onSave={() => {
              addMessage({
                role: ChatRole.AI,
                text: `Task updated: [${command.title}](/planner)`,
              });
              resetModal();
            }}
          />,
        );
        break;

      case "create_goal":
        setActionModal(
          <GoalForm
            goalData={command}
            onClose={() => resetModal()}
            onSave={() => {
              addMessage({
                role: ChatRole.AI,
                text: `Goal created: [${command.title}](/planner)`,
              });
              resetModal();
            }}
          />,
        );
        break;

      case "update_goal":
        setActionModal(
          <GoalForm
            goalData={command}
            onClose={() => resetModal()}
            onSave={() => {
              addMessage({
                role: ChatRole.AI,
                text: `Goal updated: [${command.title}](/planner)`,
              });
              resetModal();
            }}
          />,
        );
        break;

      case "create_itinerary":
        setActionModal(
          <ItineraryForm
            itineraryData={command}
            onClose={() => resetModal()}
            onSave={() => {
              addMessage({
                role: ChatRole.AI,
                text: `Itinerary created: [${command.title}](/planner)`,
              });
              resetModal();
            }}
          />,
        );
        break;

      case "update_itinerary":
        setActionModal(
          <ItineraryForm
            itineraryData={command}
            onClose={() => resetModal()}
            onSave={() => {
              addMessage({
                role: ChatRole.AI,
                text: `Itinerary updated: [${command.title}](/planner)`,
              });
              resetModal();
            }}
          />,
        );
        break;

      case "create_character":
        setActionModal(
          <CharacterForm
            character={command}
            onAdd={(id: string, name?: string) => {
              addMessage({
                role: ChatRole.AI,
                text: `Character created: [${name || command.name || "New Character"}](/characters/${id})`,
              });
              resetModal();
            }}
            onUpdate={() => resetModal()}
            onCancel={() => resetModal()}
          />,
        );
        break;

      case "update_character":
        setActionModal(
          <CharacterForm
            character={{ id: command.characterId, ...command.data }}
            onUpdate={() => {
              addMessage({
                role: ChatRole.AI,
                text: `Character updated: [${command.data.name}](/characters/${command.characterId})`,
              });
              resetModal();
            }}
            onCancel={() => resetModal()}
          />,
        );
        break;

      case "confirm_delete":
        setActionModal(
          <div className="p-4 border rounded-xl bg-secondary/30 text-card-foreground flex flex-col gap-3">
            <p className="text-sm font-medium">{command.message}</p>
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={resetModal}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="rounded-full"
                onClick={async () => {
                  try {
                    const uid = user?.uid;
                    if (!uid) return;

                    if (command.itemType === "task") {
                      const { deleteTask } = await import("@/lib/services/tasks");
                      await deleteTask(uid, command.itemId);
                    } else if (command.itemType === "event") {
                      const { deleteEvent } = await import("@/lib/services/events");
                      await deleteEvent(uid, command.itemId, command.participantIds);
                    } else if (command.itemType === "goal") {
                      const { deleteGoal } = await import("@/lib/services/goals");
                      await deleteGoal(uid, command.itemId);
                    } else if (command.itemType === "chapter") {
                      const { deleteChapter } = await import("@/lib/services/chapters");
                      await deleteChapter(uid, command.itemId);
                    } else if (command.itemType === "journal") {
                      const { deleteJournal } = await import("@/lib/services/journals");
                      await deleteJournal(uid, command.chapterId, command.itemId);
                    } else if (command.itemType === "character") {
                      const { deleteCharacter } = await import("@/lib/services/characters");
                      await deleteCharacter(uid, command.itemId);
                    } else if (command.itemType === "itinerary") {
                      const { deleteItinerary } = await import("@/lib/services/itineraries");
                      await deleteItinerary(uid, command.itemId);
                    }

                    addMessage({
                      role: ChatRole.AI,
                      text: `Successfully deleted the ${command.itemType}.`,
                    });
                  } catch (e) {
                    console.error("Delete failed", e);
                    addMessage({
                      role: ChatRole.AI,
                      text: `Failed to delete the ${command.itemType}.`,
                    });
                  }
                  resetModal();
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        );
        break;

      case "brain_dump":
        setBrainDumpData(command);
        setIsMaximized(true);
        setActionModal(
          <BrainDumpConfirmation
            data={command}
            onConfirm={(results) => {
              addMessage({
                role: ChatRole.AI,
                text: `Successfully processed brain dump! Added ${results.success} items.`,
              });
              const systemMsg = `[System: The user has successfully saved the items from the brain dump. Results: ${results.success} items added.]`;
              addMessage({
                role: ChatRole.SYSTEM,
                text: systemMsg,
              });
              setBrainDumpData(null);
              resetModal();
              askAI.mutate(systemMsg);
            }}
            onCancel={() => {
              const systemMsg = `[System: The user has discarded the brain dump items.]`;
              addMessage({
                role: ChatRole.SYSTEM,
                text: systemMsg,
              });
              setBrainDumpData(null);
              resetModal();
              askAI.mutate(systemMsg);
            }}
            onEditItem={(type, index, item) => {
              handleEditBrainDumpItem(type, index, item, command);
            }}
          />,
        );
        break;

      default:
        console.warn("Unknown action:", command.action);
        resetModal();
        break;
    }
  }

  function handleEditBrainDumpItem(
    type: keyof BrainDump,
    index: number,
    item: any,
    currentData: BrainDump,
  ) {
    const onSaveOrCancel = (updatedItem?: any) => {
      let newData = { ...currentData };
      if (updatedItem) {
        // @ts-ignore
        newData[type][index] = updatedItem;
      }
      setBrainDumpData(newData);
      setActionModal(
        <BrainDumpConfirmation
          data={newData}
          onConfirm={(results) => {
            addMessage({
              role: ChatRole.AI,
              text: `Successfully processed brain dump! Added ${results.success} items.`,
            });
            setBrainDumpData(null);
            resetModal();
          }}
          onCancel={() => {
            setBrainDumpData(null);
            resetModal();
          }}
          onEditItem={(t, i, it) => {
            handleEditBrainDumpItem(t, i, it, newData);
          }}
        />,
      );
    };

    switch (type) {
      case "tasks":
        setActionModal(
          <TaskForm
            taskData={item}
            onClose={() => onSaveOrCancel()}
            onSave={() => onSaveOrCancel(item)}
          />,
        );
        break;
      case "goals":
        setActionModal(
          <GoalForm
            goalData={item}
            onClose={() => onSaveOrCancel()}
            onSave={() => onSaveOrCancel(item)}
          />,
        );
        break;
      case "itineraries":
        setActionModal(
          <ItineraryForm
            itineraryData={item}
            onClose={() => onSaveOrCancel()}
            onSave={() => onSaveOrCancel(item)}
          />,
        );
        break;
      case "characters":
        setActionModal(
          <CharacterForm
            character={item}
            onAdd={() => onSaveOrCancel(item)}
            onUpdate={() => onSaveOrCancel(item)}
            onCancel={() => onSaveOrCancel()}
          />,
        );
        break;
      case "journals":
        setActionModal(
          <JournalForm
            journal={item}
            chapterId={DEFAULT_CHAPTER_ID}
            onFinish={() => onSaveOrCancel(item)}
            onCancel={() => onSaveOrCancel()}
          />,
        );
        break;
      case "events":
        setActionModal(
          <EventForm
            eventData={item}
            onClose={() => onSaveOrCancel()}
            onSave={() => onSaveOrCancel(item)}
          />,
        );
        break;
      case "chapters":
        setActionModal(
          <ChapterForm
            chapter={item}
            onAdd={() => onSaveOrCancel(item)}
            onUpdate={() => onSaveOrCancel(item)}
            onCancel={() => onSaveOrCancel()}
          />,
        );
        break;
    }
  }

  const icon = (size = 32) => (
    <ThemedCanvasImage
      src="/z_icon.webp"
      alt="Zappy Logo"
      width={size}
      height={size}
    />
  );

  return (
    <>
      <Button
        onClick={() => {
          if (isMobile) setIsMaximized(true);
          setOpen(!open);
        }}
        size={"icon"}
        className="border border-primary pointer-events-auto absolute bottom-22 lg:bottom-12 right-8 lg:right-12 xl:right-20 2xl:right-8 z-60 flex items-center gap-2 rounded-full px-4 py-3 shadow-2xl transition-all hover:bg-primary/90 h-14 w-14"
        title="Open Zappy Chat"
        variant="secondary"
      >
        {icon(40)}
        {isSessionActive && (
          <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white" />
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              x: isMaximized ? 420 : 180,
              y: isMaximized ? 500 : 300,
              scale: 0.05,
            }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              x: isMaximized ? 420 : 180,
              y: isMaximized ? 500 : 300,
              scale: 0.05,
            }}
            transition={{ duration: 0.5 }}
            className={cn(
              "pointer-events-auto bg-background flex flex-col z-50 p-4 space-y-4 w-full min-h-[500px]",
              isMaximized
                ? "max-w-[98vw] fixed md:absolute top-0 left-0 h-full pb-24 z-60"
                : "absolute max-h-[80vh] bottom-38 lg:bottom-28 right-8 lg:right-12 xl:right-20 2xl:right-8 max-w-sm bg-background rounded-xl shadow-xl border",
            )}
          >
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2">
                {icon()}
                <div className="text-sm font-semibold">Zappy</div>
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    isSessionActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isSessionActive ? "Active" : "New"}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMaximized(!isMaximized)}
                    title={isMaximized ? "Minimize" : "Maximize"}
                  >
                    {isMaximized ? <Minimize2 /> : <Maximize2 />}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHistory(!showHistory)}
                  title={showHistory ? "Back to Chat" : "Chat History"}
                  className={showHistory ? "text-primary hover:text-primary/80" : ""}
                >
                  <History size={16} />
                </Button>
                {isSessionActive && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleResetSession}
                    title="Reset conversation"
                  >
                    <RotateCcw size={16} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X size={18} />
                </Button>
              </div>
            </div>
            {showHistory ? (
              <div className="flex flex-col flex-1 overflow-y-auto space-y-3 p-1">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h3 className="font-semibold text-sm">Previous Chats</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                    onClick={() => {
                      startNewSession();
                      setShowHistory(false);
                    }}
                  >
                    <Plus size={14} /> New Chat
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 max-h-[350px] md:max-h-[500px]">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={cn(
                        "group flex items-center justify-between p-2.5 rounded-lg border transition-colors hover:bg-accent/40 cursor-pointer",
                        session.id === currentSessionId
                          ? "bg-accent/50 border-primary/30"
                          : "bg-card border-border"
                      )}
                      onClick={() => {
                        switchSession(session.id);
                        setShowHistory(false);
                      }}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-medium text-xs truncate">
                          {session.title || "New Chat"}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(session.updatedAt || session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        title="Delete chat history"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div
                  className="mt-auto overflow-y-auto space-y-2 text-sm"
                  ref={containerRef}
                >
                  <div className="flex flex-col gap-2">
                    {messages
                      .filter((msg) => msg.role !== ChatRole.SYSTEM)
                      .map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={`flex ${
                            msg.role === ChatRole.USER ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                              msg.role === ChatRole.USER
                                ? "bg-primary text-primary-foreground self-end ms-4 rounded-br-md"
                                : "bg-secondary text-secondary-foreground self-start me-4 rounded-bl-md"
                            }`}
                          >
                            {msg.role === ChatRole.USER ? (
                              <span className="whitespace-pre-wrap">{msg.text}</span>
                            ) : (
                              <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 p-0">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    a: ({ href, children }) => (
                                      <a
                                        href={href}
                                        className="underline text-primary font-medium hover:text-primary/80 transition-colors"
                                      >
                                        {children}
                                      </a>
                                    ),
                                  }}
                                >
                                  {msg.text}
                                </ReactMarkdown>
                                {msg.isStreaming && (
                                  <span className="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse align-middle" />
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </div>

                  <div className="border-t py-4 @container">
                    {askAI.isPending &&
                    !messages[messages.length - 1]?.isStreaming ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[80%] p-3 px-4 rounded-2xl rounded-bl-md bg-secondary text-gray-400 border text-sm shadow-sm">
                          <div className="flex items-center gap-3">
                            <motion.span
                              key={aiStatus || "thinking"}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="font-medium animate-pulse"
                            >
                              {aiStatus || "Thinking..."}
                            </motion.span>
                            <div className="flex items-center gap-1">
                              {[0, 0.2, 0.4].map((delay, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 1.5,
                                    delay,
                                  }}
                                  className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      actionModal
                    )}
                  </div>

                  {showBottomButton && (
                    <Button
                      onClick={scrollToBottom}
                      className={cn(
                        "absolute right-6 z-50 rounded-full p-2 shadow-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground",
                        isMaximized ? "bottom-48" : "bottom-28",
                      )}
                    >
                      <ArrowDown size={20} />
                    </Button>
                  )}
                </div>

                <div className="border-t pt-2">
                  <div className="border rounded-4xl p-1 flex items-end gap-2 focus-within:ring-2 focus-within:ring-ring focus-within:border-border transition-all">
                    <Textarea
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      rows={1}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask something..."
                      className="w-full rounded-l-4xl p-2 text-sm min-h-9 max-h-64 border-0 ring-0 focus:ring-0 focus:border-0 focus:outline-none shadow-none focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-none "
                    />
                    <Button
                      className="rounded-full"
                      onClick={sendMessage}
                      disabled={askAI.isPending || !input.trim()}
                    >
                      <span className="hidden sm:inline">Send</span>
                      <SendHorizonal />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
