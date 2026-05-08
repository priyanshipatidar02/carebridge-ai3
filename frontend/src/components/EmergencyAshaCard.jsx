import React from "react";
import { PhoneCall, Siren } from "lucide-react";

export default function EmergencyAshaCard() {
  return (
    <div className="mt-6 rounded-[2rem] border border-red-200 bg-red-50 p-6 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-red-600 p-3 text-white"><Siren /></div>
        <div>
          <h2 className="text-2xl font-bold text-red-800">No nearby hospital found</h2>
          <p className="mt-2 text-red-700">You may contact an ASHA worker or local emergency support for immediate help.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white" href="tel:+919999999999"><PhoneCall className="mr-2 inline" size={16} /> Call ASHA Worker</a>
            <a className="rounded-2xl bg-white px-5 py-3 font-bold text-red-700" href="tel:108">Call Emergency 108</a>
          </div>
        </div>
      </div>
    </div>
  );
}
