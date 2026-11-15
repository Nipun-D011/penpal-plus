import React from 'react';
import Card from '../../../components/common/Card';

export const InventoryStatCard = ({ title, value, variant = 'default' }) => {
  const getValueColor = () => {
    switch (variant) {
      case 'amber':
        return 'text-[#b87d2b]';
      case 'red':
        return 'text-[#b83226]';
      default:
        return 'text-slate-900';
    }
  };

  return (
    <Card className="flex flex-col justify-between py-5 px-6 hover:shadow-sm transition-shadow">
      <span className="text-xs font-medium text-slate-500 mb-2">
        {title}
      </span>
      <h3 className={`font-serif font-bold text-2xl lg:text-3xl tracking-tight leading-none ${getValueColor()}`}>
        {value}
      </h3>
    </Card>
  );
};

export default InventoryStatCard;
