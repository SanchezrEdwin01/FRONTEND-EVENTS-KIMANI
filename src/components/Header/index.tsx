import React from 'react';
import TabbedNavigation from '@/components/TabbedNavigation';
import { MenuOutline } from 'styled-icons/evaicons-outline';
import Dropdown from '@/components/Dropdown';
import { useBaseURL } from '@/hooks/useBaseURL';
import { useToken } from '@/hooks/useToken';
import { useMarketPlaceUrl } from '@/hooks/useMarketPlaceUrl';
import './index.scss';

export default function Header() {
  const BASE_URL = useBaseURL();

  return (
    <header id="main-header" className="header sticky-header">
      <div className="hero">
        <div
          className="logo"
          onClick={() => window.open(`${BASE_URL}/communities`, '_self')}
        >
          <picture>
            <source src="/assets/logo.svg" />
            <img
              src="https://community.kimanilife.com/assets/logo.webp"
              alt="Kimani Life"
            />
          </picture>
        </div>
        <div className="menu">
          <div className="items">
            <MenuOutline size="30" />
          </div>
          <Dropdown />
        </div>
      </div>

      <TabbedNavigation
        tabs={[
          {
            title: 'Local',
            onClick: () => window.open(`${BASE_URL}/communities`, '_self')
          },
          {
            title: 'Global',
            onClick: () => window.open(`${BASE_URL}/global`, '_self')
          },
          {
            title: 'Events',
            onClick: () => window.open(`${BASE_URL}/events`, '_self')
          },
          {
            title: 'Marketplace',
            onClick: () =>
              window.open(
                `${useMarketPlaceUrl()}/marketplace/portal?origin=${BASE_URL}&token=${useToken()}`,
                '_self'
              )
          },
          {
            title: 'Concierge',
            onClick: () => window.open(`${BASE_URL}/concierge/request`, '_self')
          },
          {
            title: 'Corporate',
            onClick: () => window.open(`${BASE_URL}/corporate`, '_self')
          },
          {
            title: 'Resident',
            onClick: () => window.open(`${BASE_URL}/resident`, '_self')
          }
        ]}
        active={'Events'}
      />
    </header>
  );
}
