import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './EventCarousel.module.css';
import CustomEventCard from '../CustomEventCard/CustomEventCard';

export default function EventCarousel({ mostAnticipatedEvents, onCardClick }) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 7000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
  };

  return (
    <div className={styles.carousel}>
      <h1 className={styles.title}>Самые ожидаемые события года</h1>
      <Slider {...settings}>
        {mostAnticipatedEvents.map((event) => (
          <CustomEventCard
            key={event.id}
            event={event}
            onCardClick={onCardClick}
          />
        ))}
      </Slider>
    </div>
  );
}
