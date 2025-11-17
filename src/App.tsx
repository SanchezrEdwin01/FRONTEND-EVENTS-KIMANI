import React, { lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Context from '@/context';
import { withSuspense } from '@/hooks/index';
import { UserProvider } from './context/UserContext';
import { QueryProvider } from './providers/query-provider';
import './styles/index.css';
import './styles/index.scss';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Loader from '@/components/Loader';

// Pages (lazy)
const NewEventPage = withSuspense(lazy(() => import('@/containers/new-event')));
const HomePage = withSuspense(lazy(() => import('@/containers/home')));
const EventsPage = withSuspense(lazy(() => import('@/containers/events')));
const ViewEventPage = withSuspense(lazy(() => import('@/containers/view-event')));
const RegisterGuestsPage = withSuspense(lazy(() => import('./containers/register-guests')));
const EditEventPage = withSuspense(lazy(() => import('@/containers/edit-event')));
const PendingRequests = withSuspense(lazy(() => import('@/containers/pending-requests')));
const BlastAMessage = withSuspense(lazy(() => import('@/containers/blast-a-message')));
const InviteGuests = withSuspense(lazy(() => import('@/containers/invite-guests')));
const ApprovedGuests = withSuspense(lazy(() => import('@/containers/approved-guests')));
const ManageHosts = withSuspense(lazy(() => import('@/containers/manage-hosts')));
const ManagePayments = withSuspense(lazy(() => import('@/containers/manage-payments')));
const EventEditorPage = withSuspense(lazy(() => import('@/containers/event-editor')));

function AppRoutes() {
  return (
    <Context>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/view/:eventId" element={<ViewEventPage />} />
        <Route path="/register-guests/:eventId" element={<RegisterGuestsPage />} />
        {/* 🔓 pública temporalmente */}
        <Route path="/event-editor/:eventId" element={<EventEditorPage />} />

        {/* Protected */}
        <Route
          path="/new-event"
          element={
            <ProtectedRoute requireAuth>
              <NewEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:eventId"
          element={
            <ProtectedRoute requireAuth>
              <EditEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-hosts/:eventId"
          element={
            <ProtectedRoute requireAuth>
              <ManageHosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pending-requests/:eventId"
          element={
            <ProtectedRoute requireAuth>
              <PendingRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blast-a-message/:eventId"
          element={
            <ProtectedRoute requireAuth>
              <BlastAMessage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invite-guests/:eventId"
          element={
            <ProtectedRoute requireAuth>
              <InviteGuests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/approved-guests/:eventId"
          element={
            <ProtectedRoute requireAuth>
              <ApprovedGuests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-payments/:eventId"
          element={
            <ProtectedRoute requireAuth>
              <ManagePayments />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </Context>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </QueryProvider>
  );
}
