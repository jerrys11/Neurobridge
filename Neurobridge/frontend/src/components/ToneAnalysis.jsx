import React from 'react';

/**
 * ToneAnalysis Component
 * Urgency, sentiment, deadline, literal subtext, and unstated assumptions.
 */
export default function ToneAnalysis({ urgency, urgencyReason, sentiment, subtext, deadline, assumedContext = [] }) {
  const getUrgencyClass = () => {
    switch (urgency?.toLowerCase()) {
      case 'high': return 'urgency-high';
      case 'medium': return 'urgency-medium';
      case 'low':
      default: return 'urgency-low';
    }
  };
  // Never rely on color alone to communicate urgency.
  const urgencyIcon = { high: '▲', medium: '◆', low: '●' }[urgency?.toLowerCase()] || '◆';

  return (
    <div className="analysis-card">
      <div className="analysis-meta">
        <div className="meta-item">
          <span className="meta-label">Urgency</span>
          <span className={`urgency-badge ${getUrgencyClass()}`}>
            <span aria-hidden="true">{urgencyIcon}</span> {urgency || 'Medium'}
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Sender Sentiment</span>
          <span className="sentiment-badge">{sentiment || 'Neutral'}</span>
        </div>
        {deadline?.phrase && (
          <div className="meta-item">
            <span className="meta-label">Deadline</span>
            <span className={`deadline-badge ${deadline.isExplicit ? '' : 'deadline-inferred'}`}>
              <span aria-hidden="true">🕒</span> {deadline.phrase}
              {!deadline.isExplicit && deadline.phrase !== 'No deadline stated' && (
                <em className="deadline-note"> (inferred)</em>
              )}
            </span>
          </div>
        )}
      </div>

      {urgencyReason && (
        <div className="urgency-explanation">
          <strong>Why:</strong> {urgencyReason}
        </div>
      )}

      <div className="subtext-section">
        <h4><span aria-hidden="true">🔍</span> The Hidden Meaning (Subtext)</h4>
        <p className="subtext-body">
          {subtext || "The sender didn't include specific instructions, but here is what they are implying in plain text."}
        </p>
      </div>

      {assumedContext && assumedContext.length > 0 && (
        <div className="subtext-section">
          <h4><span aria-hidden="true">🧩</span> What the Sender Assumes You Know</h4>
          <ul className="assumed-list">
            {assumedContext.map((item, idx) => (
              <li key={idx} className="assumed-item">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
