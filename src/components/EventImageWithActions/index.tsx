import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import defaultEventImage from '@/assets/images/default-event.png';
import backIcon from '@/assets/images/back.svg';
import favouriteIcon from '@/assets/images/favourite.svg';
import shareIcon from '@/assets/images/share.svg';
import cn from 'classnames';
import './styles.scss';
import { useUser } from '@/context/UserContext';
interface EventImageWithActionsProps {
  imageUrl?: string;
  onFavorite: () => void;
  onShare?: () => void;
  eventTitle?: string;
  eventUrl?: string;
  hasMultipleImages?: boolean;
  onNextImage?: () => void;
  onPrevImage?: () => void;
  isSaved?: boolean;
}

const EventImageWithActions: React.FC<EventImageWithActionsProps> = ({
  imageUrl,
  onFavorite,
  onShare,
  eventTitle = 'Check out this event',
  eventUrl,
  hasMultipleImages = false,
  onNextImage,
  onPrevImage,
  isSaved
}) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }

    if (navigator.share && eventUrl) {
      try {
        await navigator.share({
          title: eventTitle,
          text: 'I thought you might be interested in this event!',
          url: eventUrl
        });
      } catch (error) {
        console.error('Error sharing event:', error);

        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (!eventUrl) return;

    navigator.clipboard.writeText(eventUrl).catch(err => {
      console.error('Failed to copy link:', err);
    });
  };

  return (
    <div className="image-container overflow-hidden">
      <img
        src={imageUrl || defaultEventImage}
        alt="Event"
        className="main-image w-full object-cover object-top sm-h-full min-h-[400px] h-[484px]"
        onError={e => {
          e.currentTarget.src = defaultEventImage;
        }}
      />

      {hasMultipleImages && (
        <div className="image-navigation">
          <button
            className="nav-button prev-button"
            onClick={onPrevImage}
            aria-label="Previous image"
          >
            &#10094;
          </button>
          <button
            className="nav-button next-button"
            onClick={onNextImage}
            aria-label="Next image"
          >
            &#10095;
          </button>
        </div>
      )}

      <div className="image-container__call-to-action">
        <button className="icon-button home-icon" onClick={() => navigate('/')}>
          <img src={backIcon} alt="Back to home" />
        </button>

        {user && (
          <button
            className={cn('icon-button favourite-icon', {
              '!bg-gray-700': isSaved,
              '!text-white': isSaved
            })}
            onClick={onFavorite}
          >
            <img src={favouriteIcon} alt="Add to favorites" />
          </button>
        )}

        <button className="icon-button share-icon" onClick={handleShare}>
          <img src={shareIcon} alt="Share event" />
        </button>
      </div>
    </div>
  );
};

export default EventImageWithActions;
