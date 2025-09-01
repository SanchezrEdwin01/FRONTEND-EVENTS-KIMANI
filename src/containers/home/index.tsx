import { wrapErrorBoundary } from '@/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import EventListContainer from '@/components/EventListContainer';
import Filters from '@/components/Filters';
import { useNavigate } from 'react-router-dom';
import TabbedContent from '@/components/TabbedContent';
import { TAB_ALL, TAB_MY_EVENTS, TAB_SAVED_EVENTS } from '@/utils/constants';
import { useCreatedEvents, useEvents, useSavedEvents } from '@/hooks/useEvents';
import { useUser } from '@/context/UserContext';

const getStartTime = (e: any) => {
  const s = e?.start_date ?? e?.startDate;
  const t = s ? Date.parse(s) : NaN;
  return Number.isFinite(t) ? t : NaN;
};

const byStartDatePriority = (list: any[] = []) => {
  const now = Date.now();
  return [...(list || [])].sort((a, b) => {
    const ta = getStartTime(a);
    const tb = getStartTime(b);

    const aMissing = !Number.isFinite(ta);
    const bMissing = !Number.isFinite(tb);
    if (aMissing || bMissing)
      return aMissing && bMissing ? 0 : aMissing ? 1 : -1;

    const aPast = ta < now;
    const bPast = tb < now;
    if (aPast !== bPast) return aPast ? 1 : -1;

    return aPast ? tb - ta : ta - tb;
  });
};

const Home = () => {
  const { data: events, isLoading, refetch: fetchEvents } = useEvents(true);
  const { user } = useUser();
  const { refetch: fetchSavedEvents } = useSavedEvents(false);
  const { refetch: fetchCreatedEvents } = useCreatedEvents(false);
  const [eventState, setEventState] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [tabId, setTabId] = useState(TAB_ALL);
  const navigate = useNavigate();
  useEffect(() => {
    const initializeEvents = async () => {
      const { data: fetchedEvents } = await fetchEvents();
      if (fetchedEvents) {
        const sorted = byStartDatePriority(fetchedEvents);
        setEventState(sorted);
        setFilteredEvents(sorted);
      }
    };
    initializeEvents();
  }, []);
  const updateEvents = useCallback((newEvents?: any[]) => {
    const sorted = byStartDatePriority(newEvents || []);
    setEventState(sorted);
    setFilteredEvents(sorted);
  }, []);
  useEffect(() => {
    const hydrateEvents = async () => {
      try {
        let fetchedData;

        switch (tabId) {
          case TAB_SAVED_EVENTS:
            fetchedData = await fetchSavedEvents();
            break;
          case TAB_MY_EVENTS:
            fetchedData = await fetchCreatedEvents();
            break;
          default:
            updateEvents(events);
            return;
        }

        if (fetchedData?.data) {
          updateEvents(fetchedData.data);
        }
      } catch (error) {
        console.error('Failed to hydrate events:', error);
      }
    };

    hydrateEvents();
  }, [events, tabId, updateEvents]);
  const handleFilteredEvents = useCallback((evts: any[]) => {
    setFilteredEvents(byStartDatePriority(evts));
  }, []);
  const handleTabChange = useCallback(
    async (newTabId: string) => {
      setTabId(newTabId);
      try {
        let fetchedData;

        switch (newTabId) {
          case TAB_SAVED_EVENTS:
            fetchedData = await fetchSavedEvents();
            break;
          case TAB_MY_EVENTS:
            fetchedData = await fetchCreatedEvents();
            break;
          default:
            updateEvents(events);
            return;
        }

        if (fetchedData?.data) {
          updateEvents(fetchedData.data);
        }
      } catch (error) {
        console.error('Failed to update events:', error);
      }
    },
    [events, updateEvents]
  );
  return (
    <Layout hideHeader={false} hideFooter={false}>
      <section>
        <Filters
          eventState={eventState}
          onFilter={handleFilteredEvents}
          onReset={() => setFilteredEvents(eventState)}
        />
        <TabbedContent onTabChange={handleTabChange} />
        <EventListContainer eventState={filteredEvents} isLoading={isLoading} />
        {user && (
          <button
            onClick={() => navigate('/new-event')}
            className="fixed text-black bottom-20 right-4 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center z-50 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7 0C7.55228 0 8 0.447715 8 1V6H13C13.5523 6 14 6.44772 14 7C14 7.55228 13.5523 8 13 8H8V13C8 13.5523 7.55228 14 7 14C6.44772 14 6 13.5523 6 13V8H1C0.447715 8 0 7.55228 0 7C0 6.44772 0.447715 6 1 6H6V1C6 0.447715 6.44772 0 7 0Z"
                fill="black"
              />
            </svg>
          </button>
        )}
      </section>
    </Layout>
  );
};
export default wrapErrorBoundary(Home);
