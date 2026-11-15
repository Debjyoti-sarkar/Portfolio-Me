-- =============================================================================
-- Content update from Deb's own write-up (2026-11-15):
--   * IIT Mandi research focus
--   * BeyondSilence rewritten as an image-to-data interpretation pipeline
--   * SIH 2025 project = KAVACH / NexaVault: merged into one case study
--     (slug kept as `secure-rural-banking` so achievement links still work);
--     the separate `nexavault-kavach` card is set to draft, not deleted.
-- =============================================================================

-- IIT Mandi -------------------------------------------------------------------
update portfolio.experiences set
  role = 'Summer Research Intern — AI-Assisted Educational Pipelines (GyanSetu)',
  highlights = array[
    'Researched AI-assisted educational systems combining Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), automated content generation and interactive STEM simulations.',
    'Explored LLM-driven educational content generation and intelligent learning assistance, and RAG systems for context-aware retrieval and knowledge delivery.',
    'Worked on automated creation of structured learning materials and interactive STEM simulations to improve conceptual understanding — aiming to make technical education more personalised, engaging and accessible.'
  ]
where organization = 'Indian Institute of Technology (IIT) Mandi';

-- BeyondSilence -----------------------------------------------------------------
update portfolio.projects set
  tagline = 'AI pipeline that turns images into structured, actionable data.',
  summary = 'An AI-powered image-to-data interpretation pipeline that transforms visual information into structured, meaningful and actionable data using computer vision and multimodal AI.',
  problem = 'A great deal of useful information is locked inside images — unstructured, hard to search and impossible for software to act on. BeyondSilence aims to bridge the gap between unstructured visual information and structured digital knowledge through an AI-assisted interpretation pipeline.',
  role = E'- Designing and building the end-to-end **image-to-data pipeline**.\n- Integrating **Google Cloud Vision** for visual extraction with **Google Gemini** for LLM-based interpretation.\n- Converting interpreted results into **machine-readable, structured output**, with **Firebase** as the app backend.',
  architecture = E'1. **Image acquisition** — accepting visual inputs in different formats and conditions.\n2. **Image processing** — extracting the relevant visual information (Google Cloud Vision).\n3. **AI interpretation** — understanding the extracted information with multimodal models (Google Gemini).\n4. **Structured data extraction** — converting visual information into machine-readable data.\n5. **Intelligent output generation** — producing meaningful interpretations and insights.\n\nPython handles the AI integration; Firebase backs the application.',
  challenges = E'- Extracting meaningful information from **complex images**.\n- **Maintaining interpretation accuracy** across inputs.\n- Converting **unstructured visual information into structured data**.\n- Integrating **computer vision with LLM-based interpretation** in one pipeline.\n- Handling **different image formats and varying visual conditions**.',
  results = 'PLACEHOLDER: add outcomes once available — e.g. accuracy on a test set, processing time, or a demo link.',
  tech = array['Python', 'Google Cloud Vision', 'Google Gemini', 'Firebase', 'Multimodal AI', 'Computer Vision'],
  categories = array['ai-ml'],
  social_impact = false,
  cover_image = 'projects/beyondsilence/cover-v2.jpg',
  gallery = '[{"src":"projects/beyondsilence/architecture-v2.jpg","alt":"Pipeline diagram: image acquisition, Cloud Vision processing, Gemini interpretation, structured extraction, intelligent output, stored in Firebase","caption":"Five-stage pipeline (diagram)"}]'::jsonb
where slug = 'beyondsilence';

-- KAVACH (SIH 2025) ---------------------------------------------------------------
update portfolio.projects set
  title = 'KAVACH — Secure Rural Banking',
  tagline = 'Fraud-resistant, accessible digital banking for rural users — SIH 2025 National Finalist.',
  summary = 'A cybersecurity- and blockchain-oriented digital banking solution that strengthens transaction authentication, improves fraud awareness and makes banking security accessible for rural users.',
  problem = 'Rural users increasingly depend on digital financial services but face fraudulent transactions, insecure authentication, limited connectivity and complex banking apps. KAVACH set out to make digital banking both safer and simpler for them.',
  role = E'- Built **multi-layered authentication**: OTP challenge–response, role-based access control and real-time transaction anomaly detection.\n- Built a **phishing-detection pipeline** that screens every URL in **under 100 ms**.\n- Developed the **Node.js / Express REST API** with MongoDB and owned the **Android build pipeline** (Gradle, SDK/NDK, device and emulator deployment).',
  architecture = E'- **Mobile app:** React Native with simplified, accessibility-first flows, secure money transfers, QR payments and a voice assistant in 22 Indian languages.\n- **API:** Node.js + Express — 12 route handlers, 8 services, auth and validation middleware — over MongoDB with 8 Mongoose models.\n- **Fraud detection:** transaction scanning for suspicious activity, Hugging Face BERT models for OTP and SMS fraud analysis (risk levels from Critical to Safe), and AI phishing-link screening.\n- **Offline OTP:** TOTP-based verification for limited-connectivity environments.\n- **Blockchain:** exploring ledger-backed mechanisms for transaction integrity and security.',
  challenges = E'- Designing **secure authentication workflows** that still work for first-time users.\n- Addressing **connectivity limitations** in rural environments (offline OTP).\n- Integrating **blockchain concepts** into banking workflows.\n- Designing **fraud-detection interfaces** and transaction-scanning mechanisms.\n- **Balancing security, accessibility and usability.**',
  results = E'- **National Finalist, Smart India Hackathon 2025.**\n- Phishing pipeline screens 100% of URLs in under 100 ms.',
  tech = array['React Native', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'Hugging Face', 'Blockchain', 'Android SDK/NDK', 'Gradle'],
  categories = array['social-impact', 'fintech', 'mobile'],
  social_impact = true,
  github_url = 'https://github.com/Debjyoti-sarkar/KAVACH',
  cover_image = 'projects/secure-rural-banking/cover-v2.jpg',
  gallery = '[{"src":"projects/secure-rural-banking/architecture-v2.jpg","alt":"Architecture diagram: React Native app to Express API and MongoDB; sign-in and payments pass through fraud detection, with blockchain explored for transaction integrity","caption":"Architecture (diagram)"}]'::jsonb
where slug = 'secure-rural-banking';

-- Keep the old separate card recoverable but hidden.
update portfolio.projects set status = 'draft' where slug = 'nexavault-kavach';

update portfolio.achievements set description = 'KAVACH — secure rural banking and fraud-detection ecosystem.'
where event = 'Smart India Hackathon (SIH) 2025';

-- New skills from the research and BeyondSilence work -------------------------------
insert into portfolio.skills (group_name, group_order, name, sort_order) values
  ('AI/ML & Security', 40, 'LLMs & RAG', 0),
  ('AI/ML & Security', 40, 'Google Gemini', 1),
  ('AI/ML & Security', 40, 'Google Cloud Vision', 2)
on conflict (group_name, name) do nothing;

-- Keep three featured projects on the home page after the KAVACH merge.
update portfolio.projects set featured = true where slug = 'wishflow-ai';
