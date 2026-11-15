import { Package, Truck, DollarSign, CheckCircle2 } from 'lucide-react';

export const SupplierKpiCards = ({
  openPOCount = 2,
  inTransitCount = 1,
  totalOutstanding = 'Rs. 38,500',
  lifetimePurchases = 'Rs. 412,000',
}) => {
  const cards = [
    {
      title: 'Open Purchase Orders',
      value: openPOCount,
      subtext: 'Awaiting fulfillment or confirmation',
      icon: Package,
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'In-Transit / Active',
      value: inTransitCount,
      subtext: 'Dispatched to Pen Pal Plus store',
      icon: Truck,
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Outstanding Balance Due',
      value: totalOutstanding,
      subtext: 'Due from Pen Pal Plus (under credit terms)',
      icon: DollarSign,
      iconBg: 'bg-red-50 text-red-700 border-red-200',
      highlight: true,
    },
    {
      title: 'Lifetime Purchases',
      value: lifetimePurchases,
      subtext: 'Total stock procurement volume',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center ${card.iconBg}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div
                className={`text-xl sm:text-2xl font-bold font-mono tracking-tight ${
                  card.highlight ? 'text-amber-600' : 'text-slate-900'
                }`}
              >
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SupplierKpiCards;
