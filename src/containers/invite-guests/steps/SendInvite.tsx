import React, { useCallback, useState } from 'react';
import ImageWithFallback from '@/components/ImageWithFallback';
import Separator from '@/components/Separator';
import Button from '@/components/Button';
import { useUser } from '@/context/UserContext';
import { generateFileURL } from '@/utils/utils';
import { useBulkMessage } from '@/hooks/useBulkMessage';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
export default function SendInvite({
  members,
  onSuccess
}: {
  members: any[];
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const { eventId } = useParams();
  const [personalMessages, setPersonalMessages] = React.useState<{
    [key: string]: string;
  }>({});
    const { data } = useUser();
    const { user } = data || {};
  const { mutate: sendInvite, isPending } = useBulkMessage();
  const [successfullySent, setSuccessfullySent] =
    React.useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleMessageChange = useCallback(
    (memberId: string, message: string) => {
      setPersonalMessages(prev => ({
        ...prev,
        [memberId]: message
      }));
    },
    []
  );

  const areMessagesValid = useCallback(() => {
    if (Object.keys(personalMessages).length === 0) return false;

    return Object.values(personalMessages).every(
      message => message.trim().length > 0
    );
  }, [personalMessages]);

  const handleSendInvite = useCallback(() => {
    setError(null);
    sendInvite(
      {
        eventId: eventId,
        messages: members.map(member => {
          if (!personalMessages[member?._id]) {
            return {
              user_id: member._id
            };
          }
          return {
            user_id: member._id,
            content: personalMessages[member?._id] || ''
          };
        })
      },
      {
        onSuccess: () => {
          setSuccessfullySent(true);
          setPersonalMessages({});
          queryClient.setQueryData(['events', eventId], oldData => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              invited_count:
                (oldData?.invited_count || 0) +
                Object.keys(personalMessages).length
            };
          });
        },
        onError: error => {
          console.error('Failed to send invites:', error);
          setError('Failed to send invites. Please try again.');
          setTimeout(() => setError(null), 3000);
        }
      }
    );
  }, [personalMessages, eventId, sendInvite, areMessagesValid]);

  const handleReturnToList = () => {
    setSuccessfullySent(false);
    onSuccess();
  };

  return (
    <>
      {!successfullySent && (
        <div className="flex-1 overflow-hidden p-4">
          <div className="flex flex-col gap-3 w-full max-w-sm mx-auto pb-[80px]">
            {members?.map((member, index) => {
              const memberAvatar =
                (member?.avatar && generateFileURL(member.avatar)) || null;
              return (
                <div
                  key={index}
                  className="flex flex-col gap-[31px] items-center justify-between"
                >
                  <div className="w-full p-2 bg-[#2e2c2c] rounded-[10px] border-[#dfdfec] inline-flex justify-start items-center gap-2 cursor-pointer">
                    <ImageWithFallback
                      data-placeholder="Off"
                      data-size="xs"
                      data-style="Circle"
                      className="w-6 h-6 rounded-[100px]"
                      src={memberAvatar}
                      alt={member.username}
                    />
                    <div className="flex-1 justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
                      {member.username}
                    </div>
                  </div>
                  <div className="w-full h-[89px] px-4 py-2 bg-[#2e2c2c] rounded-[10px] border-[#dfdfec] inline-flex flex-col justify-center items-center gap-2">
                    <div className="self-stretch justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
                      {user?.username || 'The host'} invited you to the Event
                    </div>
                    <input
                      type="text"
                      value={personalMessages[member._id] || ''}
                      onChange={e =>
                        handleMessageChange(member._id, e.target.value)
                      }
                      placeholder="Write your personal invite here"
                      className={`self-stretch bg-transparent text-base font-normal font-['Hanken_Grotesk'] outline-none border-none ${
                        personalMessages[member._id]
                          ? 'text-white'
                          : 'text-[#515151]'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {successfullySent && (
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
                  Invites Sent Successfully!
                </h3>
                <p className="text-gray-400 text-base font-normal font-['Hanken_Grotesk']">
                  All invites have been sent to the selected members.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Button
                onClick={handleReturnToList}
                className="w-full bg-[#2e2c2c] hover:bg-[#3e3c3c] text-white"
              >
                Send More Invites
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
      {!successfullySent && (
        <>
          <div className="w-full z-2 fixed bottom-0 left-0 bg-[#151616]">
            <Separator noMargin />
            <div className="w-[90%] max-w-[600px] mx-auto pb-4">
              <Button
                onClick={handleSendInvite}
                disabled={isPending}
                className={error ? '!bg-red-500 !hover:bg-red-600' : ''}
                isLoading={isPending}
              >
                {isPending ? 'Sending...' : error ? 'Retry' : 'Send'}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
