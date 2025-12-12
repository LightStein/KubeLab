import React from 'react';

export default function ProgressBar({
  value,
  max = 100,
  label = '',
  showValue = true,
  size = 'md',
  color = 'blue',
  className = ''
}) {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    blue: 'bg-k8s-blue',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  const colorClass = percentage > 80 ? colors.red : percentage > 60 ? colors.yellow : colors[color];

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium text-gray-300">
              {value.toFixed(1)} / {max} hrs
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-[#21262d] rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} ${colorClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
