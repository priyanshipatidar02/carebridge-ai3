import React from "react";
import { Link } from "react-router-dom";
import { FileText, HeartPulse, Languages, MapPin, ShieldPlus } from "lucide-react";
import Header from "../components/Header";
import { getT } from "../i18n/translations";

const features = [
  [HeartPulse, "AI Symptom Checker"],
  [FileText, "Medical Report Analysis"],
  [MapPin, "Nearby Hospital Finder"],
  [ShieldPlus, "Emergency ASHA Help"],
  [Languages, "English/Hindi Support"]
];

export default function Landing() {
  const t = getT();
  return (
    <div>
      <Header badge={t.badge} title={t.title} subtitle={t.subtitle} />
      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <section className="card overflow-hidden p-8 md:p-10">
          <h2 className="font-display text-5xl font-bold leading-tight text-primary">Health guidance that feels calm in urgent moments.</h2>
          <p className="mt-5 text-lg text-slate-600">Create a profile, analyze symptoms, upload reports, and find nearby care without exposing your API keys in the browser.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/create-profile">Create Patient Profile</Link>
            <Link className="btn-light" to="/reports">Analyze Report</Link>
          </div>
        </section>
        <section className="grid gap-4">
          {features.map(([Icon, label]) => (
            <div key={label} className="card flex items-center gap-4 p-5">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary"><Icon /></div>
              <p className="font-bold text-slate-800">{label}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
