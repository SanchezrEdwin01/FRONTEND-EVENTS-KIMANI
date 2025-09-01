import React from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/Card';
import { SkeletonCard } from '@/components/Card';
import { Event } from '@/types/event';
import { useUser } from '@/context/UserContext';
interface EventListContainerProps {
  eventState: Event[];
  isLoading: boolean;
}

const EventListContainer = ({
  eventState,
  isLoading
}: EventListContainerProps) => {
  const { user } = useUser();
  if (isLoading) {
    return (
      <div
        className={
          user
            ? 'flex flex-col items-center justify-center pb-[70px] mx-[25px]'
            : 'flex flex-col items-center justify-center pb-[30px] mx-[25px]'
        }
      >
        {[...Array(6)]?.map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (!eventState?.length) {
    return (
      <div className="text-center py-8">
        <p>No events found</p>
      </div>
    );
  }

  const listing = React.useMemo(() => {
    if (!eventState || !eventState?.length) return null;

    return eventState.map((event, index) => (
      <React.Fragment key={(event as any)._id ?? index}>
        <Card card={event} />
        {index < eventState.length - 1 && (
          <hr className="w-full my-4 bg-[#191919] opacity-30" />
        )}
      </React.Fragment>
    ));
  }, [eventState]);
  return (
    <div
      className={
        user
          ? 'flex flex-col items-center justify-center pb-[70px] mx-[25px]'
          : 'flex flex-col items-center justify-center pb-[30px] mx-[25px]'
      }
    >
      {listing}
    </div>
  );
};

EventListContainer.propTypes = {
  eventState: PropTypes.arrayOf(PropTypes.shape({}))
};

export default EventListContainer;
