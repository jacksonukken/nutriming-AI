import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { NutritionData } from '../types';

interface NutritionChartProps {
  data: NutritionData;
}

// Dark mode optimized colors: Emerald, Blue, Amber
const COLORS = ['#34d399', '#60a5fa', '#fbbf24'];

export const NutritionChart: React.FC<NutritionChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Protein', value: data.protein },
    { name: 'Carbs', value: data.carbs },
    { name: 'Fat', value: data.fat },
  ];

  const activeData = chartData.filter(d => d.value > 0);

  if (activeData.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-slate-600 text-sm">
        No macro data
      </div>
    );
  }

  return (
    <div className="h-48 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={activeData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {activeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}g`, '']}
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              borderColor: '#1e293b', 
              color: '#f8fafc',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
            }}
            itemStyle={{ color: '#cbd5e1' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-white">
          {Math.round(data.protein + data.carbs + data.fat)}g
        </span>
        <span className="text-xs text-slate-500 uppercase tracking-wide">Total</span>
      </div>
    </div>
  );
};