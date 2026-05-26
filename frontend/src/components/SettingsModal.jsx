import React, { useState } from 'react';

/**
 * SettingsModal Component
 * Allows users to input and save their Gemini API Key in localStorage.
 */
export default function SettingsModal({ isOpen, onClose, currentApiKey, onSave }) {
  const [keyInput, setKeyInput] = useState(currentApiKey || '');
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(keyInput.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Configure Copilot</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close settings">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <p className="settings-instruction">
            NeuroBridge runs live in your browser. To power the AI interpreter, please enter your personal <strong>Gemini API Key</strong> below.
          </p>

          <div className="api-key-source">
            <span>Don't have a key? </span>
            <a 
              href="https://aistudio.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link-accent"
            >
              Get a free API Key from Google AI Studio &rarr;
            </a>
          </div>

          <div className="form-group">
            <label htmlFor="apiKeyInput">Gemini API Key</label>
            <div className="input-password-wrapper">
              <input
                id="apiKeyInput"
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="text-input"
                autoFocus
              />
              <button
                type="button"
                className="toggle-visibility-btn"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <span className="helper-text">
              Your key is saved locally in your browser cache and is never sent to any external server other than Google's Gemini API.
            </span>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
