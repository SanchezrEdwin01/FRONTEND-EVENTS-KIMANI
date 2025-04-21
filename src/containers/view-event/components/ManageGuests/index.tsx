import {
  UserPlusIcon,
  MegaphoneIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Statistics from './Statistics';
import { useNavigate } from 'react-router-dom';

const ManageGuests = ({ event }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, []);

  return (
    <div className="flex flex-col mt-3">
      <div className="self-stretch inline-flex justify-start items-start gap-3.5">
        <div
          onClick={() => navigate(`/invite-guests/${event._id}`)}
          className="cursor-pointer w-[108.67px] px-[49px] py-0.5 bg-[#2e2c2c] rounded-[10px] shadow-[0px_0px_3.299999952316284px_0px_rgba(255,255,255,1.00)] backdrop-blur-[8.90px] inline-flex flex-col justify-center items-center gap-[3px]"
        >
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-[18px] h-[18px] left-[3px] top-[3px] absolute">
              <UserPlusIcon width={18} height={18} />
            </div>
          </div>
          <div className="relative justify-start text-white text-xs font-bold font-['Hanken_Grotesk']">
            Invite{' '}
          </div>
        </div>
        <div
          onClick={() => navigate(`/blast-a-message/${event._id}`)}
          className="cursor-pointer w-[108.67px] px-[49px] py-0.5 bg-[#2e2c2c] rounded-[10px] shadow-[0px_0px_3.299999952316284px_0px_rgba(255,255,255,1.00)] backdrop-blur-[8.90px] inline-flex flex-col justify-center items-center gap-[3px]"
        >
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-[18px] h-[17.66px] left-[3px] top-[3px] absolute">
              <MegaphoneIcon width={18} height={18} />
            </div>
          </div>
          <div className="relative justify-start text-white text-xs font-bold font-['Hanken_Grotesk']">
            Blast
          </div>
        </div>
        <div
          onClick={handleCopy}
          className="cursor-pointer w-[108.67px] py-0.5 bg-[#2e2c2c] rounded-[10px] shadow-[0px_0px_3.299999952316284px_0px_rgba(255,255,255,1.00)] backdrop-blur-[8.90px] inline-flex flex-col justify-center items-center gap-[3px] relative overflow-hidden"
        >
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-[18px] h-[18px] left-[3px] top-[3px] absolute">
              {copied ? (
                <svg
                  className="w-[18px] h-[18px] text-green-400 transition-all duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <DocumentDuplicateIcon
                  width={18}
                  height={18}
                  className="transition-all duration-200"
                />
              )}
            </div>
          </div>
          <div className="relative justify-start text-white text-xs font-bold font-['Hanken_Grotesk'] transition-all duration-200">
            {copied ? (
              <span className="flex items-center gap-1 text-green-400">
                Copied!
              </span>
            ) : (
              'Invite link'
            )}
          </div>
        </div>
      </div>
      <Statistics event={event} />
    </div>
  );
};

ManageGuests.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    type: PropTypes.string
  }).isRequired
};

export default ManageGuests;
