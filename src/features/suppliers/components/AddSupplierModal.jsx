import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const AddSupplierModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Books & publications');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Credit 30 Days');
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const categories = [
    'Books & publications',
    'Paper & consumables',
    'Toner & printing hardware',
    'Stationery',
    'Packaging & Binding',
    'Office Equipment',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Supplier name is required';
    if (!contact.trim()) newErrors.contact = 'Contact phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newSupplier = {
      id: `sup-${Date.now()}`,
      name: name.trim(),
      category,
      contact: contact.trim(),
      email: email.trim(),
      address: address.trim(),
      lastPurchase: currentDate,
      totalPurchases: 'Rs. 0',
      totalPurchasesRaw: 0,
      outstanding: 'Rs. 0',
      outstandingRaw: 0,
      status: 'Active',
      paymentTerms,
      recentOrders: [],
    };

    onAdd(newSupplier);
    setName('');
    setContact('');
    setEmail('');
    setAddress('');
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
              Add new supplier
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Record a supplier to manage purchase orders & dues
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input
            id="sup-name"
            label="Supplier / Company Name"
            placeholder="e.g. Sarasavi Wholesalers"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-lg text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] transition-all"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <Input
              id="sup-contact"
              label="Contact Number"
              type="tel"
              placeholder="e.g. 011 258 3390"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              error={errors.contact}
              required
            />

            <Input
              id="sup-email"
              label="Email Address (Optional)"
              type="email"
              placeholder="e.g. orders@supplier.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Input
            id="sup-address"
            label="Address / Location (Optional)"
            placeholder="e.g. Stanley Tillakaratne Mawatha, Nugegoda"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
              Save Supplier
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierModal;
