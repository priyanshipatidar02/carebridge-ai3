import React from "react";
import { useState } from "react";

export default function FollowUpQuestions({ questions = [], onComplete }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  if (!questions.length) return null;
  const q = questions[index];
  const progress = ((index + 1) / questions.length) * 100;

  const setAnswer = (value) => setAnswers(prev => ({ ...prev, [q.id]: value }));
  const next = () => index === questions.length - 1 ? onComplete(answers) : setIndex(i => i + 1);

  return (
    <div className="card p-6">
      <p className="text-sm font-bold text-primary">Question {index + 1} of {questions.length}</p>
      <div className="mt-3 h-2 rounded-full bg-cream"><div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
      <h2 className="mt-6 text-2xl font-bold text-slate-900">{q.question}</h2>
      <div className="mt-5">
        {q.type === "text" && <input className="input" value={answers[q.id] || ""} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer" />}
        {q.type === "yesno" && <div className="flex gap-3">{["Yes", "No"].map(v => <button key={v} className={`btn-light ${answers[q.id] === v ? "!bg-primary !text-white" : ""}`} onClick={() => setAnswer(v)}>{v}</button>)}</div>}
        {q.type === "select" && <select className="input" value={answers[q.id] || ""} onChange={(e) => setAnswer(e.target.value)}><option value="">Select</option>{(q.options || []).map(opt => <option key={opt}>{opt}</option>)}</select>}
        {q.type === "slider" && <div><input className="w-full accent-primary" type="range" min={q.min || 1} max={q.max || 10} value={answers[q.id] || q.min || 1} onChange={(e) => setAnswer(Number(e.target.value))} /><p className="mt-2 font-bold text-primary">{answers[q.id] || q.min || 1}</p></div>}
      </div>
      <div className="mt-6 flex justify-between">
        <button className="btn-light" disabled={index === 0} onClick={() => setIndex(i => Math.max(0, i - 1))}>Back</button>
        <button className="btn-primary" onClick={next}>{index === questions.length - 1 ? "Analyze" : "Next"}</button>
      </div>
    </div>
  );
}
