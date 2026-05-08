import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Activity, BarChart3, FileText, HeartPulse, History, Home, Siren } from "lucide-react";

const items = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/check", label: "Symptom Checker", icon: HeartPulse },
  { to: "/reports", label: "Report Analysis", icon: FileText },
  { to: "/history", label: "History", icon: History },
  { to: "/chart", label: "Severity Chart", icon: BarChart3 },
  { to: "/emergency", label: "Emergency", icon: Siren }
];

export default function Sidebar() {
  return (
    <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-[2rem] bg-white/80 p-4 shadow-soft backdrop-blur lg:block">
      <Link to="/" className="mb-7 flex items-center gap-3 rounded-2xl p-3 hover:bg-cream">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-white"><Activity /></div>
        <div>
          <p className="font-display text-2xl font-bold text-primary">CareBridge</p>
          <p className="text-xs text-slate-500">AI Health Assistant</p>
        </div>
      </Link>
      <nav className="space-y-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-primary text-white" : "text-slate-600 hover:bg-cream hover:text-primary"}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-cream p-4 text-sm text-slate-600">
        <b className="text-primary">Safety first:</b> CareBridge supports decisions but does not replace doctors.
      </div>
    </aside>
  );
}
