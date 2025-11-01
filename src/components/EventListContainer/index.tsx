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
      <React.Fragment key={(event as any)._id ?? index}>
        {/* Adjunta onContextMenu solo si es admin */}
        <div
          className="inline-block"
          onContextMenu={isAdmin ? (e) => onEventContextMenu?.(e, event) : undefined}
        >
          <Card card={{ ...event, hosts: event.hosts?.map((host) => host.name) }} />
        </div>
        {index < eventState.length - 1 && <hr className="w-full my-4 bg-[#191919] opacity-30" />}
      </React.Fragment>
    ));
  }, [eventState, onEventContextMenu, isAdmin]);

  if (isLoading) {
    return (
      <div className={user ? 'flex flex-col items-center justify-center pb-[70px] mx-[25px]' : 'flex flex-col items-center justify-center pb-[30px] mx-[25px]'}>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-8">
        <p>No events found</p>
      </div>
    );
  }

  return (
    <div className={user ? 'flex flex-col items-center justify-center pb-[70px] mx-[25px]' : 'flex flex-col items-center justify-center pb-[30px] mx-[25px]'}>
      {listing}
    </div>
  );
};

EventListContainer.propTypes = {
  eventState: PropTypes.arrayOf(PropTypes.shape({} as any)) as any,
  isLoading: PropTypes.bool,
  onEventContextMenu: PropTypes.func,
};

export default EventListContainer;
