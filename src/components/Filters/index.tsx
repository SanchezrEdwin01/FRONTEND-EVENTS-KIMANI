import * as React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  MapPinIcon
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

const CITIES = [
  { value: '', label: 'Global Destinations' },
  { value: 'miami', label: 'Miami' },
  { value: 'new_york', label: 'New York' },
  { value: 'los_angeles', label: 'Los Angeles' },
  { value: 'las_vegas', label: 'Las Vegas' },
  { value: 'hamptons', label: 'Hamptons' },
  { value: 'chicago', label: 'Chicago' },
  { value: 'houston', label: 'Houston' },
  { value: 'austin', label: 'Austin' },
  { value: 'dallas', label: 'Dallas' },
  { value: 'phoenix', label: 'Phoenix' },
  { value: 'philadelphia', label: 'Philadelphia' },
  { value: 'san_francisco', label: 'San Francisco' },
  { value: 'new_orleans', label: 'New Orleans' },
  { value: 'washington_dc', label: 'Washington DC' },
  { value: 'boston', label: 'Boston' },
  { value: 'toronto', label: 'Toronto' },
  { value: 'montreal', label: 'Montreal' },
  { value: 'vancouver', label: 'Vancouver' },
  { value: 'quebec', label: 'Quebec' },
  { value: 'london', label: 'London' },
  { value: 'greece', label: 'Greece' },
  { value: 'paris', label: 'Paris' },
  { value: 'ibiza', label: 'Ibiza' },
  { value: 'milan', label: 'Milan' },
  { value: 'barcelona', label: 'Barcelona' },
  { value: 'madrid', label: 'Madrid' },
  { value: 'rome', label: 'Rome' },
  { value: 'marbella', label: 'Marbella' },
  { value: 'berlin', label: 'Berlin' },
  { value: 'munich', label: 'Munich' },
  { value: 'amsterdam', label: 'Amsterdam' },
  { value: 'stockholm', label: 'Stockholm' },
  { value: 'belgrade', label: 'Belgrade' },
  { value: 'prague', label: 'Prague' },
  { value: 'bucharest', label: 'Bucharest' },
  { value: 'kiev', label: 'Kiev' },
  { value: 'zagreb', label: 'Zagreb' },
  { value: 'vienna', label: 'Vienna' },
  { value: 'monaco', label: 'Monaco' },
  { value: 'cannes', label: 'Cannes' },
  { value: 'st_tropez', label: 'St Tropez' },
  { value: 'lisbon', label: 'Lisbon' },
  { value: 'zurich', label: 'Zurich' },
  { value: 'geneva', label: 'Geneva' },
  { value: 'basel', label: 'Basel' },
  { value: 'gstaad', label: 'Gstaad' },
  { value: 'warsaw', label: 'Warsaw' },
  { value: 'krakow', label: 'Kraków' },
  { value: 'belize', label: 'Belize' },
  { value: 'costa_rica', label: 'Costa Rica' },
  { value: 'el_salvador', label: 'El Salvador' },
  { value: 'guatemala', label: 'Guatemala' },
  { value: 'honduras', label: 'Honduras' },
  { value: 'nicaragua', label: 'Nicaragua' },
  { value: 'panama', label: 'Panama' },
  { value: 'mexico_city', label: 'Mexico City' },
  { value: 'cabo_mexico', label: 'Cabo, Mexico' },
  { value: 'playa_del_carmen', label: 'Playa Del Carmen' },
  { value: 'tulum', label: 'Tulum' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'colombia', label: 'Colombia' },
  { value: 'ecuador', label: 'Ecuador' },
  { value: 'paraguay', label: 'Paraguay' },
  { value: 'peru', label: 'Peru' },
  { value: 'uruguay', label: 'Uruguay' },
  { value: 'dubai', label: 'Dubai' },
  { value: 'abu_dhabi', label: 'Abu Dhabi' },
  { value: 'turkey', label: 'Turkey' },
  { value: 'saudi_arabia', label: 'Saudi Arabia' },
  { value: 'israel', label: 'Israel' },
  { value: 'china', label: 'China' },
  { value: 'japan', label: 'Japan' },
  { value: 'hong_kong', label: 'Hong Kong' },
  { value: 'south_korea', label: 'South Korea' },
  { value: 'thailand', label: 'Thailand' },
  { value: 'indonesia', label: 'Indonesia' },
  { value: 'india', label: 'India' },
  { value: 'maldives', label: 'Maldives' },
  { value: 'nepal', label: 'Nepal' },
  { value: 'philippine', label: 'Philippine' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'sydney', label: 'Sydney' },
  { value: 'melbourne', label: 'Melbourne' },
  { value: 'new_zealand', label: 'New Zealand' },
  { value: 'fiji', label: 'Fiji' },
  { value: 'bahamas', label: 'Bahamas' },
  { value: 'caribbean_islands', label: 'Caribbean Islands' },
  { value: 'saint_barth', label: 'Saint Barth' },
  { value: 'puerto_rico', label: 'Puerto Rico' },
  { value: 'dominican_republic', label: 'Dominican Republic' },
  { value: 'morocco', label: 'Morocco' },
  { value: 'algeria', label: 'Algeria' },
  { value: 'namibia', label: 'Namibia' },
  { value: 'south_africa', label: 'South Africa' },
  { value: 'swaziland', label: 'Swaziland' },
  { value: 'kenya', label: 'Kenya' },
  { value: 'egypt', label: 'Egypt' }
];

const Filters = ({ eventState = [], onFilter, onReset }: FiltersProps) => {
  const [selectedTag, setSelectedTag] = useState(TYPES[0]);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const debouncedSearchValue = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event?.target?.value || '');
    },
    500
  );

  const handleCitySelect = useCallback((cityValue: string) => {
    setSelectedCity(cityValue);
    setIsCityDropdownOpen(false);

    if (!cityValue) {
      onReset();
      return;
    }

    const filteredEvents = eventState.filter(event => {
      const eventCity = event.city?.toLowerCase().replace(/\s+/g, '_');
      return eventCity === cityValue;
    });

    onFilter(filteredEvents);
  }, [eventState, onFilter, onReset]);

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
      {/* City Filter Dropdown */}
      <div className="city_filter">
        <div 
          className="city_filter__trigger"
          onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
        >
          <div className="city_filter__content">
            <div className="city_filter__header">
              <span className="city_filter__label">Location</span>
            </div>
            <div className="city_filter__main">
              <MapPinIcon width={18} className="city_filter__icon" />
              <span className="city_filter__text">
                {selectedCity ? CITIES.find(city => city.value === selectedCity)?.label : 'Global Destinations'}
              </span>
            </div>
          </div>
          <ChevronDownIcon 
            width={16} 
            className={classNames('city_filter__chevron', {
              'city_filter__chevron--open': isCityDropdownOpen
            })} 
          />
        </div>
        
        {isCityDropdownOpen && (
          <div className="city_filter__dropdown">
            <div className="city_filter__dropdown-content">
              {CITIES.map((city) => (
                <div
                  key={city.value}
                  className={classNames('city_filter__option', {
                    'city_filter__option--selected': selectedCity === city.value
                  })}
                  onClick={() => handleCitySelect(city.value)}
                >
                  <span className="city_filter__option-text">{city.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
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

      {/* Event Type Tags */}
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