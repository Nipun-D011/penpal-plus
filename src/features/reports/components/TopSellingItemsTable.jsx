
export const TopSellingItemsTable = ({ items = [], title = 'Top selling items this month' }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight mb-4">
        {title}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              <th className="pb-3 pr-4 font-semibold">ITEM</th>
              <th className="pb-3 px-4 font-semibold">CATEGORY</th>
              <th className="pb-3 px-4 text-right font-semibold">UNITS SOLD</th>
              <th className="pb-3 pl-4 text-right font-semibold">REVENUE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="py-3.5 pr-4 text-sm font-medium text-slate-800">
                  {item.name}
                </td>
                <td className="py-3.5 px-4 text-sm text-slate-500">
                  {item.category}
                </td>
                <td className="py-3.5 px-4 text-sm font-medium text-slate-700 text-right">
                  {item.unitsSold.toLocaleString()}
                </td>
                <td className="py-3.5 pl-4 text-sm font-semibold text-slate-900 text-right">
                  {item.revenue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingItemsTable;
