
import {
  CalendarIcon,
  HeartIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { TAB_ALL, TAB_MY_EVENTS, TAB_SAVED_EVENTS } from '@/utils/constants';
export const defaultTabs = [
  { id: TAB_ALL, label: 'Explore', icon: <CalendarIcon width={24} /> },
];

export const defaultTabsWithUser = [
  { id: TAB_ALL, label: 'Explore', icon: <CalendarIcon width={24} /> },
  { id: TAB_MY_EVENTS, label: 'My Events', icon: <HeartIcon width={24} /> },
  { id: TAB_SAVED_EVENTS, label: 'Saved Events', icon: <BookmarkIcon width={24} /> }
];

