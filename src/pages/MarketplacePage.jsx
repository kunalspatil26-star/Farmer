import { useMemo, useState } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useProducts } from '../hooks/useFirebaseData.js';
import { mockProducts } from '../data/mockProducts.js'; // Fallback

const filters = [
  { id: 'gst', label: 'GST status', options: ['All', 'GST Exempt', 'Taxable'] },
  { id: 'organic', label: 'Organic', options: ['All', 'Organic', 'Non-organic'] }
];

export default function MarketplacePage({ userRole }) {
  const { products: firebaseProducts, loading } = useProducts();
  const products = firebaseProducts.length > 0 ? firebaseProducts : mockProducts; // Use Firebase if available, else mock
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText = search.toLowerCase();
      const matchesQuery = product.name.toLowerCase().includes(searchText) || product.category.toLowerCase().includes(searchText) || product.location.toLowerCase().includes(searchText);
      const matchesGst = selectedFilter === 'All' || (selectedFilter === 'GST Exempt' && product.gstExempt) || (selectedFilter === 'Taxable' && !product.gstExempt);
      return matchesQuery && matchesGst;
    });
  }, [products, search, selectedFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Buyer marketplace" subtitle="Loading products..." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-farmsoil bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 animate-pulse">
              <div className="h-4 bg-farmsoil rounded mb-2"></div>
              <div className="h-6 bg-farmsoil rounded mb-4"></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="h-12 bg-farmsoil rounded"></div>
                <div className="h-12 bg-farmsoil rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Buyer marketplace" subtitle="Search fresh farm products, compare prices, and choose the right seller for your needs." />
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-farmsoil bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Search products</label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tomato, rice, jaggery"
              className="mt-3 w-full rounded-3xl border border-farmsoil bg-farmsoil px-4 py-3 text-sm outline-none transition focus:border-farmgreen dark:bg-slate-800"
            />
          </div>
          <div className="rounded-3xl border border-farmsoil bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Filter</p>
            <div className="mt-4 space-y-3">
              {filters.map((filter) => (
                <div key={filter.id}>
                  <p className="text-sm font-medium text-farmgreen">{filter.label}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {filter.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSelectedFilter(option)}
                        className={`rounded-full px-4 py-2 text-sm ${selectedFilter === option ? 'bg-farmgreen text-white' : 'bg-farmsoil text-farmgray'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-farmsoil bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Quick facts</p>
          <div className="mt-4 space-y-3 text-sm text-farmgray">
            <p>• {products.length} live farm listings from trusted sellers.</p>
            <p>• GST-aware price breakdown for every taxable product.</p>
            <p>• Search by category, location, and freshness to find the best offer.</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
