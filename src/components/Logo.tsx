import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-12 h-12',
  };

  return (
    <svg
      className={`${sizes[size]} ${className}`}
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Plate */}
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.9"
      />
      <circle
        cx="50"
        cy="50"
        r="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.7"
      />
      
      {/* Fork */}
      <g transform="translate(25, 50)">
        <rect x="0" y="-20" width="3" height="35" rx="1.5" />
        <rect x="-3" y="-20" width="2" height="8" rx="1" />
        <rect x="1" y="-20" width="2" height="8" rx="1" />
        <rect x="4" y="-20" width="2" height="8" rx="1" />
      </g>
      
      {/* Knife */}
      <g transform="translate(75, 50)">
        <rect x="-1.5" y="-20" width="3" height="35" rx="1.5" />
        <path d="M 1.5 -20 L 5 -15 L 5 -5 L 1.5 -5 Z" opacity="0.8" />
      </g>
    </svg>
  );
};

export default Logo;
