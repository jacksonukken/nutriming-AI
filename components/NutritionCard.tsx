import React from 'react';

interface NutritionCardProps {
  label: string;
  value: number;
  unit: string;
  colorClass: string;
  icon?: React.ReactNode;
}

export const NutritionCard: React.FC<NutritionCardProps> = ({ label, value, unit, colorClass, icon }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md">
      <div>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{label}</p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
          <span className="text-slate-400 text-sm">{unit}</span>
        </div>
      </div>
      {icon && (
        <div className={`p-2 rounded-full bg-opacity-10 ${colorClass.replace('text-', 'bg-').replace('700', '100').replace('600', '100')}`}>
           {icon}
        </div>
      )}
    </div>
  );
};