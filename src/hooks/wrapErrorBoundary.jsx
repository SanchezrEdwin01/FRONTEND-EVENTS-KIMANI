/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorScreen from '@/components/ErrorScreen';

export default function wrapErrorBoundary (Component) {
    return (props) => (
        <ErrorBoundary 
            fallback={({ error }) => (
                <ErrorScreen
                    title="Oops! Something went wrong"
                    message={error.message}
                    showHomeButton={true}
                />
            )}
        >
            <Component {...props} />
        </ErrorBoundary>
    );
}