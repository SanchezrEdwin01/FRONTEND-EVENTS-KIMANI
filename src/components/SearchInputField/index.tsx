import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import cn from 'classnames';
import './styles.scss';
export default function SearchInputField({
  placeholder,
  onChange,
  onReset,
  className
}: {
  placeholder: string;
  onChange: (value: string) => void;
  onReset: () => void;
  className?: string;
}) {
  const [searchValue, setSearchValue] = useState(null);
  const debouncedSearchValue = useDebouncedCallback(event => {
    setSearchValue(event?.target?.value || '');
  }, 1000);
  useEffect(() => {
    if (searchValue) {
      onChange(searchValue);
    } else if (searchValue === '') {
      onReset();
    }
  }, [searchValue]);
  return (
    <div className={cn('search_bar', className)}>
      <div className="search_bar__container">
        <label htmlFor="search-input" className={'search_bar__icon'}>
          <MagnifyingGlassIcon width={20} />
        </label>
        <input
          type="text"
          id="search-input"
          className="search-input"
          placeholder={placeholder}
          onChange={debouncedSearchValue}
        />
      </div>
    </div>
  );
}
