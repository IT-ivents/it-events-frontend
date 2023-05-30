import styles from './Event.module.css';
import EventDescription from '../EventDescription/EventDescription';
import EventsList from '../EventsList/EventsList';
import { interestingEvents } from '../../utils/constants/index';

const Event = ({ selectedEvent, onCardClick }) => {
  return (
    <div className={styles.eventContainer}>
      <EventDescription selectedEvent={selectedEvent} />
      <aside>
        <img
          className={styles.eventImage}
          src={selectedEvent.image}
          alt={selectedEvent.title}
        />
      </aside>
      <EventsList
        title="Смотрите также"
        list={interestingEvents}
        onCardClick={onCardClick}
      />
    </div>
  );
};

export default Event;
