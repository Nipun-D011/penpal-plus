import React, { useState, useEffect } from 'react';
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
import {
  subscribeToInvoices,
  createInvoice,
  generateNextInvoiceNumber,
} from '../../../services/billingService';
import { subscribeToInventory } from '../../../services/inventoryService';
import { subscribeToCustomers } from '../../../services/customerService';

export const BillingPage = () => {
  const [invoices, setInvoices] = useState(mockRecentInvoices);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoiceForm, setInvoiceForm] = useState(initialInvoiceFormState);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Subscribe to live invoices from Cloud Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToInvoices(
      (liveInvoices) => {
        if (liveInvoices && liveInvoices.length > 0) {
          setInvoices(liveInvoices);
          // Set invoice number to next available sequence
          setInvoiceForm((prev) => ({
            ...prev,
            invoiceNumber: generateNextInvoiceNumber(liveInvoices),
          }));
        } else {
          setInvoices(mockRecentInvoices);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to live invoices:', error);
        setInvoices(mockRecentInvoices);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to live inventory items so they can be billed and stocks shown
  useEffect(() => {
    const unsubscribe = subscribeToInventory(
      (items) => {
        setInventoryItems(items || []);
      },
      (error) => {
        console.error('Error listening to inventory items for billing:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to live customers for billing dropdown
  useEffect(() => {
    const unsubscribe = subscribeToCustomers(
      (custs) => {
        setCustomers(custs || []);
      },
      (error) => {
        console.error('Error listening to customers for billing:', error);
      }
    );

    return () => unsubscribe();
  }, []);

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

  // Save & Generate Invoice (persists to Firestore and deducts inventory)
  const handleSaveAndGenerate = async () => {
    // Validate items
    const validItems = invoiceForm.items.filter(
      (item) => item.description?.trim() !== '' && (parseFloat(item.amount) > 0 || parseFloat(item.rate) > 0)
    );

    if (validItems.length === 0) {
      showToast('Please add at least one line item or service before generating.');
      return;
    }

    setIsSubmitting(true);
    try {
      const rawCustomer = invoiceForm.customerName || 'General Customer';
      const cleanCustomer = rawCustomer.split(' - ')[0].split(' · ')[0];
      const initials =
        cleanCustomer
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase() || 'PP';

      const now = new Date();
      const fullDate = `${now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })} · ${now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;

      const newInvoiceRecord = {
        invoiceNumber: invoiceForm.invoiceNumber,
        customer: cleanCustomer,
        customerName: rawCustomer,
        customerPhone: invoiceForm.customerPhone || '077 233 1190',
        initials: initials,
        avatarBg: 'bg-[#15803d]',
        date: 'Today',
        fullDate: fullDate,
        amount: `Rs. ${invoiceForm.totalDue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        numericAmount: invoiceForm.totalDue,
        status: 'Paid',
        statusVariant: 'paid',
        paymentMethod: invoiceForm.paymentMethod || 'Cash',
        items: validItems,
        subtotal: invoiceForm.subtotal,
        discount: invoiceForm.discount,
        totalDue: invoiceForm.totalDue,
      };

      // Save to Cloud Firestore & deduct inventory
      const created = await createInvoice(newInvoiceRecord);

      // Open receipt modal for preview / printing
      setActiveReceipt(created);
      setIsReceiptOpen(true);
      showToast(`Invoice ${invoiceForm.invoiceNumber} saved & stock deducted!`);

      // Prepare next invoice form
      const nextInvNumber = generateNextInvoiceNumber([...invoices, created]);
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
    } catch (error) {
      console.error('Error saving invoice:', error);
      showToast('Error saving invoice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save as Draft
  const handleSaveAsDraft = async () => {
    setIsSubmitting(true);
    try {
      const rawCustomer = invoiceForm.customerName || 'General Customer';
      const cleanCustomer = rawCustomer.split(' - ')[0].split(' · ')[0];
      const initials =
        cleanCustomer
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase() || 'PP';

      const now = new Date();
      const fullDate = `${now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })} · ${now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;

      const draftRecord = {
        invoiceNumber: invoiceForm.invoiceNumber,
        customer: cleanCustomer,
        customerName: rawCustomer,
        customerPhone: invoiceForm.customerPhone || '077 233 1190',
        initials: initials,
        avatarBg: 'bg-[#64748b]',
        date: 'Today',
        fullDate: fullDate,
        amount: `Rs. ${invoiceForm.totalDue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        numericAmount: invoiceForm.totalDue,
        status: 'Pending',
        statusVariant: 'pending',
        paymentMethod: invoiceForm.paymentMethod || 'Cash',
        items: invoiceForm.items.filter((i) => i.description?.trim() !== ''),
        subtotal: invoiceForm.subtotal,
        discount: invoiceForm.discount,
        totalDue: invoiceForm.totalDue,
        isDraft: true,
      };

      const created = await createInvoice(draftRecord);
      showToast(`Invoice ${invoiceForm.invoiceNumber} saved as draft.`);

      const nextInvNumber = generateNextInvoiceNumber([...invoices, created]);
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
    } catch (error) {
      console.error('Error saving draft:', error);
      showToast('Error saving draft invoice.');
    } finally {
      setIsSubmitting(false);
    }
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
            inventoryItems={inventoryItems}
            customers={customers}
            isSubmitting={isSubmitting}
            onUpdateInvoice={setInvoiceForm}
            onSaveAndGenerate={handleSaveAndGenerate}
            onSaveAsDraft={handleSaveAsDraft}
          />
        </div>

        {/* Right Column: Recent invoices Card (40% on desktop) */}
        <div className="lg:col-span-5 xl:col-span-5">
          <RecentInvoicesList
            invoices={invoices}
            loading={loading}
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
