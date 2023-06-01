import styles from './VerticalEventCard.module.css';
import { useNavigate } from 'react-router-dom';
//import playIcon from '../../images/play-icon.svg';

const VerticalEventCard = ({ event, onCardClick }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    onCardClick(event);
    navigate('/event');
  };

  return (
    <li key={event.id} className={`${styles.card}`}>
      <div className={styles.imageContainer}>
        {event.price !== 'Бесплатно' ? (
          <span className={styles.price}>{event.price}&ensp;&#8381;</span>
        ) : (
          <span className={styles.price}>{event.price}</span>
        )}
        <img
          src={event.image}
          alt="event_picture"
          className={styles.image}
          onClick={handleCardClick}
        />
        <button className={styles.likeButton} type="button"></button>
      </div>

      <div className={`${styles.descriptionContainer}`}>
        <h3 className={styles.title}>{event.title}</h3>
        <button className={styles.linkButton} type="button"></button>
      </div>
      <div className={styles.rowContainer}>
        <time>{event.date}</time>
        <span>&bull;</span>
        <p>{event.location}</p>
      </div>

      {/* <figure className={styles.eventFigure}>
          <img src={playIcon} alt="play-icon" />
          <figcaption>Online-трансляция</figcaption>
        </figure> */}
    </li>
  );
};

export default VerticalEventCard;
