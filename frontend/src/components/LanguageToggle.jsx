import React from "react";
export default function LanguageToggle({ value, onChange }) {
  return (
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
      <option>English</option>
      <option>Hindi</option>
    </select>
  );
}
