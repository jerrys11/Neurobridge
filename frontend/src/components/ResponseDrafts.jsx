import React, { useState } from 'react';

/**
 * ResponseDrafts Component
 * Renders tone-adjusted response drafts in a tabbed UI.
 */
export default function ResponseDrafts({ drafts = [] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!drafts || drafts.length === 0) return null;

  return (
    <div className="drafts-card">
      <h4>✍️ Tone-Adjusted Drafts</h4>
      <p className="card-sub-description">
        Choose a response style that fits your company's communication culture. Copy and paste it directly.
      </p>

      <div className="tab-header">
        {drafts.map((draft, index) => (
          <button
            key={index}
            type="button"
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(index);
              setCopied(false);
            }}
          >
            {draft.tone}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <div className="draft-textarea-wrapper">
          <div className="draft-text-box">
            {drafts[activeTab]?.text}
          </div>
          <button
            type="button"
            className={`btn btn-copy ${copied ? 'copied' : 'btn-primary'}`}
            onClick={() => handleCopy(drafts[activeTab]?.text)}
          >
            {copied ? '✓ Copied!' : '📋 Copy Draft'}
          </button>
        </div>
      </div>
    </div>
  );
}
