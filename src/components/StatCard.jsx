export default function StatCard({ title, value, subtitle, accent }) {
  return (
    <div className={`rounded-3xl border border-farmsoil bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 ${accent || ''}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-farmgreen">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      {subtitle ? <p className="mt-2 text-sm text-farmgray">{subtitle}</p> : null}
    </div>
  );
}
