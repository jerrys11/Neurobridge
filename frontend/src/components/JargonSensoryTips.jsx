import React from 'react';

/**
 * JargonSensoryTips Component
 * Renders corporate jargon explanations and anxiety-reducing sensory tips.
 */
export default function JargonSensoryTips({ jargon = [], sensoryTips = [] }) {
  const hasJargon = jargon && jargon.length > 0;
  const hasTips = sensoryTips && sensoryTips.length > 0;

  if (!hasJargon && !hasTips) return null;

  return (
    <div className="jargon-sensory-card">
      {hasJargon && (
        <div className="jargon-section">
          <h4>💬 Corporate Jargon Translation</h4>
          <dl className="jargon-list">
            {jargon.map((item, idx) => (
              <div key={idx} className="jargon-item">
                <dt className="jargon-phrase">"{item.phrase}"</dt>
                <dd className="jargon-translation">{item.translation}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {hasJargon && hasTips && <div className="card-divider" />}

      {hasTips && (
        <div className="sensory-section">
          <h4>🍃 Sensory Pacing & Stress Tips</h4>
          <ul className="sensory-list">
            {sensoryTips.map((tip, idx) => (
              <li key={idx} className="sensory-tip">
                <span className="sensory-bullet">✦</span>
                <span className="sensory-text">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
