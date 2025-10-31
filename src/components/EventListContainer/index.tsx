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
  const { user } = useUser();

  if (isLoading) {
    return (
      <div className={user ? 'flex flex-col items-center justify-center pb-[70px] mx-[25px]' : 'flex flex-col items-center justify-center pb-[30px] mx-[25px]'}>
        {[...Array(6)]?.map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)}
      </div>
    );
  }

  if (!isLoading && (!eventState || eventState.length === 0)) {
    return (
      <div className="text-center py-8">
        <p>No events found</p>
      </div>
    );
  }

  const listing = React.useMemo(() => {
    return eventState.map((event, index) => (
      <React.Fragment key={(event as any)._id ?? index}>
        {/* solo la carta reacciona al click derecho */}
        <div className="inline-block" onContextMenu={(e) => onEventContextMenu?.(e, event)}>
          <Card card={event} />
        </div>
        {index < eventState.length - 1 && <hr className="w-full my-4 bg-[#191919] opacity-30" />}
      </React.Fragment>
    ));
  }, [eventState, onEventContextMenu]);

  return (
    <div className={user ? 'flex flex-col items-center justify-center pb-[70px] mx-[25px]' : 'flex flex-col items-center justify-center pb-[30px] mx-[25px]'}>
      {listing}
    </div>
  );
};

EventListContainer.propTypes = {
  eventState: PropTypes.arrayOf(PropTypes.shape({}))
};

export default EventListContainer;
