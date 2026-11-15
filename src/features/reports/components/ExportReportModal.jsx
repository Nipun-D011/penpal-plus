import { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Printer } from 'lucide-react';
import Button from '../../../components/common/Button';

export const ExportReportModal = ({ isOpen, onClose, currentPeriod = 'August 2026' }) => {
  const [format, setFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeItemBreakdown, setIncludeItemBreakdown] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
        onClose();
      }, 1200);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Export Sales Report
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Period: {currentPeriod}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-in zoom-in-75 duration-200" />
            <h4 className="font-serif font-bold text-lg text-slate-900 mt-3">
              Report exported successfully!
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Your download will begin shortly.
            </p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                    format === 'pdf'
                      ? 'border-[#131d33] bg-[#131d33]/5 text-[#131d33] font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span>PDF Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('csv')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                    format === 'csv'
                      ? 'border-[#131d33] bg-[#131d33]/5 text-[#131d33] font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>CSV / Excel</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Report Inclusions
              </label>
              <label className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="rounded border-slate-300 text-[#131d33] focus:ring-[#131d33]"
                />
                Include revenue trend & category charts
              </label>
              <label className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeItemBreakdown}
                  onChange={(e) => setIncludeItemBreakdown(e.target.checked)}
                  className="rounded border-slate-300 text-[#131d33] focus:ring-[#131d33]"
                />
                Include top selling items table
              </label>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Print</span>
              </button>

              <div className="flex-1">
                <Button
                  onClick={handleExport}
                  isLoading={isExporting}
                  className="w-full !py-2.5 text-xs"
                >
                  Download {format.toUpperCase()}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportReportModal;
