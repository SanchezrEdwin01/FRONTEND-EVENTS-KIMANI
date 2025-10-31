import { wrapErrorBoundary } from '@/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import EventListContainer from '@/components/EventListContainer';
import Filters from '@/components/Filters';
import { useNavigate } from 'react-router-dom';
import TabbedContent from '@/components/TabbedContent';
import { TAB_ALL, TAB_MY_EVENTS, TAB_SAVED_EVENTS } from '@/utils/constants';
import {
  useCreatedEvents,
  useEvents,
  useSavedEvents,
  useDeleteEvent,
} from '@/hooks/useEvents';
import { useUser } from '@/context/UserContext';
import ContextMenu, { ContextMenuItem } from '@/components/ContextMenu';

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
  // Nota: useEvents(true) hidrata el listado inicial.
  const { data: events, isLoading, refetch: fetchEvents } = useEvents(true);
  const { user } = useUser();
  const { refetch: fetchSavedEvents } = useSavedEvents(false);
  const { refetch: fetchCreatedEvents } = useCreatedEvents(false);

  const [eventState, setEventState] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [tabId, setTabId] = useState(TAB_ALL);
  const navigate = useNavigate();

  const { mutateAsync: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  // --- Context menu state
  const [ctxMenu, setCtxMenu] = useState<{
    open: boolean;
    x: number;
    y: number;
    event: any | null;
  }>({ open: false, x: 0, y: 0, event: null });

  const openCtx = useCallback((x: number, y: number, eventData: any) => {
    setCtxMenu({ open: true, x, y, event: eventData });
  }, []);

  const closeCtx = useCallback(() => {
    setCtxMenu((s) => ({ ...s, open: false }));
  }, []);

  const goToEventEditor = useCallback(
    (id: string) => navigate(`/event-editor/${id}`),
    [navigate]
  );

  // Handlers del menú contextual
  const onEditEvent = useCallback(() => {
    if (!ctxMenu.event?._id) return;
    closeCtx();
    goToEventEditor(ctxMenu.event._id);
  }, [ctxMenu.event, goToEventEditor, closeCtx]);

  const onDeleteEvent = useCallback(async () => {
    const evt = ctxMenu.event;
    if (!evt?._id) return;
    closeCtx();

    const ok = window.confirm(`Delete the event "${evt.title || 'Untitled'}"?`);
    if (!ok) return;

    try {
      // 1) Optimista
      setFilteredEvents((prev) => prev.filter((e) => e._id !== evt._id));
      setEventState((prev) => prev.filter((e) => e._id !== evt._id));
      // 2) API
      await deleteEvent(evt._id);
      // 3) Refetch según pestaña
      if (tabId === TAB_SAVED_EVENTS) {
        const res = await fetchSavedEvents();
        if (res?.data) {
          const sorted = byStartDatePriority(res.data);
          setEventState(sorted);
          setFilteredEvents(sorted);
        }
      } else if (tabId === TAB_MY_EVENTS) {
        const res = await fetchCreatedEvents();
        if (res?.data) {
          const sorted = byStartDatePriority(res.data);
          setEventState(sorted);
          setFilteredEvents(sorted);
        }
      } else {
        const res = await fetchEvents();
        if (res?.data) {
          const sorted = byStartDatePriority(res.data);
          setEventState(sorted);
          setFilteredEvents(sorted);
        }
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
      const res =
        tabId === TAB_SAVED_EVENTS
          ? await fetchSavedEvents()
          : tabId === TAB_MY_EVENTS
          ? await fetchCreatedEvents()
          : await fetchEvents();
      if (res?.data) {
        const sorted = byStartDatePriority(res.data);
        setEventState(sorted);
        setFilteredEvents(sorted);
      }
      alert('Could not delete the event. Please try again.');
    }
  }, [
    ctxMenu.event,
    closeCtx,
    deleteEvent,
    tabId,
    fetchSavedEvents,
    fetchCreatedEvents,
    fetchEvents,
  ]);

  const menuItems: ContextMenuItem[] = [
    { label: 'Edit event', onClick: onEditEvent },
    { label: isDeleting ? 'Deleting…' : 'Delete event', onClick: onDeleteEvent, danger: true },
  ];

  // --- Carga / tabs
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [events, tabId, updateEvents, fetchCreatedEvents, fetchSavedEvents]);

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
    [events, updateEvents, fetchCreatedEvents, fetchSavedEvents]
  );

  const handleEventContextMenu = useCallback(
    (e: React.MouseEvent, evtData: any) => {
      e.preventDefault();
      e.stopPropagation();
      openCtx(e.clientX, e.clientY, evtData);
    },
    [openCtx]
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
        {/* Nota: la uniformidad de tamaño y nitidez de imágenes ya se logra
            con el Card (fit cover + dpr=2) y con el upload 1080×1080 */}
        <EventListContainer
          eventState={filteredEvents}
          isLoading={isLoading}
          onEventContextMenu={handleEventContextMenu}
        />
        {user && (
          <button
            onClick={() => navigate('/new-event')}
            className="fixed text-black bottom-20 right-4 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center z-50 cursor-pointer"
            type="button"
            aria-label="Create new event"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7 0C7.55228 0 8 0.447715 8 1V6H13C13.5523 6 14 6.44772 14 7C14 7.55228 13.5523 8 13 8H8V13C8 13.5523 7.55228 14 7 14C6.44772 14 6 13.5523 6 13V8H1C0.447715 8 0 7.55228 0 7C0 6.447715 0.447715 6 1 6H6V1C6 0.447715 6.44772 0 7 0Z"
                fill="black"
              />
            </svg>
          </button>
        )}
      </section>

      {/* Menú contextual global */}
      <ContextMenu open={ctxMenu.open} x={ctxMenu.x} y={ctxMenu.y} items={menuItems} onClose={closeCtx} />
    </Layout>
  );
};

export default wrapErrorBoundary(Home);
