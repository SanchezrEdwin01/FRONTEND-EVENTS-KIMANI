// src/containers/home/index.tsx
import { wrapErrorBoundary } from '@/hooks';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import EventListContainer from '@/components/EventListContainer';
import Filters from '@/components/Filters';
import { useNavigate } from 'react-router-dom';
import TabbedContent from '@/components/TabbedContent';
import { TAB_ALL, TAB_MY_EVENTS, TAB_SAVED_EVENTS } from '@/utils/constants';
import { useCreatedEvents, useEvents, useSavedEvents } from '@/hooks/useEvents';
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
    if (aMissing || bMissing) return aMissing && bMissing ? 0 : aMissing ? 1 : -1;
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

  const [eventState, setEventState] = useState<any[] | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<any[] | null>(null);
  const [tabId, setTabId] = useState(TAB_ALL);
  const navigate = useNavigate();

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

  // ✅ Poblar desde react-query cuando cambie `events`
  useEffect(() => {
    if (!events) return; // no limpies mientras carga: evita "No events found"
    const sorted = byStartDatePriority(events);
    setEventState(sorted);
    setFilteredEvents(sorted);
  }, [events]);

  // Items del menú contextual
  const onEditEvent = useCallback(() => {
    const id = ctxMenu.event?._id || ctxMenu.event?.id;
    if (!id) return; // ✅ evita navegar a /edit/undefined
    navigate(`/edit/${id}`);
  }, [ctxMenu.event, navigate]);

  const onDeleteEvent = useCallback(() => {
    const id = ctxMenu.event?._id || ctxMenu.event?.id;
    if (!id) return;
    if (confirm('Are you sure you want to delete this event?')) {
      console.log('Delete event:', id);
      // TODO: conectar delete API + refetch
    }
  }, [ctxMenu.event]);

  const menuItems: ContextMenuItem[] = useMemo(
    () => [
      { label: 'Edit event', onClick: onEditEvent },
      { label: 'Delete event', onClick: onDeleteEvent, danger: true },
    ],
    [onEditEvent, onDeleteEvent]
  );

  const handleFilteredEvents = useCallback((evts: any[]) => {
    setFilteredEvents(byStartDatePriority(evts));
  }, []);

  const updateEvents = useCallback((newEvents?: any[]) => {
    if (!newEvents) return;
    const sorted = byStartDatePriority(newEvents);
    setEventState(sorted);
    setFilteredEvents(sorted);
  }, []);

  // Cambio de pestañas: mantener lista previa mientras llegan nuevos datos
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
          default: {
            // Lista general
            const { data } = await fetchEvents();
            if (data) updateEvents(data);
            return;
          }
        }
        if (fetchedData?.data) updateEvents(fetchedData.data);
      } catch (error) {
        console.error('Failed to update events:', error);
      }
    },
    [fetchCreatedEvents, fetchSavedEvents, fetchEvents, updateEvents]
  );

  // Click derecho sobre cada Card
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
          eventState={eventState || []}
          onFilter={handleFilteredEvents}
          onReset={() => filteredEvents && setFilteredEvents(eventState || [])}
        />
        <TabbedContent onTabChange={handleTabChange} />
        <EventListContainer
          eventState={filteredEvents || []}
          isLoading={isLoading && !eventState} // muestra skeleton la primera vez
          onEventContextMenu={handleEventContextMenu}
        />
        {user && (
          <button
            onClick={() => navigate('/new-event')}
            className="fixed text-black bottom-20 right-4 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center z-50 cursor-pointer"
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

      <ContextMenu
        open={ctxMenu.open}
        x={ctxMenu.x}
        y={ctxMenu.y}
        items={menuItems}
        onClose={closeCtx}
      />
    </Layout>
  );
};

export default wrapErrorBoundary(Home);
