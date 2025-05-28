"use client";
import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  Plus,
  X,
  RotateCcw,
  ArrowDown,
  SendHorizonal,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAiChat } from "@/lib/hooks/useAiChat";
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

export default function ChatBotUI() {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Adjust breakpoint as needed

  const [isMaximized, setIsMaximized] = useState(isMobile);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  // Updated to use the new chat hook
  const {
    sendMessage: askAI,
    resetSession,
    isSessionActive,
    messages,
    addMessage,
    clearMessages,
  } = useAiChat();

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = { role: ChatRole.USER, text: input.trim() };
    addMessage(userMessage);
    setInput("");

    askAI.mutate(input, {
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

        addMessage({
          role: ChatRole.AI,
          text: command?.message || responseText,
        });
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

  const defaultActions = [
    {
      action: "create_journal",
      item: "Journal",
      message: "Create a new journal entry",
    },
    {
      action: "create_chapter",
      item: "Chapter",
      message: "Create a new chapter",
    },
    {
      action: "create_character",
      item: "Character",
      message: "Create a new character",
    },
    {
      action: "create_task",
      item: "Task",
      message: "Create a new task",
    },
    {
      action: "create_event",
      item: "Event",
      message: "Create a new event",
    },
    {
      action: "create_goal",
      item: "Goal",
      message: "Create a new goal",
    },
    {
      action: "create_itinerary",
      item: "Itinerary",
      message: "Create a new itinerary",
    },
  ];

  const defaultCreate = (
    <>
      <div className="flex gap-2 flex-wrap">
        {defaultActions.map((action, index) => (
          <Button
            size={"sm"}
            key={index}
            className="rounded-full"
            onClick={() => {
              executeAICommand(action);
              addMessage({
                role: ChatRole.USER,
                text: action.message,
              });
            }}
          >
            <Plus />
            {action.item}
          </Button>
        ))}
      </div>
    </>
  );

  const [actionModal, setActionModal] = useState<React.ReactElement | null>(
    defaultCreate
  );

  const resetModal = () => {
    setActionModal(defaultCreate);
  };
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

    // Run initially
    checkIfAtBottom();

    // Add scroll listener
    el.addEventListener("scroll", checkIfAtBottom);
    return () => el.removeEventListener("scroll", checkIfAtBottom);
  }, [open, isMaximized]);

  useEffect(() => {
    scrollToBottom();
  }, [open, messages]);

  // Added session reset handler
  const handleResetSession = () => {
    resetSession();
    clearMessages();
    resetModal();
  };

  function tryParseCommand(rawText: string) {
    const json = rawText
      .replace(/^```json/, "") // remove opening ```json
      .replace(/^```/, "") // in case it uses ``` instead
      .replace(/```$/, "") // remove closing ```
      .trim();
    try {
      const result = JSON.parse(json);
      return result;
    } catch {
      // not valid JSON
      console.error("Failed to parse JSON:", json);
    }
    return null;
  }

  function executeAICommand(command: any) {
    switch (command.action) {
      case "create_chapter":
        console.log("Creating chapter:", command);
        setActionModal(
          <ChapterForm
            chapter={command}
            onAdd={(id: string, name?: string) => {
              addMessage({
                role: ChatRole.AI,
                text: `Chapter created: <a class="underline text-primary" href="/chapters/${id}">${
                  name || command.title || "New Chapter"
                }</a>`,
              });
              // routerPush(`/chapters/${id}`);
              resetModal();
            }}
            onUpdate={() => resetModal()}
            onCancel={() => resetModal()}
          />
        );
        break;

      case "create_journal":
        console.log("Creating journal:", command);
        setActionModal(
          <JournalForm
            journal={command}
            chapterId={DEFAULT_CHAPTER_ID}
            onFinish={(id: string, chapterId?: string, name?: string) => {
              addMessage({
                role: ChatRole.AI,
                text: `Journal created: <a class="underline text-primary" href="/chapters/${
                  chapterId || DEFAULT_CHAPTER_ID
                }/journals/${id}">${
                  name || command.title || "New Journal"
                }</a>`,
              });
              resetModal();
            }}
            onCancel={() => resetModal()}
          />
        );
        break;

      case "create_event":
        console.log("Creating event:", command);
        setActionModal(
          <EventForm eventData={command} onClose={() => resetModal()} />
        );
        break;

      case "create_task":
        console.log("Creating task:", command);
        setActionModal(
          <TaskForm taskData={command} onClose={() => resetModal()} />
        );
        break;

      case "create_goal":
        console.log("Creating goal:", command);
        setActionModal(
          <GoalForm goalData={command} onClose={() => resetModal()} />
        );
        break;

      case "create_itinerary":
        console.log("Creating itinerary:", command);
        setActionModal(
          <ItineraryForm itineraryData={command} onClose={() => resetModal()} />
        );
        break;

      case "create_character":
        console.log("Creating character:", command);
        setActionModal(
          <CharacterForm
            character={command}
            onAdd={(id: string, name?: string) => {
              addMessage({
                role: ChatRole.AI,
                text: `Character created: <a class="underline text-primary" href="/characters/${id}">${
                  name || command.name || "New Character"
                }</a>`,
              });
              resetModal();
            }}
            onUpdate={() => resetModal()}
            onCancel={() => resetModal()}
          />
        );
        break;

      default:
        console.warn("Unknown action:", command.action);
        setActionModal(defaultCreate);
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
      {/* Floating Toggle Button */}
      <Button
        onClick={() => {
          if (isMobile) setIsMaximized(true);
          setOpen(!open);
        }}
        size={"icon"}
        className="pointer-events-auto absolute bottom-22 lg:bottom-12 right-8 lg:right-12 xl:right-20 2xl:right-8 z-60 flex items-center gap-2 rounded-full px-4 py-3 shadow-lg transition-all hover:bg-primary/90 h-14 w-14"
        title="Open Zappy Chat"
        variant="secondary"
      >
        {icon(40)}
        {/* Session indicator */}
        {isSessionActive && (
          <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white" />
        )}
      </Button>

      {/* Animated Chat Panel */}
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
            // className=
            className={cn(
              "pointer-events-auto bg-background flex flex-col z-50 p-4 space-y-4 w-full min-h-[500px]",
              isMaximized
                ? "max-w-screen fixed md:absolute top-0 left-0 h-full pb-24 z-60"
                : "absolute max-h-[80vh] bottom-38 lg:bottom-28 right-8 lg:right-12 xl:right-20 2xl:right-8 max-w-sm bg-background rounded-xl shadow-xl border"
            )}
          >
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-2">
                {icon()}
                <div className="text-sm font-semibold">Zappy</div>
                {/* Session status indicator */}
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
                {/* Maximize/Minimize button */}
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
                {/* Reset session button */}
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

            <div
              className="mt-auto overflow-y-auto space-y-2 text-sm"
              ref={containerRef}
            >
              <div className="flex flex-col gap-2">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${
                      msg.role === ChatRole.USER
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                        msg.role === ChatRole.USER
                          ? "bg-primary text-primary-foreground self-end ms-4 rounded-br-md"
                          : "bg-secondary text-secondary-foreground self-start me-4 rounded-bl-md"
                      }`}
                    >
                      <span
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: msg.text as string }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="border-t py-4 @container">
                {askAI.isPending ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] p-3 rounded-2xl rounded-bl-md bg-secondary text-gray-400 border text-sm shadow-sm">
                      <div className="flex items-center gap-2">
                        {[0, 0.2, 0.4].map((delay, i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              delay,
                            }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                        ))}
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
                    isMaximized ? "bottom-48" : "bottom-28"
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
