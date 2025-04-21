import React from 'react';
import Button from '@/components/Button';
import { Event } from '@/types/event';
import Separator from '@/components/Separator';
import { formatDate, getDisplayImage } from '@/utils/utils';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useNavigate } from 'react-router-dom';
import { PLATFORM_URL } from '@/utils/constants';
export default function SuccessStep({ event }: { event: Event }) {
  const navigate = useNavigate();
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          url: `${PLATFORM_URL}/view/${event._id}`
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      
      try {
        await navigator.clipboard.writeText(
          `${PLATFORM_URL}/view/${event._id}`
        );
      } catch (error) {
        console.log('Failed to copy:', error);
      }
    }
  };
  return (
    <>
      <div
        className="step-wrapper flex flex-col"
        style={{
          minHeight: 'calc(100vh - 120px)'
        }}
      >
        <div
          data-style="Outlined"
          className="w-[38px] h-[38px] overflow-hidden mb-[5px]"
        >
          <svg
            xmlns="http:
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
          >
            <path
              d="M19 3.16669C10.26 3.16669 3.16666 10.26 3.16666 19C3.16666 27.74 10.26 34.8334 19 34.8334C27.74 34.8334 34.8333 27.74 34.8333 19C34.8333 10.26 27.74 3.16669 19 3.16669ZM19 31.6667C12.0175 31.6667 6.33332 25.9825 6.33332 19C6.33332 12.0175 12.0175 6.33335 19 6.33335C25.9825 6.33335 31.6667 12.0175 31.6667 19C31.6667 25.9825 25.9825 31.6667 19 31.6667ZM26.2675 12.0017L15.8333 22.4359L11.7325 18.3509L9.49999 20.5834L15.8333 26.9167L28.5 14.25L26.2675 12.0017Z"
              fill="#4DDE21"
            />
          </svg>
          Selection colors Hex #4DDE21
        </div>
        <div className="mb-[5px] text-white text-3xl font-medium font-['Hanken_Grotesk']">
          Event is created!
        </div>
        <div className="mb-[10px] text-white text-base font-medium font-['Hanken_Grotesk']">
          Personalize the event page and start inviting people to your fun!{' '}
        </div>
        <div className="w-full p-2 bg-[#2e2c2c] rounded-lg backdrop-blur-[2px] inline-flex flex-col justify-center items-start gap-2">
          <ImageWithFallback
            wrapperClassName="w-full aspect-[355/260] max-h-[355px] "
            src={
              event.thumbnail && event.thumbnail.length > 0
                ? getDisplayImage(event.thumbnail)
                : event.gallery && event.gallery.length > 0
                  ? getDisplayImage(event.gallery[0])
                  : ''
            }
            alt={event.title}
            className="w-full h-full rounded-[10px] object-cover"
          />
          <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
            <div className="self-stretch justify-start text-white text-lg font-medium font-['Hanken_Grotesk'] leading-[22.93px]">
              {event.title}
              <br />
              <b>{event.country}</b> - {event.city}
            </div>
            <div className="self-stretch justify-start text-white text-base font-normal font-['Hanken_Grotesk'] leading-tight">
              {formatDate(event.start_date, false, event.end_date)}
            </div>
          </div>
        </div>
        <div className="w-full mt-auto">
          <Separator />
          <div className="w-[90%] max-w-[600px] mx-auto pb-4">
            <Button
              className="mb-[6px]"
              onClick={() => navigate(`/view/${event._id}`)}
            >
              Invite Guests
            </Button>
            <Button
              backgroundColor="#363536"
              textColor="#FFFFFF"
              onClick={handleShare}
            >
              Share Event
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
