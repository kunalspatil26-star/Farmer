import SectionHeader from '../components/SectionHeader.jsx';

const methods = [
  { name: 'Cash on delivery', status: 'Available' },
  { name: 'UPI payment', status: 'Placeholder' },
  { name: 'Bank transfer', status: 'Ready' },
  { name: 'Card payment', status: 'Ready' }
];

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Payments" subtitle="Track settlement status, payment method readiness, and cashflow from orders." />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Payment methods</h2>
          <div className="mt-4 space-y-3 text-sm text-farmgray">
            {methods.map((method) => (
              <div key={method.name} className="rounded-3xl bg-farmsoil p-4 dark:bg-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <span>{method.name}</span>
                  <span className="text-xs font-semibold uppercase text-farmgreen">{method.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-farmsoil bg-farmsoil p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent settlements</h2>
          <p className="mt-4 text-sm text-farmgray">This section will show settled payouts and advance payments once integrated with payment gateways.</p>
          <div className="mt-6 space-y-4 text-sm text-farmgray">
            <div className="rounded-3xl bg-white p-4 dark:bg-slate-900">
              <p className="font-semibold text-slate-900 dark:text-slate-100">Order #order-1</p>
              <p className="mt-2">₹4,095 — Settled in 2 days</p>
            </div>
            <div className="rounded-3xl bg-white p-4 dark:bg-slate-900">
              <p className="font-semibold text-slate-900 dark:text-slate-100">Order #order-3</p>
              <p className="mt-2">₹876.80 — Pending settlement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
