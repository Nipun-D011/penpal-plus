import React from 'react';

export const OrderDetailProgressCard = ({ order, onUpdateStatus }) => {
  if (!order) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm text-center text-slate-400 text-xs">
        Select an order from the list above to view live tracking and items summary.
      </div>
    );
  }

  const steps = [
    { id: 1, label: 'Order placed', status: 'New' },
    { id: 2, label: 'Processing', status: 'Processing' },
    { id: 3, label: 'Ready', status: 'Ready' },
    { id: 4, label: 'Delivered', status: 'Delivered' },
  ];

  // Determine current active step index (1-based)
  let currentStep = order.statusStep || 1;
  if (!order.statusStep) {
    switch (order.status?.toLowerCase()) {
      case 'new':
        currentStep = 1;
        break;
      case 'processing':
        currentStep = 2;
        break;
      case 'ready':
        currentStep = 3;
        break;
      case 'delivered':
        currentStep = 4;
        break;
      default:
        currentStep = 1;
    }
  }

  const nextStepObj = currentStep < 4 ? steps[currentStep] : null;

  // Calculate percentage for progress bar fill:
  const getProgressWidth = (step) => {
    switch (step) {
      case 1:
        return '25%';
      case 2:
        return '50%';
      case 3:
        return '75%';
      case 4:
        return '100%';
      default:
        return '25%';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm">
      {/* Header with Title and Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2.5">
          <h3 className="font-bold text-slate-900 text-sm md:text-base">
            Order {order.id} · progress
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] md:text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            Detail / expanded view
          </span>
        </div>

        {onUpdateStatus && nextStepObj && (
          <button
            type="button"
            onClick={() => onUpdateStatus(order.id, nextStepObj.status, nextStepObj.id)}
            className="self-start sm:self-auto px-3 py-1.5 bg-[#131d33] hover:bg-[#1f2d4d] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Advance to: {nextStepObj.label}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
        {/* Left Section: Placed Info & Visual Stepper */}
        <div className="lg:col-span-7">
          <p className="text-xs text-slate-400 font-medium mb-4">
            {order.placedInfo || `Placed on ${order.orderDate} · ${order.customer} · ${order.itemsCount} · ${order.amount}`}
          </p>

          {/* Stepper Progress Bar */}
          <div className="space-y-2">
            {/* Progress track */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: getProgressWidth(currentStep) }}
              />
            </div>

            {/* Stepper Labels */}
            <div className="flex items-center justify-between pt-1">
              {steps.map((s) => {
                const isPassedOrCurrent = s.id <= currentStep;
                const isCurrent = s.id === currentStep;

                return (
                  <span
                    key={s.id}
                    className={`text-xs ${
                      isCurrent
                        ? 'font-bold text-slate-900'
                        : isPassedOrCurrent
                        ? 'font-medium text-slate-700'
                        : 'font-normal text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Section: Items Summary list */}
        <div className="lg:col-span-5 lg:border-l border-slate-100 lg:pl-8">
          <p className="text-xs md:text-sm text-slate-600 font-normal leading-relaxed">
            {order.itemsSummary || 'Standard bookshop items & stationery order'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailProgressCard;
