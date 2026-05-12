import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader.jsx';
import { mockOrders } from '../data/mockOrders.js';

export default function BillingHistoryPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Billing history" subtitle="Review past invoices, payment status, orders, and GST summaries." />
      <div className="grid gap-4">
        {mockOrders.map((order) => (
          <Link key={order.id} to={`/invoice/${order.id}`} className="rounded-3xl border border-farmsoil bg-white p-5 shadow-sm transition hover:border-farmgreen dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Invoice for {order.productName}</p>
                <p className="mt-1 text-sm text-farmgray">Buyer: {order.buyer}</p>
              </div>
              <div className="rounded-3xl bg-farmsoil px-3 py-1 text-xs font-semibold text-farmgreen">{order.paymentStatus}</div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-farmgray">
              <p>Order date: {order.createdAt}</p>
              <p>Total amount: ₹{order.total}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
