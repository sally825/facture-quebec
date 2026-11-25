import { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, Receipt, Users, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Invoices from './components/Invoices';
import Expenses from './components/Expenses';
import Clients from './components/Clients';
import SettingsPage from './components/Settings';
import { storage } from './storage';
import { Invoice, Expense, Client, BusinessInfo } from './types';

type Tab = 'dashboard' | 'invoices' | 'expenses' | 'clients' | 'settings';

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [business, setBusiness] = useState<BusinessInfo>(storage.getBusiness());

  useEffect(() => {
    setInvoices(storage.getInvoices());
    setExpenses(storage.getExpenses());
    setClients(storage.getClients());
  }, []);

  const saveInvoices = (data: Invoice[]) => {
    setInvoices(data);
    storage.saveInvoices(data);
  };

  const saveExpenses = (data: Expense[]) => {
    setExpenses(data);
    storage.saveExpenses(data);
  };

  const saveClients = (data: Client[]) => {
    setClients(data);
    storage.saveClients(data);
  };

  const saveBusiness = (data: BusinessInfo) => {
    setBusiness(data);
    storage.saveBusiness(data);
  };

  const nav = [
    { id: 'dashboard' as Tab, label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'invoices' as Tab, label: 'Factures', icon: FileText },
    { id: 'expenses' as Tab, label: 'Dépenses', icon: Receipt },
    { id: 'clients' as Tab, label: 'Clients', icon: Users },
    { id: 'settings' as Tab, label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="bg-white border-b md:border-b-0 md:border-r border-slate-200 md:w-64 md:min-h-screen">
        <div className="p-5 border-b border-slate-100">
          <h1 className="text-xl font-bold text-sky-700">Facture Québec</h1>
          <p className="text-xs text-slate-500 mt-0.5">Facturation simple pour freelances</p>
        </div>
        <nav className="p-3 flex md:flex-col gap-1 overflow-x-auto">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap
                  ${active ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 max-w-5xl">
        {tab === 'dashboard' && (
          <Dashboard
            invoices={invoices}
            expenses={expenses}
            onNavigate={(t) => setTab(t)}
          />
        )}
        {tab === 'invoices' && (
          <Invoices
            invoices={invoices}
            clients={clients}
            business={business}
            onSave={saveInvoices}
          />
        )}
        {tab === 'expenses' && (
          <Expenses expenses={expenses} onSave={saveExpenses} />
        )}
        {tab === 'clients' && (
          <Clients clients={clients} onSave={saveClients} />
        )}
        {tab === 'settings' && (
          <SettingsPage business={business} onSave={saveBusiness} />
        )}
      </main>
    </div>
  );
}
