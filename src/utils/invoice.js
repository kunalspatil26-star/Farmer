import { getGstBreakdown } from './gst.js';

export function createInvoiceNumber(prefix = 'FPI', index = 1) {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${prefix}-${yyyy}${mm}${dd}-${String(index).padStart(4, '0')}`;
}

export function buildInvoice({ order, seller, buyer, product, taxInfo, charges = {} }) {
  const amount = Number((order.quantity * product.price).toFixed(2));
  const gst = getGstBreakdown({ amount, rate: product.gstRate, isTaxable: product.gstExempt === false, sameState: seller.state === buyer.state });
  const discount = charges.discount || 0;
  const freight = charges.freight || 0;
  const netAmount = Number((amount - discount + freight + gst.taxAmount).toFixed(2));

  return {
    invoiceNumber: createInvoiceNumber('FPI', Number(order.id.split('-')[1] || 1)),
    seller,
    buyer,
    product,
    order,
    gst,
    discount,
    freight,
    totalAmount: netAmount,
    createdAt: order.createdAt,
    billingAddress: buyer.address || buyer.state,
    shippingAddress: buyer.address || buyer.state
  };
}
