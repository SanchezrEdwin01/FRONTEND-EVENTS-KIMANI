import * as React from 'react';
import { TicketType, TicketPricing } from './types';

interface TicketDetailsProps extends TicketType, TicketPricing {
  availableTickets: number;
}

export const TicketDetails: React.FC<TicketDetailsProps> = ({
  type,
  currency,
  ticketFee,
  processingFee,
  availableTickets
}) => (
  <div className="ticket-details">
    <div className="price-includes">
      <h3>Price Includes:</h3>
      <div className="fee-item">
        <span>Ticket Fee</span>
        <span>{currency}{ticketFee.toFixed(2)}</span>
      </div>
      <div className="fee-item">
        <span>Processing Fee</span>
        <span>{currency}{processingFee.toFixed(2)}</span>
      </div>
    </div>
    <div className="availability">
      <span>{availableTickets} {type} tickets available for purchase</span>
    </div>
  </div>
); 