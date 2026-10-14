import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const AddCustomerModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Customer name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate initials (e.g. Kumari Fonseka -> KF)
    const nameParts = name.trim().split(' ').filter(Boolean);
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : nameParts[0].slice(0, 2).toUpperCase();

    // Color palette for new customer avatars
    const colors = [
      'bg-[#15803d]',
      'bg-[#2563eb]',
      'bg-[#d97706]',
      'bg-[#1e293b]',
      'bg-[#854d0e]',
      'bg-[#7c3aed]',
    ];
    const avatarBg = colors[Math.floor(Math.random() * colors.length)];

    const currentYear = new Date().getFullYear().toString();
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      initials,
      avatarBg,
      phone: phone.trim(),
      city: city.trim() || 'Kurunegala',
      ordersCount: 0,
      totalSpent: 'Rs. 0',
      totalSpentFormatted: '0',
      lastVisit: currentDate,
      customerSince: currentYear,
      purchaseHistory: [],
    };

    onAdd(newCustomer);
    setName('');
    setPhone('');
    setCity('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Add new customer
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Create a customer profile for order tracking
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
            id="cust-name"
            label="Customer or Organization Name"
            placeholder="e.g. Kumari Fonseka or Maliyadeva College"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
          />

          <Input
            id="cust-phone"
            label="Phone Number"
            type="tel"
            placeholder="e.g. 077 233 1190"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            required
          />

          <Input
            id="cust-city"
            label="City / Region"
            placeholder="e.g. Kurunegala"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

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
              Save Customer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
