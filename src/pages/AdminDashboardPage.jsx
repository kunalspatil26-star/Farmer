import SectionHeader from '../components/SectionHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import { mockProducts } from '../data/mockProducts.js';
import { mockOrders as orderData } from '../data/mockOrders.js';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Admin dashboard" subtitle="Monitor platform activity, product listings, order volume, and GST compliance." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total listings" value={mockProducts.length} subtitle="Live products on platform" />
        <StatCard title="Orders" value={orderData.length} subtitle="Recent order count" />
        <StatCard title="GST sales" value="₹24.5k" subtitle="Taxable transaction value" />
        <StatCard title="New users" value="158" subtitle="Past 7 days" />
      </div>
      <div className="rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Platform tasks</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-farmsoil p-4 text-sm dark:bg-slate-800">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Verify sellers</p>
            <p className="mt-3 text-farmgray">Review new farmer profiles needing GST validation.</p>
          </div>
          <div className="rounded-3xl bg-farmsoil p-4 text-sm dark:bg-slate-800">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Manage GST slabs</p>
            <p className="mt-3 text-farmgray">Update taxable rates and category mappings for products.</p>
          </div>
          <div className="rounded-3xl bg-farmsoil p-4 text-sm dark:bg-slate-800">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Monitor reports</p>
            <p className="mt-3 text-farmgray">Track sales, tax collection, and suspicious listings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
