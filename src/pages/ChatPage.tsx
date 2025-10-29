import React from 'react';
import ChatInterface from '../components/ChatInterface';
// Import type from the new types file
import type { Message } from '../types'; // <-- CHANGE HERE
import styles from './ChatPage.module.css'; // Import CSS module

interface Props {
    fileId: string | null;
    // Use the imported type here
    chatMessages: Message[];
    // Use the imported type here
    setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    selectedLanguage: string;
}

const ChatPage: React.FC<Props> = ({ fileId, chatMessages, setChatMessages, selectedLanguage }) => {
    return (
        <div className={`${styles.pageContainer} chat-page-bg-overlay`}> {/* Apply background class */}
             <h1 className="page-title">AI Legal Assistant</h1>
            <div className={styles.chatCard}> {/* Use module class */}
                <ChatInterface
                    fileId={fileId}
                    chatMessages={chatMessages}
                    setChatMessages={setChatMessages}
                    selectedLanguage={selectedLanguage}
                 />
            </div>
        </div>
    );
};
export default ChatPage;