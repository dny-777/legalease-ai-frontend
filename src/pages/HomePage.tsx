import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.homePage}>
        <div className={styles.overlay}></div>
        <div className={styles.content}>
            <h1 className={styles.title}>
               LegalEase <span className={styles.highlight}>AI</span>: Your Intelligent Legal Assistant
            </h1>
            <p className={styles.subtitle}>
                Simplifying complex legal documents and providing clear answers using the power of AI. Access justice, made easy.
            </p>
            <Link to="/document" className={styles.ctaButton}>
                Get Started
                <ArrowRight size={20} />
            </Link>
        </div>
    </div>
  );
};
export default HomePage;