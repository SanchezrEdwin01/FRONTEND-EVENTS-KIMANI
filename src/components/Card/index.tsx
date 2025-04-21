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
  const formatHostedBy = useCallback(hosts => {
    if (!Array.isArray(hosts)) return null;
    return `Hosted by: ${hosts
      .map(host => {
        const _host = card?.host_details?.find(h => h.id === host);
        return _host?.username;
      })
      .join(', ')}`;
  }, []);

  const handleBookmarkClick = useCallback(
    e => {
      e.stopPropagation();
      saveEvent.mutate(_id);
    },
    [saveEvent, _id]
  );
  return (
    <div className="event-card w-full max-w-sm rounded-lg overflow-hidden relative">
      <div
        className="max-w-full overflow-hidden cursor-pointer relative flex items-center justify-center min-h-[300px]"
        onClick={() => navigate(`/view/${_id}`)}
      >
        <ImageWithFallback
          src={
            thumbnail && thumbnail.length > 0
              ? getDisplayImage(thumbnail, {
                  width: 300,
                  height: 300,
                  dpr: 2,
                  fit: 'cover'
                })
              : gallery && gallery.length > 0
                ? getDisplayImage(gallery[0], {
                    width: 300,
                    height: 300,
                    dpr: 2,
                    fit: 'cover'
                  })
                : ''
          }
          alt={title}
          wrapperClassName="w-full h-full"
          className="w-full h-full object-cover rounded-b-lg"
        />
      </div>
      <div
        className="p-2 cursor-pointer"
        onClick={() => navigate(`/view/${_id}`)}
      >
        <h2 className="mb-1">
          <Link to={`/view/${_id}`} className="hover:underline cursor-pointer">
            {title}
          </Link>{' '}
          <span>| {city}</span>
        </h2>
        <p className="mb-1">{formatDate(start_date, false, end_date)}</p>
        <p>{formatHostedBy(hosts)}</p>
      </div>
      <div className="absolute top-1 right-1 flex gap-2 z-10">
        <ShareButton
          url={`${PLATFORM_URL}/view/${_id}`}
          title={`${title} - ${city}`}
        />
        {user && (
          <button
            className={cn(
              'rounded-md bg-[#0000004D] hover:bg-gray-700 md:active:bg-gray-700 w-[36px] h-[36px] flex items-center justify-center cursor-pointer touch-manipulation',
              {
                'bg-gray-700': is_saved === true,
                'text-white': is_saved === true
              }
            )}
            onClick={handleBookmarkClick}
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
    <div className="event-card w-full max-w-sm rounded-lg overflow-hidden relative animate-pulse">
      <div className="max-w-full overflow-hidden">
        <div className="w-full bg-white/60" style={{ height: '355px' }} />
      </div>
      <div className="p-2">
        <div className="mb-1">
          <div className="h-5 bg-white/60 rounded w-3/4"></div>
        </div>
        <div className="mb-1">
          <div className="h-4 bg-white/60 rounded w-1/4"></div>
        </div>
        <div>
          <div className="h-4 bg-white/60 rounded w-1/2"></div>
        </div>
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
