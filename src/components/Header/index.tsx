import React from 'react';
import TabbedNavigation from '@/components/TabbedNavigation';
import { MenuOutline } from 'styled-icons/evaicons-outline';
import Dropdown from '@/components/Dropdown';
import { useBaseURL } from '@/hooks/useBaseURL';
import './index.scss';

const Header = () => {
  const BASE_URL = useBaseURL();

  return (
    <header className="header">
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
            title: 'Corporate',
            onClick: () => window.open(`${BASE_URL}/corporate`, '_self')
          },
          {
            title: 'Resident',
            onClick: () => window.open(`${BASE_URL}/resident`, '_self')
          },

          {
            title: 'Events',
            onClick: () => window.open(`${BASE_URL}/events`, '_self')
          },
          {
            title: 'Marketplace',
            onClick: () =>
              window.open(
                'https://www.kimanilife.com/service-providers',
                '_self'
              )
          },
          {
            title: 'Concierge',
            onClick: () =>
              window.open('https://www.kimanilife.com/concierge', '_self')
          }
        ]}
        active={'Events'}
      />
    </header>
  );
};
export default Header;
