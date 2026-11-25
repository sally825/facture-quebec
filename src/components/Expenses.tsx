import { useState } from 'react';
import { Expense } from '../types';
import { generateId, formatMoney, todayISO } from '../utils';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  expenses: Expense[];
  onSave: (data: Expense[]) => void;
}

const CATEGORIES = [
  'Logiciels / Outils',
  'Matériel',
  'Transport',
  'Repas / Déplacements',
  'Formation',
  'Marketing',
  'Bureau / Internet',
  'Autre',
];

export default function Expenses({ expenses, onSave }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: todayISO(),
    description: '',
    amount: '',
    category: CATEGORIES[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.description.trim() || isNaN(amount) || amount <= 0) return;

    const newExpense: Expense = {
      id: generateId(),
      date: form.date,
      description: form.description.trim(),
      amount,
      category: form.category,
    };

    onSave([newExpense, ...expenses]);
    setForm({ date: todayISO(), description: '', amount: '', category: CATEGORIES[0] });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette dépense ?')) {
      onSave(expenses.filter((e) => e.id !== id));
    }
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dépenses</h2>
          <p className="text-sm text-slate-500 mt-0.5">Total : {formatMoney(total)}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
        >
          <Plus size={16} />
          Nouvelle dépense
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-200 p-5 mb-6 space-y-4 max-w-xl"
        >
          <h3 className="font-semibold text-slate-700">Nouvelle dépense</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Montant ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Ex: Abonnement Adobe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-100"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {expenses.length === 0 ? (
        <p className="text-slate-400 text-sm">Aucune dépense pour le moment.</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Catégorie</th>
                <th className="px-4 py-3 font-medium text-right">Montant</th>
                <th className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-500">{e.date}</td>
                  <td className="px-4 py-3 font-medium">{e.description}</td>
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{e.category}</td>
                  <td className="px-4 py-3 text-right font-medium text-rose-600">
                    {formatMoney(e.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}