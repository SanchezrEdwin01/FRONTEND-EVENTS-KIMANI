import { useState, useCallback, useEffect } from 'react';
import { TicketCounterState, ExpandableState, SelectableState } from '../types';

interface UseTicketStateProps {
  type: string;
  availableTickets: number;
  maxGuestTickets: number;
  onChange: (quantity: number) => void;
}

export const useExpandable = (): ExpandableState => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  }, []);

  return { isExpanded, toggle };
};

export const useSelectable = (): SelectableState => {
  const [isSelected, setIsSelected] = useState(false);
  
  const toggle = useCallback(() => {
    setIsSelected(prev => !prev);
  }, []);

  return { isSelected, toggle };
};

export const useTicketCounter = ({ 
  type, 
  availableTickets, 
  maxGuestTickets,
  onChange 
}: UseTicketStateProps): TicketCounterState => {
  const [count, setCount] = useState(type === 'member' ? 1 : 0);

  useEffect(() => {
    if (type === 'member') {
      onChange(1);
    }
  }, []);

  const maxAllowed = type === 'member' 
    ? 1 
    : Math.min(maxGuestTickets, availableTickets);

  const increment = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (count < maxAllowed) {
      const newCount = count + 1;
      setCount(newCount);
      onChange(newCount);
    }
  }, [count, maxAllowed, onChange]);

  const decrement = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      onChange(newCount);
    }
  }, [count, onChange]);

  return { count, increment, decrement, maxAllowed };
}; 