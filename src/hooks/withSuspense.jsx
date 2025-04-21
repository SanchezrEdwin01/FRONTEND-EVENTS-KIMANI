/* eslint-disable react/jsx-props-no-spreading */
import React, { Suspense } from 'react';
import Loader from '@/components/Loader';

export default function withSuspense (LazyComponent) {
    return (props) => (
        <Suspense fallback={<Loader />}>
            <LazyComponent {...props} />
        </Suspense>
    );
}