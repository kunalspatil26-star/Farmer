export default function OrderCard({ order }) {
  return (
    <div className="rounded-3xl border border-farmsoil bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-farmgreen">{order.status}</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">{order.productName}</h3>
        </div>
        <div className="rounded-full bg-farmsoil px-3 py-1 text-xs font-semibold text-farmgreen">{order.paymentStatus}</div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-sm text-farmgray">Buyer</p>
          <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{order.buyer}</p>
        </div>
        <div>
          <p className="text-sm text-farmgray">Quantity</p>
          <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{order.quantity} {order.unit}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-farmgray">
        <span>Order ID: {order.id}</span>
        <span>₹{order.total}</span>
      </div>
    </div>
  );
}
