import React, { useState } from 'react';

// Preset confusing corporate templates
const TEMPLATES = [
  {
    id: 'love',
    title: '💬 Vague Revision ("Needs Some Love")',
    sender: 'Jane (Design Lead)',
    context: 'Requested feedback on a web project page.',
    message: "Hey, whenever you get a chance, could you take a look at the dashboard page? It's looking a bit busy and might need some love before we show the client tomorrow afternoon. Also, let's keep an eye on the load times. Thanks!"
  },
  {
    id: 'ducks',
    title: '📧 Meeting Follow-Up ("Ducks in a Row")',
    sender: 'Mark (Product Manager)',
    context: 'Post-meeting alignment instructions.',
    message: "Hey team, regarding the launch roadmap, I think we should circle back on the database migrations. We need to make sure we're not putting the cart before the horse. Let's touch base next week. Let's make sure our ducks are in a row."
  },
  {
    id: 'yesterday',
    title: '🔥 High-Stress Fire Drill ("Like Yesterday")',
    sender: 'Sarah (VP of Sales)',
    context: 'An urgent request sent mid-afternoon.',
    message: "Hey, can you do me a quick favor? I need a list of all active enterprise trials. Need this like yesterday for a call. Sorry for the fire drill! You're a lifesaver!"
  },
  {
    id: 'fruit',
    title: '📋 Unclear Priorities ("Low-Hanging Fruit")',
    sender: 'David (Engineering Manager)',
    context: 'Assigning sprint tasks.',
    message: "We have a lot of items on our plate, but let's grab the low-hanging fruit first. I added some tasks to the backlog board. Go ahead and pick up whatever makes sense. Let's try to get some quick wins."
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
