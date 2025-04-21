import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import './index.scss';
import React, { memo } from 'react';
import { useUser } from '@/context/UserContext';
import UserIcon from '../UserIcon';
import { BASE_URL } from '@/utils/constants';

const Footer = () => {
  const { user } = useUser();
  return (
    <footer>
      <div className="navigation">
        <a href={`${BASE_URL}/`}>
          <button>
            <HomeIcon alt="Home" height={24} />
            <span>Home</span>
          </button>
        </a>
        <a href={`${BASE_URL}/search`}>
          <button>
            <MagnifyingGlassIcon alt="Search" height={24} />
            <span>Search</span>
          </button>
        </a>
        <a href={`${BASE_URL}/settings`}>
          <button>
            <UserIcon
              target={user}
              size={50}
              status={true}
              style={{
                marginTop: '-12px',
                background: '#020202',
                borderTopLeftRadius: '100%',
                borderTopRightRadius: '100%'
              }}
            />
          </button>
        </a>
        <a href={`${BASE_URL}/friends`}>
          <button>
            <UserPlusIcon alt="friends" height={24} />
            <span>Friends</span>
          </button>
        </a>
        <a href={`${BASE_URL}/members`}>
          <button>
            <UserGroupIcon alt="members" height={24} />
            <span>Members</span>
          </button>
        </a>
      </div>
    </footer>
  );
};

export default memo(Footer);
