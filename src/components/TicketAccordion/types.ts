export interface TicketType {
  type: 'member' | 'guest';
}

export interface TicketPricing {
  currency: '$' | '€';
  ticketFee: number;
  processingFee: number;
}

export interface TicketAvailability {
  availableTickets: number;
  maxGuestTickets?: number;
}

export interface TicketCounterState {
  count: number;
  increment: (e: React.MouseEvent) => void;
  decrement: (e: React.MouseEvent) => void;
  maxAllowed: number;
}

export interface ExpandableState {
  isExpanded: boolean;
  toggle: (e: React.MouseEvent) => void;
}

export interface SelectableState {
  isSelected: boolean;
  toggle: () => void;
}

export interface PriceCalculation {
  calculateTotal: () => number;
} 