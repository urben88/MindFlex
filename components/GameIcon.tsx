import React from 'react';
import { Brain, Hash, Layers, Eye, Zap, Mic, Ear, Radio, Users, Compass, Anchor, Gamepad2 } from 'lucide-react';

interface Props {
  iconName: string;
  colorClass: string;
  size?: 'sm' | 'md' | 'lg';
}

const Icons: Record<string, any> = {
  Brain, Hash, Layers, Eye, Zap, Mic, Ear, Radio, Users, Compass, Anchor, Gamepad2
};

export const GameIcon: React.FC<Props> = ({ iconName, colorClass, size = 'md' }) => {
  const Icon = Icons[iconName] || Gamepad2;
  
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-12 h-12 p-2.5',
    lg: 'w-16 h-16 p-3.5'
  };

  const iconSize = {
    sm: 16,
    md: 24,
    lg: 32
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClass} rounded-2xl text-white shadow-md flex items-center justify-center shrink-0`}>
      <Icon size={iconSize[size]} strokeWidth={2.5} />
    </div>
  );
};