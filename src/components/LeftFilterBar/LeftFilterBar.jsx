import { useState } from 'react';
import styles from './LeftFilterBar.module.css';
import TagsSection from './../TagsSection/TagsSection';

const LeftFilerBar = () => {
  const [showAllDates, setShowAllDates] = useState(false);
  const [showAllSpecialities, setShowAllSpecialities] = useState(false);

  const toggleShowAll = (setter) => {
    setter((prevValue) => !prevValue);
  };

  const renderOptions = (options, inputType, showAll, toggleShow) => {
    const renderedOptions = options.slice();

    if (showAll) {
      renderedOptions.push(
        { id: 'thisweek', value: 'This week', label: 'На этой неделе' },
        { id: 'thismonth', value: 'This month', label: 'В этом месяце' },
        { id: 'nextmonth', value: 'Next month', label: 'В следующем месяце' }
      );
    }

    return renderedOptions.map((option) => (
      <label htmlFor={option.id} key={option.id}>
        <input
          id={option.id}
          type={inputType}
          className={styles.checkboxButton}
        />
        <span className={styles.checkboxLabel}>{option.label}</span>
      </label>
    ));
  };

  return (
    <section className={styles.filterForm}>
      <h2 className={styles.filterTitle}>Фильтры</h2>
      <ul className={styles.filterList}>
        <li>
          <h3 className={styles.itemTitle}>Формат</h3>
          <label htmlFor="online">
            <input
              id="online"
              type="checkbox"
              className={styles.checkboxButton}
            />
            <span className={styles.checkboxLabel}>Online</span>
          </label>
          <label htmlFor="offline">
            <input
              id="offline"
              type="checkbox"
              className={styles.checkboxButton}
            />
            <span className={styles.checkboxLabel}>Offline</span>
          </label>
        </li>
        <li>
          <h3 className={styles.itemTitle}>Город</h3>
          <input
            type="text"
            placeholder="Поиск города"
            className={styles.filterInput}
          />
        </li>
        <li>
          <h3 className={styles.itemTitle}>Дата</h3>
          <div>
            {renderOptions(
              [
                { id: 'today', value: 'Today', label: 'Сегодня' },
                { id: 'tomorrow', value: 'Tomorrow', label: 'Завтра' },
                {
                  id: 'thisweekend',
                  value: 'This weekend',
                  label: 'В эти выходные',
                },
                { id: 'pickdate', value: 'Pick date', label: 'Выбрать дату' },
              ],
              'radio',
              showAllDates,
              () => toggleShowAll(setShowAllDates)
            )}
            <p
              onClick={() => toggleShowAll(setShowAllDates)}
              className={styles.showMore}
            >
              {showAllDates ? 'Показать меньше' : 'Показать больше'}
            </p>
          </div>
        </li>
        <li>
          <h3 className={styles.itemTitle}>Направление</h3>
          <div>
            {renderOptions(
              [
                { id: 'backend', label: 'Backend' },
                { id: 'frontend', label: 'Frontend' },
                { id: 'qa', label: 'QA' },
                { id: 'uxui', label: 'UX/UI дизайн' },
              ],
              'checkbox',
              showAllSpecialities,
              () => toggleShowAll(setShowAllSpecialities)
            )}
            <p
              onClick={() => toggleShowAll(setShowAllSpecialities)}
              className={styles.showMore}
            >
              {showAllSpecialities ? 'Показать меньше' : 'Показать больше'}
            </p>
          </div>
        </li>
        <li>
          <h3 className={styles.itemTitle}>Цена</h3>
          <label htmlFor="free" className={styles.radioButton}>
            <input id="free" type="radio" value="Free" name="price" />
            <span>Бесплатно</span>
          </label>
          <label htmlFor="paid" className={styles.radioButton}>
            <input id="paid" type="radio" value="Paid" name="price" />
            <span>Платно</span>
          </label>
        </li>
        <li>
          <h3 className={styles.itemTitle}>Теги</h3>
          <input
            type="text"
            placeholder="Поиск тега"
            className={styles.filterInput}
          />
        </li>
      </ul>
      <TagsSection />
    </section>
  );
};

export default LeftFilerBar;
