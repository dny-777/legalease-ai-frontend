import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import DocumentDisplay from '../components/DocumentDisplay';
// Import type from the new types file
import type { AnalyzedData } from '../types'; // <-- Corrected import
// Import API functions
import { simplifyText, translateText, textToSpeech } from '../services/api';
import { Loader2 } from 'lucide-react';
import styles from './DocumentPage.module.css'; // Import CSS module

interface Props {
    // Use the imported type here
    analyzedData: AnalyzedData | null;
    fileName: string | null;
    selectedLanguage: string;
    // Use the imported type here
    onDocumentUpdate: (fileId: string | null, fileName: string | null, data: AnalyzedData | null) => void;
}

const DocumentPage: React.FC<Props> = ({ analyzedData, fileName, selectedLanguage, onDocumentUpdate }) => {
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);

    // This state holds the current fileId after a successful upload
    const [currentFileId, setCurrentFileId] = useState<string | null>(null);

    // Use the imported type here
    const handleUploadSuccess = (fileId: string, name: string, data: AnalyzedData) => {
        setCurrentFileId(fileId); // Store the fileId locally on this page
        onDocumentUpdate(fileId, name, data); // Notify App component
        setActionError(null);
        setActiveAudioUrl(null);
    };

    const handleUploadError = (errorMsg: string) => {
         setCurrentFileId(null); // Clear fileId on error
         onDocumentUpdate(null, null, null);
         setActionError(null);
         setActiveAudioUrl(null);
         console.error("Upload Error:", errorMsg);
    };

    // Use the imported type here
    const handleAction = async (action: 'simplify' | 'translate' | 'listen', currentText: string, rawText: string, simplifiedText: string) => {
        // No need for the dummy fileId logic here anymore, use currentFileId state

        if (!analyzedData || isProcessingAction) return;
        let textForAction = currentText;
        setIsProcessingAction(true);
        setActionError(null);
        setActiveAudioUrl(null);
        try {
            if (action === 'simplify') {
                if (!rawText) throw new Error("Original text is missing.");
                const res = await simplifyText(rawText);
                // Pass the existing fileId back correctly
                onDocumentUpdate(currentFileId, fileName, { ...analyzedData, simplified: res.simplified_text, raw: rawText, translated: analyzedData.translated }); // Ensure other fields are kept
            } else if (action === 'translate') {
                let textToTranslate = simplifiedText || rawText; // Prefer simplified
                if (!textToTranslate) throw new Error("No text to translate.");

                // --- ADDED TRUNCATION LOGIC ---
                const MAX_TRANSLATE_CHARS = 1000; // Limit to ~1000 characters
                if (textToTranslate.length > MAX_TRANSLATE_CHARS) {
                    console.warn(`Truncating text for translation from ${textToTranslate.length} to ${MAX_TRANSLATE_CHARS} chars.`);
                    textToTranslate = textToTranslate.substring(0, MAX_TRANSLATE_CHARS) + "..."; // Add ellipsis
                }
                // --- END TRUNCATION LOGIC ---

                const res = await translateText(textToTranslate, selectedLanguage);
                 // Pass the existing fileId back correctly
                onDocumentUpdate(currentFileId, fileName, { ...analyzedData, translated: res.translated_text, raw: rawText, simplified: simplifiedText }); // Ensure other fields are kept
            } else if (action === 'listen') {
                if (!textForAction) throw new Error("No text to listen to.");
                const res = await textToSpeech(textForAction, selectedLanguage);
                setActiveAudioUrl(res.audio_url);
                const audio = new Audio(res.audio_url);
                audio.play().catch(e => console.error("Audio playback failed:", e));
            }
        } catch (err: any) {
            console.error(`Action ${action} failed`, err);
            const detail = err.response?.data?.detail || err.message || `Failed to ${action}.`;
            setActionError(String(detail));
        } finally {
            setIsProcessingAction(false);
        }
    };

    return (
        <div className={`${styles.pageContainer} document-page-bg-overlay`}> {/* Apply background class */}
            <h1 className="page-title">Document Analysis</h1>
            <div className="card"> {/* Use global card style */}
                <FileUpload onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError}/>
                {fileName && analyzedData && (
                    <div style={{marginTop: '1.5rem'}}> {/* mt-6 */}
                        <DocumentDisplay
                            data={analyzedData}
                            fileName={fileName}
                            selectedLanguage={selectedLanguage}
                            onAction={handleAction}
                            isProcessing={isProcessingAction}
                            actionError={actionError}
                            activeAudioUrl={activeAudioUrl}
                        />
                    </div>
                )}
                 {isProcessingAction && (
                    <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'center'}}>
                         <Loader2 style={{width: '1.5rem', height: '1.5rem', animation: 'spin 1s linear infinite', color: 'var(--gold)'}} />
                    </div>
                 )}
            </div>
        </div>
    );
};
export default DocumentPage;