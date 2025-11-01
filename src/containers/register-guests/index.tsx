import * as React from 'react';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import { Event } from '@/types/event';
import ShowEventDateTime from '@/components/ShowEventDateTime';
import defaultEventImage from '@/assets/images/default-event.png';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Input from '@/components/Input';
import Separator from '@/components/Separator';
import Button from '@/components/Button';
import { useUser } from '@/context/UserContext';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRegisterGuests } from '@/hooks/useEventRegistration';
import { getDisplayImage } from '@/utils/utils';
import { useEvent } from '@/hooks/useEvents';
import ErrorScreen from '@/components/ErrorScreen';
import Loader from '@/components/Loader';
const TitleContainer = styled.section`
  margin: 0 auto;
  margin-bottom: 16px;
`;

const EventContainer = styled.section`
  position: relative;
  margin: 0 auto;
  background-color: #2e2c2c;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EventImage = styled.img`
  width: 335px;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
`;

const StyledEventDateTime = styled(ShowEventDateTime)`
  font-size: 16px;
`;

interface ViewRegisterGuestsProps {
  eventId?: string;
}

interface GuestInfo {
  name: string;
  phone: string;
  email: string;
  errors?: {
    name?: boolean;
    phone?: boolean;
    email?: boolean;
  };
}

interface MainContact {
  name: string;
  phone: string;
  email: string;
  errors?: {
    name?: boolean;
    phone?: boolean;
    email?: boolean;
  };
}

const GuestFormContainer = styled.div`
  margin: 24px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const GuestForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TicketSummary = styled.div`
  margin: 24px auto;
  border-radius: 8px;
  padding: 16px;
  color: white;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #fff;
  font-family: 'Hanken Grotesk';
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const TotalPrice = styled(SummaryItem)`
  border-top: 1px solid #444;
  margin-top: 16px;
  padding-top: 16px;
  font-weight: bold;
  font-size: 26px;
`;

const ButtonContainer = styled.div`
  margin: 0 auto;
  padding-bottom: 16px;
`;

interface TicketSelection {
  memberTickets: number;
  guestTickets: number;
  memberPrice: number;
  guestPrice: number;
  memberTicketFee?: number;
  memberProcessingFee?: number;
  guestTicketFee?: number;
  guestProcessingFee?: number;
  event?: Event;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email?.trim());
};

const validatePhone = (phone: string): boolean => {
  const cleanedNumber = phone.replace(/[^\d+]/g, '');

  if (cleanedNumber.startsWith('+')) {
    return cleanedNumber.length >= 9 && cleanedNumber.length <= 16;
  }

  return cleanedNumber.length >= 10 && cleanedNumber.length <= 15;
};

const formatPhoneNumber = (value: string) => {
  const cleanedNumber = value.replace(/[^\d+]/g, '');

  const formattedNumber = cleanedNumber.replace(/\+/g, (match, index) =>
    index === 0 ? match : ''
  );

  const maxLength = formattedNumber.startsWith('+') ? 16 : 15;
  const truncatedNumber = formattedNumber.slice(0, maxLength);

  if (truncatedNumber.startsWith('+')) {
    return truncatedNumber.replace(
      /(\+\d{1,3})(\d{1,3})?(\d{1,3})?(\d{1,4})?/,
      (match, p1, p2, p3, p4) => {
        let formatted = p1;
        if (p2) formatted += ' ' + p2;
        if (p3) formatted += ' ' + p3;
        if (p4) formatted += ' ' + p4;
        return formatted;
      }
    );
  } else {
    return truncatedNumber.replace(
      /(\d{3})(\d{3})?(\d{4})?/,
      (match, p1, p2, p3) => {
        let formatted = p1;
        if (p2) formatted += ' ' + p2;
        if (p3) formatted += ' ' + p3;
        return formatted;
      }
    );
  }
};

const validateName = (name: string): boolean => {
  const trimmedName = name.trim();
  const nameParts = trimmedName.split(' ');
  return nameParts.length >= 2 && trimmedName.length >= 3;
};

const StyledInput = styled(Input)<{ hasError?: boolean }>`
  font-family: 'HankenGrotesk', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  ${props =>
    props.hasError &&
    `
    border: 1px solid #ff4444;
    &:focus {
      border-color: #ff4444;
    }
  `}
`;

const RegisterGuests: React.FC<ViewRegisterGuestsProps> = ({
  eventId: propEventId
}) => {
  const { eventId: urlEventId } = useParams<{ eventId: string }>();
  const finalEventId = propEventId || urlEventId || '';
  const { data: event, isPending: loading, error } = useEvent(finalEventId);
    const { data } = useUser();
    const { user } = data || {};
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams();

  const [mainContact, setMainContactInformation] = useState<MainContact>({
    name: user?.username || '',
    phone: '',
    email: '',
    errors: {}
  });

  const { ticketSelection } = useMemo(
    () =>
      location.state
        ? (location.state as { ticketSelection: TicketSelection })
        : {
            ticketSelection: {
              memberTickets: 0,
              guestTickets: 0,
              memberPrice: 0,
              guestPrice: 0
            }
          },
    [location.state]
  );

  const totalGuests = useMemo(
    () => ticketSelection.guestTickets,
    [ticketSelection.guestTickets]
  );

  const [guestInfo, setGuestInfo] = React.useState<GuestInfo[]>(
    Array(totalGuests).fill({
      name: '',
      phone: '',
      email: '',
      errors: {}
    })
  );
  const [registered, setRegistered] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { mutate: registerGuests, isPending } = useRegisterGuests();

  const handleMainContactChange = useCallback(
    (field: keyof GuestInfo, value: string) => {
      const updatedContact = { ...mainContact };
      const updatedErrors = { ...updatedContact.errors } || {};

      if (field === 'name') {
        const formattedName = value
          .split(' ')
          .map(word => {
            if (!word) return '';
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(' ');
        updatedContact.name = formattedName;
        updatedErrors.name = !validateName(formattedName);
      } else if (field === 'phone') {
        const formattedPhone = formatPhoneNumber(value);
        updatedContact.phone = formattedPhone;
        updatedErrors.phone = !validatePhone(formattedPhone);
      } else {
        const trimmedEmail = value.trim();
        updatedContact.email = trimmedEmail;
        updatedErrors.email = !validateEmail(trimmedEmail);
      }

      updatedContact.errors = updatedErrors;
      setMainContactInformation(updatedContact);
    },
    [mainContact]
  );

  const handleGuestInfoChange = useCallback(
    (index: number, field: keyof GuestInfo, value: string) => {
      try {
        const newGuestInfo = [...guestInfo];
        const updatedGuest = { ...newGuestInfo[index] };
        const updatedErrors = { ...updatedGuest.errors };

        if (field === 'name') {
          const formattedName = value
            .split(' ')
            .map(word => {
              if (!word) return '';
              return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');

          updatedGuest.name = formattedName;
          updatedErrors.name = !validateName(formattedName);
        } else if (field === 'email') {
          const cleanedEmail = value
            .replace(/\s/g, '')
            .replace(/[^a-zA-Z0-9@._-]/g, '');

          updatedGuest.email = cleanedEmail;
          updatedErrors.email = !validateEmail(cleanedEmail);
        } else if (field === 'phone') {
          const formattedPhone = formatPhoneNumber(value);
          updatedGuest.phone = formattedPhone;
          updatedErrors.phone = !validatePhone(formattedPhone);
        }

        updatedGuest.errors = updatedErrors;
        newGuestInfo[index] = updatedGuest;
        setGuestInfo(newGuestInfo);
      } catch (error) {
        console.error('Error updating guest info:', error);
      }
    },
    [guestInfo]
  );

  const handleRegister = useCallback(async () => {
    let hasErrors = false;

    const updatedMainContact = { ...mainContact };
    updatedMainContact.errors = {
      name: !validateName(mainContact.name),
      email: !validateEmail(mainContact.email),
      phone: !validatePhone(mainContact.phone)
    };

    setMainContactInformation(updatedMainContact);

    const updatedGuestInfo = guestInfo.map(guest => ({
      ...guest,
      errors: {
        name: !validateName(guest.name),
        email: !validateEmail(guest.email),
        phone: !validatePhone(guest.phone)
      }
    }));

    const allGuests = [...guestInfo, mainContact];

    const emails = allGuests.map(guest => guest.email.trim().toLowerCase());
    const duplicateEmails = emails.filter(
      (email, index) => emails.indexOf(email) !== index && email !== ''
    );

    const phones = allGuests.map(guest => guest.phone.replace(/\s/g, ''));
    const duplicatePhones = phones.filter(
      (phone, index) => phones.indexOf(phone) !== index && phone !== ''
    );

    const names = allGuests.map(guest => guest.name.trim().toLowerCase());
    const duplicateNames = names.filter(
      (name, index) => names.indexOf(name) !== index && name !== ''
    );

    updatedGuestInfo.forEach((guest, index) => {
      if (duplicateEmails.includes(guest.email.trim().toLowerCase())) {
        guest.errors.email = true;
      }
      if (duplicatePhones.includes(guest.phone.replace(/\s/g, ''))) {
        guest.errors.phone = true;
      }
      if (duplicateNames.includes(guest.name.trim().toLowerCase())) {
        guest.errors.name = true;
      }
    });

    if (duplicateEmails.includes(mainContact.email.trim().toLowerCase())) {
      updatedMainContact.errors.email = true;
    }
    if (duplicatePhones.includes(mainContact.phone.replace(/\s/g, ''))) {
      updatedMainContact.errors.phone = true;
    }
    if (duplicateNames.includes(mainContact.name.trim().toLowerCase())) {
      updatedMainContact.errors.name = true;
    }

    setGuestInfo(updatedGuestInfo);
    setMainContactInformation(updatedMainContact);

    hasErrors = Object.values(updatedMainContact.errors).some(Boolean);
    updatedGuestInfo.forEach(guest => {
      if (Object.values(guest.errors).some(Boolean)) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      if (duplicateEmails.length > 0) {
        setFormError(
          'Duplicate email addresses found, each guest must have a unique email.'
        );
        setTimeout(() => setFormError(null), 3000);
        return;
      }
      if (duplicatePhones.length > 0) {
        setFormError(
          'Duplicate phone numbers found, each guest must have a unique phone number.'
        );
        setTimeout(() => setFormError(null), 3000);
        return;
      }
      if (duplicateNames.length > 0) {
        setFormError(
          'Duplicate names found, each guest must have a unique name.'
        );
        setTimeout(() => setFormError(null), 3000);
        return;
      }
      return;
    }

    setFormError(null);
    registerGuests(
      {
        eventId: eventId,
        guests: guestInfo.map(guest => ({
          name: guest.name.trim(),
          email: guest.email.trim(),
          phone: guest.phone.trim()
        })),
        contactInfo: {
          name: mainContact.name.trim(),
          email: mainContact.email.trim(),
          phone: mainContact.phone.trim(),
          is_main_contact: true
        }
      },
      {
        onSuccess: () => {
          setRegistered(true);
        },
        onError: error => {
          setFormError('Failed to register guests. Please try again.');
          setTimeout(() => setFormError(null), 3000);
        }
      }
    );
  }, [eventId, guestInfo, mainContact, registerGuests]);

  const memberTicketFee = useMemo(
    () => ticketSelection.memberTicketFee || 0,
    [ticketSelection.memberTicketFee]
  );
  const memberProcessingFee = useMemo(
    () => ticketSelection.memberProcessingFee || 0,
    [ticketSelection.memberProcessingFee]
  );
  const guestTicketFee = useMemo(
    () => ticketSelection.guestTicketFee || 0,
    [ticketSelection.guestTicketFee]
  );
  const guestProcessingFee = useMemo(
    () => ticketSelection.guestProcessingFee || 0,
    [ticketSelection.guestProcessingFee]
  );

  const memberTicketSubtotal = useMemo(
    () => ticketSelection.memberTickets * memberTicketFee,
    [ticketSelection.memberTickets, memberTicketFee]
  );
  const memberProcessingSubtotal = useMemo(
    () => ticketSelection.memberTickets * memberProcessingFee,
    [ticketSelection.memberTickets, memberProcessingFee]
  );
  const guestTicketSubtotal = useMemo(
    () => ticketSelection.guestTickets * guestTicketFee,
    [ticketSelection.guestTickets, guestTicketFee]
  );
  const guestProcessingSubtotal = useMemo(
    () => ticketSelection.guestTickets * guestProcessingFee,
    [ticketSelection.guestTickets, guestProcessingFee]
  );

  const totalTicketFees = useMemo(
    () => memberTicketSubtotal + guestTicketSubtotal,
    [memberTicketSubtotal, guestTicketSubtotal]
  );
  const totalProcessingFees = useMemo(
    () => memberProcessingSubtotal + guestProcessingSubtotal,
    [memberProcessingSubtotal, guestProcessingSubtotal]
  );
  const totalPrice = useMemo(
    () => totalTicketFees + totalProcessingFees,
    [totalTicketFees, totalProcessingFees]
  );

  const isFreeEvent = useMemo(
    () => event?.ticket_config?.is_paid === false,
    [event?.ticket_config?.is_paid]
  );

  const startDate = useMemo(
    () => (event?.start_date ? new Date(event.start_date) : new Date()),
    [event?.start_date]
  );
  const endDate = useMemo(
    () => (event?.end_date ? new Date(event.end_date) : new Date()),
    [event?.end_date]
  );

  const currencySymbol = useMemo(
    () => (event?.currency === 'euro' ? '€' : '$'),
    [event?.currency]
  );

  const eventImage = useMemo(() => {
    return event?.thumbnail && event?.thumbnail.length > 0
      ? getDisplayImage(event?.thumbnail, {
          width: 300,
          height: 300,
          dpr: 2,
          fit: 'cover'
        })
      : event?.gallery && event?.gallery.length > 0
        ? getDisplayImage(event?.gallery[0], {
            width: 300,
            height: 300,
            dpr: 2,
            fit: 'cover'
          })
        : '';
  }, [event?.thumbnail, event?.gallery]);

  if (loading) {
    return (
      <Layout hideHeader={false} hideFooter={true}>
        <Loader />
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <ErrorScreen
        title="Error loading event"
        message={error?.message || 'Event not found'}
        showHomeButton={true}
      />
    );
  }

  return (
    <Layout hideHeader={false} hideFooter={true}>
      <div className="w-[90%] max-w-[355px] mx-auto">
        <TitleContainer>
          <div className="justify-start text-white text-2xl font-medium font-['Playfair_Display']">
            Register for this event
          </div>
        </TitleContainer>
        <EventContainer>
          <EventImage
            src={eventImage}
            alt={event?.title || 'Event Image'}
            onError={e => {
              e.currentTarget.src = defaultEventImage;
            }}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="self-stretch justify-start text-white text-lg font-medium font-['Hanken_Grotesk'] leading-[22.93px]">
            {event?.title ||
              'Event Title For the Longest Name On The Application that will be two rows or three'}
            <br />
            <b>{event?.city || 'Miami'}</b>
          </div>
          <StyledEventDateTime startTime={startDate} endTime={endDate} />
        </EventContainer>
        <Separator />
        {!registered ? (
          <>
            <GuestFormContainer>
              <GuestForm>
                <div className="justify-start text-white text-lg font-semibold font-['Hanken_Grotesk']">
                  Main contact information
                </div>
                <StyledInput
                  placeholder="Name & Surname*"
                  value={mainContact?.name}
                  onChange={e =>
                    handleMainContactChange('name', e.target.value)
                  }
                  hasError={mainContact.errors?.name}
                />
                <StyledInput
                  placeholder="Mobile number*"
                  value={mainContact?.phone}
                  onChange={e =>
                    handleMainContactChange('phone', e.target.value)
                  }
                  hasError={mainContact.errors?.phone}
                />
                <StyledInput
                  type="email"
                  placeholder="Email*"
                  value={mainContact?.email}
                  onChange={e =>
                    handleMainContactChange('email', e.target.value)
                  }
                  hasError={mainContact.errors?.email}
                />
              </GuestForm>
              {Array.from({ length: totalGuests }).map((_, index) => (
                <GuestForm key={index}>
                  <div className="justify-start text-white text-lg font-semibold font-['Hanken_Grotesk']">
                    Guest {index + 1}
                  </div>
                  <StyledInput
                    placeholder="Name & Surname*"
                    value={guestInfo[index].name}
                    onChange={e =>
                      handleGuestInfoChange(index, 'name', e.target.value)
                    }
                    hasError={guestInfo[index].errors?.name}
                  />
                  <StyledInput
                    placeholder="Mobile number*"
                    value={guestInfo[index].phone}
                    onChange={e =>
                      handleGuestInfoChange(index, 'phone', e.target.value)
                    }
                    hasError={guestInfo[index].errors?.phone}
                  />
                  <StyledInput
                    type="email"
                    placeholder="Email*"
                    value={guestInfo[index].email}
                    onChange={e =>
                      handleGuestInfoChange(index, 'email', e.target.value)
                    }
                    hasError={guestInfo[index].errors?.email}
                  />
                </GuestForm>
              ))}
            </GuestFormContainer>
            <TicketSummary>
              {ticketSelection.memberTickets > 0 && (
                <>
                  <SummaryItem>
                    <span>{ticketSelection.memberTickets}x Member Tickets</span>
                    {memberTicketSubtotal > 0 && (
                      <span>
                        {currencySymbol}
                        {memberTicketSubtotal.toFixed(2)}
                      </span>
                    )}
                  </SummaryItem>
                  {!isFreeEvent && memberProcessingSubtotal > 0 && (
                    <SummaryItem>
                      <span>Member Processing Fees</span>
                      <span>
                        {currencySymbol}
                        {memberProcessingSubtotal.toFixed(2)}
                      </span>
                    </SummaryItem>
                  )}
                </>
              )}
              {ticketSelection.guestTickets > 0 && (
                <>
                  <SummaryItem>
                    <span>{ticketSelection.guestTickets}x Guest Tickets</span>
                    {guestTicketSubtotal > 0 && (
                      <span>
                        {currencySymbol}
                        {guestTicketSubtotal.toFixed(2)}
                      </span>
                    )}
                  </SummaryItem>
                  {!isFreeEvent && guestProcessingSubtotal > 0 && (
                    <SummaryItem>
                      <span>Guest Processing Fees</span>
                      <span>
                        {currencySymbol}
                        {guestProcessingSubtotal.toFixed(2)}
                      </span>
                    </SummaryItem>
                  )}
                </>
              )}
              {!isFreeEvent && totalPrice > 0 && (
                <TotalPrice>
                  <span>Total</span>
                  <span>
                    {currencySymbol}
                    {totalPrice.toFixed(2)}
                  </span>
                </TotalPrice>
              )}
              {event?.payment_type && (
                <>
                  <Separator />
                  <div className="justify-start text-white text-lg font-semibold font-['Hanken_Grotesk']">
                    <SummaryItem>Payment link</SummaryItem>
                    <span>
                      <a
                        href={event?.payment_type}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm !underline decoration-blue-500 decoration-2 underline-offset-4 !text-blue-500 !hover:text-blue-600"
                      >
                        Click here to be redirected to the payment page
                      </a>
                    </span>
                  </div>
                </>
              )}
            </TicketSummary>
            {formError && (
              <div className="text-red-500 text-center font-semibold font-['Hanken_Grotesk']">
                {formError}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col flex-1 w-full">
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
                      Registration Successful!
                    </h3>
                    <p className="text-gray-400 text-base font-normal font-['Hanken_Grotesk']">
                      You have successfully registered for this event.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Button
                    onClick={() => navigate(`/view/${eventId}`)}
                    className="w-full bg-[#2e2c2c] hover:bg-[#3e3c3c] text-white"
                  >
                    View Event
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    className="w-full bg-transparent border border-[#2e2c2c] hover:bg-[#2e2c2c]/20 text-white"
                  >
                    Go Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!registered && (
        <>
          <Separator />
          <div className="w-[90%] max-w-[355px] mx-auto">
            <ButtonContainer>
              <Button
                onClick={handleRegister}
                disabled={isPending}
                isLoading={isPending}
                className={error ? '!bg-red-500 !hover:bg-red-600' : ''}
              >
                {isPending
                  ? 'Registering...'
                  : error
                    ? 'Retry'
                    : isFreeEvent
                      ? 'Register'
                      : 'Pay'}
              </Button>
            </ButtonContainer>
          </div>
        </>
      )}
    </Layout>
  );
};

export default RegisterGuests;
