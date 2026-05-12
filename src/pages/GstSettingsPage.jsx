import { useState } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';
import { gstSlabs, hsnMaster } from '../data/mockGst.js';

export default function GstSettingsPage() {
  const [slabs, setSlabs] = useState(gstSlabs);
  const [hsn, setHsn] = useState(hsnMaster);

  return (
    <div className="space-y-6">
      <SectionHeader title="GST settings" subtitle="Manage tax slabs, HSN/SAC codes, and tax rules for agriculture and processed goods." />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">GST slabs</h2>
          <div className="mt-4 space-y-3 text-sm text-farmgray">
            {slabs.map((slab) => (
              <div key={slab.rate} className="rounded-3xl bg-farmsoil p-4 dark:bg-slate-800">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{slab.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">HSN / SAC master</h2>
          <div className="mt-4 space-y-3 text-sm text-farmgray">
            {hsn.map((item) => (
              <div key={item.code} className="rounded-3xl bg-farmsoil p-4 dark:bg-slate-800">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{item.code}</p>
                <p className="mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-3xl bg-farmsoil p-6 text-sm text-farmgray dark:bg-slate-800">
        <p>Admin can later wire these values to a backend API and use them to configure product-level tax rules in the marketplace.</p>
        <button className="mt-4 rounded-3xl bg-farmgreen px-5 py-3 text-sm font-semibold text-white transition hover:bg-farmleaf">Edit GST rules</button>
      </div>
    </div>
  );
}
