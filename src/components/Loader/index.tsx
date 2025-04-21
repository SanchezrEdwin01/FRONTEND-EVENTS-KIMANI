import * as React from 'react';

import './styles.scss';

export default function Loader() {
  return (
    <div className="loader">
      <div className="ring">
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
