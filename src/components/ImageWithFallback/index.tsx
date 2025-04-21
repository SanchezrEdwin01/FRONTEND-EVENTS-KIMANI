import React, { useState } from 'react';
import PropTypes from 'prop-types';
import defaultEventImage from '@/assets/images/default-event.png';

const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = defaultEventImage,
  className = '',
  sizes = '100vw',
  wrapperClassName = '',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) {
      setError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <picture className={wrapperClassName}>
      {!error && (
        <>
          <source srcSet={`${src}`} type="image/webp" />
        </>
      )}
      <source srcSet={fallbackSrc} type="image/jpeg" />
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className={className}
        {...props}
      />
    </picture>
  );
};

ImageWithFallback.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string,
  className: PropTypes.string,
  sizes: PropTypes.string
};

export default ImageWithFallback;
