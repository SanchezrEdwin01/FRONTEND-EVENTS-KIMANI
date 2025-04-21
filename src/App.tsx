import React, { lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Context from '@/context';
import { withSuspense } from '@/hooks/index';
import { UserProvider, useUser } from './context/UserContext';
import { QueryProvider } from './providers/query-provider';
import './styles/index.css';
import './styles/index.scss';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Loader from '@/components/Loader';

// For now
const NewEventPage = withSuspense(lazy(() => import('@/containers/new-event')));
const HomePage = withSuspense(lazy(() => import('@/containers/home')));
const EventsPage = withSuspense(lazy(() => import('@/containers/events')));
const ViewEventPage = withSuspense(
  lazy(() => import('@/containers/view-event'))
);
const RegisterGuestsPage = withSuspense(
  lazy(() => import('./containers/register-guests'))
);
const EditEventPage = withSuspense(
  React.lazy(() => import('@/containers/edit-event'))
);
const PendingRequests = withSuspense(
  React.lazy(() => import('@/containers/pending-requests'))
);
const BlastAMessage = withSuspense(
  React.lazy(() => import('@/containers/blast-a-message'))
);
const InviteGuests = withSuspense(
  React.lazy(() => import('@/containers/invite-guests'))
);
const ApprovedGuests = withSuspense(
  React.lazy(() => import('@/containers/approved-guests'))
);
const ManageHosts = withSuspense(
  React.lazy(() => import('@/containers/manage-hosts'))
);
const ManagePayments = withSuspense(
  React.lazy(() => import('@/containers/manage-payments'))
);

function AppRoutes() {
  const { isLoading } = useUser();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Context>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />

        {/* Protected Routes */}
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

        <Route path="/view/:eventId" element={<ViewEventPage />} />

        <Route
          path="/register-guests/:eventId"
          element={<RegisterGuestsPage />}
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {import.meta.env.DEV && <ReactQueryDevtools />}
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
