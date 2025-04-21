import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ClipboardIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

const CopyToClipboard = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`rounded-md bg-[#0000004D] hover:bg-gray-700 w-[36px] h-[36px] flex items-center justify-center ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <ClipboardDocumentCheckIcon
          width={18}
          height={18}
          className="text-green-500"
        />
      ) : (
        <ClipboardIcon width={18} height={18} />
      )}
    </button>
  );
};

CopyToClipboard.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default CopyToClipboard;
