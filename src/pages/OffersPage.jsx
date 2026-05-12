import SectionHeader from '../components/SectionHeader.jsx';
import { useOffers } from '../hooks/useFirebaseData.js';
import { mockOffers } from '../data/mockOffers.js'; // Fallback
import { mockProducts } from '../data/mockProducts.js';

export default function OffersPage() {
  const { offers: firebaseOffers, loading } = useOffers('user-1'); // Replace with actual user ID
  const offers = firebaseOffers.length > 0 ? firebaseOffers : mockOffers;

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Offers and negotiation" subtitle="Loading offers..." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-farmsoil bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 animate-pulse">
              <div className="h-4 bg-farmsoil rounded mb-2"></div>
              <div className="h-6 bg-farmsoil rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-farmsoil rounded"></div>
                <div className="h-4 bg-farmsoil rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Offers and negotiation" subtitle="Review buyer offers and manage counter-offers with expiry timers." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {offers.map((offer) => {
          const product = mockProducts.find((item) => item.id === offer.productId);
          return (
            <div key={offer.id} className="rounded-3xl border border-farmsoil bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-farmgreen">{offer.status}</p>
              <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{product?.name}</h2>
              <p className="mt-2 text-sm text-farmgray">Buyer: {offer.buyer}</p>
              <div className="mt-4 space-y-2 text-sm text-farmgray">
                <p><strong>Offer price:</strong> ₹{offer.offerPrice} / {product?.unit}</p>
                <p><strong>Quantity:</strong> {offer.quantity} {product?.unit}</p>
                <p><strong>Expires in:</strong> {offer.expiry}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button className="rounded-3xl bg-farmgreen px-4 py-2 text-sm font-semibold text-white transition hover:bg-farmleaf">Accept</button>
                <button className="rounded-3xl border border-farmsoil px-4 py-2 text-sm font-semibold text-farmgray transition hover:border-farmgreen">Counter</button>
                <button className="rounded-3xl border border-farmsoil px-4 py-2 text-sm font-semibold text-farmgray transition hover:border-red-500">Reject</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
