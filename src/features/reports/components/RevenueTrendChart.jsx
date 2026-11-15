import { useState } from 'react';

export const RevenueTrendChart = ({ data = [], title = 'Revenue trend – last 6 months' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Find max value to compute height proportions accurately
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
          {title}
        </h3>
      </div>

      {/* Bar Chart Area */}
      <div className="relative pt-6 pb-2">
        <div className="h-44 sm:h-52 flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-6 border-b border-slate-100">
          {data.map((item, index) => {
            const heightPercent = Math.max(Math.round((item.amount / maxAmount) * 88), 12);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-10 z-20 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2 rounded-md shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in duration-150">
                    <span>{item.month}: {item.displayAmount}</span>
                  </div>
                )}

                {/* Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 ${
                    item.isCurrent
                      ? 'bg-[#e8a838] group-hover:bg-[#df9f2e]'
                      : 'bg-[#15213b] group-hover:bg-[#1f3156]'
                  } ${isHovered ? 'scale-y-[1.02] shadow-md' : ''}`}
                />
              </div>
            );
          })}
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between gap-3 sm:gap-6 px-2 sm:px-6 pt-3">
          {data.map((item) => (
            <div key={item.month} className="flex-1 text-center">
              <span
                className={`text-xs ${
                  item.isCurrent
                    ? 'font-bold text-slate-900'
                    : 'font-medium text-slate-500'
                }`}
              >
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueTrendChart;
