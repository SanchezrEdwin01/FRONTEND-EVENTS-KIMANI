import React from 'react';
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowRight
} from 'react-icons/md';
import './index.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Heading = props => {
  const { text, direction, hasNoTransition, ...rest } = props;

  return (
    <h2
      {...rest}
      className={cn([
        'heading flex flex-row items-center',
        { ['no-transition']: hasNoTransition }
      ])}
    >
      {text}{' '}
      <span className="flex flex-row items-center justify-center text-white">
        {direction !== 'down' ? (
          <MdOutlineKeyboardArrowRight />
        ) : (
          <MdOutlineKeyboardArrowDown />
        )}
      </span>
    </h2>
  );
};

Heading.PropTypes = {
  text: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(['down']),
  hasNoTransition: PropTypes.bool
};

export default Heading;
