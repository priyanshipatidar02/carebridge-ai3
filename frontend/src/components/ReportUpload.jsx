import React from "react";
import { UploadCloud } from "lucide-react";

export default function ReportUpload({ file, setFile, onSubmit, loading }) {
  return (
    <div className="card p-6">
      <label className="grid cursor-pointer place-items-center rounded-[2rem] border-2 border-dashed border-primary/20 bg-cream/60 p-10 text-center transition hover:border-primary/50">
        <UploadCloud className="text-primary" size={42} />
        <p className="mt-3 text-xl font-bold text-primary">Upload medical report</p>
        <p className="mt-1 text-sm text-slate-500">PDF, JPG, JPEG, or PNG up to 10MB</p>
        <input className="hidden" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </label>
      {file && <p className="mt-4 rounded-2xl bg-primary/5 p-3 font-semibold text-primary">Selected: {file.name}</p>}
      <button disabled={!file || loading} className="btn-primary mt-5" onClick={onSubmit}>{loading ? "Reading your report safely..." : "Analyze Report"}</button>
    </div>
  );
}
