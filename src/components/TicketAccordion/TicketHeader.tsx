import * as React from 'react';
import memberIcon from '@/assets/images/member-icon.svg';
import guestIcon from '@/assets/images/guest-icon.svg';
import expandIcon from '@/assets/images/expand.svg';
import collapseIcon from '@/assets/images/collapse.svg';

interface TicketHeaderProps {
  type: 'member' | 'guest';
  currency: '$' | '€';
  totalPrice: number;
  isExpanded: boolean;
  onExpandClick: (e: React.MouseEvent) => void;
  isFree?: boolean;
}

export const TicketHeader: React.FC<TicketHeaderProps> = ({
  type,
  currency,
  totalPrice,
  isExpanded,
  onExpandClick,
  isFree = false
}) => (
  <div className="ticket-main">
    <div className="ticket-info">
      <img 
        src={type === 'member' ? memberIcon : guestIcon} 
        alt={`${type} icon`} 
        className="type-icon"
      />
      <div className="ticket-text">
        <span className="ticket-type">{type === 'member' ? 'Member*' : 'Guest'}</span>
        {isFree ? (
          <span className="ticket-price">Free</span>
        ) : (
          <span className="ticket-price">{currency}{totalPrice.toFixed(2)}</span>
        )}
      </div>
    </div>
    
    {!isFree && (
      <img 
        src={isExpanded ? collapseIcon : expandIcon} 
        alt={isExpanded ? 'collapse' : 'expand'} 
        className="expand-icon"
        onClick={onExpandClick}
      />
    )}
  </div>
); 