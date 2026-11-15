import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const NewJobModal = ({
  isOpen,
  onClose,
  onAdd,
  staffOptions,
  jobTypeOptions,
  columns,
}) => {
  const [title, setTitle] = useState('');
  const [customer, setCustomer] = useState('');
  const [jobType, setJobType] = useState(jobTypeOptions[1] || 'Photocopy');
  const [staff, setStaff] = useState(staffOptions[1] || 'Sunil');
  const [timing, setTiming] = useState('Due today');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('pending');
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) newErrors.title = 'Job title/description is required';
    if (!customer.trim()) newErrors.customer = 'Customer name is required';
    if (!amount.trim()) newErrors.amount = 'Amount is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const randomIdNumber = Math.floor(1000 + Math.random() * 9000);
    const newJob = {
      id: `PP-2026-${randomIdNumber}`,
      title: title.trim(),
      customer: customer.trim(),
      status,
      timing: timing.trim() || 'Due today',
      amount: amount.startsWith('Rs.') ? amount.trim() : `Rs. ${amount.trim()}`,
      staff,
      jobType,
    };

    onAdd(newJob);
    setTitle('');
    setCustomer('');
    setAmount('');
    setTiming('Due today');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Create new print job
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add a new ticket to the production pipeline
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input
            id="job-title"
            label="Job Title / Description"
            placeholder="e.g. Wedding invitation cards or Banner 6×3 ft"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            required
          />

          <Input
            id="job-customer"
            label="Customer Name / Organization"
            placeholder="e.g. Kumari Fonseka"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            error={errors.customer}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wide">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#131d33]/20 focus:border-[#131d33]"
              >
                {jobTypeOptions
                  .filter((t) => t !== 'All job types')
                  .map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wide">
                Assign Staff
              </label>
              <select
                value={staff}
                onChange={(e) => setStaff(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#131d33]/20 focus:border-[#131d33]"
              >
                {staffOptions
                  .filter((s) => s !== 'All staff')
                  .map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="job-timing"
              label="Due Timing"
              placeholder="e.g. Due today or Due 25 Aug"
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
            />

            <Input
              id="job-amount"
              label="Amount (Rs.)"
              placeholder="e.g. 3,500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={errors.amount}
              required
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wide">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#131d33]/20 focus:border-[#131d33]"
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              className="w-auto px-5 py-2.5 bg-[#e8a838] hover:bg-[#d89727] text-[#131d33] font-semibold"
            >
              Create Job
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewJobModal;
