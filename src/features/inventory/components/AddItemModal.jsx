import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const AddItemModal = ({ isOpen, onClose, onAdd, categories }) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState(categories[1] || 'Stationery');
  const [stock, setStock] = useState('');
  const [reorderLevel, setReorderLevel] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!code.trim()) newErrors.code = 'SKU / ISBN is required';
    if (!stock || isNaN(stock)) newErrors.stock = 'Valid stock number is required';
    if (!reorderLevel || isNaN(reorderLevel)) newErrors.reorderLevel = 'Valid reorder level is required';
    if (!unitPrice.trim()) newErrors.unitPrice = 'Unit price is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const numStock = parseInt(stock, 10);
    const numReorder = parseInt(reorderLevel, 10);

    let status = 'In stock';
    let statusVariant = 'in-stock';

    if (numStock === 0) {
      status = 'Out of stock';
      statusVariant = 'out-of-stock';
    } else if (numStock <= numReorder) {
      status = 'Low stock';
      statusVariant = 'low';
    }

    const newItem = {
      id: `inv-${Date.now()}`,
      initial: title.trim().charAt(0).toUpperCase() || 'P',
      title: title.trim(),
      code: code.trim(),
      category,
      stock: numStock,
      reorderLevel: numReorder,
      unitPrice: unitPrice.startsWith('Rs.') ? unitPrice : `Rs. ${unitPrice}`,
      status,
      statusVariant,
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Add new inventory item
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter title, category and stock thresholds
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input
            id="item-title"
            label="Item Title"
            placeholder="e.g. Atlas CR 120pg Single Rule"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="item-code"
              label="SKU / ISBN"
              placeholder="e.g. SKU EB-120-CR"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={errors.code}
              required
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wide">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#131d33]/20 focus:border-[#131d33]"
              >
                {categories
                  .filter((c) => c !== 'All categories')
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              id="item-stock"
              label="Current Stock"
              type="number"
              placeholder="e.g. 50"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              error={errors.stock}
              required
            />
            <Input
              id="item-reorder"
              label="Reorder Level"
              type="number"
              placeholder="e.g. 15"
              value={reorderLevel}
              onChange={(e) => setReorderLevel(e.target.value)}
              error={errors.reorderLevel}
              required
            />
            <Input
              id="item-price"
              label="Unit Price"
              placeholder="e.g. 120"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              error={errors.unitPrice}
              required
            />
          </div>

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
              Save Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
