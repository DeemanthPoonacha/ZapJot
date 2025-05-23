import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ChatBotUI from "../chat-bot";

export interface FloatingButtonProps {
  label?: string;
  onClick?: () => void;
  showChatBot?: boolean;
}

export default function FloatingButton({
  label,
  onClick,
  showChatBot,
}: FloatingButtonProps) {
  return (
    <div className="fixed h-dvh w-screen sm:max-w-2xl md:max-w-3xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl pointer-events-none">
      {showChatBot ? (
        <ChatBotUI />
      ) : (
        <Button
          onClick={onClick}
          className="pointer-events-auto absolute bottom-22 lg:bottom-12 right-8 lg:right-12 xl:right-20 2xl:right-8 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-lg transition-all hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          {label}
        </Button>
      )}
    </div>
  );
}
