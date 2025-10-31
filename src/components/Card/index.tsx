import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import './index.scss';
import ShareButton from '../ShareButton';
import { formatDate, getDisplayImage } from '@/utils/utils';
import ImageWithFallback from '../ImageWithFallback';
import { useSaveEvent } from '@/hooks/useEvents';
import cn from 'classnames';
import { useUser } from '@/context/UserContext';
import { PLATFORM_URL } from '@/utils/constants';

const Card = ({ card }) => {
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

  const { user } = useUser();
  const navigate = useNavigate();
  const saveEvent = useSaveEvent();

  const formatHostedBy = useCallback((hosts) => {
    if (!Array.isArray(hosts)) return null;
    const names = hosts
      .map((host) => {
        const _host = card?.host_details?.find((h) => h.id === host);
        return _host?.username;
      })
      .filter(Boolean);
    return names.length ? `Hosted by: ${names.join(', ')}` : null;
  }, []);

  const handleBookmarkClick = useCallback(
    (e) => {
      e.stopPropagation();
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

  return (
    <div className="event-card w-full max-w-md rounded-lg overflow-hidden relative">
      <div className="cursor-pointer" onClick={() => navigate(`/view/${_id}`)}>
        {/* Contenedor cuadrado más grande */}
        <div className="media-square media-square--lg">
          <ImageWithFallback
            src={imgSrc}
            alt={title}
            wrapperClassName="media-square__inner"
            className="media-square__img"
            decoding="async"
          />
        </div>
      </div>

      <div
        className="p-3 cursor-pointer"
        onClick={() => navigate(`/view/${_id}`)}
      >
        <h2 className="mb-1 text-lg leading-snug">
          <Link to={`/view/${_id}`} className="hover:underline cursor-pointer">
            {title}
          </Link>{' '}
          <span className="text-base text-white/80">| {city}</span>
        </h2>
        <p className="mb-1 text-sm">{formatDate(start_date, false, end_date)}</p>
        {formatHostedBy(hosts) && <p className="text-sm">{formatHostedBy(hosts)}</p>}
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

export const SkeletonCard = () => {
  return (
    <div className="event-card w-full max-w-md rounded-lg overflow-hidden relative animate-pulse">
      <div className="media-square media-square--lg">
        <div className="media-square__placeholder" />
      </div>
      <div className="p-3">
        <div className="mb-1"><div className="h-5 bg-white/60 rounded w-3/4" /></div>
        <div className="mb-1"><div className="h-4 bg-white/60 rounded w-1/4" /></div>
        <div><div className="h-4 bg-white/60 rounded w-1/2" /></div>
      </div>
    </div>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.string.isRequired,
    gallery: PropTypes.arrayOf(PropTypes.string),
    start_date: PropTypes.string.isRequired,
    hosts: PropTypes.arrayOf(PropTypes.string),
    city: PropTypes.string.isRequired
  }).isRequired
};

export default Card;
