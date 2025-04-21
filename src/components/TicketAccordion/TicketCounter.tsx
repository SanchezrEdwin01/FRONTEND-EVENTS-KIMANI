import * as React from 'react';
import { TicketType } from './types';
import ticketIcon from '../../assets/images/ticket.svg';

interface TicketCounterProps extends TicketType {
  ticketCount: number;
  maxAllowedTickets: number;
  availableTickets: number;
  onIncrement: (e: React.MouseEvent) => void;
  onDecrement: (e: React.MouseEvent) => void;
}

export const TicketCounter: React.FC<TicketCounterProps> = ({
  ticketCount,
  maxAllowedTickets,
  onIncrement,
  onDecrement
}) => (
  <div className="ticket-counter pb-[3px]" onClick={e => e.stopPropagation()}>
    <button
      className="counter-button minus"
      onClick={onDecrement}
      disabled={ticketCount === 0}
    >
      -
    </button>
    <div className="ticket-wrapper">
      <img src={ticketIcon} alt="ticket" className="ticket-icon" />
      <span className="count">{ticketCount}</span>
    </div>
    <button
      className="counter-button plus"
      onClick={onIncrement}
      disabled={ticketCount === maxAllowedTickets}
    >
      +
    </button>
  </div>
);
