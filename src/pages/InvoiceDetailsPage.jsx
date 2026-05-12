import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';
import { mockOrders } from '../data/mockOrders.js';
import { mockProducts } from '../data/mockProducts.js';
import { mockUser } from '../data/mockUsers.js';
import { buildInvoice } from '../utils/invoice.js';

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useMemo(() => mockOrders.find((item) => item.id === id) || mockOrders[0], [id]);
  const product = useMemo(() => mockProducts.find((item) => item.name === order.productName) || mockProducts[0], [order.productName]);
  const invoice = useMemo(() => buildInvoice({ order, seller: mockUser, buyer: { name: order.buyer, state: order.placeOfSupply }, product, charges: { discount: 0, freight: 60 } }), [order, product]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-3xl border border-farmsoil bg-white px-4 py-3 text-sm font-semibold text-farmgreen transition hover:border-farmgreen dark:border-slate-700 dark:bg-slate-900">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="rounded-3xl bg-farmsoil px-4 py-3 text-sm font-semibold text-farmgreen">Invoice #{invoice.invoiceNumber}</div>
      </div>
      <SectionHeader title="Invoice details" subtitle="GST-ready invoice preview with taxable and exempt product handling." />
      <div className="rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-farmgray">Seller</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{invoice.seller.businessName}</p>
                <p className="text-sm text-farmgray">GSTIN: {invoice.seller.gstin}</p>
              </div>
              <div>
                <p className="text-sm text-farmgray">Buyer</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{invoice.buyer.name}</p>
                <p className="text-sm text-farmgray">State: {invoice.buyer.state}</p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-farmsoil p-4 text-sm text-farmgray dark:bg-slate-800">
              <p><strong>Invoice date:</strong> {invoice.createdAt}</p>
              <p><strong>Place of supply:</strong> {invoice.order.placeOfSupply}</p>
              <p><strong>Bill type:</strong> {invoice.gst.type === 'Exempt' ? 'Bill of Supply' : 'Tax Invoice'}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-farmsoil bg-white p-5 text-sm text-farmgray shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Amount summary</p>
            <div className="mt-4 space-y-3">
              <p>Product amount: ₹{(invoice.order.quantity * invoice.product.price).toFixed(2)}</p>
              <p>GST total: ₹{invoice.gst.taxAmount.toFixed(2)}</p>
              <p>Freight: ₹{invoice.freight.toFixed(2)}</p>
              <p>Discount: -₹{invoice.discount.toFixed(2)}</p>
            </div>
            <p className="mt-5 text-xl font-bold text-slate-900 dark:text-slate-100">Total: ₹{invoice.totalAmount.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto rounded-3xl border border-farmsoil bg-farmsoil dark:border-slate-700 dark:bg-slate-950">
          <table className="min-w-full text-left text-sm text-farmgray">
            <thead className="border-b border-farmsoil bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Unit price</th>
                <th className="px-4 py-3">Tax</th>
                <th className="px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-farmsoil dark:border-slate-700">
                <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{invoice.product.name}</td>
                <td className="px-4 py-4">{invoice.order.quantity} {invoice.product.unit}</td>
                <td className="px-4 py-4">₹{invoice.product.price}</td>
                <td className="px-4 py-4">₹{invoice.gst.taxAmount.toFixed(2)}</td>
                <td className="px-4 py-4">₹{invoice.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
