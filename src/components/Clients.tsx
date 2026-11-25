import { useState } from 'react';
import { Client } from '../types';
import { generateId } from '../utils';
import { Plus, Trash2, Pencil } from 'lucide-react';

interface Props {
  clients: Client[];
  onSave: (data: Client[]) => void;
}

const empty: Omit<Client, 'id'> = {
  name: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
};

export default function Clients({ clients, onSave }: Props) {
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const openNew = () => {
    setForm(empty);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (c: Client) => {
    setForm({
      name: c.name,
      email: c.email || '',
      address: c.address || '',
      city: c.city || '',
      postalCode: c.postalCode || '',
    });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingId) {
      onSave(
        clients.map((c) =>
          c.id === editingId ? { ...c, ...form } : c
        )
      );
    } else {
      onSave([...clients, { id: generateId(), ...form }]);
    }
    setShowForm(false);
    setForm(empty);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce client ?')) {
      onSave(clients.filter((c) => c.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Clients</h2>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
        >
          <Plus size={16} />
          Nouveau client
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-200 p-5 mb-6 space-y-4 max-w-xl"
        >
          <h3 className="font-semibold text-slate-700">
            {editingId ? 'Modifier le client' : 'Nouveau client'}
          </h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Courriel</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              {editingId ? 'Mettre à jour' : 'Ajouter'}
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

      {clients.length === 0 ? (
        <p className="text-slate-400 text-sm">Aucun client pour le moment.</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Courriel</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Ville</th>
                <th className="px-4 py-3 font-medium w-24"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{c.city || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 rounded"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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