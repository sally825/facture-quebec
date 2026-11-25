import { useState } from 'react';
import { BusinessInfo } from '../types';

interface Props {
  business: BusinessInfo;
  onSave: (data: BusinessInfo) => void;
}

export default function SettingsPage({ business, onSave }: Props) {
  const [form, setForm] = useState<BusinessInfo>(business);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof BusinessInfo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Paramètres</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 max-w-xl space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'entreprise / vous</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Ex: Marie Tremblay — Design"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Code postal</label>
            <input
              type="text"
              value={form.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
            <input
              type="text"
              value={form.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Courriel</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Numéros de taxes (optionnel)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">N° TPS</label>
              <input
                type="text"
                value={form.tpsNumber || ''}
                onChange={(e) => handleChange('tpsNumber', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="123456789 RT0001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">N° TVQ</label>
              <input
                type="text"
                value={form.tvqNumber || ''}
                onChange={(e) => handleChange('tvqNumber', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="1234567890 TQ0001"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            Enregistrer
          </button>
          {saved && <span className="text-sm text-emerald-600">Enregistré ✓</span>}
        </div>
      </form>
    </div>
  );
}