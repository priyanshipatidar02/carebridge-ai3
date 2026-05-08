import React from "react";
import Header from "../components/Header";
import EmergencyAshaCard from "../components/EmergencyAshaCard";

export default function Emergency() {
  return <div><Header badge="Emergency" title="Emergency Help" subtitle="Use this page when urgent support is needed and nearby facilities are unavailable." /><EmergencyAshaCard /><div className="card mt-5 p-6"><h2 className="text-xl font-bold text-primary">Red flags</h2><p className="mt-2 text-slate-700">Severe chest pain, unconsciousness, breathing difficulty, stroke-like symptoms, heavy bleeding, severe allergic swelling, or seizures need urgent medical attention.</p></div></div>;
}
