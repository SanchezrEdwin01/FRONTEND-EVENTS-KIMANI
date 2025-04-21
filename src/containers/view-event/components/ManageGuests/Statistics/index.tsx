import * as React from 'react';
import Separator from '@/components/Separator';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

export default function Statistics({ event }) {
  const { guest_stats } = event;
  const invited = useMemo(() => guest_stats?.total_invited || 0, [guest_stats]);
  const going = useMemo(() => guest_stats?.total_going || 0, [guest_stats]);
  const pending = useMemo(() => guest_stats?.total_pending || 0, [guest_stats]);
  const notGoing = useMemo(
    () => guest_stats?.total_rejected || 0,
    [guest_stats]
  );
  return (
    <>
      <Separator />
      <div className="flex flex-col">
        <div className="pb-3 text-white text-xl font-medium font-['Playfair_Display']">
          Guests
        </div>
        <div className="self-stretch inline-flex justify-start items-start gap-[34px]">
          <div className="inline-flex flex-col justify-start items-start gap-0.5">
            <div className="relative justify-start text-white text-base font-bold font-['Hanken_Grotesk']">
              {event?.invited_count ? event?.invited_count + invited : invited}
            </div>
            <div className="relative justify-start text-white text-sm font-light font-['Hanken_Grotesk']">
              Invited
            </div>
          </div>
          <div className="inline-flex flex-col justify-start items-start gap-0.5">
            <div className="relative justify-start text-white text-base font-bold font-['Hanken_Grotesk']">
              {going}
            </div>
            <div className="relative justify-start text-white text-sm font-light font-['Hanken_Grotesk']">
              Going
            </div>
          </div>
          <div className="inline-flex flex-col justify-start items-start gap-0.5">
            <div className="relative justify-start text-white text-base font-bold font-['Hanken_Grotesk']">
              {pending}
            </div>
            <div className="relative justify-start text-white text-sm font-light font-['Hanken_Grotesk']">
              Pending request
            </div>
          </div>
          <div className="inline-flex flex-col justify-start items-start gap-0.5">
            <div className="relative justify-start text-white text-base font-bold font-['Hanken_Grotesk']">
              {notGoing}
            </div>
            <div className="relative justify-start text-white text-sm font-light font-['Hanken_Grotesk']">
              Not going{' '}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Statistics.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string
  })
};
