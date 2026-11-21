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

  const initialStdNum =
    rateItem.rawStandardRate !== undefined && rateItem.rawStandardRate !== null
      ? String(rateItem.rawStandardRate)
      : rateItem.standardRate?.replace(/[^0-9.]/g, '') || '';
  const [standardRate, setStandardRate] = useState(initialStdNum);

  const initialHasBulk = Boolean(rateItem.bulkRate && rateItem.bulkRate !== '—');
  const [hasBulkRate, setHasBulkRate] = useState(initialHasBulk);

  const initialBulkNum =
    rateItem.rawBulkRate !== undefined && rateItem.rawBulkRate !== null
      ? String(rateItem.rawBulkRate)
      : (rateItem.bulkRate
          ? rateItem.bulkRate.split('(')[0]?.replace(/[^0-9.]/g, '')
          : '') || '';
  const [bulkRate, setBulkRate] = useState(initialBulkNum);

  const threshMatch = rateItem.bulkRate?.match(/\(([^)]+)\)/);
  const initialThresh =
    rateItem.bulkThreshold || (threshMatch ? threshMatch[1] : '100+');
  const [bulkThreshold, setBulkThreshold] = useState(initialThresh);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

    setIsSubmitting(true);
    try {
      if (onUpdate) {
        await onUpdate(updatedItem);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update rate card:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to remove "${rateItem.service}" from the rate card?`
      )
    ) {
      setIsDeleting(true);
      try {
        if (onDelete) {
          await onDelete(rateItem.id);
        }
        onClose();
      } catch (err) {
        console.error('Failed to delete rate card:', err);
      } finally {
        setIsDeleting(false);
      }
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
              Modify standard or tier pricing for this service
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
            id="edit-service-name"
            label="Service / Item Description"
            value={service}
            onChange={(e) => setService(e.target.value)}
            error={errors.service}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="edit-unit"
              label="Billing Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              error={errors.unit}
              required
            />

            <Input
              id="edit-standard-rate"
              label="Standard Rate (Rs.)"
              type="number"
              step="0.01"
              min="0"
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
                  id="edit-bulk-rate"
                  label="Bulk Rate (Rs.)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={bulkRate}
                  onChange={(e) => setBulkRate(e.target.value)}
                  error={errors.bulkRate}
                />

                <Input
                  id="edit-bulk-thresh"
                  label="Minimum Threshold"
                  value={bulkThreshold}
                  onChange={(e) => setBulkThreshold(e.target.value)}
                  error={errors.bulkThreshold}
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 p-1 rounded transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? 'Deleting...' : 'Delete rate'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || isDeleting}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || isDeleting}
                className="w-auto px-5 py-2.5 bg-[#dfa84a] hover:bg-[#c9933b] text-[#131d33] font-semibold text-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRateModal;
