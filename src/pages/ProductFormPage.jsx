import { useState } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';
import ImageCropUploader from '../components/ImageCropUploader.jsx';
import { addProduct } from '../services/firebaseService.js';
import { gstSlabs } from '../data/mockGst.js';
import { mockProducts } from '../data/mockProducts.js';
import { CROP_RATIOS } from '../utils/cropImage.js';

export default function ProductFormPage() {
  const [form, setForm] = useState({
    name: '',
    category: 'Vegetables',
    type: 'Fresh',
    classification: 'Raw',
    quantity: 0,
    unit: 'kg',
    grade: 'A',
    variety: '',
    price: 0,
    minOrder: 0,
    harvestDate: '',
    expiryDate: '',
    location: '',
    organic: false,
    deliveryOption: 'Pickup',
    hsnCode: '0702',
    gstExempt: true,
    gstRate: 0,
    taxInclusive: false,
    seller: 'Current User', // Replace with actual user
    rating: 0,
    demand: 0,
    images: []
  });

  const [uploadedImages, setUploadedImages] = useState([]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImagesSelected = (images) => {
    setUploadedImages(images);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Convert uploaded images to image URLs
      const imageUrls = uploadedImages.map((img) => img.croppedUrl || img.previewUrl);

      const productData = {
        ...form,
        images: imageUrls.length > 0 ? imageUrls : [
          'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&h=300&fit=crop&crop=center'
        ]
      };

      await addProduct(productData);
      alert('Product saved successfully.');

      // Reset form
      setForm({
        name: '',
        category: 'Vegetables',
        type: 'Fresh',
        classification: 'Raw',
        quantity: 0,
        unit: 'kg',
        grade: 'A',
        variety: '',
        price: 0,
        minOrder: 0,
        harvestDate: '',
        expiryDate: '',
        location: '',
        organic: false,
        deliveryOption: 'Pickup',
        hsnCode: '0702',
        gstExempt: true,
        gstRate: 0,
        taxInclusive: false,
        seller: 'Current User',
        rating: 0,
        demand: 0,
        images: []
      });
      setUploadedImages([]);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Add product listing" subtitle="Create a farm product listing with GST and HSN settings for the marketplace." />
      <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2">
        {[
          { name: 'name', label: 'Product name', type: 'text' },
          { name: 'category', label: 'Category', type: 'select', options: ['Vegetables', 'Grains', 'Sweeteners', 'Dairy', 'Spices'] },
          { name: 'type', label: 'Crop type', type: 'select', options: ['Fresh', 'Processed', 'Packaged', 'Branded'] },
          { name: 'classification', label: 'Classification', type: 'select', options: ['Raw', 'Fresh', 'Processed', 'Packaged', 'Branded'] },
          { name: 'quantity', label: 'Quantity available', type: 'number' },
          { name: 'unit', label: 'Unit', type: 'select', options: ['kg', 'quintal', 'ton', 'litre', 'packet', 'box', 'bag'] },
          { name: 'price', label: 'Price per unit', type: 'number' },
          { name: 'minOrder', label: 'Minimum order quantity', type: 'number' }
        ].map((field) => (
          <label key={field.name} className="block">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{field.label}</span>
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-farmsoil bg-farmsoil px-4 py-3 text-sm outline-none transition focus:border-farmgreen dark:bg-slate-800 dark:border-slate-700"
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-farmsoil bg-farmsoil px-4 py-3 text-sm outline-none transition focus:border-farmgreen dark:bg-slate-800 dark:border-slate-700"
              />
            )}
          </label>
        ))}
        {[
          { name: 'harvestDate', label: 'Harvest date' },
          { name: 'expiryDate', label: 'Expiry date' },
          { name: 'location', label: 'Location' },
          { name: 'variety', label: 'Variety' }
        ].map((field) => (
          <label key={field.name} className="block">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{field.label}</span>
            <input
              name={field.name}
              type={field.name.includes('Date') ? 'date' : 'text'}
              value={form[field.name]}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-farmsoil bg-farmsoil px-4 py-3 text-sm outline-none transition focus:border-farmgreen dark:bg-slate-800 dark:border-slate-700"
            />
          </label>
        ))}
        <label className="block col-span-full">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">HSN / SAC code</span>
          <input
            name="hsnCode"
            value={form.hsnCode}
            onChange={handleChange}
            placeholder="1006"
            className="mt-2 w-full rounded-3xl border border-farmsoil bg-farmsoil px-4 py-3 text-sm outline-none transition focus:border-farmgreen dark:bg-slate-800 dark:border-slate-700"
          />
        </label>
        <div className="col-span-full grid gap-3 rounded-3xl bg-farmsoil p-4 dark:bg-slate-800 sm:grid-cols-2">
          <label className="flex items-center gap-3">
            <input type="checkbox" name="organic" checked={form.organic} onChange={handleChange} className="h-5 w-5 rounded border-farmgreen text-farmgreen" />
            <span className="text-sm font-semibold">Organic product</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="taxInclusive" checked={form.taxInclusive} onChange={handleChange} className="h-5 w-5 rounded border-farmgreen text-farmgreen" />
            <span className="text-sm font-semibold">Tax inclusive price</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="gstExempt" checked={form.gstExempt} onChange={handleChange} className="h-5 w-5 rounded border-farmgreen text-farmgreen" />
            <span className="text-sm font-semibold">GST exempt</span>
          </label>
          <div>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">GST rate</span>
            <select
              name="gstRate"
              value={form.gstRate}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-farmsoil bg-farmsoil px-4 py-3 text-sm outline-none transition focus:border-farmgreen dark:bg-slate-800 dark:border-slate-700"
            >
              {gstSlabs.map((slab) => (
                <option key={slab.rate} value={slab.rate}>{slab.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Image Upload and Crop Section */}
        <div className="col-span-full space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Product Images (with Crop)</span>
            <p className="mt-1 text-xs text-farmgray">Upload images and crop them to the perfect size. Maximum 5 images.</p>
          </label>
          <ImageCropUploader
            onImagesSelected={handleImagesSelected}
            maxImages={5}
            cropRatio={CROP_RATIOS.CARD}
            allowMultiple={true}
          />
        </div>

        <button type="submit" className="col-span-full rounded-3xl bg-farmgreen px-5 py-3 text-sm font-semibold text-white transition hover:bg-farmleaf">
          Save product
        </button>
      </form>
      <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Sample listings</h2>
        <p className="mt-3 text-sm text-farmgray">You can list fresh or branded products with separate GST settings, HSN codes, and location-based payment breakdowns.</p>
        <ul className="mt-4 space-y-2 text-sm text-farmgray">
          {mockProducts.slice(0, 3).map((product) => (
            <li key={product.id} className="rounded-3xl bg-farmsoil p-3">{product.name} — {product.taxLabel} — ₹{product.price}/{product.unit}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
