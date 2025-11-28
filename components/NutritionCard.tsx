import React from 'react';

interface NutritionCardProps {
  label: string;
  value: number;
  unit: string;
  color: string; // Tailwind text color class
  bg: string; // Tailwind bg color class
  delay?: string; // Animation delay class
}

export const NutritionCard: React.FC<NutritionCardProps> = ({ label, value, unit, color, bg, delay = '' }) => {
  return (
    <div className={`glass-card p-5 rounded-2xl flex flex-col justify-between hover:bg-slate-800/60 transition-colors animate-slide-up ${delay}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</span>
        <div className={`h-2 w-2 rounded-full ${color.replace('text-', 'bg-')}`}></div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold ${color}`}>{value}</span>
        <span className="text-sm text-slate-500 font-medium">{unit}</span>
      </div>
    </div>
  );
};