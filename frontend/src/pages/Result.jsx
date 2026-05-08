import React from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import ResultCard from "../components/ResultCard";
import HospitalCards from "../components/HospitalCards";

export default function Result() {
  const { state } = useLocation();
  const result = state?.result;
  if (!result) return <div><Header title="No result yet" subtitle="Run symptom analysis first." /><Link className="btn-primary" to="/check">Go to Symptom Checker</Link></div>;
  return <div><Header badge="AI Triage Result" title="Your CareBridge Result" subtitle="Review the guidance and seek doctor care when recommended." /><ResultCard result={result} /><HospitalCards facilities={result.facilities} showFallback={result.triage?.needsDoctor || result.triage?.emergencyWarning || result.triage?.severity === "high"} /></div>;
}
