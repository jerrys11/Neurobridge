import React, { useState } from 'react';

// Preset confusing vocational templates (customized for Lambs Farm demo)
const TEMPLATES = [
  {
    id: 'bakery',
    title: '🥐 Bakery Packaging ("Looks Sharp")',
    sender: 'Chef Sarah (Bakery Manager)',
    context: 'Requested packaging checks for the morning order.',
    message: "Hey Alex, let's make sure the packaging for the breakfast bread order looks sharp and professional before the delivery truck leaves at 9:00 AM. Give them a quick inspection. Thanks!"
  },
  {
    id: 'pet-center',
    title: '🐶 Pet Shop Setup ("Ducks in a Row")',
    sender: 'Jim (Pet Center Lead)',
    context: 'Preparing the shop floor for the weekend.',
    message: "Hi team, regarding the inventory check, we need to circle back on the guinea pig runs and check the food inventory before the weekend. Let's make sure our ducks are in a row before Saturday opening."
  },
  {
    id: 'cafe',
    title: '🥞 Café Shift Prep ("Like Yesterday")',
    sender: 'Manager Lisa (Café Restaurant)',
    context: 'An urgent request sent for Sunday Brunch prep.',
    message: "Hey, can you do me a quick favor? We're going to be slammed for Sunday brunch prep. Can you come in a bit early? Need you here like yesterday. Sorry for the fire drill! You're a lifesaver!"
  },
  {
    id: 'garden',
    title: '🌿 Garden Center ("Low-Hanging Fruit")',
    sender: 'Dave (Greenhouse Manager)',
    context: 'Daily plant maintenance tasks.',
    message: "We have a lot of items on our plate today, but let's grab the low-hanging fruit first. I put some flats of annuals in the middle aisle. Go ahead and get them looking fresh."
  }
];

export default function ChatSimulator({ onInterpret, isLoading }) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customText, setCustomText] = useState('');

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template.id);
    setCustomText(template.message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customText.trim()) {
      onInterpret(customText);
    }
  };

  return (
    <div className="chat-simulator-card">
      <div className="card-header">
        <h3>1. Select or Paste a Message</h3>
        <p className="card-subtitle">Choose a common confusing message template below, or paste a real email/Slack message you received.</p>
      </div>

      <div className="template-grid">
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            type="button"
            className={`template-button ${selectedTemplate === tmpl.id ? 'active' : ''}`}
            onClick={() => handleSelectTemplate(tmpl)}
          >
            <div className="template-title">{tmpl.title}</div>
            <div className="template-meta">From {tmpl.sender}</div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="message-form">
        <div className="form-group">
          <label htmlFor="messageInput">Workplace Message Editor</label>
          <textarea
            id="messageInput"
            value={customText}
            onChange={(e) => {
              setCustomText(e.target.value);
              setSelectedTemplate(''); // Deselect preset if user edits text
            }}
            placeholder="Type or paste a message here..."
            rows={6}
            className="textarea-input"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setCustomText('');
              setSelectedTemplate('');
            }}
            disabled={isLoading || !customText}
          >
            Clear
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !customText.trim()}
          >
            {isLoading ? 'Interpreting...' : '🔍 Interpret with NeuroBridge'}
          </button>
        </div>
      </form>
    </div>
  );
}
