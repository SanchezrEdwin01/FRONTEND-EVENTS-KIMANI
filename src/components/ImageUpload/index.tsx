import React, { useState, useRef } from 'react';
import { ImageAdd } from '@styled-icons/boxicons-regular/ImageAdd';
import defaultEventImage from '@/assets/images/defaultEventImage.jpg';
import { Plus } from '@styled-icons/boxicons-regular/Plus';
import { Trash } from '@styled-icons/boxicons-regular/Trash';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onGalleryChange?: (files: File[]) => void;
  error?: string;
  defaultValue?: string;
  defaultGallery?: ImageItem[];
  name: string;
}

interface ImageItem {
  file?: File;
  preview: string;
  name: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onGalleryChange,
  error,
  defaultValue,
  defaultGallery
}) => {
  const [preview, setPreview] = useState<string>(defaultValue || defaultEventImage);
  const [gallery, setGallery] = useState<ImageItem[]>(defaultGallery || []);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGalleryLoading, setIsGalleryLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => fileInputRef.current?.click();

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // subimos a 5MB para mejor calidad

    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please select only JPG or PNG images');
      return false;
    }

    if (file.size > maxSize) {
      setErrorMessage('Image size should not exceed 5MB');
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      try {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
          setIsLoading(false);
        };
        reader.readAsDataURL(file);
        onImageSelect(file);
      } catch (err) {
        console.error('Error processing image:', err);
        setErrorMessage('Error processing image. Please try again.');
      }
    }
  };

  const handleGalleryFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (files && gallery.length + files.length <= 9) {
      setIsGalleryLoading(true);
      try {
        for (const file of Array.from(files)) {
          if (validateFile(file)) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setGallery((prev) => {
                const newGallery = [
                  ...prev,
                  { file, preview: reader.result as string, name: file.name }
                ];
                onGalleryChange?.(
                  newGallery.map((item) => (item.file ? item.file : (item.name as any)))
                );
                return newGallery;
              });
            };
            reader.readAsDataURL(file);
          }
        }
      } finally {
        setIsGalleryLoading(false);
      }
    } else {
      setErrorMessage('Maximum 9 additional images allowed');
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery((prev) => {
      const newGallery = [...prev];
      newGallery.splice(index, 1);
      onGalleryChange?.(newGallery.map((item) => item.file!).filter(Boolean));
      return newGallery;
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* PREVIEW CUADRADO MÁS GRANDE */}
      <div className="upload-square upload-square--lg cursor-pointer overflow-hidden transition-colors relative rounded-lg" onClick={handleImageClick}>
        <img
          src={preview}
          alt="Event image"
          className="upload-square__img"
          decoding="async"
        />
        <div className="absolute bottom-2 right-2 bg-black/60 rounded-[10px] p-2 shadow-md">
          <ImageAdd size={28} className="text-white" />
        </div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm text-[#EAEEDD] mb-2">Additional Images (up to 9)</p>

        <div
          onClick={() => galleryInputRef.current?.click()}
          className="w-full cursor-pointer p-6 rounded-lg border-2 border-dashed border-[#78788086] hover:border-[#EAEEDD] transition-colors bg-[#2E2C2C] flex flex-col items-center justify-center gap-2 relative"
        >
          {isGalleryLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <>
              <Plus size={24} className="text-[#EAEEDD]" />
              <p className="text-sm text-[#EAEEDD]">Click to add additional images</p>
            </>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {gallery.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-[#2E2C2C] border border-[#78788086]">
              <div className="upload-thumb">
                <img src={item.preview} alt={`Gallery image ${index + 1}`} className="upload-thumb__img" />
              </div>
              <span className="flex-1 truncate text-sm text-[#EAEEDD]">
                {item?.name || `Image ${index + 1}`}
              </span>
              <button
                onClick={() => removeGalleryImage(index)}
                className="p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors w-[30px] h-[30px] flex justify-center items-center"
                type="button"
              >
                <Trash size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="hidden" />
      <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png" onChange={handleGalleryFileChange} multiple className="hidden" />

      {(errorMessage || error) && <p className="text-red-500 text-sm mt-2">{errorMessage || error}</p>}

      {/* Estilos en-línea mínimos si no usas un CSS propio */}
      <style jsx>{`
        .upload-square {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #111;
          border-radius: 12px;
          overflow: hidden;
        }
        .upload-square::before {
          content: '';
          display: block;
          padding-top: 100%;
        }
        .upload-square--lg {
          min-height: 420px;
        }
        @media (min-width: 640px) {
          .upload-square--lg { min-height: 500px; }
        }
        @media (min-width: 768px) {
          .upload-square--lg { min-height: 560px; }
        }
        .upload-square__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .upload-thumb {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          overflow: hidden;
          background: #111;
          flex-shrink: 0;
        }
        .upload-thumb__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;
