import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import CancelEventModal from '@/components/CancelEventModal';
import { menuOptions } from './options';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useDeleteEvent } from '@/hooks/useEvents';
const ManageEvent = ({ event }) => {
  const [isCancelEventModalOpen, setIsCancelEventModalOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate: deleteEvent } = useDeleteEvent();

  const handleOpenCancelEventModal = useCallback(() => {
    setIsCancelEventModalOpen(true);
  }, []);

  const handleCancelEvent = useCallback(() => {
    deleteEvent(event._id);
    navigate('/');
  }, [deleteEvent, event._id, navigate]);

  const handleOptionClick = useCallback(
    ({ option, event }) => {
      if (option.isModal) {
        handleOpenCancelEventModal();
      } else {
        option.action({ event, navigate });
      }
    },
    [handleOpenCancelEventModal, navigate]
  );

  return (
    <>
      <div className="flex flex-col">
        <div className="pb-3 text-white text-xl font-medium font-['Playfair_Display']">
          Manage event
        </div>
        <div className="self-stretch inline-flex justify-start items-center gap-3 flex-wrap content-center mb-4">
          {menuOptions.map((option, index) => (
            <div
              key={index}
              onClick={() =>
                !option.disabled && handleOptionClick({ option, event })
              }
              className={cn(option.wrapperClassName, 'cursor-pointer', {
                'w-[100px] h-20 px-1 py-0.5 bg-[#2e2c2c] rounded-[10px] backdrop-blur-[8.90px] inline-flex flex-col justify-center items-center gap-[18px]':
                  !option.wrapperClassName,
                'opacity-50 cursor-not-allowed': option.disabled
              })}
            >
              <div className="w-6 h-6 relative overflow-hidden">
                <div
                  className={cn({
                    'text-[#ce5959]': option.variant === 'danger'
                  })}
                >
                  {<option.icon />}
                </div>
              </div>
              <div
                className={cn([
                  option.buttonClassName,
                  {
                    "self-stretch relative text-center justify-start text-white text-xs font-bold font-['Hanken_Grotesk']":
                      !option.buttonClassName,
                    'text-[#ce5959]': option.variant === 'danger'
                  }
                ])}
              >
                {option.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <CancelEventModal
        isOpen={isCancelEventModalOpen}
        onClose={() => setIsCancelEventModalOpen(false)}
        onCancel={handleCancelEvent}
      />
    </>
  );
};

ManageEvent.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    type: PropTypes.string
  }).isRequired
};

export default ManageEvent;
