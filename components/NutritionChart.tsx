import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { NutritionData } from '../types';

interface NutritionChartProps {
  data: NutritionData;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B']; // Emerald (Protein), Blue (Carbs), Amber (Fat)

export const NutritionChart: React.FC<NutritionChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Protein', value: data.protein },
    { name: 'Carbs', value: data.carbs },
    { name: 'Fat', value: data.fat },
  ];

  // Filter out zero values to avoid empty segments or label issues
  const activeData = chartData.filter(d => d.value > 0);

  if (activeData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        No macro data available
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
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
          >
            {activeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}g`, '']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};