import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import LanguageToggle from "../components/LanguageToggle";
import { getT } from "../i18n/translations";

export default function CreateProfile() {
  const navigate = useNavigate();
  const t = getT();
  const [form, setForm] = useState({ name: "", age: "", gender: "Female", language: localStorage.getItem("language") || "English" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const { data } = await api.post("/api/patient/create", { ...form, age: Number(form.age) });
      localStorage.setItem("patientId", data.patient._id);
      localStorage.setItem("patientName", data.patient.name);
      localStorage.setItem("language", data.patient.language);
      navigate("/check");
    } catch (err) { setError(err.response?.data?.message || "Could not create profile"); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <Header badge={t.patient} title="Create Patient Profile" subtitle="This helps CareBridge personalize the language and save your health history." />
      <form onSubmit={submit} className="card max-w-2xl space-y-4 p-6">
        {error && <div className="rounded-2xl bg-red-50 p-3 font-semibold text-red-700">{error}</div>}
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        <input className="input" placeholder="Age" type="number" value={form.age} onChange={(e) => update("age", e.target.value)} required />
        <select className="input" value={form.gender} onChange={(e) => update("gender", e.target.value)}><option>Female</option><option>Male</option><option>Other</option></select>
        <LanguageToggle value={form.language} onChange={(v) => { update("language", v); localStorage.setItem("language", v); }} />
        <button className="btn-primary" disabled={loading}>{loading ? "Creating..." : "Continue to Symptom Checker"}</button>
      </form>
    </div>
  );
}
