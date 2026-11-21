import { useState } from 'react';
import { X } from 'lucide-react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const AddRateModal = ({ isOpen, onClose, onAdd }) => {
  const [service, setService] = useState('');
  const [unit, setUnit] = useState('Per page');
  const [standardRate, setStandardRate] = useState('');
  const [hasBulkRate, setHasBulkRate] = useState(false);
  const [bulkRate, setBulkRate] = useState('');
  const [bulkThreshold, setBulkThreshold] = useState('100+');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
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
        newErrors.bulkThreshold = 'Bulk threshold is required (e.g. 50+)';
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

    // Format current date as "DD MMM YYYY", e.g. "19 Aug 2026"
    const today = new Date();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const day = String(today.getDate()).padStart(2, '0');
    const month = months[today.getMonth()];
    const year = today.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;

    const newRateItem = {
      id: `rc-${Date.now()}`,
      service: service.trim(),
      unit: unit.trim(),
      standardRate: stdFormatted,
      bulkRate: bulkFormatted,
      rawStandardRate: Number(standardRate),
      rawBulkRate: hasBulkRate ? Number(bulkRate) : null,
      bulkThreshold: hasBulkRate ? bulkThreshold : null,
      lastUpdated: formattedDate,
    };

    setIsSubmitting(true);
    try {
      if (onAdd) {
        await onAdd(newRateItem);
      }
      setService('');
      setUnit('Per page');
      setStandardRate('');
      setHasBulkRate(false);
      setBulkRate('');
      setBulkThreshold('100+');
      setErrors({});
      onClose();
    } catch (err) {
      console.error('Failed to add rate card:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Add new service rate
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Set fixed standard and bulk pricing for print services
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input
            id="service-name"
            label="Service / Item Description"
            placeholder="e.g. Colour Photocopy (A3), Matte Lamination"
            value={service}
            onChange={(e) => setService(e.target.value)}
            error={errors.service}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="unit"
              label="Billing Unit"
              placeholder="e.g. Per page, Per document, Per sq. ft"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              error={errors.unit}
              required
            />

            <Input
              id="standard-rate"
              label="Standard Rate (Rs.)"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 50.00"
              value={standardRate}
              onChange={(e) => setStandardRate(e.target.value)}
              error={errors.standardRate}
              required
            />
          </div>

          {/* Bulk Tier Checkbox Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasBulkRate}
                onChange={(e) => setHasBulkRate(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#dfa84a] focus:ring-[#dfa84a]"
              />
              <span className="text-xs font-semibold text-slate-700">
                Offer special discounted bulk rate
              </span>
            </label>
          </div>

          {/* Bulk Rate Details (Conditional) */}
          {hasBulkRate && (
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Bulk Tier Pricing
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  id="bulk-rate"
                  label="Bulk Rate (Rs.)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 40.00"
                  value={bulkRate}
                  onChange={(e) => setBulkRate(e.target.value)}
                  error={errors.bulkRate}
                />

                <Input
                  id="bulk-thresh"
                  label="Minimum Threshold"
                  placeholder="e.g. 50+ or 100+"
                  value={bulkThreshold}
                  onChange={(e) => setBulkThreshold(e.target.value)}
                  error={errors.bulkThreshold}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-auto px-5 py-2.5 bg-[#dfa84a] hover:bg-[#c9933b] text-[#131d33] font-semibold text-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Rate'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRateModal;
