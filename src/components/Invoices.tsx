import { useState } from 'react';
import { Invoice, InvoiceItem, Client, BusinessInfo } from '../types';
import { calculateTotals, formatMoney, formatDate, generateId, todayISO } from '../utils';
import { storage } from '../storage';
import { Plus, Trash2, Eye, X } from 'lucide-react';

interface Props {
  invoices: Invoice[];
  clients: Client[];
  business: BusinessInfo;
  onSave: (data: Invoice[]) => void;
}

export default function Invoices({ invoices, clients, business, onSave }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState<Invoice | null>(null);

  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: generateId(), description: '', quantity: 1, unitPrice: 0 },
  ]);

  const resetForm = () => {
    setClientId('');
    setDate(todayISO());
    setDueDate('');
    setNotes('');
    setItems([{ id: generateId(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const addItem = () => {
    setItems([...items, { id: generateId(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === clientId);
    if (!client) {
      alert('Veuillez sélectionner un client.');
      return;
    }

    const validItems = items.filter((i) => i.description.trim() && i.unitPrice > 0);
    if (validItems.length === 0) {
      alert('Ajoutez au moins un item valide.');
      return;
    }

    const totals = calculateTotals(validItems);
    const nextNum = storage.getNextInvoiceNumber();
    const number = `FQ-${String(nextNum).padStart(4, '0')}`;

    const invoice: Invoice = {
      id: generateId(),
      number,
      clientId: client.id,
      clientName: client.name,
      date,
      dueDate: dueDate || date,
      items: validItems,
      notes: notes.trim() || undefined,
      status: 'draft',
      ...totals,
    };

    onSave([invoice, ...invoices]);
    storage.setNextInvoiceNumber(nextNum + 1);
    setShowForm(false);
    resetForm();
  };

  const updateStatus = (id: string, status: Invoice['status']) => {
    onSave(
      invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette facture ?')) {
      onSave(invoices.filter((i) => i.id !== id));
    }
  };

  const totals = calculateTotals(items);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Factures</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
        >
          <Plus size={16} />
          Nouvelle facture
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-200 p-5 mb-6 space-y-5"
        >
          <h3 className="font-semibold text-slate-700">Nouvelle facture</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client *</label>
              <select
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Sélectionner...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {clients.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">Ajoutez d'abord un client.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Échéance</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Items</label>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-2">
                  <input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Qté"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Prix"
                    value={item.unitPrice || ''}
                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-28 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItem}
              className="mt-2 text-sm text-sky-600 hover:underline"
            >
              + Ajouter un item
            </button>
          </div>

          {/* Totals */}
          <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-1 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Sous-total</span>
              <span>{formatMoney(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TPS (5 %)</span>
              <span>{formatMoney(totals.tps)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TVQ (9,975 %)</span>
              <span>{formatMoney(totals.tvq)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1 border-t border-slate-200">
              <span>Total</span>
              <span>{formatMoney(totals.total)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optionnel)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Conditions de paiement, remerciements..."
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg"
            >
              Créer la facture
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-slate-600 px-4 py-2.5 rounded-lg hover:bg-slate-100"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste */}
      {invoices.length === 0 ? (
        <p className="text-slate-400 text-sm">Aucune facture pour le moment.</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">N°</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 w-28"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{inv.number}</td>
                  <td className="px-4 py-3">{inv.clientName}</td>
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{inv.date}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatMoney(inv.total)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={inv.status}
                      onChange={(e) => updateStatus(inv.id, e.target.value as Invoice['status'])}
                      className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer
                        ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                          inv.status === 'sent' ? 'bg-amber-50 text-amber-700' :
                          'bg-slate-100 text-slate-600'}`}
                    >
                      <option value="draft">Brouillon</option>
                      <option value="sent">Envoyée</option>
                      <option value="paid">Payée</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPreview(inv)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 rounded"
                        title="Aperçu"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id)}
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

      {/* Modal aperçu facture */}
      {preview && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Aperçu — {preview.number}</h3>
              <button onClick={() => setPreview(null)} className="p-1 hover:bg-slate-100 rounded">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 text-sm space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-base">{business.name || 'Votre entreprise'}</p>
                  {business.address && <p className="text-slate-500">{business.address}</p>}
                  {business.city && (
                    <p className="text-slate-500">
                      {business.city} {business.postalCode}
                    </p>
                  )}
                  {business.email && <p className="text-slate-500">{business.email}</p>}
                  {business.tpsNumber && (
                    <p className="text-slate-400 text-xs mt-1">TPS : {business.tpsNumber}</p>
                  )}
                  {business.tvqNumber && (
                    <p className="text-slate-400 text-xs">TVQ : {business.tvqNumber}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-sky-700">{preview.number}</p>
                  <p className="text-slate-500">Date : {formatDate(preview.date)}</p>
                  <p className="text-slate-500">Échéance : {formatDate(preview.dueDate)}</p>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Facturé à</p>
                <p className="font-medium">{preview.clientName}</p>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-500 border-b">
                    <th className="pb-2 font-medium">Description</th>
                    <th className="pb-2 font-medium text-right">Qté</th>
                    <th className="pb-2 font-medium text-right">Prix</th>
                    <th className="pb-2 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50">
                      <td className="py-2">{item.description}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">{formatMoney(item.unitPrice)}</td>
                      <td className="py-2 text-right">
                        {formatMoney(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-1 text-right">
                <p>
                  Sous-total : <span className="font-medium">{formatMoney(preview.subtotal)}</span>
                </p>
                <p>
                  TPS (5 %) : <span className="font-medium">{formatMoney(preview.tps)}</span>
                </p>
                <p>
                  TVQ (9,975 %) : <span className="font-medium">{formatMoney(preview.tvq)}</span>
                </p>
                <p className="text-lg font-bold pt-1">
                  Total : {formatMoney(preview.total)}
                </p>
              </div>

              {preview.notes && (
                <div className="border-t pt-3 text-slate-500">
                  <p className="text-xs uppercase tracking-wide mb-1">Notes</p>
                  <p>{preview.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}