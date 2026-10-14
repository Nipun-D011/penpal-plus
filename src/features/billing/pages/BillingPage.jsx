import React, { useState } from 'react';
import { Printer, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import NewInvoiceCard from '../components/NewInvoiceCard';
import RecentInvoicesList from '../components/RecentInvoicesList';
import ReceiptModal from '../components/ReceiptModal';
import ViewAllInvoicesModal from '../components/ViewAllInvoicesModal';
import {
  mockRecentInvoices,
  initialInvoiceFormState,
} from '../data/mockBillingData';

export const BillingPage = () => {
  const [invoices, setInvoices] = useState(mockRecentInvoices);
  const [invoiceForm, setInvoiceForm] = useState(initialInvoiceFormState);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Helper to show temporary notification
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Header action: "Print last receipt"
  const handlePrintLastReceipt = () => {
    const lastInvoice = invoices[0] || invoiceForm;
    setActiveReceipt(lastInvoice);
    setIsReceiptOpen(true);
  };

  // Click on a recent invoice to preview receipt
  const handleSelectRecentInvoice = (inv) => {
    setActiveReceipt(inv);
    setIsReceiptOpen(true);
  };

  // Save & Generate Invoice
  const handleSaveAndGenerate = () => {
    const nextInvNumber = `INV-2026-${String(invoices.length + 843).padStart(4, '0')}`;
    
    // Extract initials and name
    const rawCustomer = invoiceForm.customerName || 'General Customer';
    const cleanCustomer = rawCustomer.split(' - ')[0].split(' · ')[0];
    const initials = cleanCustomer
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newInvoiceRecord = {
      id: invoiceForm.invoiceNumber,
      invoiceNumber: invoiceForm.invoiceNumber,
      customer: cleanCustomer,
      customerName: rawCustomer,
      customerPhone: invoiceForm.customerPhone || '077 233 1190',
      initials: initials || 'PP',
      avatarBg: 'bg-[#15803d]', // Green by default
      date: 'Today',
      fullDate: `${new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })} · ${new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      amount: `Rs. ${invoiceForm.totalDue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      numericAmount: invoiceForm.totalDue,
      status: 'Paid',
      statusVariant: 'paid',
      paymentMethod: invoiceForm.paymentMethod || 'Cash',
      items: [...invoiceForm.items],
      subtotal: invoiceForm.subtotal,
      discount: invoiceForm.discount,
      totalDue: invoiceForm.totalDue,
    };

    // Prepend to recent invoices
    setInvoices((prev) => [newInvoiceRecord, ...prev]);

    // Open receipt modal for printing
    setActiveReceipt(newInvoiceRecord);
    setIsReceiptOpen(true);
    showToast(`Invoice ${invoiceForm.invoiceNumber} generated & saved successfully!`);

    // Prepare next invoice form with incremented number
    setInvoiceForm({
      ...initialInvoiceFormState,
      invoiceNumber: nextInvNumber,
      items: [
        {
          id: `item-${Date.now()}`,
          description: '',
          qty: 1,
          rate: 0,
          amount: 0,
        },
      ],
      subtotal: 0,
      discount: 0,
      totalDue: 0,
    });
  };

  // Save as Draft
  const handleSaveAsDraft = () => {
    showToast(`Invoice ${invoiceForm.invoiceNumber} saved as draft.`);
  };

  const headerActions = (
    <button
      type="button"
      onClick={handlePrintLastReceipt}
      className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-xs md:text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-300"
    >
      <Printer className="w-4 h-4 text-slate-700" />
      <span>Print last receipt</span>
    </button>
  );

  return (
    <DashboardLayout
      title="Billing & invoices"
      subtitle="Generate a digital invoice and printable receipt"
      headerActions={headerActions}
    >
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131d33] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs md:text-sm animate-in fade-in slide-in-from-bottom-2 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: New invoice Card (60% on desktop) */}
        <div className="lg:col-span-7 xl:col-span-7">
          <NewInvoiceCard
            invoiceData={invoiceForm}
            onUpdateInvoice={setInvoiceForm}
            onSaveAndGenerate={handleSaveAndGenerate}
            onSaveAsDraft={handleSaveAsDraft}
          />
        </div>

        {/* Right Column: Recent invoices Card (40% on desktop) */}
        <div className="lg:col-span-5 xl:col-span-5">
          <RecentInvoicesList
            invoices={invoices}
            onSelectInvoice={handleSelectRecentInvoice}
            onViewAll={() => setIsViewAllOpen(true)}
          />
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        invoice={activeReceipt}
      />

      {/* View All Invoices Ledger Modal */}
      <ViewAllInvoicesModal
        isOpen={isViewAllOpen}
        onClose={() => setIsViewAllOpen(false)}
        invoices={invoices}
        onSelectInvoice={handleSelectRecentInvoice}
      />
    </DashboardLayout>
  );
};

export default BillingPage;
