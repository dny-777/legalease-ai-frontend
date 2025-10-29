import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Type definitions
export interface UploadResponse { // Export interface
  file_id: string;
  file_name: string;
  raw_text: string;
}
export interface SimplifyResponse { // Export interface
  simplified_text: string;
}
export interface TranslateResponse { // Export interface
  translated_text: string;
}
export interface TTSResponse { // Export interface
  audio_url: string;
}
export interface ChatResponse { // Export interface
  answer_text: string;
  audio_url?: string;
  file_id?: string;
  query: string;
}

// API Functions
export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await api.post('/api/upload_ocr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log("Upload Response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const simplifyText = async (text: string): Promise<SimplifyResponse> => {
  try {
    const response = await api.post('/api/simplify', { text });
    console.log("Simplify Response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Simplify error:", error);
    throw error;
  }
};

export const translateText = async (text: string, target_language: string): Promise<TranslateResponse> => {
  try {
    const response = await api.post('/api/translate', { text, target_language });
    console.log("Translate Response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Translate error:", error);
    throw error;
  }
};

export const textToSpeech = async (text: string, language: string): Promise<TTSResponse> => {
  try {
    const response = await api.post('/api/tts', { text, language });
    console.log("TTS Response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("TTS error:", error);
    throw error;
  }
};

export const postChatMessage = async (query: string, file_id: string | null, language: string): Promise<ChatResponse> => {
  try {
    const response = await api.post('/api/chat', { query, file_id, language });
    console.log("Chat Response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};