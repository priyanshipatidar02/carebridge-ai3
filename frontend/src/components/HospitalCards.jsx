import React from "react";
import { MapPin, Phone, Navigation } from "lucide-react";
import EmergencyAshaCard from "./EmergencyAshaCard";

export default function HospitalCards({ facilities = [], showFallback = true }) {
  if (!facilities.length) return showFallback ? <EmergencyAshaCard /> : null;
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-2xl font-bold text-primary">Nearby hospitals & clinics</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {facilities.map((f, idx) => (
          <div key={`${f.name}-${idx}`} className="card p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary"><MapPin /></div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{f.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{f.address || "Address unavailable"}</p>
                <p className="mt-2 text-sm font-semibold text-primary">{f.distanceKm} km • {f.estimatedTravelTime}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a className="btn-primary inline-flex items-center gap-2" href={f.mapsUrl} target="_blank" rel="noreferrer"><Navigation size={16} /> Directions</a>
              {f.phone && <a className="btn-light inline-flex items-center gap-2" href={`tel:${f.phone}`}><Phone size={16} /> Call</a>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
