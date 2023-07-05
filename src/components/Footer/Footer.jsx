import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import Logo from '../Logo/Logo';
import GitHubLogo from '../../images/SocialNetworks/GitHub.svg';
import MessengerLogo from '../../images/SocialNetworks/Messenger.svg';
import VkLogo from '../../images/SocialNetworks/VK.svg';
import useScrollToTop from '../../utils/hooks/useScrollToTop';
import PopupCookie from '../PopupCookie/PopupCookie';

const logoSize = {
  fontSize: '20px',
  color: '#F1F0EB',
};

const Footer = ({ onEnter }) => {
  const date = new Date().getFullYear();
  const { scrollToTop } = useScrollToTop();
  const [showPopup, setShowPopup] = useState(false);
  const disabled = true;

  const renderFooterItems = () => {
    const footerItems = [
      { text: 'О нас', to: '/about' },
      { text: 'События' },
      { text: 'Cookies', onClick: () => setShowPopup(true) },
      { text: 'Мы в СМИ!', disabled },
      { text: 'Войти в ЛК', onClick: onEnter },
      { text: 'Политика конфиденциональности', to: '/privacy' },
    ];

    return footerItems.map((item, index) => (
      <li className={styles.footerItem} key={index}>
        {item.to ? (
          <Link to={item.to} className={styles.logoLink}>
            <span>{item.text}</span>
          </Link>
        ) : (
          <span
            onClick={item.onClick}
            className={item.disabled ? styles.disabled : ''}
          >
            {item.text}
          </span>
        )}
      </li>
    ));
  };

  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.logos}>
        <Logo logoSize={logoSize} onClick={scrollToTop} />
        <span className={styles.year}>© {date} IT-events</span>
      </div>
      <div className={styles.infoContainer}>
        <ul className={styles.footerList}>{renderFooterItems()}</ul>
        <div className={styles.contacts}>
          <p className={styles.email}>it-connect-event@yandex.ru</p>
          <div className={styles.images}>
            <img src={GitHubLogo} alt="GitHub" />
            <img src={MessengerLogo} alt="Messenger" />
            <img src={VkLogo} alt="Vk" />
          </div>
        </div>
      </div>
      {showPopup && <PopupCookie setShowPopup={setShowPopup} />}
    </footer>
  );
};

export default Footer;
