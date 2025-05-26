"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAiResponse } from "@/lib/hooks/useAiResponse";
import EventForm from "./planner/events/EventForm";
import TaskForm from "./planner/tasks/TaskForm";
import CharacterForm from "./characters/CharacterForm";
import { useNProgressRouter } from "./layout/link/CustomLink";
import GoalForm from "./planner/goals/GoalForm";
import ChapterForm from "./chapters/ChapterForm";
import JournalForm from "./journals/JournalForm";
import { DEFAULT_CHAPTER_ID } from "@/lib/constants";
import ItineraryForm from "./planner/itineraries/ItineraryForm";

export default function ChatBotUI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  enum ChatRole {
    USER = "user",
    AI = "ai",
  }

  const [messages, setMessages] = useState<{ role: ChatRole; text: string }[]>(
    []
  );

  const [actionModal, setActionModal] = useState<React.ReactElement | null>(
    null
  );
  const { mutate: askAI, isPending } = useAiResponse();
  const { routerPush } = useNProgressRouter();

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
            onAdd={(id: string) => {
              routerPush(`/chapters/${id}`);
              setActionModal(null);
            }}
            onUpdate={() => setActionModal(null)}
            onCancel={() => setActionModal(null)}
          />
        );
        break;

      case "create_journal":
        console.log("Creating journal:", command);
        setActionModal(
          <JournalForm
            journal={command}
            chapterId={DEFAULT_CHAPTER_ID}
            onFinish={(id: string, chapterId?: string) => {
              routerPush(
                `/chapters/${chapterId || DEFAULT_CHAPTER_ID}/journals/${id}`
              );
              setActionModal(null);
            }}
            onCancel={() => setActionModal(null)}
          />
        );
        break;

      case "create_event":
        console.log("Creating event:", command);
        setActionModal(
          <EventForm eventData={command} onClose={() => setActionModal(null)} />
        );
        break;

      case "create_task":
        console.log("Creating task:", command);
        setActionModal(
          <TaskForm taskData={command} onClose={() => setActionModal(null)} />
        );
        break;

      case "create_goal":
        console.log("Creating goal:", command);
        setActionModal(
          <GoalForm goalData={command} onClose={() => setActionModal(null)} />
        );
        break;

      case "create_itinerary":
        console.log("Creating itinerary:", command);
        setActionModal(
          <ItineraryForm
            itineraryData={command}
            onClose={() => setActionModal(null)}
          />
        );
        break;

      case "create_character":
        console.log("Creating character:", command);
        setActionModal(
          <CharacterForm
            character={command}
            onAdd={(id: string) => routerPush(`/characters/${id}`)}
            onUpdate={() => setActionModal(null)}
            onCancel={() => setActionModal(null)}
          />
        );
        break;

      default:
        console.warn("Unknown action:", command.action);
    }
  }

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = { role: ChatRole.USER, text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    askAI(input, {
      onSuccess: (responseText) => {
        const command = tryParseCommand(responseText);
        if (command.action) {
          executeAICommand(command);
        }
        setMessages((prev) => [
          ...prev,
          { role: ChatRole.AI, text: command.message },
        ]);
      },
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <Button
        onClick={() => setOpen(!open)}
        className="pointer-events-auto absolute bottom-22 lg:bottom-12 right-8 lg:right-12 xl:right-20 2xl:right-8 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-lg transition-all hover:bg-primary/90"
        variant="default"
      >
        <MessageCircle size={24} />
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
              <div className="text-sm font-semibold">ZapJot Assistant</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </Button>
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
                  <span className="whitespace-pre-wrap">{msg.text}</span>
                </div>
              ))}
              {isPending && (
                <div className="text-gray-400 italic">Thinking...</div>
              )}
            </div>

            {actionModal || (
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
                  disabled={isPending || !input.trim()}
                  className="w-full"
                >
                  Send
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
