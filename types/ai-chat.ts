export enum ChatRole {
  USER = "user",
  AI = "ai",
}

export type ChatMessage = {
  role: ChatRole;
  text: string;
};
