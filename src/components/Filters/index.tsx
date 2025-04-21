import * as React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { TYPES } from '@/utils/constants';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { EVENT_TYPE_ALL } from '@/utils/constants';
const Filters = ({ eventState = [], onFilter, onReset }) => {
  const [selectedTag, setSelectedTag] = useState({
    name: 'All',
    value: EVENT_TYPE_ALL
  });
  const [searchValue, setSearchValue] = useState(null);
  const debouncedSearchValue = useDebouncedCallback(event => {
    setSearchValue(event?.target?.value || '');
  }, 1000);
  const handleSearchBarFiltering = useCallback(
    (searchValue: string) => {
      const searchTerms = searchValue
        .toLowerCase()
        .split(' ')
        .filter(term => term);

      const filteredEvents = eventState.filter(event => {
        const hostNames =
          event.hosts?.map(host => host.username).join(' ') || '';
        const eventText = [
          event.title,
          hostNames,
          event.place,
          event.description,
          event.event_type,
          event.city,
          event.country,
          event.area,
          event.address,
          event.start_date,
          event.end_date,
          event.start_time,
          event.end_time
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchTerms.every(term => eventText.includes(term));
      });

      onFilter(filteredEvents);
    },
    [eventState]
  );
  const handleSelectedTag = useCallback(
    (tag: { name: string; value: string }) => {
      setSelectedTag(tag);
      if (tag.value === EVENT_TYPE_ALL) {
        onReset();
        return;
      }
      const filteredEvents = eventState.filter(event =>
        event.event_type?.toLowerCase().includes(tag.value.toLowerCase())
      );
      onFilter(filteredEvents);
    },
    [eventState]
  );
  useEffect(() => {
    if (searchValue) {
      handleSearchBarFiltering(searchValue);
    } else if (searchValue === '') {
      onReset();
    }
  }, [searchValue]);
  return (
    <div className="filters">
      <div className="search_bar">
        <div className="search_bar__container">
          <label htmlFor="search-input" className={'search_bar__icon'}>
            <MagnifyingGlassIcon width={20} />
          </label>
          <input
            type="text"
            id="search-input"
            className="search-input"
            placeholder="Search your event..."
            onChange={debouncedSearchValue}
          />
        </div>
        <button className="search_bar__funnel" style={{ display: 'none' }}>
          <AdjustmentsHorizontalIcon width={25} />
        </button>
      </div>
      <div className="tags">
        {TYPES.map((type: { name: string; value: string }, v: number) => (
          <div
            key={v}
            className={classNames([
              'tag',
              {
                selected_tag: selectedTag?.value === type?.value
              }
            ])}
            onClick={() => handleSelectedTag(type)}
          >
            <span>{type.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

Filters.propTypes = {
  eventState: PropTypes.arrayOf(PropTypes.shape({}))
};

export default Filters;
