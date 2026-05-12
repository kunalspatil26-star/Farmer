export const mockOrders = [
  {
    id: 'order-1',
    productName: 'Packaged Rice (5kg)',
    buyer: 'Anita Sharma',
    quantity: 15,
    unit: 'packet',
    total: 4095,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    placeOfSupply: 'Maharashtra',
    gstType: 'CGST+SGST',
    createdAt: '2026-05-10'
  },
  {
    id: 'order-2',
    productName: 'Tomato (Fresh)',
    buyer: 'Sunil Patil',
    quantity: 120,
    unit: 'kg',
    total: 2640,
    status: 'Packed',
    paymentStatus: 'Unpaid',
    placeOfSupply: 'Maharashtra',
    gstType: 'Exempt',
    createdAt: '2026-05-09'
  },
  {
    id: 'order-3',
    productName: 'Organic Jaggery (1kg)',
    buyer: 'Ritika Deshmukh',
    quantity: 8,
    unit: 'box',
    total: 876.8,
    status: 'Delivered',
    paymentStatus: 'Paid',
    placeOfSupply: 'Karnataka',
    gstType: 'IGST',
    createdAt: '2026-05-07'
  }
];
