import React, { useMemo } from 'react';
import { Contract, Customer } from '../types';
import { AlertIcon, ContractIcon, CustomerIcon, OverdueIcon } from './ui/Icons';

interface DashboardProps {
  contracts: Contract[];
  customers: Customer[];
  getCustomerById: (id: string) => Customer | undefined;
}

const Dashboard: React.FC<DashboardProps> = ({ contracts, customers, getCustomerById }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const upcomingRenewals = contracts.filter(c => {
      const renewalDate = new Date(c.renewalDate);
      return renewalDate > now && renewalDate <= thirtyDaysFromNow;
    });

    const overduePayments = contracts.filter(c => {
        const renewalDate = new Date(c.renewalDate);
        return renewalDate <= now && c.paymentStatus !== 'Paid';
    });

    return {
      totalContracts: contracts.length,
      totalCustomers: customers.length,
      upcomingRenewals,
      overduePayments,
    };
  }, [contracts, customers]);

  const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; colorClass: string }> = ({ title, value, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200 flex items-center group">
      <div className={`p-4 rounded-xl ${colorClass} group-hover:scale-110 transition-transform duration-200`}>
        {icon}
      </div>
      <div className="ml-5">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
    </div>
  );

  const ReminderCard: React.FC<{ contract: Contract; customer?: Customer, type: 'upcoming' | 'overdue' }> = ({ contract, customer, type }) => (
    <div className={`bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors ${type === 'overdue' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-amber-400'}`}>
       <div className="flex items-start space-x-4">
           <div className={`p-2 rounded-lg ${type === 'upcoming' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'}`}>
               {type === 'upcoming' ? <AlertIcon /> : <OverdueIcon />}
           </div>
          <div>
            <p className="font-bold text-slate-800">{customer?.name || 'Unknown Customer'}</p>
            <p className="text-sm text-slate-500 mt-1">
              Due Date: {new Date(contract.renewalDate).toLocaleDateString()}
            </p>
          </div>
       </div>
       <div className="text-right">
           <p className="text-xs text-slate-400 font-medium uppercase">AMC Amount</p>
           <p className={`font-bold text-lg ${type === 'overdue' ? 'text-red-600' : 'text-primary-600'}`}>
               ${contract.amcAmount.toLocaleString()}
           </p>
       </div>
    </div>
  );


  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Contracts" 
            value={stats.totalContracts} 
            icon={<ContractIcon />} 
            colorClass="bg-primary-50 text-primary-600" 
        />
        <StatCard 
            title="Total Customers" 
            value={stats.totalCustomers} 
            icon={<CustomerIcon />} 
            colorClass="bg-indigo-50 text-indigo-600" 
        />
        <StatCard 
            title="Renewals (30 Days)" 
            value={stats.upcomingRenewals.length} 
            icon={<AlertIcon />} 
            colorClass="bg-amber-50 text-amber-500" 
        />
        <StatCard 
            title="Overdue Actions" 
            value={stats.overduePayments.length} 
            icon={<OverdueIcon />} 
            colorClass="bg-red-50 text-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <span className="bg-amber-100 p-1.5 rounded-lg text-amber-600 mr-3"><AlertIcon /></span>
                Upcoming Renewals
             </h3>
             <span className="text-xs font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-500">Next 30 Days</span>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {stats.upcomingRenewals.length > 0 ? (
              stats.upcomingRenewals.map(c => <ReminderCard key={c.id} contract={c} customer={getCustomerById(c.customerId)} type="upcoming" />)
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400">No upcoming renewals pending.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <span className="bg-red-100 p-1.5 rounded-lg text-red-600 mr-3"><OverdueIcon /></span>
                Action Required
            </h3>
            <span className="text-xs font-medium bg-red-50 px-3 py-1 rounded-full text-red-600">Overdue</span>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {stats.overduePayments.length > 0 ? (
              stats.overduePayments.map(c => <ReminderCard key={c.id} contract={c} customer={getCustomerById(c.customerId)} type="overdue" />)
            ) : (
               <div className="text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                   <p className="text-slate-500">All payments are up to date. Great job!</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;