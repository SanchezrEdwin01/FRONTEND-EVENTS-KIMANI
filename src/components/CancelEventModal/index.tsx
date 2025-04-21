import * as React from 'react';
import Modal from '@/components/Modal';

interface CancelEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
}

const CancelEventModal: React.FC<CancelEventModalProps> = ({
  isOpen,
  onClose,
  onCancel
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      position="bottom"
      width="100%"
      maxWidth="100%"
      borderRadius="16px 16px 0 0"
      verticalPosition="bottom"
    >
      <div className="w-full items-center p-3 bg-[#202222] shadow-[0px_-1px_4.300000190734863px_0px_rgba(170,170,170,0.30)] inline-flex flex-col justify-center items-start gap-6">
        <div className="w-full flex flex-col justify-start items-center">
          <div className="self-stretch inline-flex justify-end items-center gap-2.5">
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-[18px] h-[18px] left-[3px] top-[3px] absolute" />
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch relative text-center justify-start text-white text-xl font-semibold font-['Hanken_Grotesk']">
              Cancel your event
            </div>
            <div className="self-stretch relative text-center justify-start text-white text-base font-medium font-['Hanken_Grotesk'] leading-tight">
              We will notify the guests that event has been canceled{' '}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <div
            data-hierarchy="Primary"
            data-size="md"
            data-state="Default"
            className="self-stretch px-4 py-2.5 bg-[#ce5959] rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer"
            onClick={onCancel}
          >
            <div>Cancel event</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CancelEventModal;
