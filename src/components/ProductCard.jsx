import { Star, MapPin, Tag, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImagePlaceholder from './ImagePlaceholder.jsx';

export default function ProductCard({ product }) {
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Link to={`/product/${product.id}`} className="group block rounded-3xl border border-farmsoil bg-white p-4 shadow-sm transition hover:border-farmgreen hover:shadow-farmgreen/10 dark:border-slate-700 dark:bg-slate-900">
      {/* Product Image */}
      <div className="aspect-video overflow-hidden rounded-2xl bg-farmsoil relative">
        {mainImage ? (
          <>
            <img
              src={mainImage}
              alt={product.name}
              className="h-full w-full object-cover transition group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.querySelector('.image-placeholder').style.display = 'flex';
              }}
            />
            <ImagePlaceholder className="image-placeholder h-full w-full absolute inset-0" iconSize={32} style={{ display: 'none' }} />
          </>
        ) : (
          <ImagePlaceholder className="h-full w-full" iconSize={32} />
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{product.name}</h2>
          <p className="mt-1 text-sm text-farmgray">{product.category} • {product.classification}</p>
        </div>
        <div className="rounded-3xl bg-farmsoil px-3 py-1 text-xs font-semibold text-farmgreen">{product.taxLabel}</div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-farmsoil/80 p-3 text-sm">
          <div className="font-semibold">Price</div>
          <div className="mt-2 text-xl font-bold">₹{product.price} / {product.unit}</div>
        </div>
        <div className="rounded-2xl bg-farmsoil/80 p-3 text-sm">
          <div className="font-semibold">Available</div>
          <div className="mt-2 text-xl font-bold">{product.quantity} {product.unit}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-farmgray">
        <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-farmgold" />{product.rating}</span>
        <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{product.location.split(',')[0]}</span>
      </div>
    </Link>
  );
}
