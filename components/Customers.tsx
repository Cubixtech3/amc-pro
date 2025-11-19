import React from 'react';
import { Customer, CustomerStatus } from '../types';

interface CustomersProps {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (customer: Customer) => void;
}

const statusStyles: { [key in CustomerStatus]: string } = {
  [CustomerStatus.Active]: 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-500/20',
  [CustomerStatus.Inactive]: 'bg-slate-50 text-slate-600 border-slate-100 ring-slate-500/20',
  [CustomerStatus.Blocked]: 'bg-red-50 text-red-600 border-red-100 ring-red-500/20',
};

const Customers: React.FC<CustomersProps> = ({ customers, updateCustomer }) => {
    
  const handleStatusChange = (customer: Customer, newStatus: CustomerStatus) => {
    updateCustomer({ ...customer, status: newStatus });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Customer Database</h3>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition shadow-md shadow-primary-500/30 font-medium text-sm">
            + New Customer
        </button>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 text-slate-500 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-4 border-b border-slate-100">Company Name</th>
              <th className="p-4 border-b border-slate-100">Email Contact</th>
              <th className="p-4 border-b border-slate-100">Status</th>
              <th className="p-4 border-b border-slate-100 text-center">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {customers.map(customer => (
              <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-semibold text-slate-700">{customer.name}</td>
                <td className="p-4 text-slate-600">{customer.email}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ring-1 ring-inset ${statusStyles[customer.status]}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="p-4">
                    <div className="flex justify-center space-x-2">
                        {Object.values(CustomerStatus).map(status => (
                            customer.status !== status && (
                                <button
                                key={status}
                                onClick={() => handleStatusChange(customer, status)}
                                className={`px-2 py-1 text-xs font-semibold rounded transition-colors border ${
                                    status === CustomerStatus.Active ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' :
                                    status === CustomerStatus.Inactive ? 'border-slate-200 text-slate-600 hover:bg-slate-50' :
                                    'border-red-200 text-red-600 hover:bg-red-50'
                                }`}
                                >
                                Set {status}
                                </button>
                            )
                        ))}
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;