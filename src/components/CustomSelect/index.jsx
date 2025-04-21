
import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

import './index.scss';

import Heading from '@/components/Heading';


const CustomSelect = props => {
  const { defaultValue, options, cb, showOptions, arrowDown } = props;
  const [currentValue, setCurrentValue] = useState({});
  const handleSelection = useCallback((o) => { cb(o); setCurrentValue(o); },[cb]);
  return (
    <div>
      <Heading text={currentValue?.label || defaultValue} direction={arrowDown ? "down": null} hasNoTransition />
          <div className="CustomSelect__options">
        {showOptions && options?.map(o =>
          <button type="button" className={cn([{ activeOption: o?.label === currentValue?.label }])}
          onClick={() => handleSelection(o)}>{o.label}</button>)}
          </div>
    </div>
  );
};
CustomSelect.propTypes = {
    defaultValue: PropTypes.string.isRequired,
    options: PropTypes.shape({}).isRequired,
    cb: PropTypes.func.isRequired,
    arrowDown: PropTypes.bool,
    showOptions: PropTypes.bool,
};

export default CustomSelect;
