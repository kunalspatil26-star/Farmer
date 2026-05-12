export function calculatePriceRecommendation(product, localRate, buyerOffers = []) {
  const averageOffer = buyerOffers.length > 0 ? buyerOffers.reduce((sum, offer) => sum + offer.offerPrice, 0) / buyerOffers.length : product.price;
  const recommended = Math.max(product.price, localRate, averageOffer * 0.95);
  const minProfit = Math.max(product.price * 0.9, localRate * 0.9);
  return {
    recommendedPrice: Number(recommended.toFixed(2)),
    minProfitablePrice: Number(minProfit.toFixed(2)),
    localRate,
    demandScore: product.demand
  };
}

export function getTrendingData(product) {
  return {
    labels: ['5d ago', '4d ago', '3d ago', '2d ago', 'Today'],
    values: product.priceTrend || []
  };
}
