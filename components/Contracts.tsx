import React, { useState } from 'react';
import { Contract, Customer, PaymentStatus } from '../types';
import InvoiceModal from './InvoiceModal';
import GeminiEmailModal from './GeminiEmailModal';
import { InvoiceIcon, EmailIcon } from './ui/Icons';

interface ContractsProps {
  contracts: Contract[];
  customers: Customer[];
  addContract: (contract: Omit<Contract, 'id' | 'paymentStatus'>) => void;
  updateContract: (contract: Contract) => void;
  getCustomerById: (id: string) => Customer | undefined;
}

const statusStyles: { [key in PaymentStatus]: string } = {
  [PaymentStatus.Paid]: 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-500/20',
  [PaymentStatus.Pending]: 'bg-amber-50 text-amber-600 border-amber-100 ring-amber-500/20',
  [PaymentStatus.Overdue]: 'bg-red-50 text-red-600 border-red-100 ring-red-500/20',
};

const Contracts: React.FC<ContractsProps> = ({ contracts, customers, addContract, updateContract, getCustomerById }) => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isInvoiceOpen, setInvoiceOpen] = useState(false);
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);

  const handleGenerateInvoice = (contract: Contract) => {
    setSelectedContract(contract);
    setInvoiceOpen(true);
  };

  const handleGenerateEmail = (contract: Contract) => {
    setSelectedContract(contract);
    setEmailModalOpen(true);
  };

  const getStatusForContract = (contract: Contract): PaymentStatus => {
    const renewalDate = new Date(contract.renewalDate);
    const now = new Date();
    if(contract.paymentStatus === PaymentStatus.Paid && renewalDate > now) {
        return PaymentStatus.Paid;
    }
    if (renewalDate <= now) {
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(now.getDate() - 15);
        if (renewalDate <= fifteenDaysAgo) {
            return PaymentStatus.Overdue;
        }
        return PaymentStatus.Pending;
    }
    return contract.paymentStatus;
  }
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Contract Management</h3>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition shadow-md shadow-primary-500/30 font-medium text-sm">
            + New Contract
        </button>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 text-slate-500 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-4 border-b border-slate-100">Customer</th>
              <th className="p-4 border-b border-slate-100">AMC Amount</th>
              <th className="p-4 border-b border-slate-100">Renewal Date</th>
              <th className="p-4 border-b border-slate-100">Status</th>
              <th className="p-4 border-b border-slate-100 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {contracts.map(contract => {
              const customer = getCustomerById(contract.customerId);
              const displayStatus = getStatusForContract(contract);
              return (
                <tr key={contract.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4">
                      <div className="font-semibold text-slate-700">{customer?.name || 'N/A'}</div>
                      <div className="text-xs text-slate-400">{contract.id}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-600">${contract.amcAmount.toLocaleString()}</td>
                  <td className="p-4 text-slate-600">{new Date(contract.renewalDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ring-1 ring-inset ${statusStyles[displayStatus]}`}>
                      {displayStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end items-center space-x-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                        onClick={() => handleGenerateInvoice(contract)}
                        className="flex items-center text-slate-600 hover:text-primary-600 bg-white border border-slate-200 hover:border-primary-200 hover:bg-primary-50 px-3 py-1.5 rounded-md transition-all text-sm font-medium shadow-sm"
                        >
                        <span className="mr-2"><InvoiceIcon /></span> Invoice
                        </button>
                        <button
                        onClick={() => handleGenerateEmail(contract)}
                        className="flex items-center text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-md transition-all text-sm font-medium shadow-sm shadow-primary-500/30"
                        >
                        <span className="mr-2"><EmailIcon /></span> Reminder
                        </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {isInvoiceOpen && selectedContract && (
        <InvoiceModal
          contract={selectedContract}
          customer={getCustomerById(selectedContract.customerId)}
          onClose={() => setInvoiceOpen(false)}
        />
      )}
      {isEmailModalOpen && selectedContract && (
        <GeminiEmailModal
          contract={selectedContract}
          customer={getCustomerById(selectedContract.customerId)!}
          onClose={() => setEmailModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Contracts;