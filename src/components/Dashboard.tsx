import { Invoice, Expense } from '../types';
import { formatMoney } from '../utils';
import { FileText, Receipt, TrendingUp, DollarSign } from 'lucide-react';

interface Props {
  invoices: Invoice[];
  expenses: Expense[];
  onNavigate: (tab: 'invoices' | 'expenses') => void;
}

export default function Dashboard({ invoices, expenses, onNavigate }: Props) {
  const paidInvoices = invoices.filter((i) => i.status === 'paid');
  const unpaidInvoices = invoices.filter((i) => i.status !== 'paid');

  const totalRevenue = paidInvoices.reduce((s, i) => s + i.total, 0);
  const totalUnpaid = unpaidInvoices.reduce((s, i) => s + i.total, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const profit = totalRevenue - totalExpenses;

  const cards = [
    {
      label: 'Revenus encaissés',
      value: formatMoney(totalRevenue),
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'À encaisser',
      value: formatMoney(totalUnpaid),
      icon: FileText,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Dépenses',
      value: formatMoney(totalExpenses),
      icon: Receipt,
      color: 'text-rose-600 bg-rose-50',
    },
    {
      label: 'Bénéfice net',
      value: formatMoney(profit),
      icon: TrendingUp,
      color: profit >= 0 ? 'text-sky-600 bg-sky-50' : 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Tableau de bord</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500">{c.label}</span>
                <div className={`p-2 rounded-lg ${c.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{c.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Dernières factures</h3>
            <button
              onClick={() => onNavigate('invoices')}
              className="text-sm text-sky-600 hover:underline"
            >
              Voir tout
            </button>
          </div>
          {invoices.length === 0 ? (
            <p className="text-sm text-slate-400">Aucune facture pour le moment.</p>
          ) : (
            <ul className="space-y-3">
              {invoices.slice(0, 5).map((inv) => (
                <li key={inv.id} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{inv.number}</span>
                    <span className="text-slate-400 ml-2">{inv.clientName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{formatMoney(inv.total)}</span>
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : inv.status === 'sent'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {inv.status === 'paid' ? 'Payée' : inv.status === 'sent' ? 'Envoyée' : 'Brouillon'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Dernières dépenses</h3>
            <button
              onClick={() => onNavigate('expenses')}
              className="text-sm text-sky-600 hover:underline"
            >
              Voir tout
            </button>
          </div>
          {expenses.length === 0 ? (
            <p className="text-sm text-slate-400">Aucune dépense pour le moment.</p>
          ) : (
            <ul className="space-y-3">
              {expenses.slice(0, 5).map((exp) => (
                <li key={exp.id} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{exp.description}</span>
                    <span className="text-slate-400 ml-2">{exp.category}</span>
                  </div>
                  <span className="font-medium text-rose-600">{formatMoney(exp.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}