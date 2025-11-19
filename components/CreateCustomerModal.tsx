import React, { useState } from 'react';
import { Customer, CustomerStatus } from '../types';

interface CreateCustomerModalProps {
  onClose: () => void;
  onSubmit: (customer: Omit<Customer, 'id'>) => void;
}

const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      number,
      status: CustomerStatus.Active
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <h3 className="text-lg font-bold text-slate-800">Add New Customer</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-slate-800 placeholder-slate-400"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
            <input
              type="number"
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-slate-800 placeholder-slate-400"
              value={number}
              onChange={e => setNumber(e.target.value)}
              placeholder="+971 05421387"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
            >
              Create Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomerModal;