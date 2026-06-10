import React, { useState, useEffect, useRef } from 'react';
import ChatSimulator from './components/ChatSimulator';
import CopilotSidebar from './components/CopilotSidebar';
import SettingsModal from './components/SettingsModal';
import { analyzeMessage } from './utils/geminiService';
import './App.css';

export default function App() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [textSize, setTextSize] = useState('normal');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('neurobridge_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedSize = localStorage.getItem('neurobridge_text_size') || 'normal';
    setTextSize(savedSize);
    document.documentElement.setAttribute('data-size', savedSize);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('neurobridge_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const toggleTextSize = () => {
    const sizes = ['normal', 'large', 'xl'];
    const nextSize = sizes[(sizes.indexOf(textSize) + 1) % sizes.length];
    setTextSize(nextSize);
    localStorage.setItem('neurobridge_text_size', nextSize);
    document.documentElement.setAttribute('data-size', nextSize);
  };

  const handleInterpret = async (message) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeMessage(message);
      setAnalysisData(result);
      // Bring results into view, respecting reduced-motion preferences.
      requestAnimationFrame(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        resultsRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      });
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
          <h1>NeuroBridge <span aria-hidden="true">🍃</span></h1>
          <p>AI Workplace Communication Copilot for Autistic Professionals</p>
        </div>

        <div className="header-controls">
          <button
            type="button"
            className="btn-icon"
            onClick={toggleTextSize}
            title="Adjust Text Size (A / A+ / A++)"
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
            <span aria-hidden="true">{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-join"
            onClick={() => setIsJoinOpen(true)}
          >
            Join the pilot
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

        <section className="column-right" ref={resultsRef}>
          <CopilotSidebar
            data={analysisData}
            isLoading={isLoading}
            error={error}
          />
        </section>
      </main>

      <footer style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>
          NeuroBridge — built for the Build with Gemini XPRIZE. Messages you analyze are processed
          securely and never used to train AI models.
        </p>
      </footer>

      <SettingsModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
      />
    </div>
  );
}
