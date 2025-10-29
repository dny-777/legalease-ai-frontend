import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookText, LanguagesIcon } from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
  selectedLanguage: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
  languages: string[];
}

const Header: React.FC<HeaderProps> = ({ selectedLanguage, setSelectedLanguage, languages }) => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.brand}>
          <BookText className={styles.logoIcon} />
          <span className={styles.brandText}>LegalEase <span className={styles.brandHighlight}>AI</span></span>
        </Link>
        <div className={styles.navLinks}>
          <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Home</NavLink>
          <NavLink to="/document" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Document</NavLink>
          <NavLink to="/chat" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>Chat</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>About</NavLink>
        </div>
        <div className={styles.languageSelector}>
           <LanguagesIcon className={styles.langIcon} />
          <select id="language" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} aria-label="Select output language" className={styles.selectDropdown}>
            {languages.map(lang => (<option key={lang} value={lang}>{lang}</option>))}
          </select>
        </div>
      </nav>
    </header>
  );
};
export default Header;