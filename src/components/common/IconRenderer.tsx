import React from 'react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  // Find matching Lucide icon or fallback to Wrench
  const iconMap = Icons as unknown as Record<string, React.ElementType>;
  const LucideIcon = iconMap[name] || Icons.Wrench;
  return <LucideIcon className={className} size={size} aria-hidden="true" />;
};
