import React from 'react';
import Card from '../../../components/common/Card';
import { ArrowUp, DollarSign, Printer, AlertTriangle, Package } from 'lucide-react';

export const MetricCard = ({
  title,
  value,
  subtext,
  iconType,
  trendType = 'neutral', // 'positive', 'negative', 'alert', 'neutral'
}) => {
  const getIcon = () => {
    switch (iconType) {
      case 'sales':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="font-bold text-sm">$</span>
          </div>
        );
      case 'printer':
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Printer className="w-4 h-4" />
          </div>
        );
      case 'alert':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case 'orders':
        return (
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
        );
      default:
        return null;
    }
  };

  const renderTrend = () => {
    if (!subtext) return null;

    if (trendType === 'positive') {
      return (
        <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
          <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
          {subtext}
        </span>
      );
    }

    if (trendType === 'alert') {
      return (
        <span className="inline-flex items-center text-xs font-semibold text-[#b83226]">
          <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
          {subtext}
        </span>
      );
    }

    return <span className="text-xs text-slate-500 font-normal">{subtext}</span>;
  };

  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500">{title}</span>
        {getIcon()}
      </div>

      <div className="mt-3">
        <h3 className="font-serif font-bold text-2xl lg:text-[26px] text-slate-900 tracking-tight leading-none">
          {value}
        </h3>
        <div className="mt-2 flex items-center">{renderTrend()}</div>
      </div>
    </Card>
  );
};

export default MetricCard;
