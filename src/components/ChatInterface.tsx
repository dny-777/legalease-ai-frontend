import React, { useState, useRef, useEffect } from 'react';
// Import type from the new types file
import type { Message } from '../types'; // <-- CHANGE HERE
import { postChatMessage } from '../services/api';
import { Send, Loader2, Volume2, Bot, User } from 'lucide-react';
import styles from './ChatInterface.module.css';

interface Props {
  fileId: string | null;
  // Use the imported type here
  chatMessages: Message[];
  // Use the imported type here
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  selectedLanguage: string;
}

const ChatInterface: React.FC<Props> = ({ fileId, chatMessages, setChatMessages, selectedLanguage }) => {
  const [input, setInput] = useState('');
  const [isBotLoading, setIsBotLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatError, setChatError] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim() || isBotLoading) return;
    const userQuery = input;
    setInput('');
    setChatError(null);
    // Use the imported type here
    const newUserMessage: Message = { id: Date.now().toString(), sender: 'user', text: userQuery };
    setChatMessages(prev => [...prev, newUserMessage]);
    setIsBotLoading(true);
    try {
      const res = await postChatMessage(userQuery, fileId, selectedLanguage);
      // Use the imported type here
      const botResponse: Message = {
        id: (Date.now() + 1).toString(), sender: 'bot', text: res.answer_text, audioUrl: res.audio_url || undefined,
      };
      setChatMessages(prev => [...prev, botResponse]);
      if (res.audio_url) {
        const audio = new Audio(res.audio_url);
        audio.play().catch(e => console.warn("Audio auto-play failed:", e));
      }
    } catch (err: any) {
      console.error('Chat failed', err);
      const detail = err.response?.data?.detail || 'Sorry, I encountered an error.';
      setChatError(String(detail));
    } finally {
      setIsBotLoading(false);
    }
  };

  const handlePlayAudio = (audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error("Audio playback failed:", e));
    }
  }

  return (
    <div className={styles.chatContainer}>
       <div className={styles.messagesArea}>
         {chatMessages.length === 0 && !isBotLoading && (
            <p className={styles.emptyChatMessage}>Ask a question about the document or general law.</p>
         )}
        {chatMessages.map(msg => (
          <div key={msg.id} className={`${styles.messageRow} ${msg.sender === 'user' ? styles.userRow : styles.botRow}`}>
            {msg.sender === 'bot' && <Bot className={styles.botIcon} />}
            <div className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.userBubble : styles.botBubble}`}>
              <p className={styles.messageText}>{msg.text}</p>
              {msg.sender === 'bot' && msg.audioUrl && (
                <button onClick={() => handlePlayAudio(msg.audioUrl)} className={styles.playButton} title="Play audio response">
                  <Volume2 size={12} /> Play Audio
                </button>
              )}
            </div>
             {msg.sender === 'user' && <User className={styles.userIcon} />}
          </div>
        ))}
        {isBotLoading && (
          <div className={`${styles.messageRow} ${styles.botRow}`}>
             <Bot className={styles.botIcon} />
            <div className={styles.loadingBubble}> <Loader2 className={styles.loaderIcon} /> </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <footer className={styles.footer}>
        {chatError && <p className={styles.errorTextFooter}>{chatError}</p>}
        <div className={styles.inputArea}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}} placeholder="Ask a question..." disabled={isBotLoading} className={styles.textInput} />
          <button onClick={handleSend} disabled={isBotLoading || !input.trim()} className={styles.sendButton} title="Send message">
            {isBotLoading ? <Loader2 className={styles.sendIconLoading}/> : <Send className={styles.sendIcon} />}
          </button>
        </div>
      </footer>
    </div>
  );
};
export default ChatInterface;