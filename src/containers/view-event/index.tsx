import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState, useCallback, useEffect } from 'react';
import Layout from '@/components/Layout';
import EventImageWithActions from '@/components/EventImageWithActions';
import EventTag from '@/components/EventTag';
import ShowEventDateTime from '@/components/ShowEventDateTime';
import Separator from '@/components/Separator';
import RoleBadge from '@/components/RoleBadge';
import MapLocation from '@/components/MapLocation';
import TicketAccordion from '@/components/TicketAccordion';
import Button from '@/components/Button';
import { Event } from '@/types/event';
import { useUser } from '@/context/UserContext';
import Loader from '@/components/Loader';
import ManageGuests from './components/ManageGuests/index';
import ManageEvent from './components/ManageEvent/index';
import { EventType } from '@/components/EventTag/types';
import { getDisplayImage, generateFileURL, getAllImages } from '@/utils/utils';
import ErrorScreen from '@/components/ErrorScreen';
import { useEvent, useSaveEvent } from '@/hooks/useEvents';
import { PLATFORM_URL } from '@/utils/constants';

interface ViewEventPageProps {
  eventId?: string;
}

interface TicketPricing {
  ticketFee: number;
  processingFee: number;
  availableTickets: number;
  maxTickets?: number;
}

interface TicketPricingConfig {
  member: TicketPricing;
  guest: TicketPricing;
}

interface TicketSelection {
  memberTickets: number;
  guestTickets: number;
  pricing: {
    member: number;
    guest: number;
  };
}

interface TicketRegistrationData {
  memberTickets: number;
  guestTickets: number;
  memberPrice: number;
  guestPrice: number;
  memberTicketFee: number;
  memberProcessingFee: number;
  guestTicketFee: number;
  guestProcessingFee: number;
  event: Event;
  requiresPlusOneInfo: boolean;
}

type TicketType = 'member' | 'guest';

const MONTHS = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
} as const;

const StyledLayout = {
  EventContainer: styled.div`
    position: relative;
    margin: 0 auto;
    height: 100%;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
  `,

  Section: styled.section`
    display: flex;
    flex-direction: column;
  `
};

const Typography = {
  SectionTitle: styled.h2`
    font-family:
      font-[ 'HankenGrotesk'],
      sans-serif;
    font-size: 20px;
  `,

  Area: styled.h3`
    font-family:
      font-[ 'HankenGrotesk'],
      sans-serif;
    font-size: 16px;
  `,

  EventDetails: styled.p`
    font-family:
      font-[ 'HankenGrotesk'],
      sans-serif;
    font-size: 16px;
  `
};

const Sections = {
  Location: styled(StyledLayout.Section)`
    .map-container {
      height: 100px;
      width: 100%;
      margin: 8px 0;
    }

    ${Typography.SectionTitle} {
      margin-bottom: 8px;
    }

    ${Typography.Area} {
      margin-bottom: 8px;
    }

    ${Separator} {
      margin: 16px 0;
    }

    @media (min-width: 768px) {
      .map-container {
        height: 250px;
      }
    }
  `
};

const DateUtils = {
  parseEventDate: (dateString: string): Date => {
    if (!dateString) return new Date();

    try {
      if (dateString.includes(',')) {
        const [day, monthStr, year] = dateString.replace(',', '').split(' ');

        return new Date(
          parseInt(year),
          MONTHS[monthStr as keyof typeof MONTHS],
          parseInt(day)
        );
      }

      return new Date(dateString);
    } catch (e) {
      console.error('Error parsing date:', e);
      return new Date();
    }
  }
};

const TicketUtils = {
  calculateProcessingFee: (
    price: string,
    feePercentage: string | number | null
  ): number => {
    const numericPrice = parseFloat(price);
    const numericFeePercentage =
      feePercentage === null
        ? 0
        : typeof feePercentage === 'string'
          ? parseFloat(feePercentage)
          : feePercentage;

    if (isNaN(numericPrice) || isNaN(numericFeePercentage)) {
      return 0;
    }

    return (numericPrice * numericFeePercentage) / 100;
  }
};

const EventUtils = {
  getEventTypeLabel: (eventType: string): EventType => {
    switch (eventType) {
      case 'MembersEvent':
        return 'Member Event';
      case 'KimaniEvent':
        return 'Kimani Event';
      default:
        return 'Other Event';
    }
  },

  getRoleText: (isPaid: boolean, isFirstManager: boolean): string => {
    if (isFirstManager) {
      return isPaid ? 'Hosted by' : 'Managed by';
    }
    return isPaid ? 'Co-Hosted by' : 'Co-Managed by';
  },

  getSponsorRoleText: (isFirstSponsor: boolean): string => {
    return isFirstSponsor ? 'Sponsored by' : 'Co-Sponsored by';
  }
};

const ViewEventPage: React.FC<ViewEventPageProps> = ({
  eventId: propEventId
}) => {
  const { eventId: urlEventId } = useParams<{ eventId: string }>();
  const finalEventId = propEventId || urlEventId || '';
  const navigate = useNavigate();

  const { data: event, isPending: loading, error } = useEvent(finalEventId);
  const saveEvent = useSaveEvent();

  const { user } = useUser();

  const [showTickets, setShowTickets] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [ticketSelection, setTicketSelection] = useState<TicketSelection>({
    memberTickets: 0,
    guestTickets: 0,
    pricing: {
      member: 0,
      guest: 0
    }
  });

  const isHost = useMemo(
    () =>
      Boolean(
        (user && event?.sponsors?.includes(user?._id)) ||
          event?.hosts?.includes(user?._id) ||
          (event?.created_by && user?._id == event?.created_by) ||
          false
      ),
    [event, user]
  );

  const isPaid = useMemo(() => Boolean(event?.ticket_config?.is_paid), [event]);

  const allImages = useMemo(
    () => getAllImages(event?.thumbnail, event?.gallery),
    [event]
  );

  const handleNextImage = useCallback(() => {
    if (!allImages || allImages.length <= 1) return;

    setCurrentImageIndex(prevIndex =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [allImages]);

  const handlePrevImage = useCallback(() => {
    if (!allImages || allImages.length <= 1) return;

    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  }, [allImages]);

  const handleFavorite = useCallback(async (): Promise<void> => {
    try {
      await saveEvent.mutate(finalEventId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [finalEventId, saveEvent]);

  const ticketPricing = useMemo<TicketPricingConfig>(() => {
    if (!event?.ticket_config) {
      return {
        member: {
          ticketFee: 0,
          processingFee: 0,
          availableTickets: 0
        },
        guest: {
          ticketFee: 0,
          processingFee: 0,
          availableTickets: 0,
          maxTickets: 0
        }
      };
    }

    const { ticket_config } = event;
    const isPaid = Boolean(ticket_config.is_paid);
    const processingFeePercentage =
      ticket_config.processing_fee_percentage || '0';

    const memberPrice = isPaid
      ? parseFloat(ticket_config.member_price || '0')
      : 0;
    const memberProcessingFee = isPaid
      ? TicketUtils.calculateProcessingFee(
          ticket_config.member_price || '0',
          processingFeePercentage
        )
      : 0;

    const guestPrice = isPaid
      ? parseFloat(ticket_config.non_member_price || '0')
      : 0;
    const guestProcessingFee = isPaid
      ? TicketUtils.calculateProcessingFee(
          ticket_config.non_member_price || '0',
          processingFeePercentage
        )
      : 0;

    return {
      member: {
        ticketFee: memberPrice,
        processingFee: memberProcessingFee,
        availableTickets: ticket_config.member_max_tickets || 1
      },
      guest: {
        ticketFee: guestPrice,
        processingFee: guestProcessingFee,
        availableTickets: ticket_config.non_member_max_tickets || 1,
        maxTickets: event.allow_plus_one_amount || 1
      }
    };
  }, [event]);

  useEffect(() => {
    setTicketSelection(prev => ({
      ...prev,
      pricing: {
        member:
          ticketPricing.member.ticketFee + ticketPricing.member.processingFee,
        guest: ticketPricing.guest.ticketFee + ticketPricing.guest.processingFee
      }
    }));
  }, [ticketPricing]);

  const handleTicketSelection = useCallback(
    (type: TicketType, quantity: number) => {
      setTicketSelection(prev => ({
        ...prev,
        [type === 'member' ? 'memberTickets' : 'guestTickets']: quantity
      }));
    },
    []
  );

  const handleRegister = useCallback(() => {
    if (!event) return;

    const registrationData: TicketRegistrationData = {
      memberTickets: ticketSelection.memberTickets,
      guestTickets: ticketSelection.guestTickets,
      memberPrice: ticketSelection.pricing.member,
      guestPrice: ticketSelection.pricing.guest,
      memberTicketFee: ticketPricing.member.ticketFee,
      memberProcessingFee: ticketPricing.member.processingFee,
      guestTicketFee: ticketPricing.guest.ticketFee,
      guestProcessingFee: ticketPricing.guest.processingFee,
      event: event as unknown as Event,
      requiresPlusOneInfo: Boolean(
        (event as unknown as EventType).requires_plus_one_info
      )
    };

    navigate(`/register-guests/${event._id}`, {
      state: { ticketSelection: registrationData }
    });
  }, [navigate, ticketSelection, event, ticketPricing]);

  const renderTicketSection = () => {
    if (!event?.allow_plus_one) {
      return null;
    }

    if (!showTickets) {
      return (
        <>
          <Separator />
          <div className="w-[90%] max-w-[600px] mx-auto px-[0px]">
            <Button onClick={() => setShowTickets(true)}>
              <span>{isPaid ? 'Request to join' : 'Register for free'}</span>
            </Button>
          </div>
        </>
      );
    }

    const maxGuestTicketsPerUser = event?.allow_plus_one_amount || 1;

    const availableGuestTickets =
      event?.ticket_config?.non_member_max_tickets ?? maxGuestTicketsPerUser;

    const availableMemberTickets =
      event?.ticket_config?.member_max_tickets ?? 1;

    const currencySymbol = event?.currency === 'euro' ? '€' : '$';

    return (
      <div className="pb-[5%]">
        <div className="w-[90%] max-w-[600px] mx-auto flex flex-col gap-2 justify-center items-center">
          <TicketAccordion
            key="member"
            type="member"
            currency={currencySymbol}
            ticketFee={ticketPricing.member.ticketFee}
            processingFee={ticketPricing.member.processingFee}
            availableTickets={availableMemberTickets}
            onQuantityChange={qty => handleTicketSelection('member', qty)}
          />

          <TicketAccordion
            key="guest"
            type="guest"
            currency={currencySymbol}
            ticketFee={ticketPricing.guest.ticketFee}
            processingFee={ticketPricing.guest.processingFee}
            availableTickets={availableGuestTickets}
            maxGuestTickets={maxGuestTicketsPerUser}
            onQuantityChange={qty => handleTicketSelection('guest', qty)}
          />
        </div>
        <Separator />
        <div className="w-[90%] max-w-[600px] mx-auto">
          <Button
            onClick={handleRegister}
            disabled={ticketSelection.memberTickets === 0}
          >
            <span>{isPaid ? 'Register' : 'Register for free'}</span>
          </Button>
        </div>
      </div>
    );
  };

  const renderPeopleSection = () => {
    if (!event) return null;
    if (!event?.hosts?.length && !event?.sponsors?.length) return null;
    return (
      <StyledLayout.Section>
        <Separator />
        <div className="mb-2 self-stretch justify-start text-white text-xl font-medium font-['Playfair_Display']">
          {isHost ? 'Organizer' : 'People'}
        </div>
        {/* Render managers */}
        {event?.hosts?.map((host, index) => {
          const _host = event?.host_details?.find(h => h.id === host);
          const memberAvatar =
            (_host?.avatar && generateFileURL(_host.avatar)) || null;
          return (
            <RoleBadge
              profilePicture={memberAvatar}
              key={`manager-${index}`}
              text={EventUtils.getRoleText(isPaid, index === 0)}
              userName={_host?.username}
            />
          );
        })}
        {/* Render sponsors */}
        {event?.sponsors?.map((sponsor, index) => {
          const _sponsor = event?.sponsor_details?.find(s => s.id === sponsor);
          const sponsorAvatar =
            (_sponsor?.avatar && generateFileURL(_sponsor.avatar)) || null;
          return (
            <RoleBadge
              key={`sponsor-${index}`}
              text={EventUtils.getSponsorRoleText(index === 0)}
              userName={_sponsor?.username}
              profilePicture={sponsorAvatar}
            />
          );
        })}
      </StyledLayout.Section>
    );
  };

  const renderLocationSection = () => {
    if (!event || event?.hide_address) return null;

    const eventData = event as unknown as EventType;
    const addressParts = [];

    if (eventData.address) addressParts.push(eventData.address);
    if (eventData.area) addressParts.push(eventData.area);
    if (eventData.city) addressParts.push(eventData.city);

    const fullAddress = addressParts.join(', ');

    if (!fullAddress) return null;

    return (
      <Sections.Location>
        <Separator />
        <div className="self-stretch justify-start text-white text-xl font-medium font-['Playfair_Display']">
          Location
        </div>
        <div className="mt-2 w-full justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
          {eventData.area || 'Not Specified'}
        </div>
        {eventData.address && (
          <div className="w-full justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
            {eventData.address}
          </div>
        )}
        <MapLocation
          address={fullAddress}
          eventTitle={eventData.title}
          city={eventData.city}
        />
      </Sections.Location>
    );
  };

  const renderDescriptionSection = () => {
    if (!event) return null;

    const defaultDescription =
      "You're invited to this event! 📅 Details will be shared soon. If you have any questions, feel free to reach out to the organizer.";

    return (
      <section>
        <Separator />
        <div className="self-stretch justify-start text-white text-xl font-medium font-['Playfair_Display']">
          Event Description
        </div>
        <div className="mt-2 self-stretch justify-start text-white text-base font-normal font-['Hanken_Grotesk']">
          {event.description || defaultDescription}
        </div>
      </section>
    );
  };

  const renderAttachmentsSection = () => {
    if (!event?.attachments?.length) return null;

    return (
      <>
        <Separator />
        <StyledLayout.Section>
          <div className="self-stretch justify-start text-white text-xl font-medium font-['Playfair_Display']">
            Attachments
          </div>
          <ul className="mt-2">
            {event?.attachments!.map((attachment, index) => {
              const attachmentUrl = generateFileURL({
                tag: 'events',
                _id: attachment
              });
              if (!attachmentUrl) return null;
              return (
                <li key={index} className="mb-1">
                  <a
                    href={attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="!text-blue-600 hover:underline self-stretch justify-start text-base font-normal
          font-['Hanken_Grotesk']"
                  >
                    Attachment {index + 1}
                  </a>
                </li>
              );
            })}
          </ul>
        </StyledLayout.Section>
      </>
    );
  };

  const displayImage =
    useMemo(
      () =>
        allImages.length > 0
          ? getDisplayImage(allImages[currentImageIndex], {
              width: 500,
              height: 500,
              dpr: 2,
              fit: 'cover'
            })
          : '',
      [allImages, currentImageIndex]
    ) || '';

  const startDate = DateUtils.parseEventDate(event?.start_date);
  const endDate = DateUtils.parseEventDate(event?.end_date);

  const eventTypeLabel = EventUtils.getEventTypeLabel(event?.event_type);

  if (loading) {
    return (
      <Layout hideHeader={false} hideFooter={true}>
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
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
      <StyledLayout.EventContainer className="w-[90%] max-w-[500px] mx-auto mb-[100px] px-[0px] pt-[2%] pb-[5%]">
        <EventImageWithActions
          imageUrl={displayImage || ''}
          onFavorite={handleFavorite}
          eventTitle={event.title}
          isSaved={event?.is_saved}
          eventUrl={`${PLATFORM_URL}/view/${event._id}`}
          hasMultipleImages={Boolean(allImages && allImages?.length > 1)}
          onNextImage={handleNextImage}
          onPrevImage={handlePrevImage}
        />

        <section>
          <EventTag eventType={eventTypeLabel} className="mt-4 mb-1" />
          <div className="self-stretch justify-start text-white text-2xl font-medium font-['Playfair_Display']">
            {event?.title}
            {event?.title && event?.city && <br />}
            {event?.city}
          </div>
          <ShowEventDateTime startTime={startDate} endTime={endDate} />

          {isHost && <ManageGuests event={event} />}
        </section>

        {renderPeopleSection()}
        {renderLocationSection()}
        {renderDescriptionSection()}
        {renderAttachmentsSection()}

        {isHost ? (
          <>
            <Separator />
            <ManageEvent event={event} />
          </>
        ) : (
          renderTicketSection()
        )}
      </StyledLayout.EventContainer>
    </Layout>
  );
};

ViewEventPage.propTypes = {
  eventId: PropTypes.string
};

export default ViewEventPage;
