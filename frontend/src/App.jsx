import React, { useState, useEffect } from 'react';
import ChatSimulator from './components/ChatSimulator';
import CopilotSidebar from './components/CopilotSidebar';
import SettingsModal from './components/SettingsModal';
import { analyzeMessage } from './utils/geminiService';
import './App.css';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [textSize, setTextSize] = useState('normal');
  
  // Interpretation State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  // Load API key, theme, and text size from localStorage on startup
  useEffect(() => {
    const savedKey = localStorage.getItem('neurobridge_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setIsSettingsOpen(true);
    }

    const savedTheme = localStorage.getItem('neurobridge_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedSize = localStorage.getItem('neurobridge_text_size') || 'normal';
    setTextSize(savedSize);
    document.documentElement.setAttribute('data-size', savedSize);
  }, []);

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem('neurobridge_api_key', newKey);
    setError(null);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('neurobridge_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const toggleTextSize = () => {
    const sizes = ['normal', 'large', 'xl'];
    const currentIndex = sizes.indexOf(textSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    const nextSize = sizes[nextIndex];
    setTextSize(nextSize);
    localStorage.setItem('neurobridge_text_size', nextSize);
    document.documentElement.setAttribute('data-size', nextSize);
  };
  const handleInterpret = async (message) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!apiKey) {
        throw new Error("No Gemini API Key found. Please open Settings (⚙️) and enter your key.");
      }
      const result = await analyzeMessage(message, apiKey);
      setAnalysisData(result);
    } catch (err) {
      setError(err);
      setAnalysisData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="brand-section">
          <h1>NeuroBridge 🍃</h1>
          <p>AI Workplace Communication Copilot for Autistic Professionals</p>
        </div>
        
        <div className="header-controls">
          <button 
            type="button" 
            className="btn-icon" 
            onClick={toggleTextSize}
            title="Adjust Text Size (A / A⁺ / A⁺⁺)"
            aria-label="Adjust text size"
            style={{ fontWeight: 'bold', fontSize: '0.95rem' }}
          >
            {textSize === 'normal' ? 'A' : textSize === 'large' ? 'A⁺' : 'A⁺⁺'}
          </button>
          <button 
            type="button" 
            className="btn-icon" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button 
            type="button" 
            className="btn-icon" 
            onClick={() => setIsSettingsOpen(true)}
            title="Open Settings"
            aria-label="Open settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="column-left">
          <ChatSimulator 
            onInterpret={handleInterpret} 
            isLoading={isLoading} 
          />
        </section>
        
        <section className="column-right">
          <CopilotSidebar 
            data={analysisData} 
            isLoading={isLoading} 
            error={error} 
            isKeyConfigured={!!apiKey}
          />
        </section>
      </main>

      <footer style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>NeuroBridge — A project built for the Build with Gemini XPRIZE. All keys and data are kept secure in local storage.</p>
      </footer>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        currentApiKey={apiKey} 
        onSave={handleSaveApiKey} 
      />
    </div>
  );
}
