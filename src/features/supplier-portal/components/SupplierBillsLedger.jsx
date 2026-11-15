export const SupplierBillsLedger = ({
  bills = [],
  supplier,
}) => {

  const totalBilled = bills.reduce((acc, b) => {
    const raw = parseInt(b.amount.replace(/[^0-9]/g, ''), 10) || 0;
    return acc + raw;
  }, 0);

  const totalPaid = bills.reduce((acc, b) => {
    const raw = parseInt(b.amountPaid.replace(/[^0-9]/g, ''), 10) || 0;
    return acc + raw;
  }, 0);

  const totalBalance = totalBilled - totalPaid;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'partially paid':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Ledger Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Billed to Shop
          </span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            Rs. {totalBilled.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Across {bills.length} commercial invoices
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Payments Received
          </span>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
            Rs. {totalPaid.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 mt-0.5">
            Settled via bank transfer / cash
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200/90 bg-amber-50/30 p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
            Outstanding Balance Due
          </span>
          <div className="text-xl font-bold font-mono text-amber-600 mt-1">
            Rs. {totalBalance.toLocaleString()}
          </div>
          <p className="text-[11px] text-amber-700 mt-0.5">
            Credit Terms: {supplier?.paymentTerms || 'Credit 30 Days'}
          </p>
        </div>
      </div>

      {/* Bills & Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Bills & Payment Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Itemized record of credit invoices and payment settlements
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {bills.length} Invoices Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3 px-4">Invoice / Bill ID</th>
                <th className="py-3 px-4">PO Reference</th>
                <th className="py-3 px-4">Date Issued</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Payment Terms</th>
                <th className="py-3 px-4 text-right">Bill Total</th>
                <th className="py-3 px-4 text-right">Paid to Date</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {bill.id}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {bill.poRef}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{bill.invoiceDate}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {bill.dueDate}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {bill.paymentTerms}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {bill.amount}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-semibold">
                    {bill.amountPaid}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-700">
                    {bill.balanceDue}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                        bill.status
                      )}`}
                    >
                      {bill.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierBillsLedger;
