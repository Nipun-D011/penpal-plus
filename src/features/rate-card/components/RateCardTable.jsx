
export const RateCardTable = ({ rates = [], onEditRate }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 tracking-wider uppercase bg-white">
              <th className="py-4 pl-6 pr-4 font-semibold">SERVICE</th>
              <th className="py-4 px-4 font-semibold">UNIT</th>
              <th className="py-4 px-4 font-semibold">STANDARD RATE</th>
              <th className="py-4 px-4 font-semibold">BULK RATE</th>
              <th className="py-4 px-4 font-semibold">LAST UPDATED</th>
              <th className="py-4 pl-4 pr-6 text-right font-semibold">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rates.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                {/* Service */}
                <td className="py-4 pl-6 pr-4 text-sm font-bold text-slate-900">
                  {item.service}
                </td>

                {/* Unit */}
                <td className="py-4 px-4 text-sm text-slate-500">
                  {item.unit}
                </td>

                {/* Standard Rate */}
                <td className="py-4 px-4 text-sm font-medium text-slate-800">
                  {item.standardRate}
                </td>

                {/* Bulk Rate */}
                <td className="py-4 px-4 text-sm text-slate-500">
                  {item.bulkRate}
                </td>

                {/* Last Updated */}
                <td className="py-4 px-4 text-sm text-slate-600">
                  {item.lastUpdated}
                </td>

                {/* Action Edit */}
                <td className="py-4 pl-4 pr-6 text-right">
                  <button
                    type="button"
                    onClick={() => onEditRate(item)}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RateCardTable;
