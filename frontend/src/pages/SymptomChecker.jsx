import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import AllergyModal from "../components/AllergyModal";
import FollowUpQuestions from "../components/FollowUpQuestions";
import LoadingState from "../components/LoadingState";
import ResultCard from "../components/ResultCard";
import HospitalCards from "../components/HospitalCards";
import { getT } from "../i18n/translations";

const chips = ["Fever", "Headache", "Cough", "Chest Pain", "Stomach Pain", "Dizziness", "Vomiting", "Breathing Difficulty"];

export default function SymptomChecker() {
  const t = getT();
  const nav = useNavigate();
  const location = useLocation();
  const [symptoms, setSymptoms] = useState(location.state?.symptoms || "");
  const [coords, setCoords] = useState(null);
  const [modal, setModal] = useState(false);
  const [allergyData, setAllergyData] = useState({ status: "no", allergies: [] });
  const [questions, setQuestions] = useState([]);
  const [stage, setStage] = useState("input");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const patientId = localStorage.getItem("patientId");
  const language = localStorage.getItem("language") || "English";

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      p => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setCoords(null),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const start = () => {
    if (!patientId) return nav("/create-profile");
    if (!symptoms.trim()) return setError("Please enter symptoms first");
    if (!navigator.onLine) {
      const offline = { triage: { possibleCondition: "Offline saved case", severity: "medium", severityScore: 50, needsDoctor: false, emergencyWarning: false }, medicine: { suggested: "Your case is saved locally and will sync when internet returns." }, advice: { message: "Offline mode", details: ["Saved locally", "Try again when internet returns"] }, facilities: [] };
      localStorage.setItem("pendingSymptomRequest", JSON.stringify({ patientId, symptoms, createdAt: new Date().toISOString() }));
      return setResult(offline);
    }
    setModal(true);
  };

  const submitAllergy = async (data) => {
    setModal(false); setAllergyData(data); setError(""); setStage("followupLoading");
    try {
      if (data.status === "yes") await api.post("/api/allergy/add", { patientId, allergies: data.allergies });
      const res = await api.post("/api/triage/followups", { symptoms, language });
      setQuestions(res.data.questions || []); setStage("followups");
    } catch (err) { setError(err.response?.data?.message || "Could not generate follow-up questions"); setStage("input"); }
  };

  const finalAnalyze = async (followUpAnswers) => {
    setStage("analyzing"); setError("");
    try {
      const { data } = await api.post("/api/triage/analyze", { patientId, symptoms, allergies: allergyData.allergies, allergyStatus: allergyData.status, followUpAnswers, lat: coords?.lat, lng: coords?.lng, language });
      setResult(data); setStage("done");
      nav("/result", { state: { result: data } });
    } catch (err) { setError(err.response?.data?.message || "Analysis failed"); setStage("followups"); }
  };

  return (
    <div>
      <Header badge="Symptom Checker" title="Analyze Symptoms" subtitle="Answer a few safe follow-up questions before the final AI triage." />
      <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <section className="card p-6">
          {error && <div className="mb-4 rounded-2xl bg-red-50 p-3 font-semibold text-red-700">{error}</div>}
          <textarea className="input min-h-40" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder={t.placeholder} />
          <div className="mt-4 flex flex-wrap gap-2">{chips.map(c => <button key={c} className="rounded-full bg-cream px-4 py-2 text-sm font-semibold text-primary" onClick={() => setSymptoms(s => `${s}${s ? ", " : ""}${c}`)}>{c}</button>)}</div>
          <p className={`mt-4 text-sm font-semibold ${coords ? "text-green-700" : "text-amber-700"}`}>{coords ? t.locationEnabled : t.enableLocation}</p>
          <button className="btn-primary mt-5" onClick={start}>{t.analyze}</button>
        </section>
        <section className="space-y-4">
          {stage === "followupLoading" && <LoadingState message="Preparing smart follow-up questions..." />}
          {stage === "analyzing" && <LoadingState message="Analyzing your symptoms safely..." />}
          {stage === "followups" && <FollowUpQuestions questions={questions} onComplete={finalAnalyze} />}
          {result && <><ResultCard result={result} /><HospitalCards facilities={result.facilities} showFallback={result.triage?.needsDoctor || result.triage?.emergencyWarning || result.triage?.severity === "high"} /></>}
        </section>
      </div>
      <AllergyModal open={modal} onClose={() => setModal(false)} onSubmit={submitAllergy} />
    </div>
  );
}
