import React from "react";
export default function ReportResult({ report }) {
  if (!report) return null;
  return (
    <div className="mt-6 space-y-4">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-3xl font-bold text-primary">Report Summary</h2>
          <span className={`badge ${report.riskLevel === "high" ? "bg-red-100 text-red-700" : report.riskLevel === "low" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{report.riskLevel} risk</span>
        </div>
        <p className="mt-3 text-slate-700">{report.summary}</p>
      </div>
      <div className="card p-6">
        <h3 className="text-xl font-bold text-primary">Key Findings</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">{(report.keyFindings || []).map((k, i) => <div key={i} className="rounded-2xl bg-cream p-4"><b>{k.marker}</b><p>{k.value} • {k.status}</p><p className="text-sm text-slate-600">{k.meaning}</p></div>)}</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Info title="Possible Concerns" items={report.possibleConcerns} />
        <Info title="Lifestyle Guidance" items={report.lifestyleGuidance} />
        <Info title="Red Flags" items={report.redFlags} danger />
        <div className="card p-6"><h3 className="text-xl font-bold text-primary">Doctor Recommendation</h3><p className="mt-2">{report.doctorRecommendation?.needed ? "Doctor recommended" : "Doctor may not be required immediately"}</p><p className="text-sm text-slate-600">{report.doctorRecommendation?.specialist} • {report.doctorRecommendation?.urgency}</p></div>
      </div>
      <details className="card p-6"><summary className="cursor-pointer font-bold text-primary">Extracted Text Preview</summary><pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap text-sm text-slate-600">{report.extractedText}</pre></details>
      <p className="rounded-2xl bg-primary/5 p-4 text-sm font-semibold text-primary">{report.disclaimer || "This is not a medical diagnosis. Please consult a qualified doctor."}</p>
    </div>
  );
}
function Info({ title, items = [], danger }) { return <div className="card p-6"><h3 className={`text-xl font-bold ${danger ? "text-red-700" : "text-primary"}`}>{title}</h3><ul className="mt-3 list-disc pl-5 text-slate-700">{items.map((x,i)=><li key={i}>{x}</li>)}</ul></div>; }
