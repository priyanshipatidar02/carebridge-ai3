import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import OfflineBanner from "./components/OfflineBanner";
import Landing from "./pages/Landing";
import CreateProfile from "./pages/CreateProfile";
import SymptomChecker from "./pages/SymptomChecker";
import Result from "./pages/Result";
import History from "./pages/History";
import SeverityChart from "./pages/SeverityChart";
import ReportAnalysis from "./pages/ReportAnalysis";
import Emergency from "./pages/Emergency";

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <OfflineBanner />
      <div className="mx-auto flex max-w-7xl gap-5 p-4 md:p-6">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/check" element={<SymptomChecker />} />
            <Route path="/result" element={<Result />} />
            <Route path="/history" element={<History />} />
            <Route path="/chart" element={<SeverityChart />} />
            <Route path="/reports" element={<ReportAnalysis />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
