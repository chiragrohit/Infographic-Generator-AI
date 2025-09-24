
import React from 'react';

export const IconChartBar: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M3 3v18h18" />
    <path d="M7 16V8" />
    <path d="M12 16V4" />
    <path d="M17 16v-2" />
  </svg>
);
