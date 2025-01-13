import React, { useCallback, useState } from "react";
import { cn } from "@/app/utils/cn";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface Props {
  height: number;
  width: number;
  rounded: number;
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
}

const ImageUpload: React.FC<Props> = ({
  height,
  width,
  rounded,
  image,
  setImage,
}) => {
  const [iconImageEffect, setIconImageEffect] = useState(false);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size >= 524288) {
        toast.error("Tamanho da imagem excedida");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString();
        if (!base64String) return;

        setImage(base64String);
      };
      reader.readAsDataURL(file);
    },
    [setImage]
  );

  return (
    <div
      style={{ width: width, height: height }}
      onMouseEnter={() => setIconImageEffect(true)}
      onMouseLeave={() => setIconImageEffect(false)}
      className="relative flex justify-center items-center"
    >
      <input
        id="image-upload"
        type="file"
        accept=".png, .jpg, .jpeg"
        onChange={handleImageChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 z-10"
      />

      <div
        style={{ borderRadius: rounded }}
        className="w-full h-full flex items-center justify-center"
      >
        <Upload
          className={cn(
            "absolute top-0 bottom-0 left-0 right-0 m-auto z-[1] opacity-100 transition-all duration-500 cursor-pointer",
            iconImageEffect ? "opacity-100 scale-[1.5]" : "opacity-50"
          )}
        />

        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            style={{
              width: width - 20,
              height: height - 20,
              borderRadius: rounded,
            }}
            className="object-cover opacity-100"
            src={image}
            alt="avatar_group"
          />
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
