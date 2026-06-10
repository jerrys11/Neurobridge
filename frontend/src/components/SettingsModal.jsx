import React, { useState } from 'react';
import { signup } from '../utils/geminiService';

/**
 * Join-the-pilot modal (replaces the old API-key settings modal).
 * Captures email + role — this is the user-evidence funnel for the XPRIZE
 * and the top of the sales funnel for employer pilots.
 */
export default function SettingsModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('professional');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      await signup(email, role);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="joinTitle" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="joinTitle">Join the NeuroBridge pilot</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {status === 'done' ? (
          <div className="modal-form">
            <p className="settings-instruction">
              You're on the list. We'll reach out shortly — usually within one business day.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn btn-primary" onClick={onClose}>Done</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <p className="settings-instruction">
              Free to try, no setup needed. Leave your email to save your results, get a personal
              workspace, or set up an <strong>employer pilot</strong> for your team.
            </p>

            <div className="form-group">
              <label htmlFor="joinEmail">Work email</label>
              <input
                id="joinEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="text-input"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="joinRole">I am…</label>
              <select
                id="joinRole"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="text-input"
              >
                <option value="professional">A professional who wants this for myself</option>
                <option value="employer">An employer / HR / team lead</option>
                <option value="coach">A job coach or employment specialist</option>
                <option value="other">Other</option>
              </select>
            </div>

            {status === 'error' && (
              <p className="helper-text" role="alert" style={{ color: 'var(--color-danger)' }}>{errorMsg}</p>
            )}

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Join'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
