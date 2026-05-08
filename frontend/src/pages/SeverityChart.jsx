import React from "react";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/axios";
import Header from "../components/Header";

export default function SeverityChart() {
  const [data, setData] = useState([]);
  useEffect(() => { const patientId = localStorage.getItem("patientId"); if (!patientId) return; api.get(`/api/history/chart/${patientId}`).then(r => setData(r.data.chart || [])).catch(() => setData([])); }, []);
  return <div><Header badge="Health Trend" title="Severity Chart" subtitle="Track severity score over time." /><div className="card h-[420px] p-6"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis domain={[0,100]} /><Tooltip /><Line type="monotone" dataKey="score" strokeWidth={3} dot /></LineChart></ResponsiveContainer></div></div>;
}
