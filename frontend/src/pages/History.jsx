import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";

export default function History() {
  const [history, setHistory] = useState([]); const [error, setError] = useState(""); const nav = useNavigate();
  useEffect(() => { const patientId = localStorage.getItem("patientId"); if (!patientId) return; api.get(`/api/history/${patientId}`).then(r => setHistory(r.data.history || [])).catch(e => setError(e.response?.data?.message || "Could not load history")); }, []);
  return <div><Header badge="Past Cases" title="Symptom History" subtitle="Review previous analyses and repeat a case quickly." />{error && <p className="rounded-2xl bg-red-50 p-3 text-red-700">{error}</p>}<div className="space-y-4">{history.map(h => <div key={h._id} className="card p-5"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="text-xl font-bold text-primary">{h.possibleCondition}</h3><p className="text-slate-600">{h.symptoms}</p><p className="mt-2 text-sm font-semibold">{h.severity} • {h.severityScore}/100 • {new Date(h.createdAt).toLocaleDateString()}</p></div><button className="btn-light" onClick={() => nav('/check', { state: { symptoms: h.symptoms } })}>Repeat Previous Case</button></div></div>)}</div></div>;
}
