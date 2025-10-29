import React, { useState } from 'react';
// Import type from the new types file
import type { AnalyzedData } from '../types'; // <-- CHANGE HERE
import { FileText, Loader2, Volume2, Wand2, Languages } from 'lucide-react';
import styles from './DocumentDisplay.module.css';

type ViewMode = 'raw' | 'simplified' | 'translated';

interface Props {
  // Use the imported type here
  data: AnalyzedData;
  fileName: string;
  selectedLanguage: string;
  onAction: (action: 'simplify' | 'translate' | 'listen', currentText: string, rawText: string, simplifiedText: string) => Promise<void>;
  isProcessing: boolean;
  actionError: string | null;
  activeAudioUrl: string | null;
}

const DocumentDisplay: React.FC<Props> = ({ data, fileName, selectedLanguage, onAction, isProcessing, actionError, activeAudioUrl }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('raw');

    const getDisplayedText = () => {
        if (viewMode === 'simplified') return data.simplified || "No simplified text generated yet.";
        if (viewMode === 'translated') return data.translated || `No translation generated for ${selectedLanguage} yet.`;
        return data.raw;
    };
    const currentText = getDisplayedText();

    const handleActionClick = async (action: 'simplify' | 'translate' | 'listen') => {
        await onAction(action, currentText, data.raw, data.simplified);
        // Optimistically switch view if no immediate error
         if (!isProcessing && !actionError) {
             if (action === 'simplify') setViewMode('simplified');
             if (action === 'translate') setViewMode('translated');
         }
    }

    return (
        <div className={styles.container}>
             <header className={styles.header}>
                 <div className={styles.fileNameContainer}>
                    <FileText className={styles.fileIcon} />
                    <h3 className={styles.fileName} title={fileName}>{fileName}</h3>
                </div>
             </header>
             <div className={styles.tabs}>
                <button onClick={() => setViewMode('raw')} className={`${styles.tabButton} ${viewMode === 'raw' ? styles.activeTab : ''}`}>Raw Text</button>
                <button onClick={() => setViewMode('simplified')} className={`${styles.tabButton} ${viewMode === 'simplified' ? styles.activeTab : ''}`}>Simplified</button>
                <button onClick={() => setViewMode('translated')} className={`${styles.tabButton} ${viewMode === 'translated' ? styles.activeTab : ''}`}>Translated</button>
            </div>
             <div className={styles.contentArea}>
                <p className={styles.contentText}>{currentText}</p>
            </div>
             <footer className={styles.footer}>
                <button onClick={() => handleActionClick('simplify')} disabled={isProcessing || !data.raw} className={styles.actionButton}>
                    <Wand2 size={12} /> Simplify
                </button>
                <button onClick={() => handleActionClick('translate')} disabled={isProcessing || (!data.raw && !data.simplified)} className={styles.actionButton}>
                    <Languages size={12} /> Translate
                </button>
                <button onClick={() => handleActionClick('listen')} disabled={isProcessing || !currentText.trim()} className={styles.actionButton}>
                    <Volume2 size={12} /> Listen
                </button>
                 {isProcessing && <Loader2 className={styles.loader} />}
                 {actionError && <p className={styles.errorTextFooter}>{actionError}</p>}
                 {activeAudioUrl && !isProcessing && (
                    <audio controls src={activeAudioUrl} className={styles.audioPlayer}></audio>
                 )}
             </footer>
        </div>
    );
};
export default DocumentDisplay;