import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import { defaultTabs, defaultTabsWithUser } from './tabs';
import { useUser } from '@/context/UserContext';

const TabbedContent = ({ tabs = defaultTabs, onTabChange }) => {
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useUser();
  const currentTabs = user ? defaultTabsWithUser : tabs;

  const handleTabClick = useCallback(
    tabId => {
      setActiveTab(tabId);
      onTabChange(tabId);
    },
    [onTabChange]
  );

  return (
    <div className="tabbed-content border-b border-[#AAAAAA]">
      <div className="flex">
        {currentTabs?.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-1 text-sm flex flex-col items-center justify-center gap-[2px] ${
              activeTab === tab.id
                ? 'border-b-[1.5px] border-current'
                : 'hover:text-white/60'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

TabbedContent.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired
    })
  ),
  onTabChange: PropTypes.func.isRequired
};

export default TabbedContent;
