export function getGstBreakdown({ amount, rate, isTaxable, sameState }) {
  const gstRate = isTaxable ? rate : 0;
  const taxAmount = Number(((amount * gstRate) / 100).toFixed(2));
  const cgst = sameState && isTaxable ? Number((taxAmount / 2).toFixed(2)) : 0;
  const sgst = sameState && isTaxable ? Number((taxAmount / 2).toFixed(2)) : 0;
  const igst = !sameState && isTaxable ? taxAmount : 0;

  return {
    gstRate,
    taxAmount,
    cgst,
    sgst,
    igst,
    totalAmount: Number((amount + taxAmount).toFixed(2)),
    type: !isTaxable ? 'Exempt' : sameState ? 'CGST+SGST' : 'IGST'
  };
}

export function formatGstLabel({ isTaxable, rate }) {
  if (!isTaxable) return 'GST Exempt';
  if (rate === 0) return '0% GST';
  return `${rate}% GST`;
}
