import React from 'react';
import ToneAnalysis from './ToneAnalysis';
import ActionChecklist from './ActionChecklist';
import ResponseDrafts from './ResponseDrafts';
import JargonSensoryTips from './JargonSensoryTips';

/**
 * CopilotSidebar Component
 * Coordinates the display states (Empty, Loading, Error, and Results).
 */
export default function CopilotSidebar({ data, isLoading, error, isKeyConfigured }) {
  return (
    <div className="copilot-sidebar-card">
      <div className="sidebar-header">
        <h2>🤖 NeuroBridge Copilot</h2>
      </div>

      {isLoading && (
        <div className="loading-sidebar-state">
          <div className="spinner"></div>
          <p>Analyzing message subtext...</p>
          <span className="loading-subtext">Take a deep breath. We are breaking this task down.</span>
        </div>
      )}

      {error && (
        <div className="empty-sidebar-state" style={{ color: 'var(--color-danger)' }}>
          <span className="empty-icon">⚠️</span>
          <h3>Interpretation Error</h3>
          <p>{error.message || "An unexpected error occurred. Please verify your API key and try again."}</p>
        </div>
      )}

      {!isLoading && !error && !data && (
        <div className="empty-sidebar-state">
          <span className="empty-icon">🍃</span>
          <h3>Ready to Assist</h3>
          {!isKeyConfigured ? (
            <p>Please click the settings gear ⚙️ at the top right to configure your Gemini API Key first.</p>
          ) : (
            <p>Select a template on the left or type your own message, then click <strong>Interpret</strong> to begin.</p>
          )}
        </div>
      )}

      {!isLoading && !error && data && (
        <div className="sidebar-results">
          <ToneAnalysis
            urgency={data.urgency}
            urgencyReason={data.urgencyReason}
            sentiment={data.sentiment}
            subtext={data.subtext}
          />
          
          <ActionChecklist 
            checklist={data.checklist} 
          />
          
          <ResponseDrafts 
            drafts={data.drafts} 
          />
          
          <JargonSensoryTips 
            jargon={data.jargon} 
            sensoryTips={data.sensoryTips} 
          />
        </div>
      )}
    </div>
  );
}
