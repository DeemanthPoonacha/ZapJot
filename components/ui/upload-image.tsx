"use client";

import { Button } from "@/components/ui/button";

import { Upload, LoaderCircle, ImagePlus, Camera } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { CloudinaryResult } from "@/types/general";
import { toast } from "./sonner";
import { UseFormReturn } from "react-hook-form";
import { Card } from "./card";
import { useEffect, useRef } from "react";

const UploadImage = ({
  form,
  fieldName,
  isImageUploading,
  setIsImageUploading,
  defaultCamOpen,
}: {
  // eslint-disable-next-line
  form: UseFormReturn<any>;
  fieldName: string;
  isImageUploading: boolean;
  setIsImageUploading: (isUploading: boolean) => void;
  defaultCamOpen?: boolean;
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
  const openWidgetRef = useRef<() => void>(null);

  // This effect will run once the component mounts
  useEffect(() => {
    // Check if the open function has been stored in the ref
    if (openWidgetRef.current && defaultCamOpen) {
      // Small delay to ensure the widget is properly initialized
      const timer = setTimeout(() => {
        openWidgetRef.current?.();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

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
                {field.value ? (
                  <CldImage
                    width={420}
                    height={200}
                    src={field.value}
                    alt={fieldName}
                    className="w-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImagePlus className="w-36 h-36" />
                  </div>
                )}
                <CldUploadWidget
                  uploadPreset="zapjot_covers"
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
                    croppingShowDimensions: true,
                    croppingShowBackButton: true,
                    croppingCoordinatesMode: "custom",
                  }}
                  onSuccess={(result, { widget }) => {
                    console.log("🚀 ~ Profile ~ result:", result);
                    handleImageUploadSuccess(result?.info as CloudinaryResult);
                    widget.close();
                  }}
                  onOpen={() => {
                    form.setValue(fieldName, "", { shouldDirty: true });
                    setIsImageUploading(true);
                  }}
                  onClose={() => setIsImageUploading(false)}
                  signatureEndpoint="/api/sign-image"
                >
                  {({ open }) => {
                    // Store the open function in ref for use in useEffect
                    openWidgetRef.current = open;

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

export default UploadImage;
