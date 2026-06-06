# MeyVeda UI/UX System: Brand & Product Concept
*“India’s First AYUSH Digital Health Platform — Reinvent You”*

---

## 1. Product Definition

### What MeyVeda Is
MeyVeda is a premium, category-defining digital health operating system (OS) and full-stack telemedicine/SaaS ecosystem dedicated to India’s traditional systems of medicine: the **AYUSH** disciplines (Ayurveda, Yoga, Naturopathy, Unani, Siddha, and Homeopathy), with built-in ecosystem recognition of Sowa-Rigpa. It acts as the bridge connecting ancient wellness frameworks with modern, clinical, digital-first healthcare infrastructure.

Rather than a simple listing or booking directory, MeyVeda provides a unified platform comprising:
1. **B2C Consumer Wellness App & Care Portal** for patient consultations, prescription delivery, symptom-led discovery, and daily health tracking.
2. **Practitioner Console (MeyVeda Pro)**, an EMR-integrated virtual clinic workspace for individual doctors.
3. **Clinic/Hospital SaaS Dashboard (MeyVeda Enterprise)**, an operational and administrative dashboard for multi-practitioner clinics, hospitals, and wellness resorts.
4. **AyurSanvaad AI**, a secure, multilingual conversational assistant that supports symptom-led discovery, care path navigation, triage, and patient follow-up adherence.
5. **ABDM Integration Gateway**, aligning traditional care with India's national digital health infrastructure (ABHA, HPR, HFR, PHR consent models).

```
   ┌─────────────────────────────────────────────────────────────┐
   │                       MeyVeda App / UI                      │
   └──────────────────────────────┬──────────────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Patient App   │      │ Practitioner OS │      │   Clinic SaaS   │
│   (B2C Portal)  │      │ (MeyVeda Pro)   │      │  (Enterprise)   │
└────────┬────────┘      └────────┬────────┘      └────────┬────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                                  ▼
┌───────────────────────────────────────────────────────────────────┐
│                         Core Service Layer                        │
├─────────────────┬──────────────────────┬──────────────────────────┤
│ AyurSanvaad AI  │ EMR & Health Records │ Commerce & Fulfillment   │
│ Engine (NLP)    │ (FHIR Interoperable) │ (Partner Pharmacies)     │
└────────┬────────┴───────────────┬──────┴─────────────────┬────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  ABDM Gateway   │      │ Consent Manager │      │ HPR/HFR Trust   │
│ (ABHA Onboard)  │      │   (PHR Flow)    │      │ (Verification)  │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Who It Serves
*   **Patients:** Health-conscious individuals seeking personalized, holistic care paths; chronic-illness patients seeking long-term root-cause treatment; and families managing multi-generational wellness.
*   **Practitioners:** Certified AYUSH doctors, yoga therapists, and traditional practitioners seeking EMR efficiency, digital prescription builders, and clinical credibility.
*   **Clinics & Hospitals:** Dedicated AYUSH clinics, integrated multi-specialty hospitals, and wellness sanctuaries requiring front-office automation, multi-practitioner scheduling, and ABDM compliance.
*   **Ecosystem Partners:** Certified traditional pharmacies, formulation manufacturers, and diagnostic centers seeking structured, prescription-linked digital order flows.

### Core Problems Solved
1. **Fragmentation of AYUSH Ecosystem:** Currently, traditional medicine in India operates in silos. Patients find it difficult to search, consult, and manage records across multiple disciplines under one ecosystem.
2. **Trust & Verification Deficit:** The proliferation of unverified practitioners, unstandardized remedies, and pseudo-scientific claims has diluted the medical credibility of AYUSH. MeyVeda solves this via strict HPR/HFR-aligned credentials.
3. **Lack of Structured Wellness Data:** Traditional medicine relies on longitudinal tracking (e.g., *Prakriti* or body-type cycles, seasonal diet changes, long-term therapeutic responses). There are no unified EMR solutions customized to capture AYUSH clinical metrics.
4. **Administrative & Interoperability Barriers:** AYUSH clinics are mostly offline and unable to interact with modern healthcare layers. MeyVeda offers an ABDM-native architecture, making traditional records accessible on India's national health data exchange system.

### Market Gap & Why Now?
*   **ABDM Deployment Phase:** The National Health Authority (NHA) is pushing ABDM compliance across India. Clinic systems that don't digitize will be excluded from public-sector healthcare benefits and nationwide health record exchanges.
*   **The Post-Pandemic Preventive Shift:** Consumers are actively seeking natural immunomodulators, natural stress-relief mechanisms, and long-term metabolic correction.
*   **Intelligent AI Middleware:** Natural Language Processing (NLP) has advanced enough to build *AyurSanvaad AI*—a safe assistant capable of translating complex traditional terms (e.g., *Tridosha*, *Mizaj*, *Vata-Pitta*) into clear, action-oriented, clinically-validated health paths without making unverified medical diagnoses.

---

## 2. UX North Star

### Core Experience Vision
The experience of using MeyVeda must feel like walking into a modern, quiet, premium sanctuary. It stands in direct contrast to stressful, cluttered, transactional hospital booking apps or noisy, hyper-colored retail commerce pages.

```
       CALM LUXURY                 CLINICAL TRUST
   [Sandalwood & Ivory]   ◀─────▶   [Earthy Leaf Green]
            │                              │
            ▼                              ▼
  Subtle micro-animations,       ABHA verification badge,
  minimalist typography          structured FHIR metrics
```

### Emotional Outcomes
*   **Reassurance:** The patient feels that their treatment is grounded in medical science and recognized validation, not guesswork.
*   **Serenity:** The visual palette and transition timings reflect the therapeutic nature of the systems they are seeking.
*   **Empowerment:** Patients have control over their medical history, choosing when and with which practitioners to share their longitudinal health data.

### Trust Goals
*   **Clinical Integrity:** Zero room for unscientific jargon. Every doctor card shows their HPR (Healthcare Professionals Registry) verification state.
*   **Data Autonomy:** Absolute clarity regarding privacy. The system never shares records without explicit, time-bound consent.
*   **AI Guardrails:** The interface makes it immediately clear when a user is speaking with *AyurSanvaad AI* versus a certified human practitioner, incorporating explicit clinical disclaimers.

### Usability Priorities
*   **Low Cognitive Friction:** Booking, onboarding, and record uploads require minimal text inputs, using instead clear selections and progressive disclosures.
*   **Multi-Generational & Vernacular Ease:** Large, readable tap targets, high text contrast, and voice-assisted pathways tailored for older users who are frequent seekers of traditional remedies.

### Product Personality
*   **Rooted:** Proud of its heritage; references botanical and mineral concepts elegantly.
*   **Intelligent:** Highly structured, clinical, and data-driven.
*   **Restrained:** Calm layouts, generous whitespace, no aggressive upsells, and no distracting notifications.

---

## 3. User Roles & Permissions

| Role | Core Goals | System Access / Permissions | Key Workflows |
| :--- | :--- | :--- | :--- |
| **Patient** | Discover doctors, consult online, track vitals, manage health history, buy prescribed medicines. | View profiles, search directory, book appointments, view own health records (PHR), buy products, access AyurSanvaad AI. | ABDM registration, telemedicine consultation, prescription ordering, vitals logging. |
| **Family Manager** | Manage health records, appointments, and care paths for children or elderly parents. | Inherits Patient permissions for linked sub-profiles under a unified account. | Booking pediatric ayurvedic massage, ordering elder care unani supplements. |
| **Practitioner (Doctor)** | Conduct consultations, write digital prescriptions, track patient timelines, coordinate care. | Read access to shared patient records (consent-based), write access to EMR & Prescriptions, manage own slots. | Entering SOAP-style wellness notes, constructing herbal prescriptions, managing consultation queues. |
| **Clinic Front-Desk** | Handle walk-ins, schedule appointments, handle billings, coordinate queues. | Full scheduling calendar access, patient registration, basic profile edits, billing interface. | Patient check-in, billing generation, rescheduling slots, managing physical waitlist. |
| **Clinic Admin** | Optimize operations, manage staff, analyze revenue, ensure regulatory compliance. | Full system setup for the clinic branch, staff directory, billing controls, analytics dashboards. | Adding/removing practitioners, setting commission splits, reviewing facility registration (HFR). |
| **Fulfillment Partner** | Route, prepare, and deliver traditional medicine formulations. | View validated digital prescriptions, dispatch systems, delivery trackers. | Confirming stock of custom formulations, updating logistics tracking numbers. |
| **Super Admin** | Platform maintenance, fraud prevention, global directory curation. | God-eye view across all clinics, global provider verification system, system logs. | Auditing disputed reviews, onboard corporate insurance partners, monitoring server performance. |

---

## 4. Information Architecture

```
                                  MeyVeda Platform IA
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
    Patient App                     Practitioner Console               Clinic Dashboard
         │                                 │                                 │
  ┌──────┴──────┬──────────┐        ┌──────┴──────┬──────────┐        ┌──────┴──────┬──────────┐
  ▼             ▼          ▼        ▼             ▼          ▼        ▼             ▼          ▼
Home          Care      Records   Queue        Calendar    Records  Analytics    Staff      Billing
- Dinacharya  - Search  - Timeline- Video Call - Slots     - EMR    - Revenue    - Doctors  - Ledger
- AI Chat     - Book    - ABHA    - Notes      - Blockouts - History- Operations - Shifts   - Invoices
```

### Patient App Navigation
1.  **Home Dashboard:** Daily Dinacharya tracker, active prescriptions, quick links to disciplines, and AyurSanvaad AI chat access.
2.  **Care (Discovery & Booking):** Cross-discipline directory, symptom search, clinic listings, and appointment scheduling.
3.  **Wellness Timeline (Records):** Unified clinical records, linked ABHA profile, health trackers (sleep, digestion, stress, energy), and consent management interface.
4.  **Apothecary (Commerce):** Prescription uploads, order tracking, chronic refills, and vetted wellness essentials.
5.  **Profile & Family:** Personal settings, family account manager, linked insurance, language selection, and support.

### Practitioner Console (MeyVeda Pro) Navigation
1.  **Active Queue (Dashboard):** Active/upcoming consultation tracker, check-in statuses, video room entryway, and daily schedule summary.
2.  **Calendar System:** Detailed slot configuration, offline vs. online time allocations, holiday/leaves management, and sync with external calendars.
3.  **EMR Vault:** Deep-dive into patient medical history, previous templates, baseline diagnostic metrics, and laboratory reports.
4.  **Analytics Center:** Patient retention metrics, consultation volumes, monthly earnings split, and peak booking timings.
5.  **Profile & Verification Status:** HPR integration, certification documents, digital signature uploads, and consultation pricing controls.

### Clinic Dashboard Navigation
1.  **Operational Command Center:** Front-desk workflow, physical check-ins, multi-doctor queue tracking, and real-time room occupancy.
2.  **Practitioner Registry:** Managing on-duty doctors, schedules, shift assignments, and branch locations.
3.  **Billing & Claims Portal:** Integrated checkout, corporate tie-up claims, insurance verification, and tax ledger management.
4.  **Business Analytics:** Patient lifetime value, return rates, average consultation times, top-performing AYUSH disciplines, and pharmacy conversion data.

---

## 5. Sitemap & Product Modules

```
                                      MeyVeda Sitemap
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         ▼                                   ▼                                   ▼
   [Onboarding]                       [Patient Portal]                  [Practitioner Hub]
   ├─ Splash / Concept                 ├─ Home / Tracker                 ├─ Queue / EMR Note
   ├─ Phone OTP Auth                   ├─ Search Directory               ├─ Video Consultation
   └─ ABHA Link / Consent              ├─ Telehealth Video               └─ Clinic Operations
                                       ├─ Longitudinal Timeline
                                       ├─ AyurSanvaad AI Chat
                                       └─ Checkout & Cart
```

### Onboarding & Security
*   `Splash/Welcome` Screen (Brand story + "Reinvent You" visual manifesto)
*   `Phone OTP Authentication` (India-native simple authentication)
*   `Identity Setup` (Create new account or link existing ABHA ID using ABDM workflow)
*   `Profile Setup` (Basic details, age, location, baseline wellness concerns, and default language)

### Patient App Modules
*   `Home Dashboard`
    *   Daily wellness focus card
    *   Dynamic Dinacharya (routine tracking widget)
    *   Up next (upcoming consultations, upcoming medicine dosages)
    *   AyurSanvaad AI quick action bubble
*   `Discipline & Provider Directory`
    *   6 AYUSH filter buttons (with subtle iconography indicating botanical, anatomical, or holistic styles)
    *   Symptom/Disorder selection panel
    *   Search results page (list layout with HPR verification badges and reviews)
    *   Doctor Details page (educational qualifications, specializations, consultation cost, and calendar availability)
*   `Booking & Payment Engine`
    *   Appointment Mode selector (Video consultation vs. In-Clinic visit)
    *   Date & Time slots picker
    *   Patient intake form (reason for visit, document uploader)
    *   Payment gateway integrations (UPI, Cards, Net Banking)
    *   Booking confirmation page
*   `Telehealth & EMR`
    *   Secure Telehealth Waiting Room (pre-call guidelines, connectivity check)
    *   Active Consultation Room (split-screen: video feed and patient-provided intake data)
    *   Digital Prescription & Treatment summary sheet
    *   Longitudinal EMR Timeline (categorized filter tabs: "All", "Prescriptions", "Lab Reports", "AI Trackers")
*   `Apothecary & Fulfillment`
    *   Upload Prescription screen
    *   Medicine Shop home (categorized by doctor prescription or general wellness supplements)
    *   Shopping Cart & Address selector
    *   Order Tracking page

### Practitioner App Modules
*   `Patient Queue Management` (Live dashboard showing check-ins, delayed starts, and session durations)
*   `EMR Entry System` (Ayush-customized SOAP notes structure containing specific inputs for Prakriti/Mizaj, pulse diagnosis, herbal formulations)
*   `Scheduling Panel` (Dynamic slot blocker)

### Clinic Admin Modules
*   `Front-desk Check-in Dashboard` (Walk-in booking flow, print receipt setup)
*   `Enterprise Analytics Dashboard` (Consolidated operational reports)

---

## 6. End-to-End User Journeys

### Journey 1: New Patient Onboarding & ABHA Linking
```
User lands on splash ──► Enters phone number ──► OTP verification ──► Link ABHA ID option ──► NHA Gateway Consent ──► Profile Created
```
*   **Step 1:** Patient downloads the app, opens the splash screen, and enters their mobile number.
*   **Step 2:** OTP is received and verified automatically.
*   **Step 3:** The screen displays a choice: *"Link your existing Government ABHA ID"* or *"Create a new ABHA ID with MeyVeda"*.
*   **Step 4:** Patient inputs their Aadhaar card number. The app sends an Aadhaar-OTP.
*   **Step 5:** Aadhaar-OTP is entered; the system retrieves demographic details and populates the profile.
*   **Step 6:** Consent statement: *"Allow MeyVeda to fetch historical medical data linked to this ABHA."* Patient clicks *"Accept."*
*   **Trust Point:** Security compliance badges, privacy guarantees (ISO 27001, HIPPA, ABDM-compliance indicators) are shown at every screen level.

### Journey 2: Multi-Specialty Booking (Ayurveda + Yoga Therapy Follow-up)
*   **Step 1:** User searches "chronic lower back pain" in the search box.
*   **Step 2:** The engine recommends: *"Ayurveda (for inflammation management) and Yoga (for spine strengthening)."*
*   **Step 3:** User selects Ayurveda. Filters by Location: "Indiranagar, Bangalore" and Availability: "Today".
*   **Step 4:** Selects a verified Ayurvedic Doctor (HPR badge visible). Selects a 4:30 PM slot.
*   **Step 5:** During checkout, the app prompts: *"Add a certified Yoga Therapist follow-up session for rehabilitation?"*
*   **Step 6:** User checks the bundle box, pays via UPI, and receives two linked appointments.

### Journey 3: Video Teleconsultation & Care Summary Delivery
*   **Step 1:** 10 minutes prior, the patient receives a notification: *"Dr. Shastri is ready. Check your connection."*
*   **Step 2:** Patient enters the waiting room and passes a network check.
*   **Step 3:** Call starts. The system provides a minimized EMR view on the doctor’s screen while keeping the patient feed visible.
*   **Step 4:** Call completes. The doctor builds the digital prescription using pre-configured AYUSH templates.
*   **Step 5:** Within 5 minutes, the patient receives a notification: *"Your personalized care summary and botanical prescription are ready."*
*   **Step 6:** The EMR screen lists the medicines, dosage patterns (e.g., *Anupana* - vehicle for medicine consumption like honey/warm water), and lifestyle recommendations.

### Journey 4: Prescription-to-Delivery Fulfillment
*   **Step 1:** In the Prescription Detail screen, the user clicks the prominent button: *"Deliver Prescribed Medicines."*
*   **Step 2:** The system automatically checks stock across partner AYUSH pharmacies near the user's PIN code.
*   **Step 3:** Order summary lists: *"Vati (Tablets) - 2 units, Taila (Oil) - 1 unit, Churna (Powder) - 1 unit."*
*   **Step 4:** User confirms delivery address, applies insurance code if applicable, and pays.
*   **Step 5:** The delivery partner receives the digital prescription copy, packages the authentic formulation, and ships it via express delivery.

### Journey 5: AyurSanvaad AI-Guided Wellness Routine (Dinacharya)
*   **Step 1:** Patient registers a daily health goal: *"Improve gut health."*
*   **Step 2:** AyurSanvaad AI generates a customized morning-to-evening *Dinacharya* (lifestyle routine) based on their body constitution.
*   **Step 3:** At 7:00 AM, a gentle prompt: *"Time for warm water with lemon. Log your digestion status afterward."*
*   **Step 4:** User logs: *"Bloated."*
*   **Step 5:** The AI logs this trend, provides dietary advice for lunch, and updates the tracker. If bloating persists for 3 consecutive days, it prompts: *"Would you like me to book a quick check-in with an Ayurveda practitioner?"*

---

## 7. MVP Definition

```
┌────────────────────────────────────────────────────────────────────────┐
│                              Phase 1 MVP                               │
├────────────────────────────────────────────────────────────────────────┤
│ • ABHA Sign-up / OTP Authentication                                    │
│ • Unified Directory Search across 6 AYUSH disciplines                 │
│ • Smart Video & In-Clinic Appointment Booking                          │
│ • EMR & Digital Prescriptions (with basic AYUSH templates)             │
│ • Basic AyurSanvaad AI (Triage, FAQ, Routine creation)                 │
│ • Localized payment options (UPI, Net Banking)                         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                             Phase 2 Growth                             │
├────────────────────────────────────────────────────────────────────────┤
│ • Longitudinal Health Timeline & Wearable Integrations                 │
│ • Custom AYUSH SOAP Clinical Notes builder                             │
│ • Advanced AyurSanvaad AI (Triage ──► Doctor Handoff loop)             │
│ • Dynamic Prescription-Linked Pharmacy Fulfilment                      │
│ • Clinic Front-desk billing & Queue optimization                      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Phase 3 Ecosystem & SaaS                         │
├────────────────────────────────────────────────────────────────────────┤
│ • Insurance & Corporate Wellness integrations                          │
│ • Advanced HFR-linked Facility Mapping & Patient Retention SaaS       │
│ • Multilingual Voice-to-EMR tools for Doctors                          │
│ • Global Ayurvedic Retreat / Wellness Destination bookings             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Screen Inventory (MVP)

| Screen Name | User Type | Purpose | Core Components | Primary CTA | Secondary CTA | Data Shown | Trust Indicators |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Welcome/Splash** | Patient | Introduce brand identity and core vision. | Background visual, branding mark, manifesto text loop. | Get Started | Log In | Tagline: "Reinvent You" | Sleek design, no clutter. |
| **OTP Auth** | All | Fast secure mobile signup. | Input field, keypad, resend OTP counter. | Verify OTP | Change Number | Mobile number | Secure lock icon. |
| **ABHA Link** | Patient | Onboard user to ABDM network. | Government registry banner, Aadhaar input, help prompt. | Link ABHA | Skip for now | Linked demographic data | NHA & ABDM logo marks. |
| **Patient Home** | Patient | Hub for user activity and daily wellness. | Dynamic timeline, Dinacharya card, quick consult, AI bubble. | Search Doctor | Log Vitals | Today's routines, medicine timeline | ABHA link status check. |
| **Provider Directory** | Patient | Find practitioners across AYUSH disciplines. | 6 discipline icons, search bar, filters, doctor list. | Book Appointment | View Profile | Specialist availability, fee, rating | HPR verified badges. |
| **Doctor Profile** | Patient | Detailed credentials and pricing. | Hero image, biography, certifications list, reviews, calendar. | Select Slot | Ask AI about Specialist | Education, consultation fees, clinic locations | HPR verification license. |
| **Telehealth Room** | Patient/Doc | Conduct video consult. | Video window, chat panel, shared documents tab. | End Call | Mute/Camera toggle | Network latency, duration | Encryption badge. |
| **Practitioner Queue** | Doctor | Manage clinic workflow. | Active queue lists, timeline, quick EMR access. | Start Call | Edit Schedule | Patient details, wait times | Clear operational states. |

---

## 9. Wireframe-Level Page Descriptions

### A. Patient Home Screen Layout
```
+--------------------------------------------------------+
| [Profile Icon]     M E Y V E D A       [Notifications] |
+--------------------------------------------------------+
| Welcome, Rohit                                         |
| ABHA ID: rohit@abha  [Verified Govt Badge]             |
+--------------------------------------------------------+
| DAILY WELLNESS: DINACHARYA                             |
| [ ] 07:00 AM : Warm Water with Herbal Infusion         |
| [ ] 08:30 AM : 15 mins Pranayama Session               |
| [ ] 01:00 PM : Satvik Lunch                            |
+--------------------------------------------------------+
| CONSULT A SPECIALIST                                   |
| [ Ayurveda ]  [ Yoga ]  [ Naturopathy ]  [ View All ]  |
+--------------------------------------------------------+
| AYURSANVAAD AI                                         |
| "How can I help you balance your routine today?"       |
| [Ask about Indigestion]  [Ask about Sleep Guidelines]  |
+--------------------------------------------------------+
| UPCOMING APPOINTMENTS                                  |
| Dr. Aditi Shastri | Ayurveda | Today, 4:30 PM          |
| [ Join Video Room ]                                    |
+--------------------------------------------------------+
| [Home]    [Consult]    [Records]    [Apothecary]       |
+--------------------------------------------------------+
```

### B. Doctor Consultation Console (MeyVeda Pro) Layout
```
+--------------------------------------------------------+
| [Logo]  MeyVeda Pro Dashboard        Dr. Aditi Shastri |
+--------------------------------------------------------+
| PATIENT QUEUE (TODAY)                                  |
| 1. Rohit Kumar - 04:30 PM (Telehealth) - [Start Call]  |
| 2. Meera Patel - 05:00 PM (In-Clinic)  - [Check In]   |
+--------------------------------------------------------+
| CLINICAL EMR WORKSPACE (Rohit Kumar)                   |
| +-------------------------+ +------------------------+ |
| | PATIENT HISTORICAL INFO | | SOAP / EMR CLINICAL NOTE| |
| | ABHA Linked: Verified   | | Vitals: BP 120/80      | |
| | Prakriti: Vata-Pitta    | | Prakriti Findings:     | |
| | Complaints: Acid Reflux | | [Vata imbalance    v]  | |
| | Previous Rx: Triphala   | | Rx Formulation:        | |
| |                         | | [Add Herb/Medicine +]  | |
| +-------------------------+ +------------------------+ |
+--------------------------------------------------------+
| [ Save EMR & Generate Digital Prescription ]           |
+--------------------------------------------------------+
```

---

## 10. UX Flows

### Flow 1: Signup & ABDM Registration (ABHA Verification)
1. **Trigger:** User opens app for the first time.
2. **Action 1:** Screen asks for Mobile Number. User inputs number, hits *"Send OTP."*
3. **Action 2:** User inputs 6-digit OTP. Verified.
4. **Action 3:** User is presented with a screen: *"We are ABDM compliant. Linking your ABHA ID unlocks a unified longitudinal health history across India."*
5. **Action 4:** User inputs Aadhaar card number. System displays Aadhaar verification terms. User ticks *"Accept"* and clicks *"Verify Aadhaar."*
6. **Action 5:** Aadhaar-OTP arrives. User inputs code.
7. **Action 6:** System displays retrieved demographic data (Name, Gender, Photo, DOB) and auto-creates/links `username@abha`.
8. **Action 7:** Success screen shows a clean card representation of their ABHA, ready to be presented at any Indian hospital.

```
+---------------+     +---------------+     +---------------+
| Enter Mobile  | ──► |  Verify OTP   | ──► | Aadhaar Input |
+---------------+     +---------------+     +---------------+
                                                    │
                                                    ▼
+---------------+     +---------------+     +---------------+
| Success State | ◄── |  Consent View | ◄── | Aadhaar OTP   |
+---------------+     +---------------+     +---------------+
```

### Flow 2: Smart Appointment Booking
1. **Trigger:** Patient hits *"Consult"* in bottom navigation.
2. **Action 1:** Search screen displays search bar and 6 AYUSH buttons. User taps *"AyurVeda."*
3. **Action 2:** System shows local and video-available doctors. User clicks filters: *"Video Consult"* and *"Language: Hindi."*
4. **Action 3:** User selects a practitioner and opens their Profile.
5. **Action 4:** User reviews credentials and clicks *"Book Slot."*
6. **Action 5:** Screen presents a calendar. User taps date, then selects a time slot.
7. **Action 6:** User inputs reason for consult (e.g., *"Insomnia and fatigue"*) and uploads old prescription photos if any.
8. **Action 7:** UPI payment window opens. Payment confirmed.
9. **Action 8:** Booking confirmation screen shows dynamic timer counting down to appointment start, along with pre-consult guidelines (e.g., *"Do not eat a heavy meal 2 hours prior to the pulse check"*).

---

## 11. Design System Direction

### Visual Tone
*   **Modern Botanical:** Merging clean, sterile clinical surfaces with natural textures and colors.
*   **Warm Luxury:** Using sand, warm ivory, and subtle copper accents to mimic premium Ayurvedic wellness sanctuaries rather than cold, corporate hospital corridors.
*   **Structured Precision:** Fine lines, clear alignments, and minimal distraction.

### Colors & Palette
```
Ivory Base (Sand/Warm Ivory) : #FAF8F5  - Main app backgrounds
Herbal Green (Primary)        : #1B4D3E  - Primary buttons, active tabs, highlights
Sage Neutral (Secondary)      : #4A6B5D  - Text subheaders, icons, secondary labels
Sandalwood/Copper (Accent)    : #C88E72  - Notifications, highlights, active states
Clinical Neutral (Background) : #FFFFFF  - Cards, modal backgrounds
Clinical Dark (Text)          : #1F2E28  - Typography main color
```

*   **Color Ratio Rule:** 60% Ivory Base, 30% Sage/Clinical Neutral, 10% Herbal Green & Copper Accent.
*   **Status Color Rules:** Alert (Warm Sandalwood instead of bright red), Success (Muted herbal green), Warning (Soft mustard gold). Avoid neon elements completely.

### Typography
*   **Primary Display/Headers:** *Playfair Display* or *Outfit* (Provides a premium, organic, yet clean appearance for display headers).
*   **Body Copy & Labels:** *Plus Jakarta Sans* or *Inter* (Optimized for micro-readability, high compliance with screen readers).
*   **Type Hierarchy Scale:**
    *   H1: 32px (Bold, Tracking -1%)
    *   H2: 24px (Semi-Bold)
    *   H3: 20px (Medium)
    *   Body: 16px (Regular, Line Height 150%)
    *   Caption: 12px (Medium, Tracking +2%)

### Iconography & Shape Language
*   **Style:** Minimal, thin-stroke line icons with organic curve variants.
*   **Borders:** Soft, rounded corners on card layouts (`border-radius: 16px`).
*   **Elevations:** Avoid heavy drop shadows. Use 1px borders of `#E6E1DA` or soft, diffused shadows: `box-shadow: 0 4px 20px rgba(42, 60, 52, 0.04)`.

---

## 12. Component System

### Reusable UI Elements

#### 1. Practitioner Trust Card (B2C facing)
*   **Description:** Container exhibiting doctor photo, specialties, experience, price, rating, and HPR certification tag.
*   **Variants:** List Card (horizontal) and Search View Card (vertical grid).
*   **States:** Default, Hover, Focused, Skeleton Loading state.
*   **Mobile consideration:** Touch target must be at least 48px height. HPR badge has a tool-tip trigger explaining what verified practitioners are.

#### 2. Dinacharya Daily Habit Tracker
*   **Description:** Checklist interface tracking daily traditional routines.
*   **Variants:** Compact Homepage Widget and Expanded Detailed Log Page.
*   **States:** Completed (strike-through text, light green container background), Active (bold, copper outline), Lock/Pending.

#### 3. Consent Management Module (ABDM Compliant)
*   **Description:** Permission widget asking for authorization to share records.
*   **Components:** Provider name, period of access selector (e.g., *"1 Day"*, *"1 Month"*, *"Always"*), data type checkboxes (Discharge summaries, Prescriptions, Lab Reports).
*   **CTAs:** Prominent green *"Grant Access"*, muted Sandalwood *"Deny"*.

---

## 13. Data & Content Design

### Voice Guidelines
*   **Clinically Calm:** Professional but warm. We don't speak like a clinical factory, nor do we sound mystical or spiritual.
*   **Plain English + Transliteration Support:** Use common names for wellness concepts, but always keep standard translations close (e.g., *"Ashwagandha (Indian Ginseng)"* or *"Vata (Air-ether system)"*).
*   **Responsible AI Communication:** The AI assistant must always introduce itself as an assistant: *"I am AyurSanvaad AI, your wellness companion. I can help configure your lifestyle routine, but I cannot replace a clinical diagnosis."*

### Microcopy Examples

| Scenario | Incorrect (Generic / Cliché) | Correct (MeyVeda Style) |
| :--- | :--- | :--- |
| **Error Screen** | "Oops! System crashed. Try again!" | "We encountered a brief interruption while retrieving your health records. Let’s try that again." |
| **Empty State Tracker** | "No data found. Start tracking!" | "Your daily wellness journey begins here. Tap below to log your morning routine." |
| **Doctor HPR Verification** | "100% Legit Ayurvedic Doc" | "HPR Verified: Authenticated under India's National Health Professional Registry." |
| **Consent Request** | "Give us access to your medical history." | "Grant temporary consent to share your historical prescriptions for clinical accuracy." |

---

## 14. Trust, Compliance, & Safety UX

### Consent-Led Architecture
MeyVeda is designed with zero-trust health data access patterns. 

```
                                  CONSENT WORKFLOW
   ┌──────────────────────────────────────────────────────────────────────┐
   │                                                                      │
   │   [ Grant Health Record Access ]                                     │
   │                                                                      │
   │   Dr. Aditi Shastri requests access to your historical records.      │
   │                                                                      │
   │   Share access for:                                                  │
   │   (•) Consultation Duration (2 hours)                                │
   │   ( ) 3 Days                                                         │
   │   ( ) 1 Year                                                         │
   │                                                                      │
   │   Data to share:                                                     │
   │   [x] Prescriptions  [x] Diagnostic Reports  [ ] Daily Trackers      │
   │                                                                      │
   │   [ Approve Consent ]                  [ Reject ]                    │
   │                                                                      │
   └──────────────────────────────────────────────────────────────────────┘
```

### Safety Features
*   **Emergency Escalation Interface:** Every medical page includes a subtle but accessible header button: *"Emergency Care Needed?"* Clicking it immediately shows a message: *"AYUSH systems are best suited for chronic care and preventive medicine. For acute medical emergencies, please dial 102 or proceed to the nearest emergency hospital."*
*   **Verification Indicators:** Standardized icons indicating credentials checked against official government registries (HPR, HFR).

---

## 15. Accessibility & India UX Considerations

*   **Multilingual Design:** The patient interface is built with simple layout scaling to support Hindi, Tamil, Telugu, Malayalam, Kannada, Marathi, and Bengali alongside English. Text labels avoid fixed-width layouts to prevent overflow when translated.
*   **Low Bandwidth Fallback:** Telemedicine room dynamically degrades video quality to maintain clear audio channels over 3G/unstable 4G networks. If video drops entirely, a single-click *"Switch to Audio Call"* or *"Call via Phone Network"* option is shown.
*   **Vernacular Microcopy & Voice Assistance:** Users can press a microphone icon to speak their symptoms in their native tongue: *"Mere pet me dard hai (My stomach hurts),"* which *AyurSanvaad AI* processes to guide them to Unani, Ayurveda, or Homeopathy practitioners.
*   **UPI Native Frictionless Checkout:** Displaying direct scan-to-pay prompts and popular UPI application triggers (GPay, PhonePe, Paytm) directly inside the app view to avoid drop-offs during payment redirects.

---

## 16. Analytics & Business UX

The system tracks and visualizes critical metrics to improve clinical and operational performance:

### Patient Metrics
*   **Booking Funnel Drop-offs:** Measuring conversion from Category Selection ──► Doctor Profile ──► Slot Selector ──► Payment Complete.
*   **Dinacharya Adherence Score:** An index calculated based on daily logged habits, directly correlated with patient check-ins.
*   **Prescription Medicine Ordering Rate:** Tracking if patients purchase their prescribed formulations directly via the integrated Apothecary.

### Clinic & Practitioner Dashboards
*   **Consultation Cycle Efficiency:** Monitoring average waiting time in queue vs. actual consultation time.
*   **No-Show & Rescheduling Trends:** Tracking which specialties experience high cancellation rates.
*   **LTV & Retention Rates:** Visualizing patient return loops for chronic treatments (e.g., Naturopathy detox plans, Panchakarma packages).

---

## 17. Practitioner & Clinic SaaS Workflows

### SOAP Clinical Notes Customization
Traditional medical consultations require inputs distinct from conventional medicine. MeyVeda Pro customizes EMR input sheets:

```
                                  MeyVeda Pro SOAP Note
   ┌──────────────────────────────────────────────────────────────────────┐
   │                                                                      │
   │   Patient: Rohit Kumar                                               │
   │   [ Subjective ]   [ Objective ]   [ Assessment ]   [ Plan ]         │
   │                                                                      │
   │   AYUSH Diagnosis Metrics:                                           │
   │   - Prakriti (Constitution):   [ Vata-Pitta     v ]                  │
   │   - Nadi (Pulse Diagnosis):     [ Mandam (Slow)  v ]                  │
   │   - Jihva (Tongue State):      [ Sama (Coated)  v ]                  │
   │                                                                      │
   │   Prescribed Treatment:                                              │
   │   - Herbal Formulation:        [ Ashwagandha Arishta  v ]            │
   │   - Dosage Frequency:           [ 20 ml post lunch & dinner v ]       │
   │   - Vehicle (Anupana):          [ Warm Water          v ]            │
   │                                                                      │
   └──────────────────────────────────────────────────────────────────────┘
```

### Clinic Dashboard Check-In Flow
1. Receptionist views the dashboard showing all bookings for the day.
2. A walk-in patient arrives. Receptionist registers them via mobile number, retrieves their ABHA card details, and checks their booking.
3. Receptionist marks the patient as *"Checked-In"*. The status updates instantly on the practitioner's active queue screen.
4. If a doctor runs over their scheduled slot, the system automatically sends an SMS notification to subsequent patients: *"Dr. Shastri is currently running 10 minutes behind schedule. Make yourself comfortable."*

---

## 18. AI Assistant Experience: AyurSanvaad AI

### Core Logic & Triage Journey
*   **Step 1:** User initiates chat: *"I feel tired all the time and have poor digestion."*
*   **Step 2:** AyurSanvaad AI uses semantic search to categorize the symptoms. It responds: *"These signs can be related to a metabolic imbalance (often called Agnimandya in Ayurveda). Let's explore. Have you noticed bloating after meals?"*
*   **Step 3:** User responds: *"Yes, every evening."*
*   **Step 4:** AyurSanvaad AI suggests care pathways: *"Here is what you can do right now: 1. Introduce warm spices like ginger into your diet. 2. Track this for 3 days. However, to find the root cause, I recommend consulting a certified practitioner. Would you like me to find Ayurveda doctors specializing in digestion near you?"*
*   **Escalation Safety Trigger:** If the user types *"chest pain,"* the AI immediately returns the Emergency Card and locks text input, showing phone numbers for emergency services.

```
                  ┌───────────────────────────────┐
                  │      User Inputs Symptoms     │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                    Is it an acute emergency?
                     ├──► YES: Trigger Emergency Card & Lock Input
                     └──► NO: Proceed
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │    Suggest Care Pathways &    │
                  │   Lifestyle Routines (Info)   │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │ Prompt Booking Option for     │
                  │ HPR Verified Practitioner     │
                  └───────────────────────────────┘
```

---

## 19. Visual Concepts

### Direction A: Clinical Ayurveda Premium

```
    BACKGROUND             SURFACES            ACCENTS
[ Warm Ivory: #FAF8F5 ]  [ Sand: #E6DFD3 ]  [ Copper: #C88E72 ]
```

*   **Mood:** Grounded, luxury, professional, highly credible.
*   **Colors:** Sand, warm ivory, deep forest green, and rich copper accents.
*   **Typography:** *Playfair Display* for headers, *Plus Jakarta Sans* for clean data readouts.
*   **Surfaces:** Matte clay textures, fine hairline borders, clean cards with rounded edges.
*   **Imagery Style:** Minimalist, editorial shots of botanicals, herbs, and clean clinic spaces.
*   **Best fit for:** Urban professionals seeking high-end Ayurvedic treatments and preventive lifestyle changes.

### Direction B: Modern Botanical Health-Tech

```
    BACKGROUND             SURFACES            ACCENTS
 [ White: #FFFFFF ]      [ Mint: #F2F9F6 ]   [ Sage: #4A6B5D ]
```

*   **Mood:** Fresh, clean, energetic, digital-first.
*   **Colors:** Crisp white base, pale mint-green backgrounds, dark charcoal text, and sage highlights.
*   **Typography:** *Outfit* for headers, *Inter* for body copy.
*   **Surfaces:** Luminous card containers, glassmorphism overlays, soft transitions.
*   **Imagery Style:** Vibrant, clean vector graphics showing botanical components, line drawings of plants, modern clinical technology.
*   **Best fit for:** Tech-savvy young families looking for a digital-native platform to manage multi-discipline consultations.

### Direction C: Calm Heritage Minimal

```
    BACKGROUND             SURFACES            ACCENTS
[ Sandalwood: #F5EFEB ] [ Terracotta: #E8D3C5 ] [ Muted Gold: #D4AF37 ]
```

*   **Mood:** Quiet luxury, deeply traditional, premium, calming.
*   **Colors:** Warm sandalwood background, soft charcoal text, and muted gold highlights.
*   **Typography:** *Cormorant Garamond* for display text, *Roboto* for clear list views.
*   **Surfaces:** Low-contrast layers, large spacing, minimal lines, natural paper-like textures.
*   **Imagery Style:** Fine line illustrations, quiet black-and-white botanical close-ups.
*   **Best fit for:** Premium users, resort guests, and enterprise partners seeking elegant, clinical health management.

---

## 20. Final Delivery Format

### Recommended MVP UX Direction
For the initial product launch, MeyVeda will adopt **Direction A: Clinical Ayurveda Premium**. This direction establishes the required level of medical trust while feeling premium and uniquely Indian.

### Top 10 Screens to Design First
1.  **Patient App Home Screen:** Highlighting ABHA status and the daily Dinacharya habit dashboard.
2.  **Discipline Hub & Doctor Discovery Screen:** 6 key AYUSH filters and symptom-led search results list.
3.  **HPR Verified Doctor Profile Screen:** Detailing credentials, consultations cost, and booking calendar.
4.  **Booking Checkout & Payment Flow:** Core booking steps and integrated UPI payments.
5.  **Telehealth Video Consultation Room:** Layout showing video feeds and doctor info.
6.  **Integrated EMR Records & Health Timeline:** Showing historical data categorized by doctor notes and lab tests.
7.  **AyurSanvaad AI Chat Workspace:** Interface showcasing routine config, suggestions, and doctor booking triggers.
8.  **Digital EMR SOAP Note Builder (MeyVeda Pro):** Practitioner interface for compiling traditional symptoms and prescriptions.
9.  **Apothecary Commerce Store & Cart:** Direct purchase flows for prescription orders.
10. **Clinic Front-Desk Operations Board:** Front-desk booking tool for administrators.

### Top 10 Components to Build First
1.  **HPR Verification Badge:** Government compliance trust visual.
2.  **Dinacharya Checklist Row:** Clean habits list item.
3.  **Booking Slot Selector:** Date & time grid components.
4.  **Consent Verification Modal:** ABDM PHR sharing approvals layout.
5.  **AI Chat Bubble:** Distinct styles for user responses and AI suggestions.
6.  **Discipline Filter Pill:** Toggle components for the 6 AYUSH specialties.
7.  **Emergency Escalation Banner:** Clear notice for medical emergencies.
8.  **EMR Timeline Node:** Chronological progress marker.
9.  **Prescription Order Checkout Card:** Listing prescribed formulations.
10. **Video Signal Indicator:** Real-time feedback on telemedicine network status.

### Top 10 UX Risks to Solve Early

| Risk | Mitigation Strategy |
| :--- | :--- |
| **1. Digital Illiteracy in Older Patients** | Offer single-click voice inputs, clear fonts, and simple OTP logins. |
| **2. Medical Misdiagnosis by AI** | Apply strict guardrails to AyurSanvaad AI; include clear disclaimers and immediate doctor-booking pathways. |
| **3. ABDM Registration Drop-off** | Design the ABHA linking step as optional during onboarding, allowing users to register and link later. |
| **4. Low Video Connectivity in Rural Areas** | Build auto-degradation to audio-only calls and integrate direct phone call fallbacks. |
| **5. Low Prescriptions Conversion** | Showcase authentic certification details and delivery tracking directly in checkout screens. |
| **6. Clinician Resistance to EMR Data Entry** | Provide structured templates, shorthand inputs, and voice-to-text dictation models. |
| **7. Multi-Discipline Treatment Confusion** | Categorize multiple care paths clearly in the health timeline. |
| **8. Trust Deficit in Traditional Remedies** | Display doctor credentials verified against the government HPR. |
| **9. Hidden Consult Fees & Cart Expenses** | Keep all pricing completely transparent at checkout. |
| **10. Patient Health Plan Adherence Drop-off** | Gamify the Dinacharya daily streak tracker with rewards/refill discounts. |

### Suggested Next-Step Sequence
```
[1. Wireframes of Top 10 Screens] ──► [2. Interactive UI Prototype] ──► [3. Developer Hand-off]
                                                                                │
                                                                                ▼
[6. ABDM Sandbox Testing]        ◄── [5. Beta Release to Clinics]   ◄── [4. Core Coding Phase]
```

1. Create high-fidelity wireframes for the **Top 10 Screens** based on **Direction A: Clinical Ayurveda Premium**.
2. Assemble an interactive UI Prototype showing the onboarding, booking, and teleconsultation flows.
3. Hand over assets and design guidelines to the engineering team.
4. Build the core frontend and backend database structures.
5. Launch a private beta to selected AYUSH clinics and practitioners for operational feedback.
6. Run ABDM sandbox tests to verify compliance before deploying to the public app stores.
