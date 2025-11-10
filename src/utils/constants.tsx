// TODO: Make these configurable
export const BASE_URL_KEY = 'base_url';
export const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'https://community.kimanilife.com';
export const API_URL =
  import.meta.env.VITE_API_URL || 'https://community.kimanilife.com/api';
export const AUTUMN_API_URL =
  import.meta.env.VITE_AUTUMN_API_URL ||
  'https://community.kimanilife.com/autumn';
export const PLATFORM_URL = `${BASE_URL}/events`;
export const EVENT_TYPE_ALL = 'all';
export const EVENT_TYPE_KIMANI = 'KimaniEvent';
export const EVENT_TYPE_MEMBER = 'MembersEvent';
export const EVENT_TYPE_OTHER = 'Other';
export const TAB_MY_EVENTS = 'my_events';
export const TAB_SAVED_EVENTS = 'saved_events';
export const TAB_ALL = 'all';
export const TYPES = [
  {
    name: 'All events',
    value: EVENT_TYPE_ALL
  },
  {
    name: 'Kimani Events',
    value: EVENT_TYPE_KIMANI
  },
  {
    name: 'Member Events',
    value: EVENT_TYPE_MEMBER
  },
  {
    name: 'Other Events',
    value: EVENT_TYPE_OTHER
  }
];

export const PORTAL_URL = import.meta.env.VITE_PORTAL_URL ||"https://marketplace.kimanilife.com";
export const DEFAULT_SERVER_ID =
  import.meta.env.VITE_DEFAULT_SERVER_ID || '01HP41709DFJP1DRSTSA88J81A';
export const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  'AIzaSyAHFo6a0yqcyCnr1nZn4n65GF1DzVcb6uY';