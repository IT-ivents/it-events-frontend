import styles from './App.module.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import {
  MainPage,
  EventPage,
  FavoritesPage,
  NotificationsPage,
  NotFoundPage,
  SearchResultPage,
  PreferencesPage,
} from '../../pages';
import {
  popularEvents,
  interestingEvents,
  mostAnticipatedEvents,
  soonEvents,
} from '../../utils/constants';

function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsList, setEventsList] = useState({
    popular: [...popularEvents],
    interesting: [...interestingEvents],
    favorites: [],
    searchResult: [],
    soon: soonEvents,
    mostAnticipated: mostAnticipatedEvents,
  });

  const navigate = useNavigate();

  // selectedEvent храним в localStorage для страницы EventPage
  useEffect(() => {
    const savedSelectedEvent = JSON.parse(
      localStorage.getItem('selectedEvent')
    );
    if (savedSelectedEvent) {
      setSelectedEvent(savedSelectedEvent);
    } else {
      setSelectedEvent(null);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedEvent', JSON.stringify(selectedEvent));
  }, [selectedEvent]);

  const handleCardClick = (event) => {
    setSelectedEvent(event);
  };

  const toggleFavorite = (event) => {
    setEventsList((prevEventsList) => {
      const updatedEventsList = {
        popular: updateList(prevEventsList.popular, event),
        interesting: updateList(prevEventsList.interesting, event),
        favorites: updateList(prevEventsList.favorites, event),
        searchResult: updateList(prevEventsList.searchResult, event),
      };

      // Обновление isLiked у selectedEvent
      const updatedSelectedEvent = { ...selectedEvent };
      if (selectedEvent && selectedEvent.id === event.id) {
        updatedSelectedEvent.isLiked = !updatedSelectedEvent.isLiked;
      }

      setSelectedEvent(updatedSelectedEvent);

      return updatedEventsList;
    });
  };
  function updateList(list, event) {
    if (list === eventsList.favorites) {
      const isEventInFavorites = list.some((item) => item.id === event.id);
      if (!isEventInFavorites) {
        const updatedList = [...list, { ...event, isLiked: true }];
        return updatedList;
      } else {
        const updatedList = list.filter((item) => item.id !== event.id);
        return updatedList;
      }
    }

    const updatedList = list.map((item) => {
      if (item.id === event.id) {
        const updatedItem = { ...item, isLiked: !item.isLiked };
        return updatedItem;
      }
      return item;
    });

    return updatedList;
  }

  useEffect(() => {
    const savedEventsList = JSON.parse(localStorage.getItem('eventsList'));
    if (savedEventsList) {
      setEventsList(savedEventsList);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('eventsList', JSON.stringify(eventsList));
  }, [eventsList]);

  const searchEvents = (query) => {
    // Собираем массивы в которых будем искать и расставляем лайки на карточках,
    // если они есть в избранном
    const filteredEvents = [...popularEvents, ...interestingEvents]
      .map((event) => {
        const isLiked = eventsList.favorites.some(
          (item) => item.id === event.id
        );
        return { ...event, isLiked };
      })
      .filter((event) => {
        const { title, description, location, price } = event;
        return (
          title?.toLowerCase().trim().includes(query.toLowerCase()) ||
          description?.toLowerCase().trim().includes(query.toLowerCase()) ||
          location?.toLowerCase().trim().includes(query.toLowerCase()) ||
          price?.toLowerCase().trim().includes(query.toLowerCase())
        );
      });
    console.log('Filtered events:', filteredEvents); // Отладочный вывод
    return filteredEvents;
  };

  const handleSearch = (query) => {
    const filteredEvents = searchEvents(query);

    setEventsList((prevEventsList) => ({
      ...prevEventsList,
      searchResult: filteredEvents,
    }));

    navigate('/results'); // Перенаправление на страницу /results
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.page}>
        <Header onSearch={handleSearch} />
        <Routes>
          <Route
            path="/"
            element={
              <MainPage
                onCardClick={handleCardClick}
                onLikeClick={toggleFavorite}
                popularEvents={eventsList.popular}
                interestingEvents={eventsList.interesting}
                mostAnticipatedEvents={eventsList.mostAnticipated}
                soonEvents={eventsList.soon}
              />
            }
          />
          <Route
            path="event"
            element={
              <EventPage
                interestingEvents={eventsList.interesting}
                selectedEvent={selectedEvent}
                onCardClick={handleCardClick}
                onLikeClick={toggleFavorite}
              />
            }
          />
          <Route
            path="favorites"
            element={
              <FavoritesPage
                onCardClick={handleCardClick}
                onLikeClick={toggleFavorite}
                favoriteEvents={eventsList.favorites}
              />
            }
          />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route
            path="results"
            element={
              <SearchResultPage
                searchResult={eventsList.searchResult}
                popularEvents={eventsList.popular}
                onCardClick={handleCardClick}
                onLikeClick={toggleFavorite}
              />
            }
          />
          <Route path="preferences" element={<PreferencesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
