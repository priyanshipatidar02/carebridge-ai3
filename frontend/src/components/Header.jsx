import React from "react";
export default function Header({ badge, title, subtitle }) {
  return (
    <header className="mb-6">
      {badge && <span className="badge bg-primary/10 text-primary">{badge}</span>}
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-slate-600">{subtitle}</p>}
    </header>
  );
}
