import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const EditRateModal = ({ isOpen, onClose, rateItem, onUpdate, onDelete }) => {
  if (!isOpen || !rateItem) return null;

  return (
    <EditRateModalForm
      key={rateItem.id}
      rateItem={rateItem}
      onClose={onClose}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
};

const EditRateModalForm = ({ rateItem, onClose, onUpdate, onDelete }) => {
  const [service, setService] = useState(rateItem.service || '');
  const [unit, setUnit] = useState(rateItem.unit || 'Per page');

  const initialStdNum = rateItem.rawStandardRate !== undefined && rateItem.rawStandardRate !== null
    ? String(rateItem.rawStandardRate)
    : rateItem.standardRate?.replace(/[^0-9.]/g, '') || '';
  const [standardRate, setStandardRate] = useState(initialStdNum);

  const initialHasBulk = Boolean(rateItem.bulkRate && rateItem.bulkRate !== '—');
  const [hasBulkRate, setHasBulkRate] = useState(initialHasBulk);

  const initialBulkNum = rateItem.rawBulkRate !== undefined && rateItem.rawBulkRate !== null
    ? String(rateItem.rawBulkRate)
    : (rateItem.bulkRate ? rateItem.bulkRate.split('(')[0]?.replace(/[^0-9.]/g, '') : '') || '';
  const [bulkRate, setBulkRate] = useState(initialBulkNum);

  const threshMatch = rateItem.bulkRate?.match(/\(([^)]+)\)/);
  const initialThresh = rateItem.bulkThreshold || (threshMatch ? threshMatch[1] : '100+');
  const [bulkThreshold, setBulkThreshold] = useState(initialThresh);

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!service.trim()) newErrors.service = 'Service name is required';
    if (!unit.trim()) newErrors.unit = 'Unit is required';
    if (!standardRate || isNaN(standardRate) || Number(standardRate) <= 0) {
      newErrors.standardRate = 'Valid standard rate is required';
    }

    if (hasBulkRate) {
      if (!bulkRate || isNaN(bulkRate) || Number(bulkRate) <= 0) {
        newErrors.bulkRate = 'Valid bulk rate is required';
      }
      if (!bulkThreshold.trim()) {
        newErrors.bulkThreshold = 'Bulk threshold is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const stdFormatted = `Rs. ${Number(standardRate).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    let bulkFormatted = '—';
    if (hasBulkRate) {
      const bFormatted = `Rs. ${Number(bulkRate).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      const cleanThreshold = bulkThreshold.endsWith('+')
        ? bulkThreshold
        : `${bulkThreshold}+`;
      bulkFormatted = `${bFormatted} (${cleanThreshold})`;
    }

    const today = new Date();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const day = String(today.getDate()).padStart(2, '0');
    const month = months[today.getMonth()];
    const year = today.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;

    const updatedItem = {
      ...rateItem,
      service: service.trim(),
      unit: unit.trim(),
      standardRate: stdFormatted,
      bulkRate: bulkFormatted,
      rawStandardRate: Number(standardRate),
      rawBulkRate: hasBulkRate ? Number(bulkRate) : null,
      bulkThreshold: hasBulkRate ? bulkThreshold : null,
      lastUpdated: formattedDate,
    };

    onUpdate(updatedItem);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove "${rateItem.service}" from the rate card?`)) {
      onDelete(rateItem.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Edit service rate
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update pricing and bulk rules for {rateItem.service}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <Input
            label="Service Name"
            value={service}
            onChange={(e) => setService(e.target.value)}
            error={errors.service}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pricing Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] transition-all shadow-sm"
              >
                <option value="Per page">Per page</option>
                <option value="Per sheet (A4)">Per sheet (A4)</option>
                <option value="Per sheet (A3)">Per sheet (A3)</option>
                <option value="Per document">Per document</option>
                <option value="Per sq. ft">Per sq. ft</option>
                <option value="Per 100">Per 100</option>
                <option value="Per card">Per card</option>
                <option value="Per book">Per book</option>
                <option value="Per hour">Per hour</option>
              </select>
            </div>

            <Input
              label="Standard Rate (Rs.)"
              type="number"
              step="0.01"
              value={standardRate}
              onChange={(e) => setStandardRate(e.target.value)}
              error={errors.standardRate}
              required
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasBulkRate}
                onChange={(e) => setHasBulkRate(e.target.checked)}
                className="rounded border-slate-300 text-[#131d33] focus:ring-[#131d33]"
              />
              Enable tiered bulk discount pricing
            </label>

            {hasBulkRate && (
              <div className="grid grid-cols-2 gap-4 mt-3 pl-6 pt-1 animate-in fade-in duration-150">
                <Input
                  label="Bulk Rate (Rs.)"
                  type="number"
                  step="0.01"
                  value={bulkRate}
                  onChange={(e) => setBulkRate(e.target.value)}
                  error={errors.bulkRate}
                  required={hasBulkRate}
                />
                <Input
                  label="Minimum Threshold"
                  value={bulkThreshold}
                  onChange={(e) => setBulkThreshold(e.target.value)}
                  error={errors.bulkThreshold}
                  required={hasBulkRate}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete rate</span>
            </button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-auto !py-2.5 px-4 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-auto !py-2.5 px-5 text-xs bg-[#dfa84a] hover:bg-[#c9933b] !text-[#131d33] font-semibold border-none"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRateModal;
