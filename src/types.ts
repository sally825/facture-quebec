export interface Client {
  id: string;
  name: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  status: 'draft' | 'sent' | 'paid';
  subtotal: number;
  tps: number;
  tvq: number;
  total: number;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface BusinessInfo {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  email: string;
  phone?: string;
  tpsNumber?: string;
  tvqNumber?: string;
}

export const TPS_RATE = 0.05;
export const TVQ_RATE = 0.09975;