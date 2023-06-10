import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import SearchFilterContext from '../../utils/context/SearchFilterContext';
import {
  MainPage,
  EventPage,
  FavoritesPage,
  NotificationsPage,
  NotFoundPage,
  SearchResultPage,
  PreferencesPage,
} from '../../pages';

import { apiEvents } from '../../utils/api';

function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsFromApi, setEventsFromApi] = useState([]);

  const [mostAnticipatedEvents, setMostAnticipatedEvents] = useState([]);
  const [popularEvents, setPopularEvents] = useState([]);
  const [soonEvents, setSoonEvents] = useState([]);
  const [interestingEvents, setInterestingEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  // стейты для поисковго фильтра
  const [values, setValues] = useState({
    status: [],
    city: null,
    date: null,
    specialities: [],
    price: null,
    findTags: null,
    tags: [],
  });
  const [findValues, setFindValues] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataAndSaveToLocalStorage = async () => {
      try {
        const response = await axios.get('http://80.87.107.15/api/v1/events/');
        const data = response.data.results;
        console.log(data);
        setEventsFromApi(data);
        localStorage.setItem('eventsData', JSON.stringify(data));
        // Разложить события по разным массивам
        if (data) {
          const mostAnticipated = data.slice(0, 6);
          const popular = data.slice(7, 19);
          const interesting = data.slice(19, 31);
          const soon = data.slice(32, 37);

          setMostAnticipatedEvents(mostAnticipated);
          setPopularEvents(popular);
          setInterestingEvents(interesting);
          setSoonEvents(soon);

          // Поиск событий по значению из поискового фильтра
          const filteredEvents = searchEvents(findValues);
          setSearchResult(filteredEvents);
        } else {
          throw new Error('Неверный формат данных eventsData:');
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
      }
    };
    // Если есть в сторадж, достаем оттуда
    const storagedEventsData = localStorage.getItem('eventsData');
    if (!storagedEventsData) {
      fetchDataAndSaveToLocalStorage();
    } else {
      try {
        const parsedData = JSON.parse(storagedEventsData);
        setEventsFromApi(parsedData);
        // Разложить события по разным массивам
        const mostAnticipated = parsedData.slice(0, 6);
        const popular = parsedData.slice(7, 19);
        const interesting = parsedData.slice(19, 31);
        const soon = parsedData.slice(32, 37);

        setMostAnticipatedEvents(mostAnticipated);
        setPopularEvents(popular);
        setInterestingEvents(interesting);
        setSoonEvents(soon);

        // Поиск событий по значению из поискового фильтра
        const filteredEvents = searchEvents(findValues);
        setSearchResult(filteredEvents);
      } catch (error) {
        console.error('Invalid eventsData format:', error);
      }
    }
  }, []);

  // Загрузка избранных событий из локального хранилища
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites'));
    if (savedFavorites) {
      setFavorites(savedFavorites);
    }
  }, []);

  // Сохранение избранных событий в локальное хранилище
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

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

  // Функция обновления массива избранных событий
  const updateFavorites = (event) => {
    const isEventInFavorites = favorites.some((item) => item.id === event.id);
    if (!isEventInFavorites) {
      const updatedFavorites = [...favorites, { ...event, isLiked: true }];
      setFavorites(updatedFavorites);
    } else {
      const updatedFavorites = favorites.filter((item) => item.id !== event.id);
      setFavorites(updatedFavorites);
    }
  };

  const toggleFavorite = (event) => {
    updateFavorites(event);

    // Обновление isLiked у selectedEvent
    const updatedSelectedEvent = { ...selectedEvent };
    if (selectedEvent && selectedEvent.id === event.id) {
      updatedSelectedEvent.isLiked = !updatedSelectedEvent.isLiked;
    }
    setSelectedEvent(updatedSelectedEvent);
  };

  // Функция обновления массивов событий при изменении избранных
  useEffect(() => {
    setMostAnticipatedEvents((prevEvents) => updateEvents(prevEvents));
    setPopularEvents((prevEvents) => updateEvents(prevEvents));
    setSoonEvents((prevEvents) => updateEvents(prevEvents));
    setInterestingEvents((prevEvents) => updateEvents(prevEvents));
    setSearchResult((prevEvents) => updateEvents(prevEvents));
  }, [favorites]);

  // Функция обновления массивов событий
  const updateEvents = (events) => {
    return events.map((event) => {
      const isLiked = favorites.some((item) => item.id === event.id);
      return { ...event, isLiked };
    });
  };

  const searchEvents = (query) => {
    const filteredEvents = [...eventsFromApi]
      .map((event) => {
        const isLiked = favorites.some((item) => item.id === event.id);
        return { ...event, isLiked };
      })
      .filter((event) => {
        const { title, description, price } = event;
        return (
          title?.toLowerCase().trim().includes(query.toLowerCase()) ||
          description?.toLowerCase().trim().includes(query.toLowerCase()) ||
          price?.toLowerCase().trim().includes(query.toLowerCase())
        );
      });

    console.log('Filtered events:', filteredEvents); // Debug output
    return filteredEvents;
  };

  const handleSearch = (query) => {
    const filteredEvents = searchEvents(query);
    setSearchResult(filteredEvents);
    navigate('/results'); // Перенаправление на страницу /results
  };

  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    apiEvents
      .getEvents()
      .then(({ success, data }) => {
        if (success) {
          setEventList(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  console.dir(eventList);

  return (
    <SearchFilterContext.Provider
      value={{
        values,
        setValues,
        findValues,
        setFindValues,
      }}
    >
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
                  mostAnticipatedEvents={mostAnticipatedEvents}
                  popularEvents={popularEvents}
                  soonEvents={soonEvents}
                  interestingEvents={interestingEvents}
                />
              }
            />
            <Route
              path="event"
              element={
                <EventPage
                  interestingEvents={interestingEvents}
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
                  favoriteEvents={favorites}
                />
              }
            />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route
              path="results"
              element={
                <SearchResultPage
                  searchResult={searchResult}
                  popularEvents={popularEvents}
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
    </SearchFilterContext.Provider>
  );
}

export default App;
