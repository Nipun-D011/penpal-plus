import Card from '../../../components/common/Card';
import { Package, Truck, DollarSign, CheckCircle2 } from 'lucide-react';

export const SupplierKpiCards = ({
  openPOCount = 2,
  inTransitCount = 1,
  totalOutstanding = 'Rs. 38,500',
  lifetimePurchases = 'Rs. 412,000',
}) => {
  const kpis = [
    {
      title: 'Open Purchase Orders',
      value: openPOCount,
      subtext: 'Awaiting dispatch / fulfillment',
      icon: Package,
      iconColor: 'bg-amber-50 text-amber-600 border border-amber-200/60',
    },
    {
      title: 'In-Transit Shipments',
      value: inTransitCount,
      subtext: 'Dispatched to Kurunegala store',
      icon: Truck,
      iconColor: 'bg-blue-50 text-blue-600 border border-blue-200/60',
    },
    {
      title: 'Outstanding Balance',
      value: totalOutstanding,
      subtext: 'Credit term settlement active',
      icon: DollarSign,
      iconColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
    },
    {
      title: 'Lifetime Volume',
      value: lifetimePurchases,
      subtext: 'Total stock procurement to date',
      icon: CheckCircle2,
      iconColor: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={idx}
            className="flex flex-col justify-between hover:shadow-md transition-all border border-slate-200/80 rounded-2xl p-5 bg-white"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium text-slate-500">
                {kpi.title}
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${kpi.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <h3 className="font-serif font-bold text-2xl lg:text-[26px] text-slate-900 tracking-tight leading-none">
                {kpi.value}
              </h3>
              <p className="mt-2 text-xs text-slate-500 font-normal">
                {kpi.subtext}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default SupplierKpiCards;
