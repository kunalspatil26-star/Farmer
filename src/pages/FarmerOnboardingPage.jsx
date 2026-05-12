import { useState } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';

export default function FarmerOnboardingPage({ user, setUser }) {
  const [form, setForm] = useState({
    name: user.name,
    businessName: user.businessName,
    mobile: user.mobile,
    state: user.state,
    district: user.district,
    village: user.village,
    pincode: user.pincode,
    gstin: user.gstin,
    upiId: user.upiId,
    verification: user.verified ? 'Verified' : 'Pending'
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setUser((prev) => ({ ...prev, ...form, verified: true }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Farmer onboarding" subtitle="Complete your profile and GST details to list products with the right tax settings." />
      <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2">
        {[
          { name: 'name', label: 'Full name', placeholder: 'Ramesh Kumar' },
          { name: 'businessName', label: 'Farm / business name', placeholder: 'Ramesh Agro Produce' },
          { name: 'mobile', label: 'Mobile number', placeholder: '+91 98765 43210' },
          { name: 'upiId', label: 'UPI ID', placeholder: 'ramesh@okaxis' },
          { name: 'state', label: 'State', placeholder: 'Maharashtra' },
          { name: 'district', label: 'District', placeholder: 'Pune' },
          { name: 'village', label: 'Village', placeholder: 'Maval' },
          { name: 'pincode', label: 'Pincode', placeholder: '410507' },
          { name: 'gstin', label: 'GSTIN (optional)', placeholder: '27ABCDE1234F2Z5' }
        ].map((field) => (
          <label key={field.name} className="block">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{field.label}</span>
            <input
              name={field.name}
              value={form[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="mt-2 w-full rounded-3xl border border-farmsoil bg-farmsoil px-4 py-3 text-sm outline-none transition focus:border-farmgreen dark:bg-slate-800 dark:border-slate-700"
            />
          </label>
        ))}
        <div className="col-span-full rounded-3xl bg-farmsoil p-4 text-sm text-farmgray dark:bg-slate-800">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Profile status</p>
          <p className="mt-2">{form.verification === 'Verified' ? 'Your profile is verified and ready to list products.' : 'Your verification is pending approval.'}</p>
        </div>
        <button type="submit" className="col-span-full rounded-3xl bg-farmgreen px-5 py-3 text-sm font-semibold text-white transition hover:bg-farmleaf">
          Save profile
        </button>
      </form>
    </div>
  );
}
