import React from "react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Header from "../components/Header";
import ReportUpload from "../components/ReportUpload";
import ReportResult from "../components/ReportResult";
import HospitalCards from "../components/HospitalCards";
import LoadingState from "../components/LoadingState";

export default function ReportAnalysis() {
  const [file, setFile] = useState(null); const [coords, setCoords] = useState(null); const [loading, setLoading] = useState(false); const [report, setReport] = useState(null); const [history, setHistory] = useState([]); const [error, setError] = useState("");
  const patientId = localStorage.getItem("patientId"); const language = localStorage.getItem("language") || "English";
  useEffect(() => { navigator.geolocation?.getCurrentPosition(p => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude })); if (patientId) api.get(`/api/reports/history/${patientId}`).then(r => setHistory(r.data.reports || [])).catch(() => {}); }, [patientId]);
  const submit = async () => { if (!patientId) return setError("Create a patient profile first."); if (!file) return; setLoading(true); setError(""); try { const fd = new FormData(); fd.append("file", file); fd.append("patientId", patientId); fd.append("language", language); if (coords) { fd.append("lat", coords.lat); fd.append("lng", coords.lng); } const { data } = await api.post("/api/reports/analyze", fd, { headers: { "Content-Type": "multipart/form-data" } }); setReport(data.report); } catch (e) { setError(e.response?.data?.message || "Report analysis failed"); } finally { setLoading(false); } };
  return <div><Header badge="Report Intelligence" title="Medical Report Analysis" subtitle="Upload a report and get a simple AI explanation with doctor guidance." />{error && <div className="mb-4 rounded-2xl bg-red-50 p-3 font-semibold text-red-700">{error}</div>}<ReportUpload file={file} setFile={setFile} onSubmit={submit} loading={loading} />{loading && <div className="mt-4"><LoadingState message="Understanding your report..." /></div>}<ReportResult report={report} />{report && <HospitalCards facilities={report.facilities} showFallback={report.doctorRecommendation?.needed || report.riskLevel === "high"} />}{history.length > 0 && <section className="mt-8"><h2 className="mb-3 text-2xl font-bold text-primary">Previous reports</h2><div className="space-y-3">{history.map(r => <div className="card p-4" key={r._id}><b>{r.fileName}</b><p className="text-sm text-slate-600">{r.summary}</p><p className="text-xs text-primary">{new Date(r.createdAt).toLocaleString()}</p></div>)}</div></section>}</div>;
}
