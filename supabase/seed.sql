-- =============================================================================
-- Seed content. Sources: Debjyoti_Sarkar_Resume.tex (Nov 2026), project READMEs
-- on GitHub, and the v1 static site. Nothing here is invented: anything
-- unknown is stored as text starting with "PLACEHOLDER:", which the site
-- renders as a clearly marked callout until it is replaced from /admin.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Projects (social-impact first)
-- ---------------------------------------------------------------------------
insert into portfolio.projects
  (slug, title, tagline, summary, problem, role, architecture, challenges, results,
   tech, categories, social_impact, featured, award, period, credits,
   github_url, live_url, cover_image, gallery, status, sort_order)
values
(
  'hearme',
  'HearMe',
  'AI-powered women''s safety platform with a companion BLE wearable.',
  'A personal-safety mobile app paired with the NeuroBand wearable — designed to detect distress, capture evidence, and reach trusted contacts when seconds matter.',
  'In an emergency, the person at risk often cannot unlock a phone, find an app and call for help. HearMe aims to detect distress automatically (sensors, voice, a silent tap on a wearable), capture tamper-evident evidence, and alert trusted contacts with live location.',
  E'- Architected the **Supabase backend**: schema, Row-Level Security, storage and real-time subscriptions for secure evidence upload.\n- Anchored evidence hashes on **Algorand** for a tamper-evident audit trail.\n- Built a **sensor-fusion engine** (accelerometer, gyroscope, touch patterns) that produces a 0–100 threat score with sub-second latency and triggers GPS-tracked emergency alerts.\n- Designed an encrypted **BLE 5.0 link** (PSK + ECDH) to an nRF52 wearable with fault-tolerant reconnection.\n- Added **on-device speech recognition** (quantised Whisper/Vosk) for voice-triggered SOS.',
  E'- **Mobile app:** Expo / React Native (iOS + Android) with SOS, evidence capture, journey tracking, behaviour anomaly detection, hidden-camera scanning, voice triggers and fake calls.\n- **NeuroBand wearable:** Nordic nRF52 running Zephyr firmware, streaming a 20-byte BioFrame at 1 Hz (HR, HRV, SpO₂, GSR, skin temperature, motion, sEMG envelope, battery, tamper) over BLE with passkey bonding.\n- **Fusion engine:** combines biosignals and phone sensors for higher-confidence triggers.\n- **Backend:** Supabase (PostgreSQL + RLS, Storage evidence locker, Realtime).\n- **Integrity:** evidence hashes anchored on Algorand.',
  E'- Keeping the **BLE link secure and reliable** — encrypted pairing (PSK + ECDH) with fault-tolerant reconnection when the band drops out of range.\n- Running **speech recognition on-device** with quantised Whisper/Vosk models so a voice SOS works without sending audio to a server.\n- Fusing noisy sensor streams into a single threat score with **sub-second latency**.',
  E'- **2nd Place, National-Level Project Expo (2026).**\n- PLACEHOLDER: add any user testing, demo, or deployment outcomes you want to share.',
  array['React Native', 'Expo', 'Supabase', 'PostgreSQL', 'Nordic nRF52', 'Zephyr', 'BLE 5.0', 'Algorand', 'Whisper', 'Vosk', 'Google Maps API'],
  array['social-impact', 'mobile', 'iot', 'ai-ml'],
  true, true,
  '2nd Place, National-Level Project Expo',
  '2026',
  null,
  null, null, null,
  '[]'::jsonb,
  'published', 10
),
(
  'secure-rural-banking',
  'Secure Rural Banking Framework',
  'Fraud-resistant UPI banking for low digital-literacy users — SIH 2025 National Finalist.',
  'A secure UPI-based rural banking application focused on fraud prevention and safe digital transactions, built for users with low digital literacy.',
  'Rural users are increasingly targeted by phishing links and OTP fraud, often on unfamiliar banking apps. The framework adds layered authentication and automatic phishing detection behind simple, accessible banking workflows.',
  E'- Built **multi-layered authentication**: OTP challenge–response, role-based access control and real-time transaction anomaly detection.\n- Built a **phishing-detection pipeline** using the OpenAI API that screens every URL in **under 100 ms**.\n- Designed user-friendly banking workflows optimised for low digital-literacy environments.',
  E'- **Client:** React Native app (Android).\n- **Auth & data:** Firebase authentication, MongoDB for application data.\n- **Fraud layer:** OTP challenge–response, RBAC, transaction anomaly detection, and an AI phishing-link classifier (OpenAI API).\n\nPLACEHOLDER: add an architecture diagram.',
  'PLACEHOLDER: describe the hardest technical problems you solved during SIH 2025.',
  E'- **National Finalist, Smart India Hackathon 2025.**\n- Phishing pipeline screens 100% of URLs in under 100 ms.',
  array['React Native', 'Firebase', 'MongoDB', 'OpenAI API', 'Android Studio'],
  array['social-impact', 'fintech', 'mobile', 'ai-ml'],
  true, true,
  'National Finalist, Smart India Hackathon 2025',
  'Nov 2025',
  null,
  null, null, null,
  '[]'::jsonb,
  'published', 20
),
(
  'beyondsilence',
  'BeyondSilence',
  'Word-level Indian Sign Language recognition from short video clips.',
  'An AI system that predicts the word signified by an Indian Sign Language gesture in a 2–3 second video, to help deaf users communicate with people who do not sign.',
  'Sign language is an action, not a single pose, so it cannot be recognised from one frame. The system needs to understand motion over time to bridge the communication gap for the deaf community.',
  'PLACEHOLDER: describe your specific contribution to BeyondSilence (the codebase builds on an existing open-source ISL recognition project — see credits).',
  E'- **Input:** video from a camera, a saved file, or the web app.\n- **Sampling:** 45 frames selected evenly across the clip.\n- **Pose extraction:** MediaPipe detects body, left-hand and right-hand keypoints in each frame, saved as a NumPy array.\n- **Model:** an LSTM network processes the keypoint sequence to capture the temporal dynamics of the gesture.\n- **Output:** the predicted word (currently *Hello*, *How are you*, *Thank you*).',
  'PLACEHOLDER: describe the challenges you worked through.',
  'PLACEHOLDER: add accuracy, demo, or user-testing results if available.',
  array['Python', 'MediaPipe', 'LSTM', 'TensorFlow', 'OpenCV', 'NumPy'],
  array['social-impact', 'ai-ml'],
  true, false,
  null,
  null,
  'Builds on the open-source ISL recognition work by Sooryak12 (github.com/Sooryak12/ISL_Recognition).',
  'https://github.com/Debjyoti-sarkar/BeyondSilence', null, null,
  '[]'::jsonb,
  'published', 30
),
(
  'nexavault-kavach',
  'NexaVault (KAVACH)',
  'Full-stack secure banking app with ML fraud detection and multilingual voice assistance.',
  'A full-stack UPI banking app designed for the Indian market, with ML-based fraud detection, multi-language voice assistance and accessibility-first design.',
  'Digital payments are growing fastest among users who are most exposed to fraud and least served by English-only interfaces.',
  E'- Developed the full-stack app with a **Node.js / Express REST API** and MongoDB.\n- Owned the **Android build pipeline**: Gradle, SDK/NDK dependencies, and device/emulator deployment.',
  E'- **Client:** React Native (iOS/Android) with QR payments, biometric login and a voice assistant (speech-to-text and text-to-speech) in 22 Indian languages.\n- **API:** Node.js + Express with MongoDB (Mongoose).\n- **Fraud detection:** Hugging Face BERT models for OTP and transaction fraud analysis, SMS/call spam detection, TOTP-based offline OTP.',
  'PLACEHOLDER: describe the challenges you worked through.',
  'PLACEHOLDER: add results or outcomes.',
  array['React Native', 'Node.js', 'Express', 'MongoDB', 'Android SDK/NDK', 'Gradle', 'Hugging Face'],
  array['fintech', 'mobile', 'web'],
  false, true,
  null,
  null,
  null,
  'https://github.com/Debjyoti-sarkar/KAVACH', null, null,
  '[]'::jsonb,
  'published', 40
),
(
  'wishflow-ai',
  'WishFlow AI',
  'Agentic automation for reminders, personalised messages and calendar sync.',
  'An agentic AI workflow platform that automates reminders, personalised messages, calendar sync and push/email delivery.',
  'PLACEHOLDER: describe the problem WishFlow AI solves and who it is for.',
  E'- Engineered the **agentic AI workflow** automating reminders, personalised messages, calendar sync and push/email delivery.\n- **Dockerised** the full stack for reproducible development and production builds.',
  'PLACEHOLDER: add an architecture overview.',
  'PLACEHOLDER: describe the challenges you worked through.',
  'PLACEHOLDER: add results or outcomes.',
  array['Next.js', 'TypeScript', 'Docker', 'Agentic AI', 'Calendar API'],
  array['ai-ml', 'web'],
  false, false,
  null, null, null,
  null, null, null,
  '[]'::jsonb,
  'published', 50
),
(
  'wifi-robot-car',
  'Wi-Fi Controlled Robot Car',
  'Embedded robot car driven from a browser over Wi-Fi.',
  'A full-stack embedded system to control a robot car remotely via a web interface served by the microcontroller.',
  null,
  E'- Implemented the firmware on an **ESP8266** with an **L298N** motor driver for responsive motor control.\n- Designed the control UI in HTML, CSS and AJAX for real-time feedback.',
  E'- **Controller:** ESP8266 hosting a web interface on the local network.\n- **Drive:** L298N dual H-bridge motor driver.\n- **UI:** HTML/CSS page sending AJAX commands for real-time control.',
  null, null,
  array['ESP8266', 'L298N', 'C++', 'HTML/CSS', 'AJAX'],
  array['iot'],
  false, false,
  null, null, null,
  null, null, null,
  '[]'::jsonb,
  'published', 60
),
(
  'iot-smart-light',
  'IoT Smart Light Control',
  'Phone-controlled smart lighting with timers and colour control.',
  'A smart lighting system that lets users remotely switch lights, set timers and change colours from a smartphone app.',
  null,
  E'- Integrated an **Arduino Uno** with a Wi-Fi module for remote control.\n- Built remote on/off, timer settings and colour-changing features.',
  null, null, null,
  array['Arduino Uno', 'Wi-Fi Module', 'C++'],
  array['iot'],
  false, false,
  null, null, null,
  null, null, null,
  '[]'::jsonb,
  'published', 70
);

-- ---------------------------------------------------------------------------
-- Skills (grouped by area)
-- ---------------------------------------------------------------------------
insert into portfolio.skills (group_name, group_order, name, sort_order)
select g.group_name, g.group_order, s.name, s.ord
from (values
  ('Languages', 10, array['Python', 'TypeScript', 'JavaScript', 'C++', 'C', 'SQL', 'HTML/CSS']),
  ('Web, Mobile & Backend', 20, array['React Native', 'Next.js', 'Node.js', 'Express', 'REST APIs', 'Supabase / PostgreSQL', 'Firebase', 'MongoDB']),
  ('DevOps & Tools', 30, array['Docker', 'CI/CD', 'Git / GitHub', 'Linux', 'Gradle', 'Android SDK/NDK']),
  ('AI/ML & Security', 40, array['Agentic AI', 'Prompt Engineering', 'Whisper / Vosk', 'Model Quantisation', 'Sensor Fusion', 'RBAC', 'ECDH', 'Algorand']),
  ('Embedded & IoT', 50, array['Arduino', 'ESP8266', 'Nordic nRF52', 'BLE 5.0', 'Wi-Fi', 'UART / SPI / I2C', 'GPIO / PWM'])
) as g(group_name, group_order, names)
cross join lateral unnest(g.names) with ordinality as s(name, ord);

-- ---------------------------------------------------------------------------
-- Experience & education
-- ---------------------------------------------------------------------------
insert into portfolio.experiences (kind, role, organization, location, start_date, end_date, highlights, sort_order) values
(
  'work', 'Summer Research Intern — GyanSetu Internship Program',
  'Indian Institute of Technology (IIT) Mandi', 'Mandi, Himachal Pradesh',
  '2026-07-01', '2026-08-31',
  array[
    'Selected for IIT Mandi''s GyanSetu summer program; contributed to ongoing faculty-guided research activities.',
    'PLACEHOLDER: add your research topic, tools and outcome.'
  ], 10
),
(
  'work', 'STIC & Development Intern',
  'SJB Institute of Technology', 'Bangalore, Karnataka',
  '2023-11-01', null,
  array[
    'Deployed an IoT sensor monitoring system with real-time dashboard alerts, cutting estimated operational waste by 20%.',
    'Researched autonomous drone navigation (GPS waypoint tracking, PID flight control, telemetry limits) and presented findings to a faculty review panel.',
    'Worked across 3 engineering teams in sprint cycles on hardware–software integration; coordinated 5+ technical events for the Institution''s Innovation Council (IIC).'
  ], 20
),
(
  'leadership', 'Member',
  'Google Developer Student Clubs (GDSC), SJBIT', 'Bangalore, Karnataka',
  '2023-11-01', '2024-12-31',
  array['Contributed to 4+ agile project cycles.'], 30
),
(
  'education', 'B.Tech in Computer Science and Engineering (Data Science) — CGPA 9.1/10',
  'SJB Institute of Technology', 'Bangalore, Karnataka',
  '2023-11-01', '2027-08-31',
  array['Coursework: Data Structures & Algorithms, Operating Systems, Computer Networks, Machine Learning, Embedded Systems, DSP.'], 40
);

-- ---------------------------------------------------------------------------
-- Achievements
-- ---------------------------------------------------------------------------
insert into portfolio.achievements (title, event, description, date, date_precision, kind, project_slug) values
('2nd Place', 'National-Level Project Expo', 'HearMe, an AI-powered women''s safety ecosystem.', '2026-01-01', 'year', 'award', 'hearme'),
('National Finalist', 'Smart India Hackathon (SIH) 2025', 'Secure rural banking communication framework.', '2025-11-01', 'month', 'hackathon', 'secure-rural-banking'),
('2nd Place, Ideathon', 'TECHNOTSAV 2025', 'Zentix — "When Mind Whispers, We Listen", an AI-driven mental-health intervention platform.', '2025-05-01', 'month', 'hackathon', null),
('3rd Place', 'InnovonX Hackathon', 'Real-time AI diagnostic classification model for medical assistance.', '2025-04-01', 'month', 'hackathon', null);

-- ---------------------------------------------------------------------------
-- Notes: one unpublished draft so the admin editor has an example.
-- Nothing is published until Deb writes it.
-- ---------------------------------------------------------------------------
insert into portfolio.blog_posts (slug, title, excerpt, content, tags, published) values
(
  'draft-first-note',
  'PLACEHOLDER: your first note',
  'PLACEHOLDER: one-sentence summary.',
  E'PLACEHOLDER: write your first note here in Markdown — for example, how you designed RLS for HearMe''s evidence locker.\n\nThis draft is not published.',
  array['draft'],
  false
);
