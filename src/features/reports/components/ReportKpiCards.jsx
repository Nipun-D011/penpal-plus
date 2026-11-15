import { ArrowUp, ArrowDown } from 'lucide-react';

export const ReportKpiCards = ({ metrics = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const isUp = metric.trend === 'up';

        return (
          <div
            key={metric.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
          >
            <p className="text-xs font-medium text-slate-500">
              {metric.title}
            </p>

            <div className="mt-2">
              <span className="font-serif font-bold text-2xl lg:text-[28px] text-slate-900 tracking-tight leading-none">
                {metric.value}
              </span>
            </div>

            <div className="mt-2.5 flex items-center gap-1.5">
              <div
                className={`flex items-center text-xs font-semibold ${
                  isUp ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {isUp ? (
                  <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
                <span>{metric.change}</span>
              </div>

              {metric.period && (
                <span className="text-xs text-slate-500 font-normal">
                  {metric.period}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportKpiCards;
