import React, { useRef } from 'react';
import { UploadFile } from '@styled-icons/material';
import Button from '@/components/Button';

interface AttachFileButtonProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  wrapperClassName?: string;
}

const AttachFileButton: React.FC<AttachFileButtonProps> = ({
  onFileSelect,
  accept = '*/*',
  maxSize = 10, // default 10MB
  wrapperClassName = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size should not exceed ${maxSize}MB`);
        return;
      }

      onFileSelect(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <Button
        leftIcon={<UploadFile />}
        backgroundColor="#2E2C2C"
        textColor="#fff"
        fontWeight={400}
        onClick={handleClick}
        className={wrapperClassName}
      >
        Attach a file
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default AttachFileButton;
