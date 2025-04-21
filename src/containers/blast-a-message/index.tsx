import * as React from 'react';
import NavigationLayout from '@/components/NavigationLayout';
import Separator from '@/components/Separator';
import Button from '@/components/Button';
import { useParams } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { useStatusMessage } from '@/hooks/useStatusMessage';

export default function BlastAMessage() {
  const { eventId } = useParams();
  const [message, setMessage] = useState('');
  const { mutate: sendMessage, isPending } = useStatusMessage();

  const [recipients, setRecipients] = React.useState({
    Approved: false,
    Pending: false,
    Rejected: false
  });

  const [successfullySent, setSuccessfullySent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecipientChange = useCallback(
    (category: keyof typeof recipients) => {
      setRecipients(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    },
    []
  );

  const handleSendMessage = () => {
    if (!message.trim() || !eventId) return;

    const selectedStatuses = Object.entries(recipients)
      .filter(([_, isSelected]) => isSelected)
      .map(([status]) => status);

    if (selectedStatuses.length === 0) return;

    setError(null);
    sendMessage(
      {
        eventId,
        messageData: {
          statuses: selectedStatuses as (
            | 'Approved'
            | 'Pending'
            | 'Rejected'
            | 'All'
          )[],
          message: message.trim()
        }
      },
      {
        onSuccess: () => {
          setMessage('');
          setRecipients({ Approved: false, Pending: false, Rejected: false });
          setSuccessfullySent(true);
        },
        onError: error => {
          console.error('Failed to send message:', error);
          setError('Failed to send message. Please try again.');
          setTimeout(() => setError(null), 3000);
        }
      }
    );
  };

  const handleReturnToForm = () => {
    setSuccessfullySent(false);
  };

  return (
    <NavigationLayout
      backUrl={`/view/${eventId}`}
      title="Blast a message"
      onBack={null}
    >
      <div className="flex flex-col flex-1 w-full">
        {!successfullySent ? (
          <>
            <div className="flex-1 overflow-hidden p-4">
              <div className="mb-4 space-y-2">
                <div className="text-sm text-[#aaaaaa] mb-2">Send to:</div>
                {Object.entries(recipients).map(([key, checked]) => (
                  <label
                    key={key}
                    className="flex items-center space-x-2 text-[#aaaaaa] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        handleRecipientChange(key as keyof typeof recipients)
                      }
                      className="accent-primary"
                    />
                    <span className="capitalize">{key} guests</span>
                  </label>
                ))}
              </div>

              <textarea
                placeholder="Share a message with the guests..."
                className="w-full bg-transparent text-[#aaaaaa] text-base font-light font-['Hanken_Grotesk'] leading-snug resize-none focus:outline-none"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
            <Separator />
            <div className="w-[90%] max-w-[600px] mx-auto pb-4">
              <Button
                onClick={handleSendMessage}
                disabled={
                  !Object.values(recipients).some(Boolean) ||
                  !message.trim() ||
                  isPending
                }
                className={error ? '!bg-red-500 !hover:bg-red-600' : ''}
                isLoading={isPending}
              >
                {isPending ? 'Sending...' : error ? 'Retry' : 'Send'}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-hidden p-4">
            <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-white text-xl font-semibold font-['Hanken_Grotesk'] mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-400 text-base font-normal font-['Hanken_Grotesk']">
                    Your message has been sent to the selected recipients.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Button
                  onClick={handleReturnToForm}
                  className="w-full bg-[#2e2c2c] hover:bg-[#3e3c3c] text-white"
                >
                  Send Another Message
                </Button>
                <Button
                  onClick={() => window.history.back()}
                  className="w-full bg-transparent border border-[#2e2c2c] hover:bg-[#2e2c2c]/20 text-white"
                >
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NavigationLayout>
  );
}
