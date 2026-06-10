import React, { useState, useEffect } from 'react';

/**
 * ActionChecklist Component
 * Interactive, numbered task checklist with progress indicator.
 * Fully keyboard- and screen-reader-accessible: the checkbox inside a
 * <label> is the real control (no click handlers on list items).
 */
export default function ActionChecklist({ checklist = [] }) {
  const [completedTasks, setCompletedTasks] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCompletedTasks({});
  }, [checklist]);

  const toggleTask = (index) => {
    setCompletedTasks((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const totalTasks = checklist.length;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const percentComplete = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const handleCopyList = async () => {
    const listText = checklist.map((item, idx) => `[ ] ${idx + 1}. ${item}`).join('\n');
    try {
      await navigator.clipboard.writeText(listText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — fail quietly */
    }
  };

  if (!checklist || checklist.length === 0) return null;

  return (
    <div className="checklist-card">
      <div className="card-sub-header">
        <h4><span aria-hidden="true">📋</span> Actionable Checklist</h4>
        <button type="button" className="btn-text-only" onClick={handleCopyList} aria-live="polite">
          {copied ? 'Copied ✓' : 'Copy List'}
        </button>
      </div>

      <div className="progress-container">
        <div className="progress-bar-wrapper" role="progressbar" aria-valuenow={percentComplete} aria-valuemin={0} aria-valuemax={100} aria-label="Checklist progress">
          <div className="progress-bar" style={{ width: `${percentComplete}%` }}></div>
        </div>
        <div className="progress-text">
          {completedCount} of {totalTasks} steps completed ({percentComplete}%)
        </div>
      </div>

      <ul className="checklist-list">
        {checklist.map((item, index) => (
          <li key={index} className={`checklist-item ${completedTasks[index] ? 'checked' : ''}`}>
            <label className="checklist-label">
              <input
                type="checkbox"
                checked={!!completedTasks[index]}
                onChange={() => toggleTask(index)}
                className="checkbox-input"
              />
              <span className="task-text">
                <span className="task-number">{index + 1}.</span> {item}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
