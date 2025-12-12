import React from 'react';

const statusStyles = {
  running: {
    bg: 'bg-green-900/50',
    border: 'border-green-700',
    text: 'text-green-400',
    dot: 'bg-green-400',
  },
  stopped: {
    bg: 'bg-gray-800/50',
    border: 'border-gray-600',
    text: 'text-gray-400',
    dot: 'bg-gray-500',
  },
  starting: {
    bg: 'bg-yellow-900/50',
    border: 'border-yellow-700',
    text: 'text-yellow-400',
    dot: 'bg-yellow-400',
  },
  stopping: {
    bg: 'bg-orange-900/50',
    border: 'border-orange-700',
    text: 'text-orange-400',
    dot: 'bg-orange-400',
  },
  error: {
    bg: 'bg-red-900/50',
    border: 'border-red-700',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
  active: {
    bg: 'bg-green-900/50',
    border: 'border-green-700',
    text: 'text-green-400',
    dot: 'bg-green-400',
  },
  inactive: {
    bg: 'bg-gray-800/50',
    border: 'border-gray-600',
    text: 'text-gray-400',
    dot: 'bg-gray-500',
  },
};

export default function StatusBadge({ status, showDot = true, className = '' }) {
  const styles = statusStyles[status] || statusStyles.stopped;
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${styles.bg} ${styles.border} ${styles.text} ${className}`}
    >
      {showDot && (
        <span className={`w-2 h-2 rounded-full ${styles.dot} ${status === 'running' || status === 'active' ? 'status-pulse' : ''}`} />
      )}
      {displayStatus}
    </span>
  );
}
