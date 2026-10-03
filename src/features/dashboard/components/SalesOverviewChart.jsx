import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const SalesOverviewChart = ({ data }) => {
  const [activeRange, setActiveRange] = useState('Month');

  const ranges = ['Week', 'Month', 'Year'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-amber-400 font-medium mt-0.5">
            Rs. {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      {/* Header with Title & Range Filter */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-slate-900">
          Weekly sales overview
        </h3>

        {/* Range Selector Pill */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs border border-slate-200/60">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                activeRange === range
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-56 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={8}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey="sales" radius={[6, 6, 0, 0]} maxBarSize={28}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isHighlight ? '#e8a838' : '#151f33'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesOverviewChart;
