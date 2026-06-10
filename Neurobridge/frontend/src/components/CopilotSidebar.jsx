import React from 'react';
import ToneAnalysis from './ToneAnalysis';
import ActionChecklist from './ActionChecklist';
import ResponseDrafts from './ResponseDrafts';
import JargonSensoryTips from './JargonSensoryTips';

/**
 * CopilotSidebar Component
 * Coordinates the display states (Empty, Loading, Error, and Results).
 */
export default function CopilotSidebar({ data, isLoading, error }) {
  return (
    <div className="copilot-sidebar-card">
      <div className="sidebar-header">
        <h2><span aria-hidden="true">🤖</span> NeuroBridge Copilot</h2>
      </div>

      {isLoading && (
        <div className="loading-sidebar-state" role="status">
          <div className="spinner" aria-hidden="true"></div>
          <p>Analyzing message subtext...</p>
          <span className="loading-subtext">Take a deep breath. We are breaking this task down.</span>
        </div>
      )}

      {error && (
        <div className="empty-sidebar-state" role="alert" style={{ color: 'var(--color-danger)' }}>
          <span className="empty-icon" aria-hidden="true">⚠️</span>
          <h3>Interpretation Error</h3>
          <p>{error.message || 'An unexpected error occurred. Please try again in a moment.'}</p>
        </div>
      )}

      {!isLoading && !error && !data && (
        <div className="empty-sidebar-state">
          <span className="empty-icon" aria-hidden="true">🍃</span>
          <h3>Ready to Assist</h3>
          <p>Select a template on the left or paste your own message, then click <strong>Interpret</strong> to begin. No sign-up needed.</p>
        </div>
      )}

      {!isLoading && !error && data && (
        <div className="sidebar-results">
          <ToneAnalysis
            urgency={data.urgency}
            urgencyReason={data.urgencyReason}
            sentiment={data.sentiment}
            subtext={data.subtext}
            deadline={data.deadline}
            assumedContext={data.assumedContext}
          />

          <ActionChecklist checklist={data.checklist} />

          <ResponseDrafts drafts={data.drafts} />

          <JargonSensoryTips jargon={data.jargon} sensoryTips={data.sensoryTips} />
        </div>
      )}
    </div>
  );
}
