import { ShareIcon } from '@heroicons/react/24/outline';
import React from 'react';
import PropTypes from 'prop-types';
const ShareButton = ({
  url = window.location.href,
  title = document.title
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(url);
      } catch (error) {
        console.log('Failed to copy:', error);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="rounded-md bg-[#0000004D] hover:bg-gray-700 w-[36px] h-[36px] flex items-center justify-center cursor-pointer"
      >
        <ShareIcon width={18} height={18} />
      </button>
    </div>
  );
};

ShareButton.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string
};

export default ShareButton;
