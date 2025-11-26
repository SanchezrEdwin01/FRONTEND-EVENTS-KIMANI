// src/components/Card.tsx
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import './index.scss';
import ShareButton from '../ShareButton';
import { formatDate, getDisplayImage } from '@/utils/utils';
import { useSaveEvent } from '@/hooks/useEvents';
import cn from 'classnames';
import { useUser } from '@/context/UserContext';
import { PLATFORM_URL } from '@/utils/constants';
import ProgressiveImage from '../ProgressiveImage';

interface CardProps {
  card: {
    _id: string;
    title: string;
    thumbnail?: string;
    gallery?: string[];
    start_date: string;
    end_date?: string;
    hosts: string[];
    city: string;
    is_saved?: boolean;
    host_details?: Array<{ id: string; username: string }>;
  };
}

const Card: React.FC<CardProps> = ({ card }) => {
  const {
    _id,
    title,
    thumbnail,
    gallery,
    start_date,
    end_date,
    hosts,
    city,
    is_saved
  } = card;

  const { data } = useUser();
  const { user } = data || {};
  const navigate = useNavigate();
  const saveEvent = useSaveEvent();

  const formatHostedBy = useCallback((hosts: string[]) => {
    if (!Array.isArray(hosts)) return null;
    
    // Si hosts es un array de strings (nombres), úsalos directamente
    if (hosts.length > 0 && typeof hosts[0] === 'string') {
      return `Hosted by: ${hosts.join(', ')}`;
    }
    
    // Si hosts es un array de IDs, usa host_details para mapear
    if (card?.host_details) {
      const names = hosts
        .map((hostId) => {
          const host = card.host_details?.find((h) => h.id === hostId);
          return host?.username;
        })
        .filter(Boolean);
      return names.length ? `Hosted by: ${names.join(', ')}` : null;
    }
    
    return null;
  }, [card?.host_details]);

  const handleBookmarkClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      saveEvent.mutate(_id);
    },
    [saveEvent, _id]
  );

  const imgSrc =
    thumbnail && thumbnail.length > 0
      ? getDisplayImage(thumbnail, { width: 1440, height: 1440, dpr: 2, fit: 'cover' })
      : gallery && gallery.length > 0
      ? getDisplayImage(gallery[0], { width: 1440, height: 1440, dpr: 2, fit: 'cover' })
      : '';

  const handleCardClick = () => {
    navigate(`/view/${_id}`);
  };

  return (
    <div className="event-card">
      <div className="cursor-pointer" onClick={handleCardClick}>
        {/* Contenedor cuadrado con ancho fijo */}
        <div className="media-square media-square--lg">
          <div className="media-square__inner">
            <ProgressiveImage
              src={imgSrc}
              alt={title}
              className="media-square__img"
              decoding="async"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div
        className="p-3 cursor-pointer"
        onClick={handleCardClick}
      >
        <h2 className="mb-1 text-lg leading-snug text-white">
          <Link to={`/view/${_id}`} className="hover:underline cursor-pointer">
            {title}
          </Link>{' '}
          <span className="text-base text-white/80">| {city}</span>
        </h2>
        <p className="mb-1 text-sm text-gray-300">{formatDate(start_date, false, end_date)}</p>
        {formatHostedBy(hosts) && <p className="text-sm text-gray-300">{formatHostedBy(hosts)}</p>}
      </div>

      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <ShareButton
          url={`${PLATFORM_URL}/view/${_id}`}
          title={`${title} - ${city}`}
        />
        {user && (
          <button
            className={cn(
              'rounded-md bg-[#0000004D] hover:bg-gray-700 md:active:bg-gray-700 w-[40px] h-[40px] flex items-center justify-center cursor-pointer touch-manipulation',
              { 'bg-gray-700 text-white': is_saved === true }
            )}
            onClick={handleBookmarkClick}
            aria-label="Save event"
          >
            <BookmarkIcon width={22} height={22} />
          </button>
        )}
      </div>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="event-card animate-pulse">
      <div className="media-square media-square--lg">
        <div className="media-square__placeholder bg-gray-700 w-full h-full" />
      </div>
      <div className="p-3">
        <div className="mb-1"><div className="h-5 bg-gray-600 rounded w-3/4" /></div>
        <div className="mb-1"><div className="h-4 bg-gray-600 rounded w-1/4" /></div>
        <div><div className="h-4 bg-gray-600 rounded w-1/2" /></div>
      </div>
    </div>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    gallery: PropTypes.arrayOf(PropTypes.string),
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string,
    hosts: PropTypes.arrayOf(PropTypes.string).isRequired,
    city: PropTypes.string.isRequired,
    is_saved: PropTypes.bool,
    host_details: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string
    }))
  }).isRequired
};

export default Card;