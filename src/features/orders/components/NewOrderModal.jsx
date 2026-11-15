import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const NewOrderModal = ({ isOpen, onClose, onAdd }) => {
  const [customer, setCustomer] = useState('');
  const [itemsCount, setItemsCount] = useState('1');
  const [itemsSummary, setItemsSummary] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('New');
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!customer.trim()) newErrors.customer = 'Customer name is required';
    if (!amount.trim()) newErrors.amount = 'Total amount is required';
    if (!itemsSummary.trim()) newErrors.itemsSummary = 'Items description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const randomOrderNum = Math.floor(513 + Math.random() * 500);
    const orderId = `ORD-0${randomOrderNum}`;
    const today = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const formattedAmount = amount.startsWith('Rs.') ? amount.trim() : `Rs. ${amount.trim()}`;

    let statusStep = 1;
    if (status === 'Processing') statusStep = 2;
    if (status === 'Ready') statusStep = 3;
    if (status === 'Delivered') statusStep = 4;

    const newOrder = {
      id: orderId,
      customer: customer.trim(),
      itemsCount: `${itemsCount || 1} ${parseInt(itemsCount, 10) === 1 ? 'item' : 'items'}`,
      orderDate: today,
      placedInfo: `Placed ${today} · ${customer.trim()} · ${itemsCount || 1} items · ${formattedAmount}`,
      status,
      statusStep,
      amount: formattedAmount,
      itemsSummary: itemsSummary.trim(),
    };

    onAdd(newOrder);
    setCustomer('');
    setItemsCount('1');
    setItemsSummary('');
    setAmount('');
    setStatus('New');
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
              Create new customer order
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Record a sales order for bookshop items or print materials
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
            id="order-customer"
            label="Customer Name / Organization"
            placeholder="e.g. Nimal Silva or Maliyadeva College"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            error={errors.customer}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="order-items-count"
              label="Total Number of Items"
              type="number"
              placeholder="e.g. 3"
              value={itemsCount}
              onChange={(e) => setItemsCount(e.target.value)}
              required
            />

            <Input
              id="order-amount"
              label="Total Amount (Rs.)"
              placeholder="e.g. 3,200"
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
              <option value="New">New</option>
              <option value="Processing">Processing</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wide">
              Items Summary
            </label>
            <textarea
              rows={2}
              value={itemsSummary}
              onChange={(e) => setItemsSummary(e.target.value)}
              placeholder="e.g. Grade 8 Science Textbook × 2, Exercise Books × 10, Ballpoint Pens × 12"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#131d33]/20 focus:border-[#131d33]"
            />
            {errors.itemsSummary && (
              <p className="text-xs text-red-500 mt-1">{errors.itemsSummary}</p>
            )}
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
              Create Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrderModal;
