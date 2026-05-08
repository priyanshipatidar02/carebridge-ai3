export const translations = {
  English: {
    badge: "AI Health Companion",
    title: "CareBridge AI",
    subtitle: "AI-powered health guidance for rural and emergency care",
    patient: "Patient Profile",
    placeholder: "Describe your symptoms here...",
    analyze: "Analyze Symptoms →",
    locationEnabled: "Location enabled",
    enableLocation: "Enable location for nearby hospital suggestions",
    disclaimerTitle: "Medical disclaimer",
    disclaimerBody: "This is not a medical diagnosis. Please consult a qualified doctor.",
    reportUpload: "Upload medical report",
    reportAnalysis: "Report Analysis",
    history: "History",
    emergency: "Emergency"
  },
  Hindi: {
    badge: "AI स्वास्थ्य साथी",
    title: "CareBridge AI",
    subtitle: "ग्रामीण और आपातकालीन देखभाल के लिए AI स्वास्थ्य मार्गदर्शन",
    patient: "रोगी प्रोफ़ाइल",
    placeholder: "अपने लक्षण यहाँ लिखें...",
    analyze: "लक्षणों का विश्लेषण करें →",
    locationEnabled: "लोकेशन सक्षम है",
    enableLocation: "नज़दीकी अस्पताल सुझावों के लिए लोकेशन सक्षम करें",
    disclaimerTitle: "चिकित्सा अस्वीकरण",
    disclaimerBody: "यह चिकित्सा निदान नहीं है। कृपया योग्य डॉक्टर से सलाह लें।",
    reportUpload: "मेडिकल रिपोर्ट अपलोड करें",
    reportAnalysis: "रिपोर्ट विश्लेषण",
    history: "इतिहास",
    emergency: "आपातकाल"
  }
};

export function getT() {
  const lang = localStorage.getItem("language") || "English";
  return translations[lang] || translations.English;
}
