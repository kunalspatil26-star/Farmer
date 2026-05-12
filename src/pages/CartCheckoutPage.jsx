import SectionHeader from '../components/SectionHeader.jsx';
import { mockProducts } from '../data/mockProducts.js';
import { getGstBreakdown } from '../utils/gst.js';

const cartItem = {
  product: mockProducts[1],
  quantity: 12,
  deliveryCharge: 80,
  discount: 40,
  buyerState: 'Maharashtra'
};

export default function CartCheckoutPage() {
  const amount = cartItem.product.price * cartItem.quantity;
  const taxInfo = getGstBreakdown({ amount, rate: cartItem.product.gstRate, isTaxable: !cartItem.product.gstExempt, sameState: cartItem.buyerState === 'Maharashtra' });
  const totalPayable = amount + cartItem.deliveryCharge - cartItem.discount + taxInfo.taxAmount;

  return (
    <div className="space-y-6">
      <SectionHeader title="Cart and checkout" subtitle="Review order totals, GST breakup, shipping, and payment before creating an invoice." />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{cartItem.product.name}</h2>
          <p className="mt-2 text-sm text-farmgray">Qty: {cartItem.quantity} {cartItem.product.unit}</p>
          <div className="mt-5 space-y-3 text-sm text-farmgray">
            <p><strong>Unit price:</strong> ₹{cartItem.product.price}</p>
            <p><strong>Subtotal:</strong> ₹{amount.toFixed(2)}</p>
            <p><strong>GST amount:</strong> ₹{taxInfo.taxAmount.toFixed(2)}</p>
            <p><strong>Delivery charge:</strong> ₹{cartItem.deliveryCharge.toFixed(2)}</p>
            <p><strong>Discount:</strong> -₹{cartItem.discount.toFixed(2)}</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Total payable: ₹{totalPayable.toFixed(2)}</p>
          </div>
          <button className="mt-6 rounded-3xl bg-farmgreen px-5 py-3 text-sm font-semibold text-white transition hover:bg-farmleaf">Confirm order</button>
        </div>
        <div className="rounded-3xl border border-farmsoil bg-farmsoil p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Payment options</h3>
          <ul className="mt-4 space-y-3 text-sm text-farmgray">
            <li>• Cash on delivery (COD)</li>
            <li>• UPI payment placeholder</li>
            <li>• Bank transfer / card payment</li>
            <li>• Advance payment support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
