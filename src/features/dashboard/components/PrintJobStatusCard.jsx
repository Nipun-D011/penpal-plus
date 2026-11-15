import React from 'react';
import Card from '../../../components/common/Card';
import { Link } from 'react-router-dom';

export const PrintJobStatusCard = ({ statuses }) => {
  const getBadgeStyle = (id) => {
    switch (id) {
      case 'pending':
        return {
          pill: 'bg-[#fef9ee] border-[#fce9b8] text-[#92570b]',
          dot: 'bg-[#d97706]',
        };
      case 'prepress':
        return {
          pill: 'bg-[#eff6ff] border-[#dbeafe] text-[#1d4ed8]',
          dot: 'bg-[#3b82f6]',
        };
      case 'printing':
        return {
          pill: 'bg-[#fff7ed] border-[#ffedd5] text-[#c2410c]',
          dot: 'bg-[#f97316]',
        };
      case 'ready':
        return {
          pill: 'bg-[#f0fdf4] border-[#dcfce7] text-[#15803d]',
          dot: 'bg-[#22c55e]',
        };
      default:
        return {
          pill: 'bg-slate-50 border-slate-200 text-slate-700',
          dot: 'bg-slate-400',
        };
    }
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Print job status
        </h3>
        <Link
          to="/print-jobs"
          className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          View board
        </Link>
      </div>

      {/* List of Statuses */}
      <div className="space-y-3 flex-1 flex flex-col justify-center">
        {statuses.map((status) => {
          const style = getBadgeStyle(status.id);

          return (
            <div
              key={status.id}
              className="flex items-center justify-between py-1"
            >
              {/* Status Pill */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${style.pill}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                <span>{status.label}</span>
              </div>

              {/* Number Count */}
              <span className="font-bold text-sm text-slate-900 pr-1">
                {status.count}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PrintJobStatusCard;
