import React from 'react';
import styles from './AboutPage.module.css'; // Import CSS module

const AboutPage: React.FC = () => {
  return (
    // Apply background class
    <div className={`${styles.pageContainer} about-page-bg-overlay`}>
      <h1 className="page-title">About LegalEase AI</h1>
       {/* Use global card style and CSS module for spacing */}
      <div className={`card ${styles.card}`}>
        {/* ADDED className={styles.section} below */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Vision</h2>
          <p className={styles.paragraph}>
            Placeholder: Our vision is to democratize access to legal understanding for every citizen. We believe that complexity in legal language should not be a barrier to justice or comprehension. LegalEase AI aims to bridge this gap using cutting-edge artificial intelligence.
          </p>
        </section>

        {/* ADDED className={styles.section} below */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The Team</h2>
          <p className={styles.paragraph}>Placeholder: We are a passionate team participating in this hackathon, dedicated to building innovative solutions.</p>
           {/* Add team member details here */}
        </section>

        {/* ADDED className={styles.section} below */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Technology Used</h2>
          <ul className={styles.list}>
            <li>Frontend: React, Vite, CSS Modules, TypeScript, React Router</li>
            <li>Backend: Python, FastAPI</li>
            <li>AI/ML: Hugging Face Inference API (Translation, Summarization), EasyOCR, Sentence Transformers, FAISS, gTTS</li>
            <li>Deployment: Render (Backend), Vercel/Netlify (Frontend)</li>
          </ul>
        </section>

        {/* ADDED className={styles.section} below */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Acknowledgments</h2>
           <p className={styles.paragraph}>Placeholder: We thank the organizers of the hackathon and the creators of the open-source libraries and models that made this project possible.</p>
        </section>
      </div>
    </div>
  );
};
export default AboutPage;