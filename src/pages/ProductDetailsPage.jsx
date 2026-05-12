import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';
import ImagePlaceholder from '../components/ImagePlaceholder.jsx';
import { mockProducts } from '../data/mockProducts.js';
import { formatGstLabel, getGstBreakdown } from '../utils/gst.js';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useMemo(() => mockProducts.find((item) => item.id === id) || mockProducts[0], [id]);
  const gstSummary = getGstBreakdown({ amount: product.price, rate: product.gstRate, isTaxable: !product.gstExempt, sameState: true });
  const [selectedImage, setSelectedImage] = useState(0);

  const images = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&h=400&fit=crop&crop=center'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-3xl border border-farmsoil bg-white px-4 py-3 text-sm font-semibold text-farmgreen transition hover:border-farmgreen dark:border-slate-700 dark:bg-slate-900">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="rounded-3xl bg-farmsoil px-4 py-3 text-sm font-semibold text-farmgreen">{product.taxLabel}</div>
      </div>
      <SectionHeader title={product.name} subtitle={`Listing from ${product.seller} — ${product.location}`} />

      {/* Product Images Gallery */}
      <div className="rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-video overflow-hidden rounded-2xl bg-farmsoil relative">
            {images[selectedImage] ? (
              <>
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.querySelector('.image-placeholder').style.display = 'flex';
                  }}
                />
                <ImagePlaceholder className="image-placeholder h-full w-full absolute inset-0" iconSize={48} style={{ display: 'none' }} />
              </>
            ) : (
              <ImagePlaceholder className="h-full w-full" iconSize={48} />
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <div key={index} className="flex-shrink-0 relative">
                  <button
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === index ? 'border-farmgreen' : 'border-farmsoil'
                    }`}
                  >
                    {image ? (
                      <>
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="h-16 w-16 object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.querySelector('.thumb-placeholder').style.display = 'flex';
                          }}
                        />
                        <ImagePlaceholder className="thumb-placeholder h-16 w-16 absolute inset-0" iconSize={16} style={{ display: 'none' }} />
                      </>
                    ) : (
                      <ImagePlaceholder className="h-16 w-16" iconSize={16} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5 rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-farmgray">Category</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{product.category}</p>
            </div>
            <div>
              <p className="text-sm text-farmgray">Grade</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{product.grade}</p>
            </div>
            <div>
              <p className="text-sm text-farmgray">Available</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{product.quantity} {product.unit}</p>
            </div>
            <div>
              <p className="text-sm text-farmgray">Minimum order</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{product.minOrder} {product.unit}</p>
            </div>
          </div>
          <div className="rounded-3xl bg-farmsoil p-5">
            <p className="text-sm font-semibold text-farmgreen">Price details</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 text-sm text-farmgray">
                <p>Base price</p>
                <p className="mt-2 font-semibold text-slate-900">₹{product.price}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 text-sm text-farmgray">
                <p>GST amount</p>
                <p className="mt-2 font-semibold text-slate-900">₹{gstSummary.taxAmount}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-farmgray">Final amount: ₹{gstSummary.totalAmount} per {product.unit}</p>
          </div>
          <div className="space-y-3 rounded-3xl bg-farmsoil p-4 text-sm text-farmgray">
            <p><strong>HSN/SAC:</strong> {product.hsnCode}</p>
            <p><strong>Delivery:</strong> {product.deliveryOption}</p>
            <p><strong>Organic:</strong> {product.organic ? 'Yes' : 'No'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Price breakdown</h3>
            <ul className="mt-4 space-y-3 text-sm text-farmgray">
              <li><strong>GST status:</strong> {formatGstLabel({ isTaxable: !product.gstExempt, rate: product.gstRate })}</li>
              <li><strong>CGST:</strong> ₹{gstSummary.cgst}</li>
              <li><strong>SGST:</strong> ₹{gstSummary.sgst}</li>
              <li><strong>IGST:</strong> ₹{gstSummary.igst}</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Ready to sell</h3>
            <p className="mt-3 text-sm text-farmgray">Create an order or send a direct offer to the buyer for this product. The billing page supports intra-state and inter-state tax calculations and invoice generation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
