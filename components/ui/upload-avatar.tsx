"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, LoaderCircle } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CldUploadWidget } from "next-cloudinary";
import { CloudinaryResult } from "@/types/general";
import { toast } from "./sonner";

const UploadAvatar = ({
  form,
  fieldName,
  isImageUploading,
  setIsImageUploading,
}: {
  form: any;
  fieldName: string;
  isImageUploading: boolean;
  setIsImageUploading: (isUploading: boolean) => void;
}) => {
  const handleImageUploadSuccess = async (result: CloudinaryResult) => {
    // Get the secure URL from the upload result
    const imageUrl = result.secure_url;
    console.log("🚀 ~ handleImageUploadSuccess ~ imageUrl:", imageUrl);

    try {
      form.setValue(fieldName, imageUrl, { shouldDirty: true });
      setIsImageUploading(false);

      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setIsImageUploading(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Display Picture</FormLabel>
          <FormControl>
            <div className="border rounded-md text-center flex flex-col items-center">
              <div className="relative m-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    src={field.value || "/placeholder.svg"}
                    alt="Profile picture"
                  />
                  <AvatarFallback className="bg-muted">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <CldUploadWidget
                  uploadPreset="user_profiles"
                  options={{
                    sources: [
                      "camera",
                      "local",
                      "url",
                      "google_drive",
                      "unsplash",
                      "image_search",
                    ],
                    maxFiles: 1,
                    resourceType: "image",
                    clientAllowedFormats: ["jpeg", "png", "jpg", "webp"],
                    cropping: true,
                    croppingAspectRatio: 1,
                    croppingShowDimensions: true,
                    croppingShowBackButton: true,
                    maxFileSize: 2000000, // 2MB limit
                    showSkipCropButton: false,
                    croppingCoordinatesMode: "custom",
                    croppingDefaultSelectionRatio: 1,
                  }}
                  onSuccess={(result, { widget }) => {
                    console.log("🚀 ~ Profile ~ result:", result);
                    handleImageUploadSuccess(result?.info as CloudinaryResult);
                    widget.close();
                  }}
                  onOpen={() => setIsImageUploading(true)}
                  onClose={() => setIsImageUploading(false)}
                  signatureEndpoint="/api/sign-image"
                >
                  {({ open }) => {
                    return (
                      <Button
                        type="button"
                        onClick={() => open()}
                        disabled={isImageUploading}
                        className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90 h-10 w-10 shadow-md"
                      >
                        {isImageUploading ? (
                          <LoaderCircle className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </Button>
                    );
                  }}
                </CldUploadWidget>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UploadAvatar;
