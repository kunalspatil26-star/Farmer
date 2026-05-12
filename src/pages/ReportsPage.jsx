import SectionHeader from '../components/SectionHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import { mockOrders } from '../data/mockOrders.js';

const totalSales = mockOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2);

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Reports and analytics" subtitle="Review total sales, GST collected, product revenue, and geography-based performance." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total sales" value={`₹${totalSales}`} subtitle="All orders recorded" />
        <StatCard title="Taxable sales" value="₹18.2k" subtitle="Estimated GST taxable value" />
        <StatCard title="GST collected" value="₹2.1k" subtitle="From taxable invoices" />
        <StatCard title="Top district" value="Pune" subtitle="Highest buyer demand" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Sales by state</h2>
          <ul className="mt-4 space-y-3 text-sm text-farmgray">
            <li>Maharashtra: ₹14,550</li>
            <li>Karnataka: ₹3,200</li>
            <li>Tamil Nadu: ₹1,800</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-farmsoil bg-farmsoil p-6 shadow-sm text-sm text-farmgray dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top products</h2>
          <ol className="mt-4 space-y-3">
            <li className="rounded-3xl bg-white p-4 dark:bg-slate-900">1. Packaged Rice</li>
            <li className="rounded-3xl bg-white p-4 dark:bg-slate-900">2. Tomato (Fresh)</li>
            <li className="rounded-3xl bg-white p-4 dark:bg-slate-900">3. Organic Jaggery</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
