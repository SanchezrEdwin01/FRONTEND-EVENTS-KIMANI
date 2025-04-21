import * as React from 'react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { generateFileURL } from '@/utils/utils';

export default function Listing({
  handleAddHosts,
  event
}: {
  handleAddHosts: () => void;
  event: Event;
}) {
  return (
    <div className="flex-1 overflow-hidden p-4">
      <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
        <div className="w-9 h-9 relative ml-auto">
          <div
            className="w-9 h-9"
            onClick={handleAddHosts}
            onKeyDown={handleAddHosts}
            role="button"
            tabIndex={0}
          >
            <div className="w-9 h-9 bg-[#2e2c2c] rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 5C12.5523 5 13 5.44772 13 6V11H18C18.5523 11 19 11.4477 19 12C19 12.5523 18.5523 13 18 13H13V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V13H6C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11H11V6C11 5.44772 11.4477 5 12 5Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
        {event?.hosts?.length > 0 ? (
          event?.hosts?.map((hostId, index) => {
            const _host = event?.host_details?.find(host => host.id === hostId);
            const memberAvatar =
              (_host?.avatar && generateFileURL(_host.avatar)) || null;
            return (
              <div
                key={index}
                className="w-full px-2 py-1 bg-[#2e2c2c] rounded-lg border-[#dfdfec] inline-flex justify-start items-center gap-2"
              >
                {_host?.avatar && (
                  <ImageWithFallback
                    data-placeholder="Off"
                    data-size="xs"
                    data-style="Circle"
                    className="w-6 h-6 rounded-[100px]"
                    src={memberAvatar}
                    alt={_host?.name}
                    fallbackSrc={'https://placehold.co/24x24'}
                  />
                )}
                <div className="flex-1 justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
                  {_host?.username}
                </div>
                <div className="justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
                  Host
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full p-2 inline-flex justify-start items-center gap-3">
            No hosts added to this event yet
          </div>
        )}
      </div>
    </div>
  );
}
