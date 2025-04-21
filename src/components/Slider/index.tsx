import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import Card from '@/components/Card';
import '@splidejs/react-splide/css';
import { SplideSlide, Splide } from '@splidejs/react-splide';
const Slider = props => {
  const { cards } = props;

  return (
    <div>
      <Splide
        aria-label="Kimani Events"
        options={{
          type: 'loop',
          arrows: false,
          infinite: true,
          dots: false,
          pagination: false,
          gap: '20px',
          fixedWidth: '215px',
          perPage: 1,
          focus: 'center',
          easing: 'ease'
        }}
      >
        {cards.map(card => (
          <SplideSlide>
            <Card card={card} />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

Slider.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object)
};

export default Slider;
