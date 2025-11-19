
import { Page, Customer, Contract, CustomerStatus, PaymentStatus } from './types';

export const NAV_ITEMS = [
  { page: Page.Dashboard, label: 'Dashboard' },
  { page: Page.Contracts, label: 'Contracts' },
  { page: Page.Customers, label: 'Customers' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'CUST1', name: 'Innovate Corp', number: '555-0101', status: CustomerStatus.Active },
  { id: 'CUST2', name: 'Solutions Inc.', number: '555-0102', status: CustomerStatus.Active },
  { id: 'CUST3', name: 'Tech Giants LLC', number: '555-0103', status: CustomerStatus.Inactive },
  { id: 'CUST4', name: 'Synergy Partners', number: '555-0104', status: CustomerStatus.Blocked },
];

const createRenewalDate = (startDate: Date, months: number): string => {
    const renewalDate = new Date(startDate);
    renewalDate.setMonth(renewalDate.getMonth() + months);
    return renewalDate.toISOString();
};

const today = new Date();
const lastYear = new Date(new Date().setFullYear(today.getFullYear() - 1));
const lastYearPlus30 = new Date(new Date().setFullYear(today.getFullYear() - 1));
lastYearPlus30.setDate(lastYearPlus30.getDate() + 30);
const lastYearMinus15 = new Date(new Date().setFullYear(today.getFullYear() - 1));
lastYearMinus15.setDate(lastYearMinus15.getDate() - 15);


export const MOCK_CONTRACTS: Contract[] = [
  { 
    id: 'C1', 
    customerId: 'CUST1', 
    dealClosedDate: lastYear.toISOString(),
    dealAmount: 50000, 
    amcAmount: 5000, 
    durationInMonths: 12,
    paymentStatus: PaymentStatus.Pending,
    renewalDate: createRenewalDate(lastYear, 12),
  },
  { 
    id: 'C2', 
    customerId: 'CUST2', 
    dealClosedDate: new Date('2023-08-15').toISOString(), 
    dealAmount: 75000, 
    amcAmount: 7500, 
    durationInMonths: 12,
    paymentStatus: PaymentStatus.Paid,
    renewalDate: createRenewalDate(new Date('2023-08-15'), 12),
  },
  { 
    id: 'C3', 
    customerId: 'CUST3', 
    dealClosedDate: lastYearPlus30.toISOString(), 
    dealAmount: 30000, 
    amcAmount: 3500, 
    durationInMonths: 13,
    paymentStatus: PaymentStatus.Paid,
    renewalDate: createRenewalDate(lastYearPlus30, 13),
  },
  { 
    id: 'C4', 
    customerId: 'CUST1', 
    dealClosedDate: lastYearMinus15.toISOString(),
    dealAmount: 120000, 
    amcAmount: 12000, 
    durationInMonths: 12,
    paymentStatus: PaymentStatus.Overdue,
    renewalDate: createRenewalDate(lastYearMinus15, 12),
  },
];
