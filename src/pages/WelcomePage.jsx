import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader.jsx';

export default function WelcomePage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Welcome to FarmPrice India"
        subtitle="Sell produce directly, compare prices, manage GST-ready invoices, and grow your farm business."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/login" className="rounded-3xl bg-farmgreen px-6 py-8 text-center text-white shadow-lg shadow-farmgreen/20 transition hover:brightness-110">
          <p className="text-sm uppercase tracking-[0.3em]">Start selling</p>
          <p className="mt-4 text-xl font-bold">Farmer login</p>
        </Link>
        <Link to="/marketplace" className="rounded-3xl border border-farmsoil bg-white px-6 py-8 text-center shadow-sm transition hover:border-farmgreen">
          <p className="text-sm uppercase tracking-[0.3em] text-farmgreen">Browse offers</p>
          <p className="mt-4 text-xl font-bold text-slate-900">Buyer marketplace</p>
        </Link>
      </div>
      <div className="rounded-3xl bg-farmsoil p-6 shadow-sm dark:bg-slate-800">
        <h2 className="text-lg font-semibold">Why farmers choose FarmPrice India</h2>
        <ul className="mt-4 space-y-3 text-sm text-farmgray">
          <li>• Direct sale to buyers across India with GST-ready invoicing.</li>
          <li>• Compare mandi and buyer offers to get the right price.</li>
          <li>• Manage orders, invoices, and payment records in one place.</li>
        </ul>
      </div>
    </div>
  );
}
