import React from 'react';
import './index.scss';

const Title = props => {
  const { children, ...rest } = props;

  return (
    <h1 {...rest} className="title flex flex-row items-center">
      {children}{' '}
    </h1>
  );
};

Title.PropTypes = {};

export default Title;
