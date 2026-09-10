import React from 'react';

interface PlateAndForkProps {
  className?: string;
  size?: number;
}

const PlateAndFork: React.FC<PlateAndForkProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Plate */}
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Fork */}
      <path
        d="M4 2v7c0 .5.5 1 1 1s1-.5 1-1V2M4.5 2v3M5.5 2v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 9v11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Knife */}
      <path
        d="M20 2v11c0 .5-.5 1-1 1s-1-.5-1-1V2c0 0 1 1 1 3s1 3 1 3V2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M19 14v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default PlateAndFork;
