-- =============================================================================
-- Production content update (2026-11-15): real project details and media.
-- Sources: HearMe README + web build, WishFlowAI README + app code,
-- KAVACH/NexaVault READMEs, résumé, IIT Mandi offer/completion letters.
-- Media lives in the `portfolio-media` bucket under projects/<slug>/.
-- Screens are real screenshots; *architecture.jpg / diagram covers are
-- illustrations built from documented facts (captioned as such).
-- Apply in a transaction:
--   { echo begin; cat <this file>; echo commit; } | supabase db query --linked --project-ref <ref> -f /dev/stdin
-- =============================================================================

-- HearMe ----------------------------------------------------------------------
update portfolio.projects set
  cover_image = 'projects/hearme/cover.jpg',
  architecture = E'- **Mobile app:** Expo / React Native (iOS + Android, plus a web build) with SOS, evidence capture, journey tracking, behaviour anomaly detection, hidden-camera scanning, voice triggers, fake calls and a calculator **disguise mode**.\n- **NeuroBand wearable:** Nordic nRF52 running Zephyr firmware, streaming a 20-byte BioFrame at 1 Hz (HR, HRV, SpO₂, GSR, skin temperature, motion, sEMG envelope, battery, tamper) over BLE with passkey bonding.\n- **Local-first detection:** the phone is the source of truth — it ingests its own sensors and the band''s, runs detection on-device, and pushes encrypted artifacts to the cloud **only when an event fires**.\n- **Backend:** Supabase (Auth, PostgreSQL + RLS, Storage evidence locker, Realtime).\n- **Integrity:** evidence hashes anchored on Algorand.\n- **Accessibility:** multi-language UI (i18next) and a fully spoken voice guide for visually-impaired users.',
  results = E'- **2nd Place, National-Level Project Expo (2026).**\n- Working Expo app for Android and iOS (with a web build), the NeuroBand Zephyr firmware, and the Supabase backend — all in one repository.\n- Discreet activation paths (voice phrase, triple-tap, duress PIN, silent tap on the band) and a disguise mode that makes the app look like a calculator.',
  gallery = '[
    {"src":"projects/hearme/screen-onboarding.jpg","alt":"HearMe onboarding screen: Your Safety, Your Power — instant SOS alerts, shake detection, live GPS tracking","caption":"Onboarding (real screenshot)"},
    {"src":"projects/hearme/screen-language.jpg","alt":"HearMe language picker listing English, Hindi, Bengali, Telugu, Marathi, Tamil, Urdu and Gujarati","caption":"Multi-language setup"},
    {"src":"projects/hearme/screen-disguise.jpg","alt":"HearMe disguise mode showing a working calculator interface","caption":"Disguise mode — the app poses as a calculator"},
    {"src":"projects/hearme/screen-sign-in.jpg","alt":"HearMe sign-in screen","caption":"Sign-in"},
    {"src":"projects/hearme/screen-pin-lock.jpg","alt":"HearMe PIN lock screen","caption":"App lock with PIN"},
    {"src":"projects/hearme/architecture.jpg","alt":"Architecture diagram: NeuroBand over BLE to the HearMe app, events uploaded to Supabase with hashes on Algorand; SOS triggers alert trusted contacts","caption":"Architecture (diagram)"}
  ]'::jsonb
where slug = 'hearme';

-- WishFlow AI -----------------------------------------------------------------
update portfolio.projects set
  tagline = 'Agentic birthday automation: remembers, writes and delivers personal messages.',
  summary = 'An agentic AI platform that remembers every birthday, drafts a personal message for each person, and delivers it on the right channel at the right time — with you approving before anything is sent.',
  problem = 'Reminder notifications tell you a birthday is today, but you still have to stop, think of something personal and send it — so the message ends up generic or late. WishFlow AI handles the whole loop: it imports birthdays from your calendar, writes drafts using what you know about each person (relationship, interests, shared memories), and sends them by email, Telegram or WhatsApp.',
  architecture = E'- **Frontend:** Next.js (App Router) with React, TypeScript, Tailwind CSS, Zustand and TanStack Query — a marketing site plus a dashboard for birthdays, contacts, the AI message writer, calendar sync, delivery logs and analytics.\n- **Auth & profiles:** Supabase Auth with per-user defaults (tone, language, send time, channel).\n- **API layer:** a single typed client that runs against an in-memory mock or a **FastAPI** backend contract (contacts CRUD, upcoming birthdays, generate / approve / regenerate messages, calendar sync, delivery history).\n- **Agent:** generates three message variations per contact in a chosen tone, queues them for approval, then delivers via Email, Telegram or WhatsApp.\n- **Ops:** the full stack is Dockerised for reproducible development and production builds.',
  challenges = E'- **Keeping a human in the loop:** approval is on by default and auto-send is opt-in, so the agent never messages someone without consent.\n- **Personal, not robotic:** drafts draw on relationship and per-contact notes, with tone control and one-click regeneration.\n- **Frontend and backend evolving independently:** the UI is built against a mock API that mirrors the FastAPI contract, so either side can change without blocking the other.',
  cover_image = 'projects/wishflow-ai/cover.jpg',
  gallery = '[
    {"src":"projects/wishflow-ai/screen-hero.jpg","alt":"WishFlow AI landing page: Birthdays remembered. Messages made personal, with a scheduled AI draft for a contact","caption":"Landing page (real screenshot)"},
    {"src":"projects/wishflow-ai/screen-tour.jpg","alt":"WishFlow AI product tour showing the dashboard overview with upcoming birthdays and an approval queue","caption":"Product tour of the dashboard"},
    {"src":"projects/wishflow-ai/screen-features.jpg","alt":"WishFlow AI core capabilities section","caption":"Core capabilities"},
    {"src":"projects/wishflow-ai/screen-timeline.jpg","alt":"WishFlow AI automation timeline","caption":"Automation timeline"},
    {"src":"projects/wishflow-ai/screen-integrations.jpg","alt":"WishFlow AI integrations: Google Calendar, Gmail, Telegram, WhatsApp, Slack, Outlook","caption":"Integrations"},
    {"src":"projects/wishflow-ai/architecture.jpg","alt":"Architecture diagram: Google Calendar to Next.js dashboard and API layer; AI agent drafts, approval queue, delivery by email, Telegram or WhatsApp","caption":"Architecture (diagram)"}
  ]'::jsonb
where slug = 'wishflow-ai';

-- Secure Rural Banking --------------------------------------------------------
update portfolio.projects set
  architecture = E'- **Client:** React Native app (Android).\n- **Auth & data:** Firebase authentication, MongoDB for application data.\n- **Fraud layer:** OTP challenge–response, RBAC, transaction anomaly detection, and an AI phishing-link classifier (OpenAI API) that screens every URL in under 100 ms.',
  cover_image = 'projects/secure-rural-banking/cover.jpg',
  gallery = '[{"src":"projects/secure-rural-banking/architecture.jpg","alt":"Architecture diagram: React Native app, OTP and RBAC authentication, Firebase and MongoDB; links and transactions screened by phishing and anomaly checks","caption":"Architecture (diagram)"}]'::jsonb
where slug = 'secure-rural-banking';

-- BeyondSilence ---------------------------------------------------------------
update portfolio.projects set
  cover_image = 'projects/beyondsilence/cover.jpg',
  gallery = '[{"src":"projects/beyondsilence/architecture.jpg","alt":"Pipeline diagram: video clip, 45 sampled frames, MediaPipe keypoints, NumPy sequence, LSTM model, predicted word","caption":"Recognition pipeline (diagram)"}]'::jsonb
where slug = 'beyondsilence';

-- NexaVault (KAVACH) ----------------------------------------------------------
update portfolio.projects set
  architecture = E'- **Client:** Expo / React Native app (screens, services, contexts) with QR payments, biometric login and a voice assistant (speech-to-text and text-to-speech) in 22 Indian languages.\n- **API:** Node.js + Express — 12 route handlers, 8 business-logic services, auth and validation middleware — over MongoDB with 8 Mongoose models.\n- **Fraud detection:** Hugging Face BERT models for OTP, transaction and SMS/call spam analysis, returning a risk level (Critical / High / Medium / Low / Safe) with a recommended action; TOTP-based offline OTP.\n- **Build:** Android pipeline with Gradle and SDK/NDK dependencies, deployed to devices and emulators.',
  cover_image = 'projects/nexavault-kavach/cover.jpg',
  gallery = '[{"src":"projects/nexavault-kavach/architecture.jpg","alt":"Architecture diagram: Expo app to Express REST API to MongoDB; SMS, OTP and transactions analysed by an ML fraud API returning a risk verdict","caption":"Architecture (diagram)"}]'::jsonb
where slug = 'nexavault-kavach';

-- IoT projects ----------------------------------------------------------------
update portfolio.projects set
  cover_image = 'projects/wifi-robot-car/cover.jpg',
  gallery = '[{"src":"projects/wifi-robot-car/architecture.jpg","alt":"Diagram: browser control UI over Wi-Fi to ESP8266, L298N motor driver and DC motors","caption":"System diagram"}]'::jsonb
where slug = 'wifi-robot-car';

update portfolio.projects set
  cover_image = 'projects/iot-smart-light/cover.jpg',
  gallery = '[{"src":"projects/iot-smart-light/architecture.jpg","alt":"Diagram: smartphone app over Wi-Fi module to Arduino Uno driving RGB lights","caption":"System diagram"}]'::jsonb
where slug = 'iot-smart-light';

-- IIT Mandi: exact dates from the offer and completion letters ----------------
update portfolio.experiences set start_date = '2026-07-20', end_date = '2026-08-20'
where organization = 'Indian Institute of Technology (IIT) Mandi';
