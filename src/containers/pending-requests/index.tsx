import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import NavigationLayout from '@/components/NavigationLayout';
import { Event } from '@/types/event';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useParams } from 'react-router-dom';
import { useEventGuests } from '@/hooks/useEventGuests';
import { useEvent } from '@/hooks/useEvents';
import { generateFileURL } from '@/utils/utils';
import { useUpdateGuestsStatus } from '@/hooks/useUpdateGuestsStatus';
export default function PendingRequests() {
  const { eventId } = useParams();
  const { data: event } = useEvent(eventId);
  const { data: guests } = useEventGuests(eventId);
  const { mutate: updateGuestsStatus, isPending } = useUpdateGuestsStatus();
  const [processingGuestId, setProcessingGuestId] = useState<string | null>(
    null
  );

  const pendingGuests = useMemo(
    () => guests?.filter(guest => guest?.status === 'Pending') || [],
    [guests]
  );
  const groupedPendingGuests = useMemo(() => {
    const groups = pendingGuests?.reduce(
      (acc, guest) => {
        if (guest.plus_one_of) {
          if (!acc[guest.plus_one_of]) {
            acc[guest.plus_one_of] = {
              main_contact: null,
              additional_guests: [guest]
            };
          } else {
            acc[guest.plus_one_of].additional_guests.push(guest);
          }
        } else {
          if (!acc[guest._id]) {
            acc[guest._id] = {
              main_contact: guest,
              additional_guests: []
            };
          } else {
            acc[guest._id].main_contact = guest;
          }
        }
        return acc;
      },
      {} as Record<string, { main_contact: any; additional_guests: any[] }>
    );

    return Object.values(groups || {}).filter(group => group.main_contact);
  }, [pendingGuests]);

  const [openAccordion, setOpenAccordion] = React.useState<number | null>(null);

  const [checkedGuests, setCheckedGuests] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    if (pendingGuests) {
      const initialChecked = pendingGuests.reduce(
        (acc, guest) => {
          acc[guest._id] = true;
          return acc;
        },
        {} as Record<string, boolean>
      );
      setCheckedGuests(initialChecked);
    }
  }, [pendingGuests, guests]);

  const handleApprove = useCallback(
    guest => {
      if (processingGuestId) return;

      setProcessingGuestId(guest?.main_contact?._id);
      const guestUpdates = guest?.additional_guests?.map(_guest => ({
        guest_id: _guest?._id,
        status:
          checkedGuests[_guest?._id] === true
            ? checkedGuests[guest?.main_contact?._id] === true
              ? 'Approved'
              : 'Rejected'
            : 'Rejected'
      }));
      guestUpdates.push({
        guest_id: guest?.main_contact?._id,
        status:
          checkedGuests[guest?.main_contact?._id] === true
            ? 'Approved'
            : 'Rejected'
      });
      updateGuestsStatus(
        {
          eventId,
          guestUpdates
        },
        {
          onSettled: () => {
            setProcessingGuestId(null);
          }
        }
      );
    },
    [checkedGuests, eventId, updateGuestsStatus, processingGuestId]
  );

  const handleDecline = useCallback(
    guest => {
      if (processingGuestId) return;

      setProcessingGuestId(guest?.main_contact?._id);
      const guestUpdates = guest?.additional_guests?.map(_guest => ({
        guest_id: _guest?._id,
        status: checkedGuests[_guest?._id] ? 'Rejected' : 'Approved'
      }));
      guestUpdates.push({
        guest_id: guest?.main_contact?._id,
        status: checkedGuests[guest?.main_contact?._id]
          ? 'Rejected'
          : 'Approved'
      });
      updateGuestsStatus(
        {
          eventId,
          guestUpdates
        },
        {
          onSettled: () => {
            setProcessingGuestId(null);
          }
        }
      );
    },
    [checkedGuests, eventId, updateGuestsStatus, processingGuestId]
  );
  return (
    <NavigationLayout backUrl={`/view/${eventId}`} title="Pending requests">
      <div className="flex flex-col flex-1 w-full">
        <div className="flex-1 overflow-hidden p-4">
          <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
            {groupedPendingGuests && groupedPendingGuests?.length > 0 ? (
              groupedPendingGuests?.map((group, index) => {
                const { main_contact, additional_guests: guests } = group;
                if (!main_contact) return null;
                const mainContactAvatar =
                  (main_contact?.avatar &&
                    generateFileURL(main_contact.avatar)) ||
                  null;

                return (
                  <div className="flex flex-col w-full max-w-sm mx-auto mb-2">
                    <button
                      onClick={() =>
                        setOpenAccordion(openAccordion === index ? null : index)
                      }
                      className={`z-1 w-full p-2 bg-[#2e2c2c] rounded-[10px] border-[#dfdfec] inline-flex justify-start items-center gap-2
                    ${openAccordion === index ? 'rounded-t-lg' : 'rounded-lg'}`}
                    >
                      <div
                        className="relative w-6 h-6 mr-2"
                        onClick={e => {
                          e.stopPropagation();

                          const isChecked = checkedGuests[main_contact._id];
                          const updatedChecked = { ...checkedGuests };

                          updatedChecked[main_contact._id] = !isChecked;

                          guests?.forEach(guest => {
                            updatedChecked[guest._id] = !isChecked;
                          });

                          setCheckedGuests(updatedChecked);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checkedGuests[main_contact._id] ?? false}
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                        />
                        {checkedGuests[main_contact._id] ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            fill="none"
                            className="absolute top-0 left-0"
                          >
                            <path
                              d="M16 2.6665C8.63999 2.6665 2.66666 8.63984 2.66666 15.9998C2.66666 23.3598 8.63999 29.3332 16 29.3332C23.36 29.3332 29.3333 23.3598 29.3333 15.9998C29.3333 8.63984 23.36 2.6665 16 2.6665ZM12.3867 21.7198L7.59999 16.9332C7.07999 16.4132 7.07999 15.5732 7.59999 15.0532C8.11999 14.5332 8.95999 14.5332 9.47999 15.0532L13.3333 18.8932L22.5067 9.71984C23.0267 9.19984 23.8667 9.19984 24.3867 9.71984C24.9067 10.2398 24.9067 11.0798 24.3867 11.5998L14.2667 21.7198C13.76 22.2398 12.9067 22.2398 12.3867 21.7198Z"
                              fill="white"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            fill="none"
                            className="absolute top-0 left-0"
                          >
                            <path
                              d="M16 2.6665C8.62666 2.6665 2.66666 8.6265 2.66666 15.9998C2.66666 23.3732 8.62666 29.3332 16 29.3332C23.3733 29.3332 29.3333 23.3732 29.3333 15.9998C29.3333 8.6265 23.3733 2.6665 16 2.6665ZM16 26.6665C10.1067 26.6665 5.33332 21.8932 5.33332 15.9998C5.33332 10.1065 10.1067 5.33317 16 5.33317C21.8933 5.33317 26.6667 10.1065 26.6667 15.9998C26.6667 21.8932 21.8933 26.6665 16 26.6665Z"
                              fill="white"
                            />
                          </svg>
                        )}
                      </div>
                      {mainContactAvatar && (
                        <ImageWithFallback
                          data-placeholder="Off"
                          data-size="xs"
                          data-style="Circle"
                          className="w-6 h-6 rounded-[100px]"
                          src={mainContactAvatar}
                          alt={main_contact.name}
                        />
                      )}
                      <div className="justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
                        {main_contact.name}
                      </div>
                      <div
                        className={`ml-auto transform transition-transform duration-200 ${openAccordion === index ? 'rotate-180' : ''}`}
                      >
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
                            d="M20.7071 7.29289C21.0976 7.68342 21.0976 8.31658 20.7071 8.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L3.29289 8.70711C2.90237 8.31658 2.90237 7.68342 3.29289 7.29289C3.68342 6.90237 4.31658 6.90237 4.70711 7.29289L12 14.5858L19.2929 7.29289C19.6834 6.90237 20.3166 6.90237 20.7071 7.29289Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </button>
                    <div
                      className={`-mt-2 z-0 overflow-hidden transition-all duration-200 ${
                        openAccordion === index ? 'max-h-[500px]' : 'max-h-0'
                      }`}
                    >
                      <div className="px-2 py-1 bg-[#2e2c2c] rounded-b-lg text-white">
                        <div className="w-full self-stretch inline-flex justify-between items-start">
                          <div className="justify-start text-white text-base font-semibold font-['Hanken_Grotesk']">
                            Email
                          </div>
                          <div className="justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
                            {main_contact.email}
                          </div>
                        </div>
                        <div className="w-full self-stretch inline-flex justify-between items-start">
                          <div className="justify-start text-white text-base font-semibold font-['Hanken_Grotesk']">
                            Phone number
                          </div>
                          <div className="justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
                            {main_contact.phone}
                          </div>
                        </div>
                        <div className="w-full self-stretch inline-flex justify-between items-start">
                          <div className="justify-start text-white text-base font-semibold font-['Hanken_Grotesk']">
                            Type of ticket
                          </div>
                          <div className="justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
                            {event?.ticket_config?.is_paid === true
                              ? 'Paid'
                              : 'Free'}
                          </div>
                        </div>
                        {guests?.length > 0 && (
                          <div className="w-full self-stretch p-1 rounded-lg flex flex-col justify-start items-start gap-2">
                            <div className="w-full self-stretch inline-flex justify-between items-start">
                              <div className="justify-start text-white text-base font-semibold font-['Hanken_Grotesk']">
                                Guests
                              </div>
                              <div className="justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
                                {guests?.length}
                              </div>
                            </div>
                            <div className="self-stretch inline-flex justify-center items-start">
                              <div className="justify-start text-white text-base font-semibold font-['Hanken_Grotesk']">
                                Guest information
                              </div>
                            </div>
                            {guests?.map(guest => (
                              <div className="self-stretch p-1 opacity-70 bg-[#515151] rounded-lg flex flex-col justify-start items-start gap-2">
                                <div className="self-stretch inline-flex justify-between items-start">
                                  <div className="flex items-center">
                                    <div
                                      className="relative w-6 h-6 mr-2 cursor-pointer"
                                      onClick={e => {
                                        setCheckedGuests({
                                          ...checkedGuests,
                                          [guest._id]: !checkedGuests[guest._id]
                                        });
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={
                                          checkedGuests[guest._id] ?? false
                                        }
                                        className="absolute opacity-0 w-full h-full cursor-pointer"
                                      />
                                      {checkedGuests[guest._id] ? (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 32 32"
                                          fill="none"
                                          className="absolute top-0 left-0"
                                        >
                                          <path
                                            d="M16 2.6665C8.63999 2.6665 2.66666 8.63984 2.66666 15.9998C2.66666 23.3598 8.63999 29.3332 16 29.3332C23.36 29.3332 29.3333 23.3598 29.3333 15.9998C29.3333 8.63984 23.36 2.6665 16 2.6665ZM12.3867 21.7198L7.59999 16.9332C7.07999 16.4132 7.07999 15.5732 7.59999 15.0532C8.11999 14.5332 8.95999 14.5332 9.47999 15.0532L13.3333 18.8932L22.5067 9.71984C23.0267 9.19984 23.8667 9.19984 24.3867 9.71984C24.9067 10.2398 24.9067 11.0798 24.3867 11.5998L14.2667 21.7198C13.76 22.2398 12.9067 22.2398 12.3867 21.7198Z"
                                            fill="white"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 32 32"
                                          fill="none"
                                          className="absolute top-0 left-0"
                                        >
                                          <path
                                            d="M16 2.6665C8.62666 2.6665 2.66666 8.6265 2.66666 15.9998C2.66666 23.3732 8.62666 29.3332 16 29.3332C23.3733 29.3332 29.3333 23.3732 29.3333 15.9998C29.3333 8.6265 23.3733 2.6665 16 2.6665ZM16 26.6665C10.1067 26.6665 5.33332 21.8932 5.33332 15.9998C5.33332 10.1065 10.1067 5.33317 16 5.33317C21.8933 5.33317 26.6667 10.1065 26.6667 15.9998C26.6667 21.8932 21.8933 26.6665 16 26.6665Z"
                                            fill="white"
                                          />
                                        </svg>
                                      )}
                                    </div>
                                    <div className="justify-start text-white text-base font-semibold font-['Hanken_Grotesk']">
                                      {guest.name}
                                    </div>
                                  </div>
                                  <div className="justify-start text-white text-base font-semibold font-['Hanken_Grotesk']">
                                    {guest.email}
                                  </div>
                                </div>
                                <div className="self-stretch text-right justify-start text-white text-base font-medium font-['Hanken_Grotesk']">
                                  {guest.phone}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="m-2 w-full inline-flex justify-end items-center gap-1">
                          <div
                            className={`p-2 bg-[#06be15] rounded-[10px] border-[#dfdfec] flex justify-start items-center gap-2 ${
                              processingGuestId === group?.main_contact?._id
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer hover:bg-[#06be15]/80'
                            } transition-all duration-200`}
                            onClick={() =>
                              !processingGuestId && handleApprove(group)
                            }
                          >
                            <div className="justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
                              {processingGuestId === group?.main_contact?._id
                                ? 'Processing...'
                                : 'Approve'}
                            </div>
                          </div>
                          <div
                            className={`p-2 bg-[#2e2c2c] rounded-[10px] border-[#dfdfec] flex justify-start items-center gap-2 ${
                              processingGuestId === group?.main_contact?._id
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer hover:bg-red-500'
                            } transition-all duration-200`}
                            onClick={() =>
                              !processingGuestId && handleDecline(group)
                            }
                          >
                            <div className="justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
                              {processingGuestId === group?.main_contact?._id
                                ? 'Processing...'
                                : 'Decline'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full p-2 inline-flex justify-start items-center gap-3">
                No pending requests
              </div>
            )}
          </div>
        </div>
      </div>
    </NavigationLayout>
  );
}
