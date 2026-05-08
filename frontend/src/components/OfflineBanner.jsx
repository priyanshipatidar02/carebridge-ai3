import React from "react";
import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const goOnline = () => { setOnline(true); setRestored(true); setTimeout(() => setRestored(false), 3500); };
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => { window.removeEventListener("online", goOnline); window.removeEventListener("offline", goOffline); };
  }, []);

  if (online && !restored) return null;
  return (
    <div className={`sticky top-0 z-50 px-4 py-2 text-center text-sm font-semibold ${online ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-900"}`}>
      {online ? "Internet restored — syncing offline result" : "Offline Mode Active"}
    </div>
  );
}
