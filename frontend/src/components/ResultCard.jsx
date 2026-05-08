import React from "react";
function badgeClass(severity) {
  if (severity === "high") return "bg-red-100 text-red-700";
  if (severity === "low") return "bg-green-100 text-green-700";
  return "bg-amber-100 text-amber-700";
}

export default function ResultCard({ result }) {
  if (!result?.triage) return null;
  const { triage, medicine, advice } = result;
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-primary">Possible condition</p>
          <h2 className="mt-1 font-display text-3xl font-bold text-slate-900">{triage.possibleCondition}</h2>
        </div>
        <span className={`badge ${badgeClass(triage.severity)}`}>{triage.severity} • {triage.severityScore}/100</span>
      </div>
      {triage.emergencyWarning && <div className="mt-4 rounded-2xl bg-red-50 p-4 font-semibold text-red-700">Emergency warning detected. Please seek urgent medical help.</div>}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-cream p-4">
          <h3 className="font-bold text-primary">Medicine guidance</h3>
          <p className="mt-2 text-slate-700">{medicine?.suggested}</p>
          {medicine?.allergyWarning && <p className="mt-2 font-semibold text-red-700">{medicine.allergyWarning}</p>}
        </div>
        <div className="rounded-2xl bg-cream p-4">
          <h3 className="font-bold text-primary">Advice</h3>
          <p className="mt-2 text-slate-700">{advice?.message}</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">{(advice?.details || []).map((d, i) => <li key={i}>{d}</li>)}</ul>
        </div>
      </div>
      <p className="mt-5 rounded-2xl bg-primary/5 p-4 text-sm font-semibold text-primary">This is not a medical diagnosis. Please consult a qualified doctor.</p>
    </div>
  );
}
