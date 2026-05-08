import React from "react";
import { useState } from "react";

export default function AllergyModal({ open, onSubmit, onClose }) {
  const [status, setStatus] = useState("no");
  const [text, setText] = useState("");
  if (!open) return null;

  const submit = () => {
    const allergies = status === "yes" ? text.split(",").map(a => a.trim()).filter(Boolean) : [];
    onSubmit({ status, allergies });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="card w-full max-w-lg p-6">
        <h2 className="font-display text-3xl font-bold text-primary">Medicine Allergies</h2>
        <p className="mt-2 text-slate-600">Do you have any known medicine allergies?</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[['no','No'], ['yes','Yes'], ['notSure','Not sure']].map(([v,l]) => (
            <button key={v} onClick={() => setStatus(v)} className={`rounded-2xl border px-4 py-3 font-semibold ${status === v ? "border-primary bg-primary text-white" : "border-slate-200 bg-white text-slate-700"}`}>{l}</button>
          ))}
        </div>
        {status === "yes" && <input className="input mt-4" value={text} onChange={(e) => setText(e.target.value)} placeholder="paracetamol, ibuprofen, penicillin" />}
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-light" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}>Continue</button>
        </div>
      </div>
    </div>
  );
}
