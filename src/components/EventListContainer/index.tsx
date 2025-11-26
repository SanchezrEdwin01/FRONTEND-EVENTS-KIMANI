// src/components/EventListContainer.tsx
import React from 'react';
import PropTypes from 'prop-types';
import Card, { SkeletonCard } from '@/components/Card';
import { Event } from '@/types/event';
import { useUser } from '@/context/UserContext';

interface EventListContainerProps {
  eventState: Event[];
  isLoading: boolean;
  onEventContextMenu?: (e: React.MouseEvent, evtData: Event) => void;
}

const EventListContainer = ({ eventState, isLoading, onEventContextMenu }: EventListContainerProps) => {
  const { data } = useUser();
  const user = data?.user;
  const isAdmin = !!data?.isAdmin;

  const listing = React.useMemo(() => {
    if (!Array.isArray(eventState) || eventState.length === 0) return null;

    return eventState.map((event, index) => (
      <React.Fragment key={event._id ?? index}>
        {/* Adjunta onContextMenu solo si es admin */}
        <div
          className="w-full"
          onContextMenu={isAdmin ? (e) => onEventContextMenu?.(e, event) : undefined}
        >
          <Card card={{
            _id: event._id,
            title: event.title,
            thumbnail: event.thumbnail,
            gallery: event.gallery,
            start_date: event.start_date,
            end_date: event.end_date,
            hosts: event.hosts,
            city: event.city,
            is_saved: event.is_saved,
            host_details: event.host_details
          }} />
        </div>
        {index < eventState.length - 1 && <hr className="w-full my-4 bg-[#191919] opacity-30" />}
      </React.Fragment>
    ));
  }, [eventState, onEventContextMenu, isAdmin]);

  if (isLoading) {
    return (
      <div className={user ? 'flex flex-col items-center justify-center pb-[70px] w-full' : 'flex flex-col items-center justify-center pb-[30px] w-full'}>
        <div className="w-full px-6 sm:px-10 md:px-16 lg:px-20">
          {Array.from({ length: 6 }).map((_, index) => (
            <React.Fragment key={`skeleton-${index}`}>
              <SkeletonCard />
              {index < 5 && <hr className="w-full my-4 bg-[#191919] opacity-30" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-8">
        <p className="text-white">No events found</p>
      </div>
    );
  }

  return (
    <div className={user ? 'flex flex-col items-center justify-center pb-[70px] w-full' : 'flex flex-col items-center justify-center pb-[30px] w-full'}>
      <div className="w-full px-8 sm:px-10 md:px-16 lg:px-20">
        {listing}
      </div>
    </div>
  );
};

EventListContainer.propTypes = {
  eventState: PropTypes.arrayOf(PropTypes.shape({
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
  })),
  isLoading: PropTypes.bool,
  onEventContextMenu: PropTypes.func,
};

export default EventListContainer;