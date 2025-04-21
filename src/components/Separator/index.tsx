import * as React from 'react';
import './styles.scss';

const Separator = ({ noMargin }: { noMargin?: boolean }) => {
  return <div className={`separator ${noMargin ? '!mt-0' : ''}`} />;
};

export default Separator;
