import React, { useState } from "react";

interface ImageUploaderProps {
  imageUrl?: string;
  onImageUpload: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  onImageUpload,
}) => {
  const [preview, setPreview] = useState(imageUrl);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-uploader">
      {preview && <img src={preview} alt="Preview" className="mb-4" />}
      <input type="file" accept="image/*" onChange={handleImageChange} />
    </div>
  );
};

export default ImageUploader;
