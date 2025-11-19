import React, { useState, useCallback } from 'react';
import { Customer, Contract, Page, PaymentStatus } from './types';
import { NAV_ITEMS, MOCK_CUSTOMERS, MOCK_CONTRACTS } from './constants';
import { ContractIcon, CustomerIcon, DashboardIcon } from './components/ui/Icons';
import Dashboard from './components/Dashboard';
import Contracts from './components/Contracts';
import Customers from './components/Customers';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Dashboard);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('amc_customers', MOCK_CUSTOMERS);
  const [contracts, setContracts] = useLocalStorage<Contract[]>('amc_contracts', MOCK_CONTRACTS);

  const getCustomerById = useCallback((id: string) => {
    return customers.find(c => c.id === id);
  }, [customers]);

  const addContract = (contract: Omit<Contract, 'id' | 'paymentStatus'>) => {
    const newContract: Contract = {
      ...contract,
      id: `C${Date.now()}`,
      paymentStatus: PaymentStatus.Paid, 
    };
    setContracts(prev => [...prev, newContract]);
  };

  const updateContract = (updatedContract: Contract) => {
    setContracts(prev => prev.map(c => c.id === updatedContract.id ? updatedContract : c));
  };
  
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: `CUST${Date.now()}`,
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };

  const renderContent = () => {
    switch (activePage) {
      case Page.Dashboard:
        return <Dashboard contracts={contracts} customers={customers} getCustomerById={getCustomerById}/>;
      case Page.Contracts:
        return <Contracts contracts={contracts} customers={customers} addContract={addContract} updateContract={updateContract} getCustomerById={getCustomerById} />;
      case Page.Customers:
        return <Customers customers={customers} addCustomer={addCustomer} updateCustomer={updateCustomer} />;
      default:
        return <Dashboard contracts={contracts} customers={customers} getCustomerById={getCustomerById} />;
    }
  };

  const NavIcon = ({ page }: { page: Page }) => {
    switch (page) {
        case Page.Dashboard: return <DashboardIcon />;
        case Page.Contracts: return <ContractIcon />;
        case Page.Customers: return <CustomerIcon />;
        default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-20 md:w-72 bg-slate-900 text-white flex flex-col shadow-2xl transition-all duration-300 z-20">
        <div className="h-20 flex items-center justify-center md:justify-start md:px-8 border-b border-slate-800">
            <div className="text-primary-400 bg-slate-800 p-2 rounded-lg"><ContractIcon /></div>
            <h1 className="text-xl font-bold ml-3 hidden md:block tracking-tight text-white">AMC Manager <span className="text-primary-400">Pro</span></h1>
        </div>
        
        <div className="flex-1 px-4 py-8 space-y-2">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:block mb-4">Main Menu</p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.page}
              onClick={() => setActivePage(item.page)}
              className={`w-full flex items-center justify-center md:justify-start py-3.5 px-4 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                activePage === item.page
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <NavIcon page={item.page} />
              <span className={`ml-4 font-medium hidden md:block ${activePage === item.page ? 'text-white' : ''}`}>{item.label}</span>
              
              {activePage === item.page && (
                 <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l hidden md:block"></div>
              )}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-slate-800 hidden md:block">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-xs text-slate-400 mb-2">Need Help?</p>
                <button className="text-sm text-primary-400 hover:text-primary-300 font-medium">Contact Support &rarr;</button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div>
              <h2 className="text-2xl font-bold text-slate-800">{NAV_ITEMS.find(item => item.page === activePage)?.label}</h2>
              <p className="text-sm text-slate-500 mt-0.5">Welcome back, Admin</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold border border-primary-200">
                A
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;