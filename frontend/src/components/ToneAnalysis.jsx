import React from 'react';

/**
 * ToneAnalysis Component
 * Displays urgency, sentiment, and the literal subtext explanation.
 */
export default function ToneAnalysis({ urgency, urgencyReason, sentiment, subtext }) {
  // Determine calming pastel background for urgency level
  const getUrgencyClass = () => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return 'urgency-high';
      case 'medium':
        return 'urgency-medium';
      case 'low':
      default:
        return 'urgency-low';
    }
  };

  return (
    <div className="analysis-card">
      <div className="analysis-meta">
        <div className="meta-item">
          <span className="meta-label">Urgency</span>
          <span className={`urgency-badge ${getUrgencyClass()}`}>
            {urgency || 'Medium'}
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Sender Sentiment</span>
          <span className="sentiment-badge">
            {sentiment || 'Neutral'}
          </span>
        </div>
      </div>

      {urgencyReason && (
        <div className="urgency-explanation">
          <strong>Why:</strong> {urgencyReason}
        </div>
      )}

      <div className="subtext-section">
        <h4>🔍 The Hidden Meaning (Subtext)</h4>
        <p className="subtext-body">
          {subtext || "The sender didn't include specific instructions, but here is what they are implying in plain text."}
        </p>
      </div>
    </div>
  );
}
