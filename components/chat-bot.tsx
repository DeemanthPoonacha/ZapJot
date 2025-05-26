"use client";

import { useState } from "react";
import { MessageCircle, Plus, X, RotateCcw } from "lucide-react";
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

export default function ChatBotUI() {
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

  return (
    <>
      {/* Floating Toggle Button */}
      <Button
        onClick={() => setOpen(!open)}
        className="pointer-events-auto absolute bottom-22 lg:bottom-12 right-8 lg:right-12 xl:right-20 2xl:right-8 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-lg transition-all hover:bg-primary/90"
        variant="default"
      >
        <MessageCircle size={24} />
        {/* Session indicator */}
        {isSessionActive && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
        )}
      </Button>

      {/* Animated Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute bottom-32 lg:bottom-22 right-8 lg:right-12 xl:right-20 2xl:right-8 z-50 w-[90vw] max-w-sm bg-background rounded-2xl shadow-xl border p-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold">ZapJot Assistant</div>
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

            <div className="max-h-60 overflow-y-auto space-y-2 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-md ${
                    msg.role === ChatRole.USER
                      ? "bg-primary self-end"
                      : "bg-secondary"
                  }`}
                >
                  <span
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: msg.text as string }}
                  />
                </div>
              ))}
              {askAI.isPending && (
                <div className="text-gray-400 italic">Thinking...</div>
              )}
            </div>

            {!askAI.isPending && actionModal}

            {
              <>
                <textarea
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something..."
                  className="w-full border rounded-md p-2 text-sm resize-none"
                />
                <Button
                  onClick={sendMessage}
                  disabled={askAI.isPending || !input.trim()}
                  className="w-full"
                >
                  Send
                </Button>
              </>
            }
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
