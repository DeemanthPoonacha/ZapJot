"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Mail, Copy, Check, UserPlus, Share2, Send } from "lucide-react";
import { Character } from "@/types/characters";
import emailjs from "@emailjs/browser";

interface InviteDialogProps {
  character: Character | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteDialog({ character, open, onOpenChange }: InviteDialogProps) {
  const [email, setEmail] = useState(character?.email || "");
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteLink = typeof window !== "undefined"
    ? `${window.location.origin}/auth?ref=${encodeURIComponent(character?.name || "invite")}`
    : "https://zapjot.app";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Invite link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  const handleSendEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSending(true);
    try {
      // Try sending via Web Share API first if available on mobile
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({
          title: "Join me on ZapJot!",
          text: `Hey ${character?.name || "there"}! Join me on ZapJot to stay connected, organize events, and manage tasks together!`,
          url: inviteLink,
        });
        toast.success("Shared invite successfully!");
        onOpenChange(false);
        setIsSending(false);
        return;
      }

      // Fallback mailto link opening for direct native mail client
      const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Join me on ZapJot!")}&body=${encodeURIComponent(
        `Hi ${character?.name || ""},\n\nI'm using ZapJot to organize tasks, events, and personal goals. Join me on ZapJot here:\n${inviteLink}\n\nBest,`
      )}`;

      window.open(mailtoUrl, "_blank");
      toast.success("Opened email client with invite!");
      onOpenChange(false);
    } catch (err: any) {
      console.error("Invite error:", err);
      toast.error(err?.message || "Could not send invite.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" /> Invite to ZapJot
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Invite <strong className="text-foreground">{character?.name}</strong> to create an account and collaborate on ZapJot.
          </DialogDescription>
        </DialogHeader>

        {/* Email Invite Option */}
        <form onSubmit={handleSendEmailInvite} className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-primary" /> Email Address
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-xs flex-1"
            />
            <Button type="submit" size="sm" disabled={isSending} className="gap-1.5 shrink-0">
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </Button>
          </div>
        </form>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-background px-2 text-muted-foreground font-semibold">Or share link</span>
          </div>
        </div>

        {/* Copy Link Option */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-primary" /> Invite Link
          </label>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={inviteLink}
              className="text-xs bg-muted font-mono flex-1 text-muted-foreground truncate"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleCopyLink} className="gap-1.5 shrink-0">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </Button>
          </div>
        </div>

        <DialogFooter className="pt-2 border-t">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
