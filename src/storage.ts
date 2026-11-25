import { Invoice, Expense, Client, BusinessInfo } from './types';

const KEYS = {
  invoices: 'fq_invoices',
  expenses: 'fq_expenses',
  clients: 'fq_clients',
  business: 'fq_business',
  nextInvoiceNumber: 'fq_next_invoice_number',
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getInvoices: (): Invoice[] => load(KEYS.invoices, []),
  saveInvoices: (data: Invoice[]) => save(KEYS.invoices, data),

  getExpenses: (): Expense[] => load(KEYS.expenses, []),
  saveExpenses: (data: Expense[]) => save(KEYS.expenses, data),

  getClients: (): Client[] => load(KEYS.clients, []),
  saveClients: (data: Client[]) => save(KEYS.clients, data),

  getBusiness: (): BusinessInfo =>
    load(KEYS.business, {
      name: '',
      address: '',
      city: '',
      postalCode: '',
      email: '',
    }),
  saveBusiness: (data: BusinessInfo) => save(KEYS.business, data),

  getNextInvoiceNumber: (): number => {
    const n = load(KEYS.nextInvoiceNumber, 1);
    return typeof n === 'number' ? n : 1;
  },
  setNextInvoiceNumber: (n: number) => save(KEYS.nextInvoiceNumber, n),
};