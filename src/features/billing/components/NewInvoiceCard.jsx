import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, Check } from 'lucide-react';
import { paymentMethods, quickServiceCatalog } from '../data/mockBillingData';
import { mockCustomers } from '../../customers/data/mockCustomerData';

export const NewInvoiceCard = ({
  invoiceData,
  onUpdateInvoice,
  onSaveAndGenerate,
  onSaveAsDraft,
}) => {
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);

  // Update item field
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceData.items];
    const item = { ...updatedItems[index] };

    if (field === 'qty') {
      const parsedQty = parseFloat(value) || 0;
      item.qty = value === '' ? '' : parsedQty;
      item.amount = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
    } else if (field === 'rate') {
      const parsedRate = parseFloat(value) || 0;
      item.rate = value === '' ? '' : parsedRate;
      item.amount = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
    } else {
      item[field] = value;
    }

    updatedItems[index] = item;
    recalculateTotals(updatedItems, invoiceData.discount);
  };

  // Add a new empty line item
  const handleAddEmptyLineItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      description: '',
      qty: 1,
      rate: 0,
      amount: 0,
    };
    const updatedItems = [...invoiceData.items, newItem];
    recalculateTotals(updatedItems, invoiceData.discount);
  };

  // Add line item from quick catalog
  const handleAddCatalogItem = (service) => {
    const newItem = {
      id: `item-${Date.now()}`,
      description: service.description,
      qty: service.defaultQty || 1,
      rate: service.defaultRate || 0,
      amount: (service.defaultQty || 1) * (service.defaultRate || 0),
    };
    const updatedItems = [...invoiceData.items, newItem];
    recalculateTotals(updatedItems, invoiceData.discount);
    setShowCatalogDropdown(false);
  };

  // Remove a line item
  const handleRemoveItem = (index) => {
    if (invoiceData.items.length <= 1) {
      // Keep at least one line item (cleared)
      const clearedItems = [
        {
          id: `item-${Date.now()}`,
          description: '',
          qty: 1,
          rate: 0,
          amount: 0,
        },
      ];
      recalculateTotals(clearedItems, invoiceData.discount);
      return;
    }
    const updatedItems = invoiceData.items.filter((_, idx) => idx !== index);
    recalculateTotals(updatedItems, invoiceData.discount);
  };

  // Recalculate subtotal and total
  const recalculateTotals = (items, discountValue) => {
    const subtotal = items.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );
    const discount = parseFloat(discountValue) || 0;
    const totalDue = Math.max(0, subtotal - discount);

    onUpdateInvoice({
      ...invoiceData,
      items,
      subtotal,
      discount,
      totalDue,
    });
  };

  const handleDiscountChange = (val) => {
    const discount = parseFloat(val) || 0;
    const totalDue = Math.max(0, invoiceData.subtotal - discount);
    onUpdateInvoice({
      ...invoiceData,
      discount,
      totalDue,
    });
  };

  const handleSelectCustomer = (cust) => {
    onUpdateInvoice({
      ...invoiceData,
      customerName: `${cust.name} - ${cust.phone}`,
      customerId: cust.id,
      customerPhone: cust.phone,
    });
    setShowCustomerDropdown(false);
  };

  const formatCurrency = (val) => {
    const num = parseFloat(val) || 0;
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-7 shadow-sm flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <h2 className="text-lg md:text-[19px] font-bold text-slate-900 tracking-tight">
            New invoice
          </h2>
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">
            {invoiceData.invoiceNumber || 'INV-2026-0847'}
          </span>
        </div>

        {/* Form Fields: Customer & Payment Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 my-6">
          {/* Customer Input with Auto-Suggest Dropdown */}
          <div className="relative">
            <label className="block text-xs font-medium text-slate-400 italic mb-1.5">
              Customer
            </label>
            <div className="relative">
              <input
                type="text"
                value={invoiceData.customerName}
                onChange={(e) =>
                  onUpdateInvoice({ ...invoiceData, customerName: e.target.value })
                }
                onFocus={() => setShowCustomerDropdown(true)}
                placeholder="Customer name - phone number"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Dropdown */}
            {showCustomerDropdown && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-56 overflow-y-auto py-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select existing customer
                </div>
                {mockCustomers.map((cust) => (
                  <button
                    key={cust.id}
                    type="button"
                    onClick={() => handleSelectCustomer(cust)}
                    className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{cust.name}</span>
                      <span className="text-slate-400 text-[11px] ml-2">({cust.phone})</span>
                    </div>
                    {invoiceData.customerName.includes(cust.name) && (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </button>
                ))}
                <div
                  className="px-3 py-1.5 text-[11px] text-center text-slate-400 hover:text-slate-600 cursor-pointer border-t border-slate-100 bg-slate-50/50"
                  onClick={() => setShowCustomerDropdown(false)}
                >
                  Close list
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 italic mb-1.5">
              Payment method
            </label>
            <div className="relative">
              <select
                value={invoiceData.paymentMethod}
                onChange={(e) =>
                  onUpdateInvoice({ ...invoiceData, paymentMethod: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#131d33]/15 focus:border-[#131d33] transition-all cursor-pointer"
              >
                {paymentMethods.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mt-8 mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4 font-semibold">ITEM / SERVICE</th>
                  <th className="pb-3 px-3 text-right font-semibold w-20">QTY</th>
                  <th className="pb-3 px-3 text-right font-semibold w-24">RATE</th>
                  <th className="pb-3 pl-3 text-right font-semibold w-28">AMOUNT</th>
                  <th className="pb-3 pl-2 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70">
                {invoiceData.items.map((item, index) => (
                  <tr key={item.id || index} className="group hover:bg-slate-50/60 transition-colors">
                    {/* Item Description */}
                    <td className="py-3.5 pr-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Item or service description"
                        className="w-full bg-transparent text-xs md:text-sm text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-300 rounded px-2 py-1 -mx-2 transition-all"
                      />
                    </td>

                    {/* Quantity */}
                    <td className="py-3.5 px-3 text-right">
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                        className="w-16 bg-transparent text-right text-xs md:text-sm text-slate-800 font-normal focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-300 rounded px-1.5 py-1 transition-all"
                      />
                    </td>

                    {/* Unit Rate */}
                    <td className="py-3.5 px-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        className="w-20 bg-transparent text-right text-xs md:text-sm text-slate-800 font-normal focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-300 rounded px-1.5 py-1 transition-all"
                      />
                    </td>

                    {/* Calculated Line Amount */}
                    <td className="py-3.5 pl-3 text-right font-medium text-xs md:text-sm text-slate-800 tabular-nums">
                      {formatCurrency(item.amount)}
                    </td>

                    {/* Delete row action */}
                    <td className="py-3.5 pl-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        title="Remove line item"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 rounded transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Line Item Action */}
          <div className="relative mt-3 pt-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddEmptyLineItem}
                className="text-xs font-normal text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1.5 py-1"
              >
                <span>+ Add line item...</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCatalogDropdown(!showCatalogDropdown)}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline py-1 transition-colors flex items-center gap-1"
              >
                <span>Choose from service catalog</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Quick Catalog Dropdown */}
            {showCatalogDropdown && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2">
                <div className="px-3.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Service Catalog
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {quickServiceCatalog.map((service, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleAddCatalogItem(service)}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                    >
                      <span className="text-slate-800 font-medium">{service.description}</span>
                      <span className="text-slate-500 font-semibold ml-2">
                        Rs. {service.defaultRate.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calculation Section: Subtotal & Discount */}
        <div className="border-t border-slate-100 pt-5 space-y-2.5">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-semibold text-slate-700 tabular-nums">
              Rs. {formatCurrency(invoiceData.subtotal)}
            </span>
          </div>

          {/* Discount */}
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-slate-500 flex items-center gap-1.5">
              <span>Discount</span>
              {!isEditingDiscount ? (
                <button
                  type="button"
                  onClick={() => setIsEditingDiscount(true)}
                  className="text-[10px] text-blue-600 hover:underline"
                >
                  (edit)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingDiscount(false)}
                  className="text-[10px] text-emerald-600 font-medium"
                >
                  done
                </button>
              )}
            </span>

            {isEditingDiscount ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">Rs.</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={invoiceData.discount}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  className="w-20 px-2 py-0.5 border border-slate-300 rounded text-xs text-right focus:outline-none focus:ring-1 focus:ring-slate-400"
                  autoFocus
                />
              </div>
            ) : (
              <span className="font-normal text-slate-500 tabular-nums">
                – Rs. {formatCurrency(invoiceData.discount)}
              </span>
            )}
          </div>
        </div>

        {/* Total Due */}
        <div className="border-t border-slate-100 mt-5 pt-4 flex items-center justify-between">
          <span className="text-base md:text-lg font-bold text-slate-900">
            Total due
          </span>
          <span className="text-base md:text-lg font-bold text-slate-900 tabular-nums">
            Rs. {formatCurrency(invoiceData.totalDue)}
          </span>
        </div>
      </div>

      {/* Action Buttons: Save & generate invoice | Save as draft */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5">
        <button
          type="button"
          onClick={onSaveAndGenerate}
          className="w-full sm:w-auto flex-1 bg-[#131d33] hover:bg-[#1a2642] text-white font-semibold text-xs md:text-sm py-3 px-6 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#131d33]/40 text-center"
        >
          Save & generate invoice
        </button>

        <button
          type="button"
          onClick={onSaveAsDraft}
          className="w-full sm:w-auto flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs md:text-sm py-3 px-6 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 text-center"
        >
          Save as draft
        </button>
      </div>
    </div>
  );
};

export default NewInvoiceCard;
