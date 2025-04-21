import { wrapErrorBoundary } from '@/hooks';
import React from 'react';
import Layout from '@/components/Layout';
const EventsPage = () => {
    return (
        <Layout hideFooter>
            <section>
                <h1>Events</h1>
                <div style={{margin: '50px 0'}}>
                    <a href="/new-event">
                        New Event
                    </a>
                </div>
            </section>
        </Layout>
    )
}
export default wrapErrorBoundary(EventsPage);