import { Check } from 'lucide-react';

export const Checkbox = ({ id, checked, onChange, label, className = '' }) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-medium ${className}`}
    >
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-4 h-4 rounded flex items-center justify-center transition-colors border ${
            checked
              ? 'bg-[#b87d2b] border-[#b87d2b] text-white'
              : 'bg-white border-slate-300 hover:border-slate-400'
          }`}
        >
          {checked && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
      </div>
      {label && <span>{label}</span>}
    </label>
  );
};

export default Checkbox;
