import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadDocument } from '../services/api';
// Import type from the new types file
import type { AnalyzedData } from '../types'; // <-- CHANGE HERE
import { UploadCloud } from 'lucide-react';
import { PulseLoader } from 'react-spinners';
import styles from './FileUpload.module.css';

interface Props {
  // Use the imported type here
  onUploadSuccess: (fileId: string, fileName: string, data: AnalyzedData) => void;
  onUploadError: (errorMsg: string) => void;
}

const FileUpload: React.FC<Props> = ({ onUploadSuccess, onUploadError }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;
        setIsUploading(true);
        setUploadError(null);
        try {
            const response = await uploadDocument(file);
            // Use the imported type here
            const initialData: AnalyzedData = {
                raw: response.raw_text || "No text extracted.", simplified: '', translated: '',
            };
            onUploadSuccess(response.file_id, response.file_name, initialData);
        } catch (err: any) {
            console.error("Upload failed:", err);
            const detail = err.response?.data?.detail || 'Failed to upload/process document.';
            setUploadError(String(detail));
            onUploadError(String(detail));
        } finally {
            setIsUploading(false);
        }
    }, [onUploadSuccess, onUploadError]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'], 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
        maxFiles: 1,
        disabled: isUploading,
    });

    return (
        <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.active : ''} ${isUploading ? styles.disabled : ''}`}>
            <input {...getInputProps()} disabled={isUploading} />
            <UploadCloud className={styles.icon} />
            {isUploading ? (
                <div className={styles.statusText}>
                    <PulseLoader color="var(--gold)" size={8} />
                    <p>Processing...</p>
                </div>
            ) : isDragActive ? (
                <p className={styles.promptTextActive}>Drop file here...</p>
            ) : (
                <p className={styles.promptText}>Drag & drop PDF/Image, or click</p>
            )}
            {uploadError && <p className={styles.errorText}>{uploadError}</p>}
        </div>
    );
};
export default FileUpload;