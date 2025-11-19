
export enum Page {
  Dashboard = 'DASHBOARD',
  Contracts = 'CONTRACTS',
  Customers = 'CUSTOMERS',
}

export enum CustomerStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Blocked = 'Blocked',
}

export enum PaymentStatus {
    Paid = 'Paid',
    Pending = 'Pending',
    Overdue = 'Overdue'
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  status: CustomerStatus;
}

export interface Contract {
  id: string;
  customerId: string;
  dealClosedDate: string; // ISO string format
  dealAmount: number;
  amcAmount: number;
  durationInMonths: 12 | 13;
  paymentStatus: PaymentStatus;
  renewalDate: string; // ISO string format
}
