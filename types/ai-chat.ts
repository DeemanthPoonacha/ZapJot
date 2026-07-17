export enum ChatRole {
  USER = "user",
  AI = "ai",
  SYSTEM = "system",
}

export type ChatMessage = {
  role: ChatRole;
  text: string;
  isStreaming?: boolean;
  isDeleteConfirmation?: boolean;
  deletePayload?: {
    action: string;
    args: Record<string, any>;
  };
};
