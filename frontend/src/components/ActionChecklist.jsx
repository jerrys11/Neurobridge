import React, { useState, useEffect } from 'react';

/**
 * ActionChecklist Component
 * Renders an interactive, numbered task checklist with progress indicator.
 */
export default function ActionChecklist({ checklist = [] }) {
  const [completedTasks, setCompletedTasks] = useState({});

  // Reset checked state when a new checklist is loaded
  useEffect(() => {
    setCompletedTasks({});
  }, [checklist]);

  const toggleTask = (index) => {
    setCompletedTasks(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const totalTasks = checklist.length;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const percentComplete = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const handleCopyList = () => {
    const listText = checklist.map((item, idx) => `[ ] ${idx + 1}. ${item}`).join('\n');
    navigator.clipboard.writeText(listText);
    alert('Actionable checklist copied to clipboard!');
  };

  if (!checklist || checklist.length === 0) return null;

  return (
    <div className="checklist-card">
      <div className="card-sub-header">
        <h4>📋 Actionable Checklist</h4>
        <button type="button" className="btn-text-only" onClick={handleCopyList}>
          Copy List
        </button>
      </div>

      <div className="progress-container">
        <div className="progress-bar-wrapper">
          <div className="progress-bar" style={{ width: `${percentComplete}%` }}></div>
        </div>
        <div className="progress-text">
          {completedCount} of {totalTasks} steps completed ({percentComplete}%)
        </div>
      </div>

      <ul className="checklist-list">
        {checklist.map((item, index) => (
          <li 
            key={index} 
            className={`checklist-item ${completedTasks[index] ? 'checked' : ''}`}
            onClick={() => toggleTask(index)}
          >
            <input
              type="checkbox"
              checked={!!completedTasks[index]}
              onChange={() => {}} // handled by onClick on the list item
              className="checkbox-input"
            />
            <span className="task-text">
              <span className="task-number">{index + 1}.</span> {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
