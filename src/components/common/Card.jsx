import React from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  onClick = null
}) {
  const baseStyles = 'bg-[#161b22] border border-[#30363d] rounded-xl';
  const hoverStyles = hover ? 'hover:border-[#484f58] hover:bg-[#1c2128] transition-all duration-200 cursor-pointer' : '';
  const glowStyles = glow ? 'glow-blue' : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${glowStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-[#30363d] ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}
