import React, { useState, useCallback } from 'react';
import { Customer, Contract, Page, PaymentStatus } from './types';
import { NAV_ITEMS, MOCK_CUSTOMERS, MOCK_CONTRACTS } from './constants';
import { ContractIcon, CustomerIcon, DashboardIcon } from './components/ui/Icons';
import Dashboard from './components/Dashboard';
import Contracts from './components/Contracts';
import Customers from './components/Customers';
import { useLocalStorage } from './hooks/useLocalStorage';
import CreateCustomerModal from './components/CreateCustomerModal';

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
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans flex-col-reverse md:flex-row overflow-hidden">
      {/* Sidebar / Bottom Menu */}
      <aside className="w-full md:w-72 bg-slate-900 text-white flex md:flex-col flex-row justify-between md:justify-start shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.3)] md:shadow-2xl transition-all duration-300 z-30 shrink-0 h-[72px] md:h-auto">
        
        {/* Desktop Logo */}
        <div className="hidden md:flex h-20 items-center px-8 border-b border-slate-800 shrink-0">
            <div className="text-primary-400 bg-slate-800 p-2 rounded-lg"><ContractIcon /></div>
            <h1 className="text-xl font-bold ml-3 tracking-tight text-white">AMC Manager <span className="text-primary-400">Pro</span></h1>
        </div>
        
        {/* Nav Items */}
        <div className="flex-1 w-full md:px-4 md:py-8 flex flex-row md:flex-col justify-evenly md:justify-start items-center md:space-y-2">
          <p className="hidden md:block px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Main Menu</p>
          
          {NAV_ITEMS.map((item) => (
            <button
              key={item.page}
              onClick={() => setActivePage(item.page)}
              className={`
                relative group flex flex-col md:flex-row items-center md:justify-start justify-center
                w-full md:w-full h-full md:h-auto py-1 md:py-3.5 px-1 md:px-4
                md:rounded-xl transition-all duration-300
                ${activePage === item.page
                  ? 'text-primary-400 md:bg-primary-600 md:text-white md:shadow-lg md:shadow-primary-900/20'
                  : 'text-slate-400 hover:text-primary-300 md:hover:bg-slate-800 md:hover:text-white'
                }
              `}
            >
              <div className={`transition-transform duration-300 ${activePage === item.page ? 'scale-110 md:scale-100 -translate-y-1 md:translate-y-0' : ''}`}>
                  <NavIcon page={item.page} />
              </div>

              <span className={`
                text-[10px] md:text-sm font-medium mt-1 md:mt-0 md:ml-4 transition-colors duration-300
                ${activePage === item.page ? 'text-primary-400 md:text-white font-bold' : 'text-slate-500 md:text-inherit'}
              `}>
                {item.label}
              </span>
              
              {/* Desktop Active Indicator */}
              {activePage === item.page && (
                 <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l"></div>
              )}

              {/* Mobile Active Glow/Bar */}
              {activePage === item.page && (
                 <div className="md:hidden absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary-500 rounded-b-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
              )}
            </button>
          ))}
        </div>

        {/* Desktop Support */}
        <div className="hidden md:block p-6 border-t border-slate-800 shrink-0">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-xs text-slate-400 mb-2">Need Help?</p>
                <button className="text-sm text-primary-400 hover:text-primary-300 font-medium">Contact Support &rarr;</button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 h-full relative">
        <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-10 shrink-0">
          <div className="flex items-center">
              {/* Mobile Logo */}
              <div className="md:hidden mr-3 text-primary-600 bg-primary-50 p-1.5 rounded-lg border border-primary-100">
                  <ContractIcon />
              </div>
              <div>
                  <h2 className="text-lg md:text-2xl font-bold text-slate-800">{NAV_ITEMS.find(item => item.page === activePage)?.label}</h2>
                  <p className="text-xs md:text-sm text-slate-500 hidden md:block">Welcome back, Admin</p>
              </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 flex items-center justify-center font-bold border border-primary-200 shadow-sm">
                A
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-4 md:pb-0">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;