import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import SectionHeader from '../components/SectionHeader.jsx';
import { mockProducts } from '../data/mockProducts.js';
import { calculatePriceRecommendation, getTrendingData } from '../utils/market.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function PriceInsightsPage() {
  const product = mockProducts[0];
  const insights = calculatePriceRecommendation(product, 23, [{ offerPrice: 24 }, { offerPrice: 23 }]);
  const trend = getTrendingData(product);

  const chartData = {
    labels: trend.labels,
    datasets: [
      {
        label: 'Price trend',
        data: trend.values,
        borderColor: '#1f6f3d',
        backgroundColor: 'rgba(31,111,61,0.15)',
        tension: 0.35,
        fill: true
      }
    ]
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Price insights" subtitle="Monitor market movement and choose the best time to sell your farm products." />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{product.name}</h2>
          <p className="mt-2 text-sm text-farmgray">Demand score based on recent buyer interest and price movements.</p>
          <div className="mt-5 rounded-3xl bg-farmsoil p-5 dark:bg-slate-800">
            <p className="text-sm uppercase tracking-[0.2em] text-farmgreen">Price recommendation</p>
            <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">₹{insights.recommendedPrice}</p>
            <p className="mt-2 text-sm text-farmgray">Minimum profitable price: ₹{insights.minProfitablePrice}</p>
          </div>
          <div className="mt-5">
            <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-farmsoil bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Key metrics</h3>
            <ul className="mt-4 space-y-3 text-sm text-farmgray">
              <li><strong>Local mandi rate:</strong> ₹{insights.localRate}</li>
              <li><strong>Buyer average offer:</strong> ₹{(24 + 23) / 2}</li>
              <li><strong>Demand score:</strong> {insights.demandScore}/100</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-farmsoil p-6 text-sm text-farmgray dark:bg-slate-800">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Pro tip</p>
            <p className="mt-3">For GST-exempt fresh produce, highlight pickup options and quality grade to increase buyer confidence and quicker orders.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
