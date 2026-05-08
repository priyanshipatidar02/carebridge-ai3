# CareBridge AI

Full-stack MERN healthcare assistant with:

- AI symptom triage
- Gemini-generated follow-up questions
- Allergy safety flow
- Nearby hospital/clinic cards using backend-only Maps key
- Emergency ASHA fallback card
- Medical report upload with OCR/PDF parsing
- AI report analysis
- Patient history
- Severity chart
- English/Hindi support
- Basic offline fallback

## Run backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Fill `.env` with your MongoDB, Gemini, and Maps/Geoapify key.

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

## Important

- Do not put Gemini or Maps API keys in React frontend.
- Report analysis uses `POST /api/reports/analyze` only.
- Symptom analysis uses `POST /api/triage/analyze` only.
