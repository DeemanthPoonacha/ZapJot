// components/CloudinaryMediaModal.jsx
import { useEffect } from "react";
import { CldImage, CldVideoPlayer } from "next-cloudinary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function CloudinaryMediaModal({
  publicId,
  title = "Media",
  mediaType = "image", // "image" or "video"
  isModalOpen,
  setIsModalOpen,
  className = "",
}: {
  publicId: string;
  title?: string;
  mediaType?: "image" | "video";
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  className?: string;
}) {
  const renderModalContent = () => {
    if (mediaType === "video") {
      return (
        <CldVideoPlayer
          src={publicId}
          width="1600"
          height="900"
          autoPlay="always"
          controls={true}
          className="max-w-full max-h-screen"
        />
      );
    }

    return (
      <CldImage
        src={publicId}
        width="1600"
        height="1200"
        sizes="100vw"
        className="max-w-full max-h-screen object-contain"
        alt={title}
      />
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="p-3 md:p-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <div className={className}>{renderModalContent()}</div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
