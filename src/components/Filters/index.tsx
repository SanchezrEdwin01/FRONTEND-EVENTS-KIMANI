import * as React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { TYPES, EVENT_TYPE_ALL } from '@/utils/constants';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';

interface FiltersProps {
  eventState: any[];
  onFilter: (items: any[]) => void;
  onReset: () => void;
}

const Filters = ({ eventState = [], onFilter, onReset }: FiltersProps) => {
  const [selectedTag, setSelectedTag] = useState(TYPES[0]);
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const debouncedSearchValue = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event?.target?.value || '');
    },
    500
  );

  const handleSearchBarFiltering = useCallback(
    (text: string) => {
      const searchTerms = text.toLowerCase().split(' ').filter(Boolean);

      const filteredEvents = eventState.filter(event => {
        const hostNames = Array.isArray(event?.host_details)
          ? event.host_details
              .map((h: any) => h?.username)
              .filter(Boolean)
              .join(' ')
          : '';

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
    [eventState, onFilter]
  );

  const handleSelectedTag = useCallback(
    (tag: { name: string; value: string }) => {
      setSelectedTag(tag);

      if (tag.value === EVENT_TYPE_ALL) {
        onReset();
        return;
      }
      const norm = (s: string) => (s || '').replace(/\s+/g, '').toLowerCase();

      const filteredEvents = eventState.filter(event =>
        norm(event?.event_type || '').includes(norm(tag.value))
      );

      onFilter(filteredEvents);
    },
    [eventState, onReset, onFilter]
  );
  useEffect(() => {
    if (searchValue) {
      handleSearchBarFiltering(searchValue);
    } else if (searchValue === '') {
      onReset();
    }
  }, [searchValue, handleSearchBarFiltering, onReset]);
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
        {TYPES.map((type, i) => (
          <div
            key={type.value ?? i}
            className={classNames('tag', {
              selected_tag: selectedTag?.value === type?.value
            })}
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
  eventState: PropTypes.arrayOf(PropTypes.shape({})),
  onFilter: PropTypes.func,
  onReset: PropTypes.func
};

export default Filters;
