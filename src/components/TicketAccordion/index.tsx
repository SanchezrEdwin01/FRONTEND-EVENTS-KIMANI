import * as React from 'react';
import { TicketHeader } from './TicketHeader';
import { TicketCounter } from './TicketCounter';
import { TicketDetails } from './TicketDetails';
import { TicketType, TicketPricing, TicketAvailability } from './types';
import './styles.scss';
import { useExpandable, useSelectable, useTicketCounter } from './hooks/useTicketState';
import { useMemo } from 'react';

interface TicketAccordionProps extends TicketType, TicketPricing, TicketAvailability {
  onQuantityChange: (quantity: number) => void;
}

const TicketAccordion: React.FC<TicketAccordionProps> = ({
  type,
  currency,
  ticketFee,
  processingFee,
  availableTickets,
  maxGuestTickets = 1,
  onQuantityChange
}) => {
  const expandable = useExpandable();
  const selectable = useSelectable();
  const ticketCounter = useTicketCounter({
    type,
    availableTickets,
    maxGuestTickets,
    onChange: onQuantityChange
  });

  const totalPrice = useMemo(() => ticketFee + processingFee, [ticketFee, processingFee]);
  const isFree = useMemo(() => totalPrice === 0, [totalPrice]);

  return (
    <div 
      className={`ticket-accordion ${selectable.isSelected ? 'active' : ''}`} 
      onClick={selectable.toggle}
    >
      <TicketHeader
        type={type}
        currency={currency}
        totalPrice={totalPrice}
        isExpanded={expandable.isExpanded}
        onExpandClick={expandable.toggle}
        isFree={isFree}
      />

      {expandable.isExpanded && !isFree && (
        <TicketDetails
          currency={currency}
          ticketFee={ticketFee}
          processingFee={processingFee}
          availableTickets={availableTickets}
          type={type}
        />
      )}

      {availableTickets > 0 ? (
        <TicketCounter
          type={type}
          ticketCount={ticketCounter.count}
          maxAllowedTickets={ticketCounter.maxAllowed}
          onIncrement={ticketCounter.increment}
          onDecrement={ticketCounter.decrement}
          availableTickets={availableTickets}
        />
      ) : (
        <div className="sold-out-message">
          Sorry! All tickets are taken, but we appreciate your interest.
        </div>
      )}
    </div>
  );
};

export default TicketAccordion;

