import React from 'react';
import { Contract, Customer } from '../types';

interface InvoiceModalProps {
  contract: Contract;
  customer: Customer | undefined;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ contract, customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-wide">INVOICE</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-light">&times;</button>
        </div>
        
        <div className="p-8" id="invoice-content">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">AMC Pro Inc.</h3>
              <p className="text-slate-500 mt-1">123 Tech Avenue<br/>Silicon Valley, CA 94000</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 font-mono">INV-#{contract.id}-{new Date(contract.renewalDate).getFullYear()}</p>
              <div className="mt-2">
                  <p className="text-sm text-slate-500">Date Issued</p>
                  <p className="font-semibold text-slate-800">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="mt-2">
                  <p className="text-sm text-slate-500">Due Date</p>
                  <p className="font-semibold text-primary-600">{new Date(contract.renewalDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-10 p-6 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</p>
            <h4 className="text-lg font-bold text-slate-800">{customer.name}</h4>
            <p className="text-slate-600">{customer.email}</p>
          </div>
          
          <table className="w-full mb-10">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="text-left pb-3 font-semibold text-slate-600">Description</th>
                <th className="text-right pb-3 font-semibold text-slate-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-50">
                <td className="py-4 text-slate-700 font-medium">
                    Annual Maintenance Contract 
                    <div className="text-sm text-slate-400 font-normal mt-1">
                        Period: {new Date(contract.renewalDate).toLocaleDateString()} - {new Date(new Date(contract.renewalDate).setFullYear(new Date(contract.renewalDate).getFullYear() + 1)).toLocaleDateString()}
                    </div>
                </td>
                <td className="text-right py-4 font-semibold text-slate-800">${contract.amcAmount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          
          <div className="flex justify-end">
            <div className="w-1/2">
              <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-800">${contract.amcAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Tax (0%)</span>
                  <span className="font-medium text-slate-800">$0.00</span>
              </div>
              <div className="flex justify-between py-4">
                  <span className="text-xl font-bold text-slate-800">Total</span>
                  <span className="text-xl font-bold text-primary-600">${contract.amcAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
         <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
            <button onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors">Close</button>
            <button onClick={() => window.print()} className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-lg shadow-primary-500/30 transition-colors">Print Invoice</button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;