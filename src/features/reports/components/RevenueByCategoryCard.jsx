
export const RevenueByCategoryCard = ({ categories = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight mb-6">
          Revenue by category
        </h3>

        <div className="space-y-5">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between gap-4">
              {/* Category Label */}
              <div className="w-36 sm:w-44 flex-shrink-0">
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  {cat.name}
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>

              {/* Percentage */}
              <div className="w-12 text-right flex-shrink-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {cat.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueByCategoryCard;
