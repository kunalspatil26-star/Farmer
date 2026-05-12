import SectionHeader from '../components/SectionHeader.jsx';
import OrderCard from '../components/OrderCard.jsx';
import { useOrders } from '../hooks/useFirebaseData.js';
import { mockOrders } from '../data/mockOrders.js'; // Fallback

export default function OrdersPage() {
  const { orders: firebaseOrders, loading } = useOrders('user-1'); // Replace with actual user ID
  const orders = firebaseOrders.length > 0 ? firebaseOrders : mockOrders;

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Orders" subtitle="Loading your orders..." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-farmsoil bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 animate-pulse">
              <div className="h-4 bg-farmsoil rounded mb-2"></div>
              <div className="h-6 bg-farmsoil rounded mb-4"></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="h-8 bg-farmsoil rounded"></div>
                <div className="h-8 bg-farmsoil rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Orders" subtitle="Track pending, packed, dispatched, and delivered orders in one dashboard." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
