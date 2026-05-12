import { useNavigate } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader.jsx';

const roles = [
  { id: 'farmer', title: 'Farmer / Seller', description: 'List produce, manage orders, and receive buyer offers.' },
  { id: 'buyer', title: 'Buyer', description: 'Search products, make offers, and place orders from farms.' },
  { id: 'admin', title: 'Admin', description: 'Manage categories, GST rules, users, and reports.' }
];

export default function RoleSelectPage({ role, setSelectedRole }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <SectionHeader title="Select your role" subtitle="Choose a role to see the right dashboard and permissions." />
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedRole(item.id)}
            className={`rounded-3xl border p-6 text-left transition ${role === item.id ? 'border-farmgreen bg-farmsoil text-slate-900' : 'border-farmsoil bg-white text-farmgray hover:border-farmgreen'}`}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-farmgreen">{item.title}</p>
            <p className="mt-4 text-sm leading-6">{item.description}</p>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-farmgray">Role selected: <span className="font-semibold text-slate-900">{role}</span></p>
        <button onClick={() => navigate('/onboarding')} className="rounded-3xl bg-farmgreen px-5 py-3 text-sm font-semibold text-white transition hover:bg-farmleaf">
          Continue to setup
        </button>
      </div>
    </div>
  );
}
