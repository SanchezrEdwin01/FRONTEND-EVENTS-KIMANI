import React, { useState, useRef, useEffect } from 'react';
import { ImageAdd } from '@styled-icons/boxicons-regular/ImageAdd';
import defaultEventImage from '@/assets/images/defaultEventImage.jpg';
import { Plus } from '@styled-icons/boxicons-regular/Plus';
import { Trash } from '@styled-icons/boxicons-regular/Trash';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
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
  const [preview, setPreview] = useState<string>(
    defaultValue || defaultEventImage
  );
  const [gallery, setGallery] = useState<ImageItem[]>(defaultGallery || []);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGalleryLoading, setIsGalleryLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultValue) {
      setPreview(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (defaultGallery) {
      setGallery(defaultGallery);
    }
  }, [defaultGallery]);

  const handleImageClick = () => {
    setErrorMessage(null);
    fileInputRef.current?.click();
  };

  const handleGalleryClick = () => {
    setErrorMessage(null);
    galleryInputRef.current?.click();
  };

  const validateImageDimensions = (
    file: File
  ): Promise<{
    valid: boolean;
    width?: number;
    height?: number;
    error?: string;
  }> => {
    return new Promise(resolve => {
      // Validate file type first
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        resolve({ valid: false, error: 'Only JPG or PNG images are allowed' });
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        resolve({ valid: false, error: 'Image size must not exceed 5MB' });
        return;
      }

      // Create image element to check dimensions
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        const width = img.width;
        const height = img.height;

        resolve({ valid: true, width, height });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          valid: false,
          error: 'Failed to load image. Please try another file'
        });
      };

      img.src = url;
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    // Reset input to allow selecting the same file again
    event.target.value = '';

    if (!file) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const validation = await validateImageDimensions(file);

      if (!validation.valid) {
        setErrorMessage(validation.error || 'Invalid image dimensions');
        setIsLoading(false);
        onImageSelect(null);
        return;
      }

      // Only proceed if validation passed
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onImageSelect(file);
        setIsLoading(false);
        setErrorMessage(null);
      };
      reader.onerror = () => {
        setErrorMessage('Error reading file. Please try again');
        setIsLoading(false);
        onImageSelect(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error validating image:', err);
      setErrorMessage('Error processing image. Please try again');
      setIsLoading(false);
      onImageSelect(null);
    }
  };

  const handleGalleryFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    // Reset input to allow selecting the same files again
    event.target.value = '';

    if (!files || files.length === 0) return;

    // Check gallery limit
    if (gallery.length + files.length > 9) {
      setErrorMessage('Maximum 9 additional images allowed');
      return;
    }

    setIsGalleryLoading(true);
    setErrorMessage(null);

    const filesArray = Array.from(files);
    const newGalleryItems: ImageItem[] = [];
    const validFiles: File[] = [];
    const failedFiles: string[] = [];

    for (const file of filesArray) {
      try {
        const validation = await validateImageDimensions(file);

        if (!validation.valid) {
          failedFiles.push(`${file.name}: ${validation.error}`);
          continue;
        }

        validFiles.push(file);

        // Create preview
        const reader = new FileReader();
        const preview = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newGalleryItems.push({
          file,
          preview,
          name: file.name
        });
      } catch (err) {
        console.error(`Error processing ${file.name}:`, err);
        failedFiles.push(`${file.name}: Failed to process`);
      }
    }

    // Show consolidated error message if any files failed
    if (failedFiles.length > 0) {
      setErrorMessage(`Some images were not added:\n${failedFiles.join('\n')}`);
    }

    // Update gallery with valid images only
    if (newGalleryItems.length > 0) {
      const updatedGallery = [...gallery, ...newGalleryItems];
      setGallery(updatedGallery);

      const allFiles = updatedGallery.map(item => item.file!).filter(Boolean);
      onGalleryChange?.(allFiles);
    }

    setIsGalleryLoading(false);
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...gallery];
    newGallery.splice(index, 1);
    setGallery(newGallery);

    const files = newGallery.map(item => item.file!).filter(Boolean);
    onGalleryChange?.(files);
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Image Upload */}
      <div
        className="upload-square upload-square--lg cursor-pointer overflow-hidden transition-colors relative rounded-lg"
        onClick={handleImageClick}
      >
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

      {/* Gallery Upload */}
      <div className="mt-4">
        <p className="text-sm text-[#EAEEDD] mb-2">
          Additional Images (up to 9)
        </p>

        <div
          onClick={handleGalleryClick}
          className="w-full cursor-pointer p-6 rounded-lg border-2 border-dashed border-[#78788086] hover:border-[#EAEEDD] transition-colors bg-[#2E2C2C] flex flex-col items-center justify-center gap-2 relative"
        >
          {isGalleryLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <>
              <Plus size={24} className="text-[#EAEEDD]" />
              <p className="text-sm text-[#EAEEDD]">
                Click to add additional images
              </p>
            </>
          )}
        </div>

        {/* Gallery Items */}
        <div className="mt-4 space-y-2">
          {gallery.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg bg-[#2E2C2C] border border-[#78788086]"
            >
              <div className="upload-thumb">
                <img
                  src={item.preview}
                  alt={`Gallery image ${index + 1}`}
                  className="upload-thumb__img"
                />
              </div>
              <span className="flex-1 truncate text-sm text-[#EAEEDD]">
                {item?.name || `Image ${index + 1}`}
              </span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  removeGalleryImage(index);
                }}
                className="p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors w-[30px] h-[30px] flex justify-center items-center"
                type="button"
                aria-label="Remove image"
              >
                <Trash size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleGalleryFileChange}
        multiple
        className="hidden"
      />

      {/* Error message */}
      {(errorMessage || error) && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-2">
          <p className="text-red-400 text-sm font-medium whitespace-pre-line">
            {errorMessage || error}
          </p>
        </div>
      )}

      {/* Styles */}
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
          .upload-square--lg {
            min-height: 500px;
          }
        }
        @media (min-width: 768px) {
          .upload-square--lg {
            min-height: 560px;
          }
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
