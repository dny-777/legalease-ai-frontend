import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DocumentPage from './pages/DocumentPage';
import ChatPage from './pages/ChatPage';
import AboutPage from './pages/AboutPage';
// Import types from the new file
import type { AnalyzedData, Message } from './types'; // <-- CHANGE HERE

// List of supported languages (moved definition here for clarity)
// List of reliably working languages for the demo
export const languages = [
  "English",
  "Hindi",
  "Marathi",
  "Tamil", // Keep if tested and working
  "Telugu"  // Keep if tested and working
  // Remove Bengali, Gujarati, Kannada, Malayalam, Punjabi for now
];

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  // Use the imported types for state
  const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // Use the imported type in the handler function signature
  const handleDocumentUpdate = (id: string | null, name: string | null, data: AnalyzedData | null) => {
    setFileId(id);
    setFileName(name);
    setAnalyzedData(data);
    if (id) { // Reset chat only if upload was successful
        setChatMessages([]);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Header
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          languages={languages}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/document"
              element={
                <DocumentPage
                  analyzedData={analyzedData}
                  fileName={fileName}
                  selectedLanguage={selectedLanguage}
                  onDocumentUpdate={handleDocumentUpdate}
                />
              }
            />
            <Route
              path="/chat"
              element={
                <ChatPage
                    fileId={fileId}
                    chatMessages={chatMessages}
                    setChatMessages={setChatMessages}
                    selectedLanguage={selectedLanguage}
                />
               }
            />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
         <footer style={{ padding: '1rem', backgroundColor: '#112240', textAlign: 'center', fontSize: '0.75rem', color: '#8892b0', borderTop: '1px solid #0A192F' }}>
           LegalEase AI © 2025
         </footer>
      </div>
    </Router>
  );
}

export default App;