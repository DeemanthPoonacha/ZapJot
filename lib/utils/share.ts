import { toast } from "@/components/ui/sonner";

export interface ShareOptions {
  title: string;
  text?: string;
  url?: string;
}

/**
 * Shares content using the Web Share API when available (mobile/modern browsers),
 * falling back to copying the URL or text to the clipboard.
 */
export async function shareContent(options: ShareOptions): Promise<boolean> {
  const shareData: ShareData = {
    title: options.title,
    text: options.text,
    url: options.url || (typeof window !== "undefined" ? window.location.href : undefined),
  };

  if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (err: any) {
      // User cancelled the share dialog or share failed
      if (err?.name === "AbortError") return false;
      console.warn("Web Share failed, falling back to clipboard:", err);
    }
  }

  // Fallback: Copy to Clipboard
  const textToCopy = options.url
    ? `${options.title}\n${options.text ? options.text + "\n" : ""}${options.url}`
    : `${options.title}\n${options.text || ""}`;

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Copied to clipboard!");
      return true;
    }
  } catch (clipErr) {
    console.error("Clipboard copy failed:", clipErr);
  }

  toast.error("Sharing failed");
  return false;
}

/** Utility to strip HTML tags for plain text sharing */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}
