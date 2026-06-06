# MeyVeda — Complete Product & UX Workflow Blueprint
**India's First AYUSH Digital Health Platform — Reinvent You.**
*Authored for product planning, wireframing, UI design, engineering handoff, and MVP prioritization.*

---

## 1. Workflow Philosophy

### Core Thesis
MeyVeda is not a booking app with a telemedicine feature bolted on. It is a **continuity-of-care operating system** for AYUSH practitioners and their patients. Every workflow must reflect that: the goal is not a completed transaction, it is a long-term, trusted care relationship.

### Five Pillars That Shape Every Workflow

**1. Trust Before Speed**
Every first interaction — onboarding, first booking, first consult, first prescription — must earn trust before asking the user to move fast. The platform should feel like it was designed by someone who understands healthcare anxiety. Verified badges, consent receipts, clear language, and predictable system states are non-negotiable.

**2. Consent as Experience, Not Infrastructure**
ABHA-linked identity and ABDM consent management must be visible, readable, and empowering — not buried in settings. Every time data is shared, the patient must see it, understand it, and feel in control of it. Consent screens are trust screens. They must be designed with the same care as the booking flow.

**3. Time Efficiency for Practitioners**
Doctors in India see 30–60 patients a day. Every extra click is friction that compounds into burnout. The EMR, note-taking, prescription workflow, and daily dashboard must be tuned for speed, muscle memory, and zero administrative overhead. AI assists, but the doctor confirms. Everything defaults to the most common choice.

**4. Continuity Over Conversion**
The system should always be oriented toward "what happens next in this patient's care" — not toward booking closure. Every session ends with a next step: follow-up scheduled, prescription issued, reminder set, record updated. A completed consult with no follow-up pathway is an incomplete workflow.

**5. India-First Behavioral Design**
- Family members book on behalf of others — multi-profile support is core, not optional.
- Low trust in new apps — credential verification must be prominent and readable.
- Mixed digital literacy — language choice, vernacular-ready microcopy, simple primary actions.
- Mobile as primary device — all critical workflows must complete on a 375px screen.
- UPI-first payments, with OTP and ABHA identity linked to Aadhaar.
- Teleconsult may fail due to connectivity — fallback to phone call must be a designed state, not an error.

### How ABHA and ABDM Shape Workflow Architecture
ABHA (Ayushman Bharat Health Account) is not just an ID field. It is the backbone of record portability, consent management, and cross-facility access. MeyVeda must treat it as:
- A **trust signal** during onboarding ("Your health records are secured by the Government of India")
- A **portability layer** during record sharing (consent grants go through ABDM HIU/HIP infrastructure)
- A **verification shortcut** (ABHA-linked patients have pre-verified demographics)
- A **fallback identifier** when records from other facilities need to be pulled

Every workflow that touches records, sharing, or identity must expose the ABHA layer clearly — not as a technical detail, but as a care continuity feature.

---

## 2. Actors and System Roles

### 2.1 Patient
**Primary Goal:** Receive high-quality AYUSH care with minimal friction, maintain long-term wellness, and manage their health records with full control.

**Key Actions:**
- Register and link ABHA ID
- Browse, compare, and book practitioners
- Join teleconsultations and in-clinic visits
- Access prescriptions and care plans
- Order medicines
- Track health habits and Dinacharya
- Grant, monitor, and revoke data consent
- Manage family health profiles

**Permissions:** Read/write own health records; grant consent to practitioners; order medicines; manage family profiles they created.

**Dependencies:** Practitioner for care delivery; pharmacy for fulfillment; AI for guidance; ABDM layer for identity and record portability.

---

### 2.2 Family Manager / Caregiver
**Primary Goal:** Book, manage, and track healthcare for one or more family members under a single account.

**Key Actions:**
- Create and switch between linked family profiles
- Book appointments on behalf of family members
- View and share family member records (with explicit consent)
- Receive health reminders for dependents
- Manage medicines for the household

**Permissions:** Dependent on relationship type — full access for minors, consent-governed access for adults. Caregivers for elderly patients have elevated access with one-time consent approval.

**Dependencies:** Patient consent layer; practitioner for care delivery.

---

### 2.3 Doctor / AYUSH Practitioner
**Primary Goal:** Deliver structured, efficient, compliant AYUSH care to a panel of patients, with minimum administrative overhead and maximum clinical visibility.

**Key Actions:**
- Configure availability and consultation types
- Review patient intake before sessions
- Conduct teleconsultations and in-clinic visits
- Write structured SOAP notes and AYUSH assessments (Prakriti, Nadi, Jihva, Agni)
- Issue digital prescriptions (Herb, formulation, lifestyle)
- Generate care plans
- Schedule follow-ups
- Communicate with patients within platform boundaries
- Review analytics and earnings

**Permissions:** Read patient records during active consent window; write EMR entries during and after consultations; issue prescriptions; trigger follow-up reminders.

**Dependencies:** HPR verification before profile publishing; patient consent for record access; clinic admin for in-clinic scheduling.

---

### 2.4 Clinic Receptionist / Front Desk
**Primary Goal:** Manage walk-in and booked patient flow, check-in, queue management, and day-of operations.

**Key Actions:**
- Mark patients as checked-in
- Update queue status
- Handle rescheduling requests
- Communicate wait times to patients
- Trigger post-visit summary notifications

**Permissions:** Read appointment list; update check-in and visit status; view basic patient demographics (not clinical records).

**Dependencies:** Doctor for slot management; clinic admin for configuration; patient for visit confirmation.

---

### 2.5 Clinic Admin
**Primary Goal:** Configure and operate the clinic's presence on MeyVeda — practitioners, locations, services, branding, and billing.

**Key Actions:**
- Add and manage practitioners in the clinic
- Set consultation types, slot templates, and fees
- Configure clinic hours and holidays
- View clinic-level reports and earnings
- Manage staff access levels
- Approve prescriptions for dispensing (if clinic pharmacy)

**Permissions:** All receptionist permissions plus doctor slot management, fee configuration, and clinic-level reporting.

**Dependencies:** Super admin for platform onboarding; doctors for schedule preferences.

---

### 2.6 Pharmacy / Fulfillment Partner
**Primary Goal:** Receive verified prescription-linked orders, fulfill them with authentic AYUSH products, and manage delivery.

**Key Actions:**
- Receive order notifications with linked prescription
- Verify prescription authenticity
- Confirm product availability
- Process substitution requests
- Update delivery status
- Manage refill notifications

**Permissions:** Read linked prescription (anonymized unless order placed); write order status updates.

**Dependencies:** Patient for address and delivery acceptance; doctor prescription for medicine authorization; platform logistics layer.

---

### 2.7 AyurSanvaad AI Assistant
**Primary Goal:** Provide contextual, safe, disclaimer-backed wellness guidance — routing to practitioners when clinical care is needed.

**Key Actions:**
- Answer wellness queries with AYUSH-grounded responses
- Suggest Dinacharya routines and lifestyle changes
- Screen symptoms and suggest appropriate AYUSH discipline
- Prompt patient to book a practitioner when beyond wellness scope
- Send habit and medication reminders
- Summarize health records in plain language

**Permissions:** Read patient-consented health summary and habits; write to wellness log; cannot diagnose, prescribe, or replace practitioners.

**Behavioral Rules:**
- Always includes a disclaimer when discussing health conditions
- Never says "you have [disease]" — always says "this may be worth discussing with a practitioner"
- Escalates to emergency guidance if keywords match (chest pain, breathlessness, severe symptoms)
- Logs all interactions for optional practitioner review

---

### 2.8 Super Admin / Operations
**Primary Goal:** Manage platform health, onboard clinics and practitioners, monitor fraud and abuse, handle escalations.

**Key Actions:**
- Approve and reject practitioner profiles
- Monitor consent violations
- Handle patient complaints
- Manage pharmacy partners
- Run operational reports

**Permissions:** Full read access; selective write access to practitioner status, consent flags, and escalation states.

---

### 2.9 Consent / Records Layer (ABDM)
**Primary Goal:** Manage the secure, auditable, consent-governed flow of health records between patients, practitioners, and facilities.

**Key Actions:**
- Issue ABHA-linked identity
- Manage HIU/HIP (Health Information User/Provider) roles
- Process consent grant and revocation events
- Synchronize records from linked ABDM facilities
- Issue consent receipts visible to patients

**This is a system role, not a human role.** Its outputs must always surface in patient-facing UI as readable consent events, not opaque backend operations.

---

## 3. Patient Workflow Map

```
AWARENESS
└── App Store / Referral / Ad / WhatsApp
    └── Landing Screen — "Reinvent You" + Trust badges (ABDM, HPR)

ONBOARDING
├── Language Selection
├── Mobile OTP Login
├── ABHA Linking (optional at entry, encouraged)
├── Basic Profile (Name, Age, Gender, City)
├── Family Member Addition (optional)
├── Wellness Intake (Goals, AYUSH preference, Prakriti hint)
└── Home Dashboard unlocked

DISCOVERY
├── Home Dashboard: Upcoming → Quick Actions → AI Card → Top Practitioners
├── Symptom-Led: AI chat → discipline suggestion → booking CTA
└── Browse: Filter by discipline → profile → compare → select

BOOKING
├── Slot Selection (date, time, video/clinic)
├── Patient Selection (self / family member)
├── Reason for Visit + Report Upload (optional)
├── Payment (UPI, card, netbanking)
├── Confirmation + Calendar Add
└── Reminders (24h, 1h before consult)

PRE-CONSULT
├── Reminder push notification
├── Device Readiness Check (camera, mic, network)
├── Waiting Room (countdown, doctor status, camera preview)
└── Identity Confirmation (ABHA-linked name check)

CONSULT
├── Teleconsult: Video session with care plan panel
│   ├── Chat panel for file sharing
│   └── Session fallback to phone if video fails
└── In-Clinic: Check-in → Queue status → Visit → Post-visit sync

POST-CONSULT
├── End-of-Session Summary notification
├── Prescription release (digital, ABHA-linked)
├── Care Plan view
├── Medicine Order CTA
├── Follow-up Booking CTA
└── Rating / Feedback prompt

PRESCRIPTION & MEDICINE
├── View prescription
├── Add to Apothecary cart (prescription-linked)
├── Checkout → Address → Payment → Confirmation
├── Delivery tracking
└── Refill reminder

FOLLOW-UP & ADHERENCE
├── Daily Dinacharya reminders
├── Medicine dose reminders
├── AI wellness check-in nudges
├── Habit tracking log
├── Follow-up booking reminder (doctor-set trigger)
└── Drop-off recovery (missed reminder → re-engagement nudge)

RECORDS & CONSENT
├── Health Timeline (all records, searchable, filterable)
├── Consent Manager (active grants, history, revocation)
├── ABHA-linked record requests from other facilities
└── Download and share records (PDF, QR, ABDM share)

REPEAT CARE
├── Return to Home Dashboard
├── "Upcoming consult" or "Book your next visit" CTA
├── Prior practitioner fast-rebooking
└── Family member visit management
```

---

## 4. Doctor Workflow Map

```
ONBOARDING
├── Email/Mobile Registration
├── Credential Submission (degree, registration number, MCI/state council)
├── HPR ID entry or generation
├── Specialty and discipline tagging
├── Profile building (bio, languages, photo, clinic association)
└── Verification queue → Approval → Profile published

SETUP
├── Consultation types (Video / In-Clinic / Both)
├── Working hours + slot duration
├── Fee configuration per type
├── Buffer time, breaks, holidays
├── Recurring slot template
└── ABHA/ABDM HIP registration for prescription issuance

DAILY OPERATION (Dashboard)
├── Today's queue at a glance (Checked-in / Waiting / Done)
├── Stats strip: Total / Done / Pending / Avg duration
├── Quick access: EMR Builder / Pending prescriptions / Follow-ups due
└── Online/Offline toggle (availability indicator)

PRE-CONSULT PREP
├── Patient intake card: reason, reports uploaded, prior visit summary
├── AYUSH history pull (prior Prakriti, Nadi findings)
├── AI-generated intake summary (optional)
└── Readiness check if video

CONSULTATION
├── Join room (video or in-clinic mode)
├── Identity confirmation (patient ABHA name shown)
├── History review (EMR timeline)
├── Active note-taking (SOAP + AYUSH assessment fields)
├── In-session prescription draft
└── End consult → care plan generation

POST-CONSULT
├── Finalize and sign prescription
├── Upload to ABHA (patient record sync)
├── Schedule follow-up
├── Set adherence reminders for patient
└── Mark consultation complete

ONGOING CARE
├── Follow-up list management
├── Patient message review (bounded inbox)
├── Refill authorization requests
├── Repeat patient: prior notes comparison view
└── Dashboard: monthly revenue / consultation summary
```

---

## 5. Detailed Patient Workflows

### 5.1 New Patient Onboarding

**Entry Points:**
- App Store install → cold open
- Referral link from WhatsApp (doctor or family)
- Ad click → deep link to specialty or specific doctor

**Step 1 — Splash / Welcome Screen**
- Display: MeyVeda logo, tagline "Reinvent You", ABDM / HPR trust badges, "India's First AYUSH Digital Health Platform"
- Primary Action: "Get Started"
- Secondary Action: "Already registered? Sign in"
- Trust Cue: ABDM Compliant badge, FSSAI-certified pharmacy partners badge
- No personal data collected yet.

**Step 2 — Language Selection**
- Languages offered: English, Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali (expandable)
- Stored in local preference, also saved to profile once created
- Default: system language or English
- Single tap selection, no confirmation needed

**Step 3 — Mobile OTP Login**
- Input: +91 mobile number
- System sends OTP via SMS (Twilio or AWS SNS)
- OTP input: 4 or 6 digit, auto-fill from SMS
- Resend timer: 45 seconds
- Backend event: Create session, check if existing account. If yes → skip to dashboard. If no → continue onboarding.
- Trust Cue: "Your number is used only for verification. We do not share it with any third party."

**Step 4 — ABHA Linking (Optional at entry)**
- Explain ABHA in plain language: "Your ABHA ID is your government health identity — it keeps all your records in one place, wherever you get treated in India."
- Option A: "Yes, link my ABHA ID" → Aadhaar OTP flow (12-digit Aadhaar → OTP → ABHA ID created or linked)
- Option B: "Skip for now — I'll link later"
- Trust Cue: "Secured by the National Health Authority. Your Aadhaar data is not stored by MeyVeda."
- Backend event: If linked, pull basic demographics (Name, DOB, gender) from ABHA → pre-fill profile.

**Step 5 — Basic Profile**
- Fields: Full Name (pre-filled if ABHA-linked), Date of Birth, Gender, City/PIN code
- Optional: Profile photo
- If ABHA-linked: fields pre-filled, user confirms.
- Validation: Name (2+ chars), DOB (must be in past), city (dropdown or PIN lookup)

**Step 6 — Family Member Addition**
- "Add a family member you often book for?"
- Options: Yes → add now / Skip → add later from Profile
- If Yes: Name, relation (Spouse, Parent, Child, Other), DOB, gender, ABHA linking option
- Max 6 family profiles per account
- Each profile treated as a separate patient record with its own consent layer

**Step 7 — Wellness Intake (Personalization)**
- Screen 1: "What brings you to MeyVeda?" → Multi-select health goals (from curated list)
- Screen 2: "Which type of AYUSH care interests you?" → Discipline preferences
- Screen 3 (optional, skippable): "Have you done a Prakriti assessment?" → Yes/No → If yes, enter result; if no, offered Prakriti quiz
- Data used for: home feed personalization, practitioner recommendations, AI assistant context
- Not used for diagnosis or clinical decisions.

**Step 8 — Trust-Building / Privacy Education Screen**
- "Here's how MeyVeda protects your health data"
- 3 bullet points: ABDM-compliant storage / You control all sharing / You can delete your account anytime
- Accept: "Understood, take me in"
- Links: Privacy Policy, Terms of Service (mandatory before accepting)

**Step 9 — Home Dashboard Unlock**
- Celebration micro-moment: subtle animation
- Dashboard shows: Personalized greeting, AI wellness tip, Discover doctors CTA, Dinacharya starter
- Push notification permission request (soft ask, after dashboard loads)

**Exception States:**
- OTP not received: Resend after 45s, max 3 attempts, then "Call support" link
- Aadhaar OTP failure: Offer to skip ABHA and continue
- Network failure mid-onboarding: Save partial state, resume on next open

---

### 5.2 Symptom-Led Discovery

**Entry Points:**
- Home → "AyurSanvaad AI" card
- Home → "What are you dealing with today?" quick input
- Bottom nav → AI tab

**Step 1 — Symptom Input**
- Free text OR curated symptom tiles (most common: Fatigue, Digestive issues, Joint pain, Stress, Insomnia, Skin conditions, Weight, Hormones)
- AI processes input using AYUSH-grounded knowledge graph

**Step 2 — Guided Wellness Questions**
- 2–4 follow-up questions to clarify:
  - How long has this been happening?
  - Is this affecting daily life?
  - Have you tried any treatment?
  - Any known allergies or conditions?
- Questions are conversational, non-clinical in tone.

**Step 3 — Care Pathway Suggestion**
- AI returns: "Based on what you've described, this sounds like it could be addressed through Ayurveda or Naturopathy."
- Discipline recommendation with brief explanation
- ALWAYS includes disclaimer: "This is general wellness guidance, not a diagnosis. A verified practitioner can help you properly."

**Step 4 — Action Options**
- Primary CTA: "Find a [Discipline] Practitioner" → direct to filtered discover page
- Secondary CTA: "Tell me more" → deeper AI conversation
- Tertiary CTA: "This feels urgent" → escalation path (see exception states below)

**Step 5 — AI-to-Booking Handoff**
- If user taps "Find Practitioner", symptom context is passed to discover page as filter pre-selection
- Shortlisted practitioners shown with "Recommended for your concern" tag
- AI conversation summary optionally pre-populated in "reason for visit" during booking

**Exception States:**
- Emergency Keywords (chest pain, breathlessness, stroke symptoms, severe bleeding): AI immediately says "This sounds serious. Please call emergency services now — 108 in India. Do not wait for a teleconsult." And shows a prominent 108 call button. No booking flow.
- Symptoms suggesting a non-AYUSH condition: AI advises "This may need an allopathic evaluation first. We recommend visiting a nearby government health facility or general physician."
- Very vague input: AI asks one more clarifying question before suggesting.

---

### 5.3 Practitioner Discovery and Comparison

**Entry Points:**
- Home → "Book Consult" card
- Discover tab (bottom nav)
- AI recommendation → CTA
- Referral link to specific doctor profile

**Step 1 — Discipline Filter**
- 6 tiles: Ayurveda / Yoga / Naturopathy / Unani / Siddha / Homeopathy
- Each shows doctor count
- Multi-select allowed (shows intersection)
- Default: All (no filter)

**Step 2 — Filter Panel**
- Available filters:
  - Consultation mode (Video / In-Clinic / Both)
  - Fee range (Under ₹300 / ₹300–600 / ₹600+ / Any)
  - Availability (Today / This Week / Any)
  - Language (Hindi / English / Tamil / Telugu / etc.)
  - Gender preference (Any / Male / Female)
  - Experience (2+ / 5+ / 10+ years)
  - Rating (4+ / 4.5+)
- Filters persist across session, resettable

**Step 3 — Results List**
- Each card shows:
  - Name, credentials abbreviation
  - HPR verified badge (green shield with checkmark)
  - Specialty / discipline
  - Rating (star) + review count
  - Experience (years)
  - Languages spoken
  - Next available slot (prominent)
  - Fee
  - Consultation modes (video icon / clinic icon)
  - Location (for in-clinic)
- Sorting: Relevance (default) / Rating / Fee (low) / Soonest Available

**Step 4 — Practitioner Profile**
- Hero: Name, photo/avatar, specialty, HPR badge
- Stats: Experience / Total consultations / Languages / Reviews
- About: Bio in readable, warm language
- Qualifications: Degree tags (BAMS, MD Ayu, etc.)
- Clinic info: Name, address, hours
- Review excerpts: 2–3 most recent, "View all"
- Booking panel: Date picker → Time slots → Mode toggle → Book Now

**What Makes a Patient Choose One Provider:**
- Next available slot (biggest driver for urgent needs)
- Rating and review content (qualitative trust)
- Language match (comfort)
- Fee (price sensitivity, especially ₹300–600 range is sweet spot)
- HPR badge (trust signal)
- Specialization within discipline (e.g., Panchakarma within Ayurveda)
- Gender preference (especially women patients for gynae/hormonal concerns)
- Profile completeness (photo, bio, qualifications)

**Comparison Flow:**
- Long-press or "Compare" toggle allows side-by-side comparison of 2 practitioners
- Compare: fee, availability, rating, experience, mode, languages

---

### 5.4 Appointment Booking

**Step 1 — Mode Selection**
- If practitioner offers both: Toggle — "📹 Video Consult" vs "🏥 In-Clinic"
- Clear fee difference shown if applicable (in-clinic may cost more)
- If video only or clinic only: mode pre-selected, informational only

**Step 2 — Date Selection**
- Horizontal date strip (7-day view by default, expandable)
- Dates with no availability: greyed, not tappable
- Today / Tomorrow highlighted with label

**Step 3 — Time Slot Selection**
- Grouped by Morning / Afternoon / Evening
- Available: white background, tappable
- Booked: strikethrough, disabled
- Selected: green background
- System checks real-time availability; locks slot for 8 minutes during booking

**Step 4 — Patient Selection**
- "Who is this appointment for?"
- Options: Myself (pre-filled) / [Family member names]
- Selecting a family member: shows their demographics, ABHA status

**Step 5 — Reason for Visit**
- Free text field (optional but encouraged)
- Prompt: "Briefly describe what you'd like to discuss. This helps your doctor prepare."
- Character limit: 300
- Pre-filled if coming from AI symptom flow

**Step 6 — Upload Reports (Optional)**
- "Share any relevant reports with your doctor before the session"
- File picker: Image / PDF / ABHA record share
- Max 3 files, max 10MB each
- Uploaded securely, visible to doctor in intake panel

**Step 7 — Payment**
- Booking summary: Doctor name, date, time, mode, fee breakdown (consultation fee + GST + convenience fee)
- Payment methods: Google Pay, PhonePe, Paytm, UPI ID, Debit/Credit Card, Net Banking
- Promo code field (collapsible)
- "Pay and Confirm" primary button
- Backend: payment gateway → on success → slot locked → booking created → confirmations triggered

**Step 8 — Confirmation**
- Success screen: green checkmark animation
- Shows: Doctor name, date, time, mode, booking ID
- Calendar add link (Google Calendar / Apple Calendar / iCal)
- "Go to Waiting Room" (active on day of consult)
- "Reschedule / Cancel" link
- Trust Cue: "Booking confirmed and secured. A receipt has been sent to your mobile."

**Step 9 — Reminders**
- 24 hours before: Push notification + SMS — "Your consult with Dr. [Name] is tomorrow at [time]. Tap to open waiting room."
- 1 hour before: Push notification — "Your session starts in 1 hour. Check your camera and network."
- 15 minutes before: Push — "Dr. [Name] is ready. Join the waiting room."
- All reminders have one-tap action.

**Reschedule Logic:**
- Allowed: up to 2 hours before appointment (configurable per doctor)
- Flow: Choose new date → new slot → no additional payment if same fee; differential if fee changed
- Doctor notified of change
- Original slot immediately released to pool

**Cancel Logic:**
- Allowed: up to 24 hours before for full refund (configurable)
- 2–24 hours before: partial refund (50%, configurable)
- Less than 2 hours: no refund
- Refund: original payment method, 5–7 business days
- Doctor notified
- Patient sees cancellation reason field (optional)

**Waitlist Logic:**
- If all slots full, patient can join waitlist for that day
- On cancellation by another patient: waitlisted patient gets push notification + 30-min priority booking window
- Waitlist position visible on booking screen

**Duplicate Booking Detection:**
- System checks: same patient + same doctor + same date → warns "You already have an appointment at this time. Book a different slot?"
- Different doctors same time: allowed but warned ("You have another appointment at this time with Dr. X")

---

### 5.5 Teleconsultation Journey

**Pre-Visit Reminders:** (see 5.4 Step 9)

**Step 1 — Device Readiness Check (Waiting Room Entry)**
- Camera check: green / amber / red status
- Microphone check: volume indicator
- Network check: ping test → "Excellent / Good / Poor / Very Poor"
- Speaker test: "Click to test audio"
- If any check fails → inline guidance: "Your camera isn't working. Try [solution]. If it persists, your doctor will call you on your mobile."
- All checks pass: "You're ready. Your session starts in [X] minutes."

**Step 2 — Waiting Room**
- Doctor status: "In previous session — joining shortly" OR "Ready to join"
- Countdown timer (doctor-set, visible)
- Camera preview (self-view, full width)
- Checklist: "Have your previous reports ready / Sit in a quiet place / Keep your phone charged"
- Optional: Upload additional documents from waiting room
- Trust Cue: "This session is end-to-end encrypted."

**Step 3 — Identity Confirmation**
- On session start: system shows patient's ABHA-linked name to doctor
- Patient confirms: "Yes, this is [name]" — simple one-tap
- If family member: "Confirming appointment for [family member name], in the presence of [account holder]"

**Step 4 — Consultation Session**
- Layout: Doctor video (main) / Self video (PiP, top right)
- Controls: Mute / End Call / Camera toggle
- Sidebar (collapsible): Care plan panel (prescription in progress) + Chat
- Chat: Patient can send text or files; doctor can share documents
- Session timer: visible to both parties
- Doctor can share screen (for reports, care plans)

**Step 5 — Session Fallback (Video Failure)**
- If video fails mid-session: banner "Video connection lost"
- Auto-attempts to reconnect × 2 (10s each)
- If reconnect fails: "Switching to audio-only mode"
- If audio also fails: "We're having trouble with the connection. Dr. [Name] will call you on [registered mobile]. Please wait."
- Doctor view: system dials patient mobile automatically (via platform-masked number)
- Session still counted as complete if call happens
- Session log records: "Video failed at [timestamp], audio fallback used"

**Step 6 — End of Consultation**
- Doctor triggers end session
- Confirmation dialog: "Are you ready to end this session? Your prescription will be sent to the patient once you finalize it."
- Session summary auto-generated (visible to doctor, editable)
- Patient sees: "Consultation complete. Your care plan is being prepared."

**Step 7 — Post-Consult Summary (Patient)**
- Push notification: "Your care plan from Dr. [Name] is ready."
- Summary screen: Chief concern addressed / Key findings / Prescribed medicines / Lifestyle guidance / Follow-up date
- Actions: View full prescription / Order medicines / Schedule follow-up / Share summary
- Rating prompt: 5-star + optional text (shown 24h after consult, not immediately)

---

### 5.6 In-Clinic Consultation Support Journey

**Step 1 — Clinic Directions**
- Day-of notification: map link to clinic + "Get Directions" (opens Google Maps / Apple Maps)
- Parking notes and entry instructions if clinic admin has configured them

**Step 2 — Digital Check-In**
- On arrival: Patient opens app → "I'm here" button
- OR: QR code at clinic desk → patient scans → auto check-in
- System notifies receptionist + doctor: "[Patient name] has arrived"
- Patient sees: "Checked in. You are [position] in the queue. Estimated wait: X minutes."

**Step 3 — Queue Visibility**
- Live queue status updates (every 2 minutes)
- Notifications if queue moves significantly (patient ahead done → push "You're next")
- Patient can wait in nearby area, not stuck in waiting room

**Step 4 — Visit Status**
- "Doctor is ready for you" — push + visual on screen
- In-session: timer starts, patient sees "In consultation"
- Post-session: "Your session is complete"

**Step 5 — Post-Visit**
- Automatic: records sync from doctor's EMR to patient's health timeline
- Prescription available: push notification
- If prescription requires a physical copy at clinic: dispensed at reception, digital version simultaneously on app
- Feedback prompt: 24h after visit

---

### 5.7 Prescription and Care Plan Workflow

**Step 1 — Prescription Availability Notification**
- Push: "Dr. [Name] has finalized your prescription. View it now."
- Available on: Prescription tab / Post-consult summary / Health records timeline

**Step 2 — Prescription View**
- Header: Doctor name, credentials, HPR ID, consultation date
- Patient: Name, ABHA ID, age, Prakriti
- Medicines: Name / Dose / Frequency / Duration / Anupana (vehicle/timing)
- Clinical notes summary (plain language version of SOAP notes)
- AYUSH assessment findings: Prakriti, Nadi, Jihva, Agni
- Lifestyle recommendations: Diet / Exercise / Sleep / Stress
- Follow-up date

**Step 3 — Medicine Instructions**
- Each medicine has a detail card: "Tap for instructions"
- Shows: What it is / Why prescribed / How to take it / What to watch for
- Language in plain, reassuring terms — not clinical jargon

**Step 4 — Clarification Prompts**
- "Something unclear?" → In-app message to doctor (platform-bounded)
- Doctor can reply within 48h window
- If urgent: "Call the clinic directly" link shown

**Step 5 — Re-access**
- Prescription always available in Health Records → Prescriptions tab
- Downloadable as PDF
- Shareable via ABDM consent flow (to other facilities)
- Permanent — never deleted

---

### 5.8 Medicine Order Workflow

**Step 1 — Prescription-Linked Cart**
- "Order Medicines" CTA on prescription screen
- All prescribed medicines auto-loaded into Apothecary cart
- Each item shows: name, brand, quantity, price
- "Prescribed" badge on each item (green)

**Step 2 — Cart Review**
- Patient can adjust quantities (not reduce below prescribed if dose-specific)
- Patient can add wellness essentials (non-prescription)
- Remove option available (with warning: "This is a prescribed medicine. Are you sure?")

**Step 3 — Substitution / Unavailability Logic**
- If a medicine is out of stock: "This item is temporarily unavailable. We'll notify you when it's back." OR "A pharmacist-verified substitute is available: [alternative name] by [brand]. View details."
- Substitutes must be: same formulation, same strength, pharmacist-approved
- Patient confirms substitution or waits

**Step 4 — Address Confirmation**
- Saved addresses shown
- Option to add new address
- Delivery estimate: "Expected delivery in 2–4 business days"
- Express delivery option if available

**Step 5 — Payment**
- Methods: UPI / Card / Net Banking / COD (for non-prescription items only)
- Prescription medicines: prepayment only (COD not allowed)
- Order total breakdown: subtotal + delivery + any taxes
- Coupon code field (collapsible)

**Step 6 — Order Confirmation**
- Success: Order ID, items, delivery estimate
- Prescription uploaded to pharmacy partner (masked order — patient identity protected until confirmed)
- Pharmacy verifies prescription authenticity via platform

**Step 7 — Delivery Tracking**
- Order status: Ordered → Packed → Dispatched → Out for Delivery → Delivered
- Live tracking link (if courier partner supports it)
- Delivery agent contact (masked number)

**Step 8 — Refill Reminders**
- System calculates refill date: prescription start date + duration - 5 days
- Push notification: "Your [Medicine name] is due for refill in 5 days. Reorder now?"
- One-tap refill: same address, same pharmacy, payment saved if available
- Doctor must be notified if refill is for a medicine requiring ongoing authorization

**Repeat Order Flow:**
- "Reorder" button on past orders
- All items from prior order pre-loaded
- Patient confirms or modifies
- New delivery estimate shown

---

### 5.9 Follow-Up and Adherence Workflow

**Step 1 — Follow-Up Booking Trigger**
- Doctor sets follow-up date during consultation
- System sends patient a push notification: "Dr. [Name] recommends a follow-up on approximately [date]. Book your next session?"
- If patient does not book within 48h: second nudge
- If patient does not book within 7 days: AI wellness check-in ("How are you feeling? Dr. [Name] suggested checking in around now.")

**Step 2 — Daily Dinacharya Reminders**
- Based on care plan: doctor sets or AI suggests Dinacharya tasks
- Morning reminder (configurable time): "Good morning [Name]. Here's today's wellness plan."
- Tasks: Oil pulling / Yoga / Meditation / Specific diet / Medicine dose
- Check-off interface: simple tap to mark done
- Progress: streak counter, weekly completion %

**Step 3 — Medicine Adherence Reminders**
- Dose reminders: tied to prescription frequency and timing (e.g., "Take Ashwagandha Churna with warm milk — Good morning reminder")
- Custom: patient can set preferred reminder time
- Missed dose: next-slot notification: "You missed your morning dose. You can take it now, or wait for your evening dose."
- Never says "You failed" — always supportive

**Step 4 — AI Wellness Check-In Nudges**
- Weekly: AyurSanvaad AI asks: "How are you feeling this week?"
- 3-option quick response: "Better / Same / Worse"
- If "Worse": "I'm glad you told me. Let's talk about what's changed." → conversation → booking CTA if needed
- If "Better": positive reinforcement, share progress with doctor option

**Step 5 — Drop-Off Recovery**
- Patient not active for 14 days: gentle re-engagement push — "It's been a while. Ready to check in on your wellness goals?"
- No reminder for 21+ days: "Would you like us to stop sending reminders?" (respect digital fatigue)
- No engagement for 30 days: system reduces notification frequency to weekly

---

### 5.10 Records and Consent Workflow

**Step 1 — View Records Timeline**
- Health Timeline: all records in chronological order
- Filterable: All / Consultations / Prescriptions / Lab Reports / AI Logs / Tracker Data
- Each entry shows: type badge, date, practitioner, discipline, expandable summary
- ABHA-linked records from other facilities shown with source label

**Step 2 — Request/Share Records**
- Patient initiates share: "Share this record with…" → select practitioner (from booked doctors or new)
- OR: Doctor requests access → patient receives notification: "Dr. [Name] is requesting access to your [record type] from [date range]. Approve?"

**Step 3 — Grant Consent**
- Consent grant screen: shows exactly what is being shared, with whom, for how long
- Duration options: This session only / 30 days / 90 days / Until revoked
- Patient must actively tap "Approve" — no pre-consent
- Consent receipt issued: visible in Consent Manager
- Trust Cue: "Only [Doctor name] at [Clinic name] will be able to see these records during the approved period."

**Step 4 — Deny Consent**
- Patient can deny any consent request
- Doctor notified: "Patient has not approved record access for this session."
- Doctor can still conduct consultation based on patient's verbal history

**Step 5 — Revoke Consent**
- Patient visits Consent Manager → active grants list → "Revoke"
- Confirmation dialog: "Revoking access means [Doctor name] can no longer view your records. Previously shared data may still be retained by them as required by medical regulations."
- Revocation logged with timestamp
- Doctor notified of revocation

**Step 6 — Trust Messaging Throughout**
- Every consent action shows: ABHA ID, timestamp, what was shared/denied/revoked
- Consent log is always accessible, never deletable

---

## 6. Detailed Doctor Workflows

### 6.1 Doctor Onboarding and Verification

**Step 1 — Registration**
- Mobile or email + OTP
- Role selection: "I am an AYUSH Practitioner"
- Sub-type: Ayurveda / Yoga / Naturopathy / Unani / Siddha / Homeopathy (multi-select for multi-qualified)

**Step 2 — Credential Submission**
- Degree(s): BAMS, BUMS, BNYS, BHMS, MD (Ayu), etc.
- Registration Council: State Council or Central Council of Indian Medicine (CCIM) / Central Council of Homeopathy (CCH)
- Registration Number: Text input, verified against council database (API integration or manual review)
- Year of graduation
- Specialization within discipline

**Step 3 — HPR Entry or Generation**
- If doctor already has HPR (Health Professional Registry) ID: enter it
- If not: "Generate your HPR ID" → guides through NHA portal → return with ID
- HPR ID becomes the core verified identifier on the platform

**Step 4 — Document Upload**
- Degree certificate (PDF/image)
- Registration certificate
- Identity proof (Aadhaar or PAN)
- Optional: Photograph (for profile)
- Upload status: "Documents received. Verification takes 24–48 hours."

**Step 5 — Verification State**
- Three states: Pending Review / Under Verification / Verified / Rejected (with reason)
- During Pending state: doctor can complete profile but cannot accept bookings
- During Verified state: profile published, bookings open
- Rejection: clear reason shown, re-upload option

**Step 6 — Profile Building (while pending)**
- Bio (max 500 words, written in first person recommended)
- Languages spoken
- Specialization within discipline
- Clinic association: search by clinic name / add new clinic
- Consultation photo (optional)

**Step 7 — ABDM HIP Registration**
- Doctor must register as Health Information Provider to issue ABHA-linked prescriptions
- Platform guides through HIP registration (or handles it on behalf via bulk registration for verified doctors)

---

### 6.2 Availability and Schedule Setup

**Step 1 — Consultation Types**
- Toggle: Video / In-Clinic / Both
- Per type: fee setting, slot duration (15 / 20 / 30 / 45 / 60 min)
- Buffer between slots: 0 / 5 / 10 / 15 min

**Step 2 — Working Hours**
- Day-by-day: Mon–Sun
- For each day: Start time → End time → Break start → Break end
- Quick template: "Mon–Fri 9AM–1PM, 4PM–7PM" applied in one tap

**Step 3 — Slot Generation**
- System auto-generates slots from working hours + duration + buffer
- Slots per day preview shown before confirming
- Edit individual slots (delete specific slots, mark blocked)

**Step 4 — Holidays and Blocks**
- Calendar view: tap a date → "Block this day"
- Multi-date blocking (e.g., vacation: block range)
- Recurring blocks (e.g., Friday afternoons)
- System auto-rejects new bookings during blocked periods, notifies patients with waitlisted appointments

**Step 5 — Multi-Location Support**
- Doctor can add multiple clinic associations
- Each clinic has its own slot pool
- Video slots are doctor-level (not clinic-specific)
- Calendar view shows all locations, color-coded

**Step 6 — Emergency Blocking**
- "Block today" quick action from dashboard
- Reason (optional): Personal / Travel / Medical / Other
- Booked patients for that day: auto-rescheduling notification sent, booking remains active until patient confirms reschedule

---

### 6.3 Appointment Management Workflow

**Step 1 — Daily Queue View**
- List of today's appointments sorted by time
- Status for each: Scheduled / Checked-In / In Session / Completed / No-Show
- Patient card preview: name, age, visit reason, mode (video/clinic), time

**Step 2 — Patient Intake Preview**
- Tap any appointment to expand intake card
- Shows: reason for visit, uploaded reports (view inline), prior consultation summary (if return patient), AI intake summary (optional)
- Doctor marks "Reviewed" → triggers patient notification "Your doctor has reviewed your intake. Ready when you are."

**Step 3 — No-Show Handling**
- If patient doesn't join within 10 minutes of scheduled time (for video):
  - System sends push to patient: "Dr. [Name] is waiting. Join now or reschedule."
  - After 15 minutes: prompt doctor "Patient has not joined. Mark as no-show or wait?"
  - No-show marked: patient receives notification, no refund policy applies
  - Doctor's slot freed for emergency or walk-in (if clinic)

**Step 4 — Cancellation Handling**
- If patient cancels < 2 hours before: doctor notified, slot may remain blocked or be released (doctor preference)
- If doctor cancels: all booked patients notified immediately, full refund issued, rescheduling options provided, doctor flagged internally (quality metric)

**Step 5 — Queue Control**
- Receptionist (in-clinic) can drag-and-drop queue order (for walk-ins)
- Doctor can mark "running late" → system notifies all upcoming patients: "Dr. [Name] is running approximately [X] minutes behind schedule."
- Doctor can push urgent patient to top of queue (with reason logged)

---

### 6.4 Consultation Workflow

**Step 1 — Pre-Consult Review (5 min before)**
- Doctor opens patient card
- Views: Patient name, ABHA ID, age, gender, Prakriti (if prior assessment), chief complaint, uploaded reports
- Prior visit summary: last consultation date, prior diagnosis, prior prescription (collapsed, expandable)
- AI intake summary (optional): "Based on patient's intake, key concern is [summary]." Doctor can dismiss.

**Step 2 — Joining the Room**
- Video: "Start Consultation" → session initiated → patient notified
- In-clinic: "Begin Session" → timer starts, patient status updated to "In Session"
- Session recording: OFF by default, must be explicitly enabled by both parties

**Step 3 — Identity Confirmation**
- System shows patient's ABHA-linked name
- Doctor verbally confirms with patient at session start
- If family member is the patient: "Confirming this session is for [family member name] — is that correct?"

**Step 4 — History Capture**
- Structured section in EMR (always visible alongside video):
  - Chief Complaint (pre-filled from intake, editable)
  - History of present illness
  - Past medical history (pulled from records if consent granted)
  - Family history
  - Allergies
  - Current medications (from prior prescriptions)

**Step 5 — AYUSH Assessment Fields**
- Prakriti (Vata / Pitta / Kapha / combinations)
- Nadi Pariksha (pulse analysis) — free text
- Jihva Pariksha (tongue) — dropdown + notes
- Agni (Sama / Vishama / Teekshna / Manda)
- Mala (stool quality — optional)
- Mutra (urine — optional)
- Drik (vision / eyes — optional)
- Akruti (constitution observation — free text)

**Step 6 — Consultation Documentation**
- SOAP structure:
  - S (Subjective): Patient's complaints in their own words
  - O (Objective): Findings from assessment
  - A (Assessment): Diagnosis or impression in AYUSH terms
  - P (Plan): Treatment plan, formulations, lifestyle
- Each field is a rich text area with AYUSH terminology autocomplete
- Voice-to-text option (doctor speaks, text auto-transcribed)
- "Save draft" saves in real-time; no manual save needed

**Step 7 — Next Action Setup**
- Before ending session: doctor confirms:
  - Prescription finalized or pending?
  - Follow-up date set?
  - Patient has any questions?
- "End Consultation" → confirmation → session closed → prescription workflow triggered

---

### 6.5 EMR / Note-Taking Workflow

**Templates:**
- Condition-specific templates: e.g., "Vata imbalance presentation," "Skin condition — Pitta aggravation," "General wellness visit"
- Custom templates: doctor creates their own
- Saved templates applied with one tap

**Repeat Patient History:**
- Timeline of all prior visits visible in collapsible sidebar
- Compare mode: side-by-side current vs prior visit findings
- "Progress since last visit" section: auto-populated if doctor fills in at previous visit

**Attachments:**
- Doctor can attach: diagnostic images, lab results, Prakriti assessment charts
- Patient-uploaded files appear as attachments visible in EMR
- All attachments ABHA-linked and timestamp-verified

**Clinical Shorthand vs Patient Summary:**
- EMR has two layers: Clinical notes (doctor-level) + Patient summary (auto-generated, plain language)
- Patient summary generated by AI from clinical notes, reviewed by doctor before releasing
- Patient sees: Summary version. Doctor sees: Full clinical notes.

**Save Draft vs Finalize:**
- Notes auto-saved every 30 seconds
- "Finalize" locks the note: timestamped, non-editable (amendment-only after finalization)
- Finalized notes trigger: prescription release, record sync, follow-up scheduling

---

### 6.6 Prescription Workflow

**Step 1 — Medicine Entry**
- Search: Herb name / formulation name / patent medicine name
- Database: curated AYUSH drug database (Ayurvedic, Unani, Siddha, Homeopathic pharmacopoeia)
- Entry fields per medicine:
  - Name (required)
  - Dose (required): e.g., "1 tsp", "500mg", "5 drops"
  - Frequency (required): Once / Twice / Thrice / At bedtime / As needed
  - Duration (required): days or weeks
  - Anupana / vehicle (required for Ayurveda): Warm water / Warm milk / Honey / Ghee / Empty stomach
  - Special instructions (optional): "Avoid in monsoon," "Take 30 min before meals"
- Add multiple medicines: each on its own card

**Step 2 — Dosage Validation**
- System alerts if dose is outside standard pharmacopoeia range: "This dose exceeds the standard range for [medicine]. Please confirm."
- System checks for known herb-drug interactions (future feature)

**Step 3 — Prescription Finalization**
- Review all medicines listed
- Add: overall lifestyle guidance section / dietary advice / physical activity
- Set: next follow-up date
- Doctor digital signature: biometric confirmation (fingerprint/face ID) OR 6-digit PIN
- Timestamped: "Prescribed on [date] at [time] by [Doctor name] HPR [ID]"

**Step 4 — E-Sign and Distribution**
- Prescription sent to:
  - Patient's MeyVeda account (immediate push notification)
  - Patient's ABHA health locker (ABDM HIP push)
  - Pharmacy partner (if patient initiates order)
- Prescription not editable after e-sign; amendments create a new version
- PDF version generated: downloadable by patient

**Step 5 — Patient View Synchronization**
- Patient sees prescription within seconds of doctor signing
- System confirms: "Prescription synced to your ABHA health locker"

---

### 6.7 Follow-Up Planning Workflow

**When Follow-Up is Needed:**
- Chronic condition (always)
- New condition with uncertain progress (always)
- Post-Panchakarma (always)
- Acute condition showing improvement (suggested at 2–4 weeks)
- Wellness visit (suggested at 3 months)

**Step 1 — Suggested Follow-Up Interval**
- System suggests based on condition tag and AYUSH standard guidelines
- Doctor can accept or modify
- Options: 2 weeks / 1 month / 6 weeks / 3 months / Custom

**Step 2 — Care Plan Tasks**
- Doctor enters: patient's homework before follow-up
  - Habit changes to track
  - Symptoms to monitor and log
  - Diet diary (optional)
  - Lab investigations to do before follow-up

**Step 3 — Monitoring Points**
- Doctor selects: what to track between sessions
- Platform activates: relevant tracking modules for patient (habit log, symptom log)
- AI assistant prompted to ask follow-up-relevant questions during weekly check-ins

**Step 4 — Follow-Up Booking Trigger**
- Patient receives: notification with follow-up recommendation, direct CTA to book
- System pre-selects the doctor + approximate date range for next booking
- Booking flow same as standard appointment

---

### 6.8 Repeat Patient Workflow

**On Opening a Repeat Patient's Session:**
- EMR shows: timeline of all past visits (most recent first)
- Last prescription visible without opening separate screen
- "Progress comparison" tab: what's changed since last visit
- AI generates: "Patient's last reported concern was [X]. They were prescribed [Y]. Key items to track today: [Z]."

**Comparing Progress:**
- Side-by-side: current AYUSH assessment vs last visit findings
- Doctor marks: Improved / Same / Worse per symptom
- These marks feed AI wellness tracking model

**Modifying Treatment:**
- "Continue same treatment" button → medication list carried forward, doses adjustable
- "Modify treatment" → add/remove/change medicines, new prescription issued

**Refill Authorization:**
- Patient requests refill via app
- Doctor receives: "Patient [name] is requesting a refill of [prescription from date]"
- Doctor reviews: does patient need to come in first, or is refill appropriate?
- Approve: one-tap → prescription updated, pharmacy notified
- Decline: message to patient explaining why in-person visit is needed first

---

### 6.9 Doctor Communication and Patient Engagement Workflow

**Bounded Messaging (Platform-Gated Inbox):**
- Patients can message only within 48 hours of a completed consultation
- Message types allowed: clarification questions, reporting an adverse reaction
- NOT allowed: new symptoms, new conditions, general wellness queries (redirect to AI)

**Response Window:**
- Doctor is expected to respond within 24 hours (shown to patient as SLA)
- System sends reminder to doctor if message unanswered after 12 hours
- After 48 hours: message automatically marked "Responded or Lapsed," patient prompted to rebook if needed

**Safe Escalation Rules:**
- If patient message contains emergency keywords: system auto-triggers emergency guidance, alerts clinic admin, notifies doctor urgently
- If patient reports serious adverse reaction: doctor flagged immediately, admin team notified, pharmacovigilance log created

**Reminder Sending (Doctor-Initiated):**
- Doctor can send: "Time for your follow-up" nudge to patients from their dashboard
- Bulk nudge: all patients due for follow-up in the next 2 weeks, one-tap reminder
- Patient receives: branded notification "Dr. [Name] has sent you a reminder."

---

### 6.10 Productivity and Dashboard Workflow

**Daily Schedule View (Primary Doctor View):**
- Today's appointments: sorted by time, with status indicators
- Stats strip: Total / Done / Pending / Avg consultation duration / Revenue today
- Online/Offline toggle: controls whether new bookings are accepted

**Upcoming Consults Panel:**
- Next 7 days: all booked appointments
- Exportable as iCal / Google Calendar

**Follow-Ups Due:**
- All patients whose follow-up date has passed or is within 7 days, not rebooked
- One-tap "Send reminder" per patient or bulk

**Prescription Pending:**
- Sessions completed but prescription not yet finalized
- Alert if older than 6 hours post-session

**Monthly Analytics:**
- Total consultations / Unique patients / New vs returning ratio
- Average session duration
- Discipline/specialty breakdown
- Revenue: gross vs after platform fee
- Top diagnoses / most prescribed formulations
- Patient satisfaction: average rating

---

## 7. Cross-Workflow States and Exceptions

| State | System Behavior | Patient Experience | Doctor Experience |
|---|---|---|---|
| Missed appointment (patient) | Auto-marked no-show after 15 min. Slot freed. Refund per policy. | Notification + rebooking prompt | Notification, slot freed, no penalty |
| Missed appointment (doctor) | Admin alerted. Patient auto-refunded. Rescheduling CTA sent. | Full refund + apology, reschedule CTA | Internal flag, penalty metric tracked |
| Failed payment | Booking not confirmed. Slot held for 5 min. Retry CTA. | "Payment failed. Try another method." | Not notified until booking confirmed |
| Video failure | Auto-reconnect × 2. Audio fallback. Doctor calls patient mobile. | "Switching to audio. Your doctor will call." | "Switching to phone call mode. Dialing [patient]." |
| Doctor running late | Doctor sends "running late" alert from dashboard | Push: "Dr. [Name] is running X min late. Your new time is approximately [time]." | Estimated delay input, sends to all affected |
| Incomplete records | Patient can proceed without records. Doctor sees "No records shared." | No friction — optional fields | "Patient has not shared records. Conduct based on verbal history." |
| Unverified doctor | Profile hidden from search. Profile visible to admin. | Cannot discover or book. | "Your profile is under verification. Bookings are paused." |
| Out-of-stock medicine | Substitution offered or waitlist for item. | "Out of stock. A substitute is available / Notify me when back." | Not in their workflow |
| Duplicate booking | Warning shown, not blocked. | "You have an appointment around this time. Proceed?" | — |
| Emergency symptoms | AI/system flags → emergency number shown, booking flow paused | "This sounds serious. Call 108 now." | If in-session: "This patient may need emergency care." |
| Consent denied | Doctor can consult without record access | No change | "Patient has not approved record access. Proceed with verbal history." |
| Consent revoked | Doctor's access to records terminated immediately | "Consent revoked successfully." | "Patient has revoked record access." |
| Invalid uploads | Error shown, file not accepted | "This file type isn't supported. Please upload a PDF or image." | File not shown in intake |
| Abandoned booking (payment step) | Slot held 8 min then released. Re-engagement nudge after 30 min. | "Your slot is still available for 8 minutes. Complete your booking." | No impact |
| Abandoned checkout (medicines) | Cart saved. Push after 1 hour: "Your medicines are waiting." | Soft reminder, not aggressive | Not in their workflow |
| Prescription clarification | Patient sends message → doctor's bounded inbox | "Message sent to Dr. [Name]. Expect a response within 24 hours." | Message notification in inbox |

---

## 8. Screen-by-Screen Workflow Breakdown

### Patient Screens

#### Screen P-01: Welcome / Splash
| Field | Value |
|---|---|
| User Type | Patient (new) |
| Objective | Establish brand trust, invite to start |
| Primary Action | "Get Started" |
| Secondary Action | "Sign In" |
| Info Shown | Logo, tagline, ABDM / HPR badges, discipline icons |
| Backend Event | App init, session token created |
| Trust Cue | ABDM badge, "India's First AYUSH Platform" |
| Empty State | N/A |
| Error State | Network unavailable → "No connection. Check your internet and try again." |
| Success State | Proceeds to language selection |

#### Screen P-02: Language Selection
| Field | Value |
|---|---|
| Objective | Localize experience |
| Primary Action | Tap language |
| Info Shown | Language options as flag + name tiles |
| Backend Event | Language preference stored locally |
| Trust Cue | "We support your mother tongue" |
| Error State | None (always shows English fallback) |
| Success State | Proceeds to OTP screen |

#### Screen P-03: Mobile OTP Entry
| Field | Value |
|---|---|
| Objective | Authenticate user |
| Primary Action | "Send OTP" |
| Info Shown | +91 prefix, phone number field, TRAI compliance note |
| Backend Event | OTP dispatch, session creation |
| Trust Cue | "Your number is for verification only. Never shared." |
| Empty State | Field empty, button disabled |
| Error State | "Invalid number. Enter a 10-digit mobile number." |
| Success State | OTP sent → screen transitions to OTP input |

#### Screen P-04: OTP Input
| Field | Value |
|---|---|
| Objective | Verify ownership of mobile number |
| Primary Action | Auto-verify on 4th digit |
| Info Shown | 4-box OTP input, resend timer, "Change number" link |
| Backend Event | OTP verification, account lookup |
| Error State | "Incorrect OTP. [X] attempts remaining." |
| Success State | New user → ABHA screen. Returning user → Dashboard |

#### Screen P-05: ABHA Linking
| Field | Value |
|---|---|
| Objective | Link government health identity |
| Primary Action | "Link ABHA via Aadhaar" or "Skip for now" |
| Info Shown | ABHA explanation (plain language), benefits list |
| Backend Event | ABHA API call if user proceeds |
| Trust Cue | "Secured by National Health Authority. Aadhaar not stored by MeyVeda." |
| Empty State | No ABHA: optional, can skip |
| Error State | "Aadhaar OTP failed. Try again or skip." |
| Success State | Demographics pulled, profile pre-filled |

#### Screen P-06: Profile Creation
| Field | Value |
|---|---|
| Objective | Create basic patient identity |
| Primary Action | "Continue" |
| Info Shown | Pre-filled fields (from ABHA), editable |
| Backend Event | Patient profile record created |
| Error State | Validation errors per field |
| Success State | Proceeds to family member addition |

#### Screen P-07: Family Member Addition
| Field | Value |
|---|---|
| Objective | Enable multi-profile household management |
| Primary Action | "Add Member" or "Skip" |
| Info Shown | Existing profile preview, add form |
| Backend Event | Linked profile created under account |
| Success State | Member added → Home dashboard or continue onboarding |

#### Screen P-08: Wellness Intake
| Field | Value |
|---|---|
| Objective | Personalize experience |
| Primary Action | "Continue" after selections |
| Info Shown | Multi-select health goals, discipline preferences |
| Backend Event | Preference tags stored; home feed personalization triggered |
| Empty State | "Select at least one goal to continue" or allow skip |
| Success State | Trust/privacy screen |

#### Screen P-09: Privacy Education
| Field | Value |
|---|---|
| Objective | Inform user of data handling; get consent |
| Primary Action | "Understood, take me in" |
| Info Shown | 3 bullet data principles, links to Privacy Policy and ToS |
| Backend Event | Consent timestamp logged |
| Trust Cue | Legal compliance badge |
| Error State | Cannot proceed without accepting |
| Success State | Home Dashboard |

#### Screen P-10: Home Dashboard
| Field | Value |
|---|---|
| Objective | Central hub for all patient actions |
| Primary Action | Context-dependent: "Join Consult" or "Book Consult" |
| Info Shown | Upcoming appointment banner / Dinacharya progress / Quick actions / AI card / Top practitioners |
| Backend Event | Feed personalization, appointment status pull |
| Empty State | "Welcome to MeyVeda. Start by booking your first consultation." |
| Error State | Data load failed → "Unable to load. Pull to refresh." |
| Success State | Fully populated dashboard |

*(Additional screens follow same format — abbreviated here for engineering reference)*

#### Screen P-11: Discover / Search
- Discipline filter tiles + search bar + result list + filter panel

#### Screen P-12: Practitioner Profile
- Hero + stats + tabs (About / Reviews / Clinic) + inline booking panel

#### Screen P-13: Slot Selection
- Date strip + time slot grid + mode toggle + patient selector

#### Screen P-14: Booking Configuration
- Reason field + report upload + summary

#### Screen P-15: Payment
- Invoice + payment method grid + "Pay and Confirm"

#### Screen P-16: Booking Confirmation
- Success animation + appointment card + calendar add + reschedule link

#### Screen P-17: Waiting Room
- Doctor card + countdown + camera preview + system checks + guidelines

#### Screen P-18: Teleconsult Session
- Video layout + controls + care plan sidebar

#### Screen P-19: Post-Consult Summary
- Summary card + prescription CTA + order medicines CTA + follow-up CTA + rating prompt

#### Screen P-20: Prescription View
- Prescription card + medicine instructions + download + order CTA

#### Screen P-21: Apothecary Cart
- Item list + quantity controls + wellness items + summary

#### Screen P-22: Checkout (Address + Payment)
- Multi-step: address → payment → confirmed

#### Screen P-23: Order Tracking
- Logistics stepper + map + delivery details + refill toggle

#### Screen P-24: Health Timeline (Records)
- Filter tabs + timeline with expandable nodes + ABHA badge

#### Screen P-25: Consent Manager
- Active consents list + history tab + revoke flow

#### Screen P-26: AI Chat (AyurSanvaad)
- Chat interface + quick prompts + disclaimer + find practitioner CTA

#### Screen P-27: Dinacharya Tracker
- Task checklist + progress bar + streak + reminders

#### Screen P-28: Profile & Settings
- User card + wellness score + Prakriti + menu items + sign out

---

### Doctor Screens

#### Screen D-01: Doctor Registration
- Role selection + credentials form + HPR entry

#### Screen D-02: Document Upload
- Degree / registration certificate / ID upload + status

#### Screen D-03: Verification Status
- State display (Pending / Under Review / Verified / Rejected)

#### Screen D-04: Profile Builder
- Bio + languages + specializations + clinic association + photo

#### Screen D-05: Schedule Setup
- Day-by-day working hours + slot duration + buffer + holiday calendar

#### Screen D-06: Doctor Dashboard (Main)
- Online/offline toggle + stats strip + queue list + quick actions

#### Screen D-07: Patient Queue Card
- Patient name/age + reason + ABHA status + mode + wait time + action buttons

#### Screen D-08: Patient Intake Preview
- Expanded intake: reason + uploads + AI summary + prior visit summary

#### Screen D-09: Consultation Room (Video)
- Doctor-side video layout + patient PiP + EMR panel + controls

#### Screen D-10: EMR Builder
- SOAP tabs + AYUSH assessment fields + herb search + remedy cards

#### Screen D-11: Prescription Builder
- Medicine list + dose/freq/duration/anupana fields + add medicine + finalize

#### Screen D-12: Prescription Review + E-Sign
- Full preview + confirmation + biometric/PIN sign + send

#### Screen D-13: Care Plan Generator
- Lifestyle guidance + follow-up date + care tasks

#### Screen D-14: Follow-Up Manager
- All patients due for follow-up + send reminder + booking status

#### Screen D-15: Patient History View
- All past visits (collapsible timeline) + compare mode + refill CTA

#### Screen D-16: Bounded Inbox
- Patient messages + response field + response timer

#### Screen D-17: Availability Calendar
- Month/week view + slot status + block date + holiday management

#### Screen D-18: Analytics Dashboard
- Monthly stats + satisfaction score + revenue breakdown + prescription insights

#### Screen D-19: Clinic Association Management
- Add/manage clinics + per-clinic slot config

#### Screen D-20: Settings + Profile
- Bio edit + fee update + notification preferences + bank details for payout

---

## 9. Workflow Logic Rules

### AI Scope Rules
| Condition | Rule |
|---|---|
| User asks about a symptom | AI responds with wellness guidance + discipline suggestion + disclaimer |
| User uses emergency keywords | AI halts, shows 108, blocks booking flow |
| User asks for a diagnosis | AI says "I can't diagnose. A practitioner can evaluate this properly." |
| User's symptom sounds chronic | AI recommends booking + follow-up tracking after booking |
| User's question is answered by AI | AI does not auto-promote booking; shows "Book practitioner" as option, not default |
| User asks about allopathic drugs | AI redirects: "This is outside AYUSH scope. Please consult an allopathic specialist." |

### Booking Logic Rules
| Condition | Rule |
|---|---|
| Patient tries to book without completing profile | Prompt to complete profile first |
| Patient books for family member | Consent check for adult family member; minor: automatic |
| Patient has pending payment from prior booking | Show alert before new booking |
| Doctor is offline | Slots still visible; "Next available" date shown |
| Patient is on waitlist | Show position; 30-min priority window on cancellation |
| Repeat booking within 7 days of last consult | Warning: "You recently saw this doctor. Is this for a new concern?" |

### Medicine Order Rules
| Condition | Rule |
|---|---|
| Patient orders prescription medicine | Prescription verification required before dispatch |
| Prescription older than 30 days | "This prescription is over 30 days old. Please confirm with your doctor before ordering." |
| Medicine is a controlled substance (e.g., high-dose arsenic compounds in Ayurveda) | Requires doctor re-authorization per order, no auto-refill |
| Patient wants to order without prescription | Only wellness/OTC items allowed without prescription |
| Refill more than 3 times for same prescription | Prompt "This is your 3rd refill. Would you like to book a follow-up?" |

### Consent Rules
| Condition | Rule |
|---|---|
| Doctor requests access before booking | Not allowed — consent only after patient has booked with that doctor |
| Doctor tries to access records without consent | Access denied; system logs attempt |
| Patient revokes mid-session | Doctor's current view is locked within session (cannot be revoked during live consult for safety) |
| Records from other ABDM facilities | Patient must explicitly grant access to each facility's records |
| Minor patient | Parent/guardian must grant consent |

### Follow-Up Rules
| Condition | Rule |
|---|---|
| Doctor sets follow-up date | System sends patient booking nudge after 48h if not booked |
| Patient hasn't booked follow-up 7 days post-nudge | AI check-in triggered |
| Patient hasn't engaged in 30 days | Notification frequency halved |
| Patient reports "Worse" in wellness check-in | Booking CTA escalated |

---

## 10. Doctor-Patient Interaction Model

### Core Principle: Booking-Gated Care
- All clinical interaction is bounded by a booking. There is no open chat channel.
- Exception: 48-hour post-consult window for clarification messages only.

### Interaction Channels
| Channel | When Available | What's Allowed |
|---|---|---|
| Video/Audio consult | During booked session | Full clinical conversation |
| Post-consult message | 48h after session | Clarification questions, adverse reaction reports |
| AI assistant | Always | Wellness queries, reminders, booking help |
| Doctor-initiated reminder | At doctor's discretion | "Time for your follow-up" nudge |
| Prescription annotation | Within 48h of issuing | Additional instructions on prescribed item |
| Platform notification | System-triggered | Appointment reminders, prescription ready, follow-up due |

### What Patients Cannot Do
- Send new clinical questions outside booking window
- Contact a doctor they haven't booked with
- Request a prescription without a consultation

### What Doctors Cannot Do
- Prescribe without a consultation record
- Access patient records without consent
- Initiate unsolicited messages to patients
- Use patient data for any purpose outside the platform

### AI-First vs Doctor-First Triage
- Wellness queries, routine advice, Dinacharya: AI-first
- Symptom assessment, concern escalation: AI-first with doctor booking CTA
- Clinical evaluation, diagnosis, prescription: Doctor-only, AI is disabled for these

### Billing-Linked Follow-Up Rule
- Follow-up consultations within 7 days for the same concern: discounted follow-up fee (configurable per doctor, platform default: 50% of standard fee)
- Refill authorization without consult: free action for doctor, but counted as a touch-point in analytics

---

## 11. Trust and Safety Design Rules

### Verified Doctor Indicators
- Every practitioner card shows: green HPR verified shield + HPR ID (last 4 digits)
- Profile shows: degree, council registration, year of graduation
- "HPR Verified" must appear on every booking confirmation
- Unverified practitioners: not discoverable, not bookable

### Verified Clinic Indicators
- HFR (Health Facility Registry) registration badge on clinic profile
- Address validated, photo required
- Clinic staff members listed with access levels

### Privacy Language Standards
- Never say "We collect your data." Say "Your information helps us give you better care."
- Consent screens: explain the purpose, who sees it, for how long — every time
- Data deletion: "Delete my account" is always accessible, always in plain sight under Settings > Privacy

### Record Access Notices
- Every time a practitioner views a patient's records: patient gets a notification (non-intrusive, logged)
- Consent receipts: timestamp, practitioner name, record type accessed, duration

### Consent Receipts
- All consent events (grant, deny, revoke) generate a receipt visible in Consent Manager
- Receipts are permanent, non-deletable
- Format: "[Doctor name] was granted access to [record type] on [date] until [date]."

### AI Limitation Messaging
- Always visible on AI chat: "AyurSanvaad AI provides wellness guidance only. Not a substitute for medical advice."
- Never hidden, never behind a toggle
- Escalation language: "For medical decisions, please consult a verified AYUSH practitioner."

### Emergency Disclaimer Handling
- Emergency escalation is never chatbot-like. It is a full-screen interrupt with:
  - Red background or strong visual break
  - "Please call 108 (Emergency Services) immediately."
  - One-tap call button
  - No booking options shown on this screen

### Payment Trust
- PCI-DSS compliant payment gateway
- "This is a secure payment. MeyVeda does not store your card details."
- All transaction receipts sent to registered mobile + email

### Medical Document Authenticity
- Every prescription has: QR code linking to ABHA-registered prescription
- Prescription PDF shows: digital signature, timestamp, HPR ID, watermark
- Pharmacies can verify prescription authenticity via QR scan

### Timestamping
- All records, prescriptions, consults, and consent events are timestamped in IST with UTC reference
- Timestamps are immutable after finalization

---

## 12. UX Copy Guidance

### Tone Principles
- **Warm, not clinical.** "Dr. Aditi is ready for you" not "Patient appointment initiated."
- **Clear, not jargon-heavy.** "Your health records" not "PHI data payload."
- **Non-alarmist.** "Something seems off with your camera. Let's fix it." not "Camera error. Code 403."
- **Respectful of time.** Short sentences. No unnecessary words.
- **Premium, not corporate.** "Reinvent You" not "Book an Appointment Today."
- **Healthcare-safe.** No overclaiming. No diagnostic language from the platform.

### Microcopy by Scenario

**Onboarding:**
- "Let's get you started." (not "Create your account")
- "Your health, your records, your control." (consent intro)
- "This takes about 2 minutes." (intake)
- "You can always change this later." (optional fields)

**Consent Requests:**
- "Dr. [Name] is asking to access your consultation records from the past 6 months to prepare for today's session. This is optional — you can deny access and still have the consultation."
- "You're in control. You can revoke this access anytime."
- "Consent granted. Dr. [Name] can view your records until [date]."

**Booking Confirmation:**
- "You're all set. Dr. [Name] is looking forward to your session."
- "We'll remind you 24 hours and 1 hour before your consult."
- "Need to change your booking? No problem — tap Reschedule."

**Waiting Room:**
- "Dr. [Name] is finishing up with another patient. Your session begins in about [X] minutes."
- "You're ready. Your camera and microphone are working well."
- "Stay here — we'll let you know the moment Dr. [Name] is ready."

**Prescription Release:**
- "Your care plan is ready." (notification)
- "Dr. [Name] has prescribed the following for you. Please read through at your own pace."
- "Something unclear? You can send Dr. [Name] a message within the next 48 hours."

**Medicine Order:**
- "We'll take care of getting your prescribed medicines to you."
- "Authentic AYUSH-certified products, delivered with care."
- "Your prescription has been securely sent to our pharmacy partner."

**Follow-Up Reminders:**
- "Dr. [Name] suggested checking in around now. How are you feeling?"
- "It's been [X] weeks. Ready for your next session with Dr. [Name]?"
- "Your Ashwagandha Churna is due for a refill in 5 days. Reorder with one tap."

**Doctor Status Messages:**
- "Dr. [Name] is online and ready to take appointments."
- "Dr. [Name] is running about 15 minutes behind schedule."
- "Dr. [Name] is not available today. Here are the next available slots."

**Payment Issues:**
- "Your payment didn't go through. Your slot is held for 8 more minutes."
- "Try a different payment method. Your slot is still waiting."
- "Need help? Contact support — we'll get this sorted."

**Teleconsult Issues:**
- "The video connection dropped. We're trying to reconnect…"
- "Switching to audio mode. Dr. [Name] will call you on [number] shortly."
- "The call didn't connect. Dr. [Name] will reach out to reschedule this session. A full refund has been initiated."

**Reschedule / Cancellation:**
- "We've rescheduled your session. Dr. [Name] has been notified."
- "Your booking has been cancelled. A refund of ₹[amount] will reach you in 5–7 business days."
- "Your slot has been released. We hope to see you again soon."

---

## 13. MVP Workflow Priority

### Tier 1: Critical for Launch (MVP)

| Workflow | Rationale |
|---|---|
| Patient Onboarding (OTP + profile) | Cannot use platform without this |
| Practitioner Discovery + Filtering | Core value: connecting patients to doctors |
| Appointment Booking (video + in-clinic) | Core revenue event |
| Payment Flow | Enables monetization |
| Booking Confirmation + Reminders | Trust and experience baseline |
| Teleconsultation Session | Core product value |
| EMR / Note-taking (SOAP + AYUSH fields) | Clinical workflow, mandatory for doctors |
| Prescription Issuance (digital) | Closes consultation loop |
| Post-Consult Summary (patient) | Completion of care moment |
| Doctor Dashboard + Queue | Doctor's operational layer |
| Doctor Onboarding + Verification | Cannot list doctors without this |
| Availability + Schedule Setup | Cannot take bookings without this |
| ABHA Linking (optional, guided) | ABDM compliance from day 1 |
| Health Records Timeline (basic) | ABDM-linked record keeping |

### Tier 2: Important for v1.1

| Workflow | Rationale |
|---|---|
| Medicine Ordering (Apothecary) | Revenue extension, care continuity |
| Follow-Up Booking Flow | Care continuity, retention |
| Family Profiles | India-specific, high-demand feature |
| Consent Manager | ABDM full compliance |
| Dinacharya Tracker | Daily engagement, retention |
| AyurSanvaad AI (basic) | Differentiation, patient education |
| Symptom-Led Discovery | Better conversion than browse |
| In-Clinic Check-In + Queue | Clinic operations |
| Delivery Tracking (Orders) | Post-purchase experience |
| Follow-Up Reminder System | Adherence, retention |

### Tier 3: Later Phase (v2.0)

| Workflow | Rationale |
|---|---|
| Full ABHA/ABDM HIU/HIP integration | Complex, needs regulatory readiness |
| AI wellness check-ins (full NLP) | Requires AI infrastructure maturity |
| Multi-location clinic management | Scale, enterprise |
| Waitlist management | Operational sophistication |
| Refill authorization workflow | Requires repeat patient volume |
| Analytics dashboard for doctors | Nice-to-have after core works |
| Medicine substitution engine | Requires pharmacy API depth |

### Tier 4: Enterprise / Scale Phase

| Workflow | Rationale |
|---|---|
| Clinic admin multi-doctor management | Enterprise clinic chains |
| Insurance / Ayushman Bharat integration | Policy complexity |
| Pharmacovigilance reporting | Regulatory |
| Interoperability with ABDM FHR | Deep infrastructure |
| Voice-to-text EMR (regional languages) | AI maturity required |
| Video consultation SDK replacement | Platform maturity |

---

## 14. Final Implementation Output

### Top 15 Patient Screens to Design First

1. Splash / Welcome (P-01)
2. Mobile OTP + Verification (P-03, P-04)
3. ABHA Linking (P-05)
4. Profile Creation (P-06)
5. Home Dashboard (P-10)
6. Discover / Search + Filters (P-11)
7. Practitioner Profile + Inline Booking (P-12, P-13)
8. Booking Configuration (P-14)
9. Payment (P-15)
10. Booking Confirmation (P-16)
11. Waiting Room (P-17)
12. Teleconsult Session (P-18)
13. Post-Consult Summary (P-19)
14. Prescription View (P-20)
15. Health Records Timeline (P-24)

### Top 15 Doctor Screens to Design First

1. Doctor Registration (D-01)
2. Document Upload + Verification Status (D-02, D-03)
3. Profile Builder (D-04)
4. Schedule Setup (D-05)
5. Doctor Dashboard / Queue (D-06)
6. Patient Queue Card (D-07)
7. Patient Intake Preview (D-08)
8. Consultation Room (D-09)
9. EMR Builder — SOAP + AYUSH (D-10)
10. Prescription Builder (D-11)
11. Prescription E-Sign (D-12)
12. Care Plan Generator (D-13)
13. Follow-Up Manager (D-14)
14. Patient History / Repeat Patient (D-15)
15. Analytics Dashboard (D-18)

### Top 10 Workflow Risks

| Risk | Mitigation |
|---|---|
| 1. Video call failure during consult | Audio fallback + phone call fallback designed as first-class states |
| 2. Payment failure leaving slot in limbo | 8-min lock + auto-release + retry UX |
| 3. Doctor no-show | Immediate refund + rebooking + internal penalty tracking |
| 4. Prescription signed with wrong dose | Pharmacopoeia range validation alert before signing |
| 5. Consent records lost or inaccessible | ABDM-compliant storage with patient-visible audit trail |
| 6. Fake doctor onboarding | Manual review + HPR verification + document checks |
| 7. Patient abandonment post-booking | Reminders at 24h / 1h / 15 min + waitlist re-engagement |
| 8. Medicine substitution error | Pharmacist-only approval for substitutes, no algorithmic auto-sub |
| 9. Emergency symptom in AI chat not caught | Keyword list + semantic detection + full-screen interrupt |
| 10. ABHA linking failure blocking onboarding | Always optional; clear skip path; multiple retry options |

### Top 10 Trust Moments to Emphasize

1. **Verified doctor badge** — visible on every card, profile, and confirmation
2. **ABHA linking success** — "Your health records are now secured and portable across India"
3. **Consent grant receipt** — visible, timestamped, permanent
4. **Booking confirmation** — "HPR Verified" shown prominently on confirmation card
5. **Encryption indicator in waiting room** — "This session is end-to-end encrypted"
6. **Prescription with QR code and digital signature** — "Issued by Dr. [Name] HPR [ID]"
7. **Payment receipt** — "Secure payment. Your card details are not stored."
8. **Post-consult record sync notification** — "Your care plan has been added to your ABHA health locker"
9. **Consent revocation confirmation** — "Done. Dr. [Name] can no longer access your records."
10. **AI disclaimer** — always visible, never dismissible

### Recommended Design Order for UI/UX Team

**Week 1–2:** Patient core (P-01 to P-10: onboarding, discovery, booking)
**Week 3–4:** Patient consult + prescription (P-11 to P-20: profile, booking, consult, prescription)
**Week 5–6:** Doctor core (D-01 to D-08: registration, verification, dashboard, queue)
**Week 7–8:** Doctor clinical (D-09 to D-15: consultation room, EMR, prescription, care plan)
**Week 9–10:** Supporting workflows (consent manager, records, order tracking, analytics)
**Week 11–12:** States and exceptions (empty states, error states, loading states, fallbacks)

### Recommended Build Order for Product and Engineering Teams

**Sprint 1 (2 weeks):** Auth layer (OTP, ABHA linking, session management), user profile CRUD, database schema for patients and practitioners.

**Sprint 2 (2 weeks):** Doctor onboarding + verification state machine, HPR integration (or mock), slot and schedule management.

**Sprint 3 (2 weeks):** Practitioner discovery (search, filter, sort), practitioner profile API, availability API.

**Sprint 4 (2 weeks):** Appointment booking (slot lock, payment gateway, confirmation), booking CRUD, reminder notification system.

**Sprint 5 (2 weeks):** Teleconsultation session (WebRTC integration, audio fallback, session recording infrastructure).

**Sprint 6 (2 weeks):** EMR module (SOAP structure, AYUSH fields, note draft and finalize, attachment management).

**Sprint 7 (2 weeks):** Prescription module (medicine database, dose entry, e-sign, prescription PDF generation, ABHA push).

**Sprint 8 (2 weeks):** Records timeline (FHIR-compatible structure, ABHA sync, filter and search).

**Sprint 9 (2 weeks):** Consent manager (grant, deny, revoke, audit trail, ABDM HIU/HIP compliance).

**Sprint 10 (2 weeks):** Apothecary (cart, prescription-linked ordering, pharmacy partner API, checkout, delivery tracking).

**Sprint 11 (2 weeks):** Follow-up system (doctor-set intervals, patient reminders, rebooking flow, Dinacharya tracker).

**Sprint 12 (2 weeks):** AyurSanvaad AI (basic keyword NLP, wellness responses, emergency detection, practitioner booking CTA).

---

## Add-On A: Swimlane Workflow — Core Patient Booking + Consult

```
ACTOR     │ PATIENT              │ PLATFORM SYSTEM       │ DOCTOR               │ ABDM LAYER
──────────┼──────────────────────┼───────────────────────┼──────────────────────┼────────────────────
DISCOVERY │ Opens app            │                       │                      │
          │ Searches doctor      │ Returns filtered list  │                      │
          │ Views profile        │ Serves profile data    │                      │
          │ Selects slot         │                       │                      │
                                                         
BOOKING   │ Configures visit     │                       │                      │
          │ Uploads reports      │ Stores files securely  │                      │
          │ Initiates payment    │ Calls payment gateway  │                      │
          │ Payment confirmed    │ Locks slot             │                      │
          │                      │ Creates booking record │ Receives notification│
          │ Receives confirmation│ Sends confirmation     │                      │
          │                      │ Schedules reminders    │                      │

PRE-VISIT │ Gets 24h reminder    │ Sends push + SMS       │                      │
          │ Gets 1h reminder     │ Sends push             │                      │
          │ Opens waiting room   │ Device checks          │ Sees patient intake  │
          │                      │                       │ Marks intake reviewed │
          │                      │ Notifies patient       │                      │

CONSULT   │ Joins session        │ Establishes WebRTC     │ Joins session        │
          │ Identity confirmed   │ Verifies ABHA name     │ Confirms identity    │
          │ Participates         │ Session running        │ Notes, assessment    │
          │                      │ Auto-saves draft EMR   │                      │
          │ Session ends         │ Closes session         │ Finalizes EMR        │

POST      │ Sees "plan preparing"│                       │ Writes prescription  │
          │                      │                       │ E-signs prescription │
          │                      │ Pushes Rx to patient  │                      │ Syncs to ABHA locker
          │ Receives Rx notif.   │                       │                      │
          │ Views care plan      │                       │                      │
          │ Orders medicines     │ Routes to pharmacy     │                      │
          │ Books follow-up      │ Creates new booking    │ Receives follow-up   │
```

---

## Add-On B: MVP-Only Reduced Workflow Set

For a lean MVP, reduce to these essential flows:

**Must Have — Cannot Launch Without:**
1. Patient OTP login → Profile creation
2. Practitioner list + profile view
3. Slot selection + booking
4. UPI/card payment
5. Booking confirmation + SMS/push reminder
6. Teleconsult session (video + audio fallback)
7. Doctor dashboard + queue (online/offline toggle)
8. Patient intake preview (doctor side)
9. EMR note-taking (SOAP + basic AYUSH fields)
10. Prescription creation + e-sign
11. Prescription view (patient side)
12. Post-consult summary
13. Basic health records timeline
14. Doctor onboarding + document upload
15. Verification state machine

**Simplify for MVP (Full Feature in v1.1):**
- ABHA linking: collect ID, full integration later
- Consent Manager: basic grant/deny, full ABDM sync later
- Apothecary: display only, ordering in v1.1
- AI assistant: basic FAQ bot, full NLP in v1.1
- Family profiles: single profile only in MVP
- In-clinic check-in: manual (receptionist marks), app-based in v1.1
- Analytics for doctors: basic stats only in MVP

---

## Add-On C: Screen-to-Component Mapping Table

| Screen | Key Components |
|---|---|
| P-01 Splash | Logo, Tagline, TrustBadges, CTAButton |
| P-03/04 OTP | PhoneInput, OTPBox×4, ResendTimer, CTAButton |
| P-05 ABHA | InfoCard, RadioChoice, AadhaarInput, TrustNote |
| P-10 Dashboard | WelcomeBanner, AppointmentCard, DinacharTracker, QuickActions, AIChatCard, PractitionerList |
| P-11 Discover | DisciplineFilterGrid, SearchBar, FilterPanel, PractitionerCard×N |
| P-12 Profile | HeroCard, StatsBadges, TabNavigation, ReviewCard, BookingPanel |
| P-13 Slot Selection | DateStrip, TimeSlotGrid, ModeToggle, PatientSelector |
| P-15 Payment | InvoiceSummary, PaymentMethodGrid, CTAButton, SecurityBadge |
| P-17 Waiting Room | DoctorCard, Countdown, CameraPreview, SystemCheckList, GuidelineCard |
| P-18 Consult | VideoLayout, Controls, EMRSidePanel, ChatPanel |
| P-19 Post-Consult | SummaryCard, ActionButtons (Rx, Order, Follow-up), RatingPrompt |
| P-20 Prescription | PrescriptionHeader, MedicineCard×N, LifestyleCard, DownloadButton |
| P-24 Records | FilterTabs, TimelineNode×N, RecordCard, ABHABadge |
| P-25 Consent | ConsentCard×N, RevokeButton, ConsentHistory, InfoBanner |
| D-06 Dashboard | StatsStrip, OnlineToggle, QueueList, QuickActions |
| D-09 Consult Room | VideoLayout, PatientPiP, Controls, EMRPanel |
| D-10 EMR Builder | SOAPTabs, AYUSHAssessment, HerbSearch, RemedyCard×N |
| D-11 Rx Builder | MedicineSearchInput, RxItemCard×N, AnupanaSelect, FinalizeButton |
| D-12 E-Sign | RxPreview, SignatureConfirm, BiometricPrompt, SendButton |

---

## Add-On D: Workflow-to-Backend-Events Mapping Table

| Workflow Event | Backend Event Triggered |
|---|---|
| OTP requested | `auth.otp.dispatch` → SMS/WhatsApp gateway |
| OTP verified | `auth.session.create` → JWT issued |
| ABHA linked | `abha.link.initiate` → NHA API → demographics pull |
| Profile created | `patient.profile.create` → DB write, ABHA push (if linked) |
| Slot selected | `booking.slot.lock` → 8-min lock in slot table |
| Payment success | `booking.payment.confirm` → booking record created, slot permanently locked, `notification.booking.confirm` dispatched |
| Payment failure | `booking.slot.release` after 8 min, `notification.payment.failed` dispatched |
| Booking confirmed | `notification.doctor.new_booking`, `notification.patient.confirmation`, `reminder.schedule` (24h, 1h, 15min) |
| Patient joins waiting room | `session.patient.ready` → doctor notified |
| Session started | `consultation.session.start` → session record created, timer started |
| Video failure | `session.webrtc.fail` → `session.fallback.audio` → `session.call.initiate` |
| Session ended | `consultation.session.end` → duration logged, `emr.draft.available` |
| EMR finalized | `emr.finalize` → timestamped, locked, `prescription.available_to_issue` |
| Prescription signed | `prescription.esign` → PDF generated, `abha.push.prescription`, `notification.patient.rx_ready`, `pharmacy.order.available` |
| Patient orders medicine | `order.cart.create` → `prescription.verify` → `pharmacy.order.dispatch` |
| Delivery status updated | `order.status.update` → `notification.patient.delivery_update` |
| Consent granted | `consent.grant` → ABDM HIU request fulfilled → `consent.receipt.create` → `notification.patient.consent_granted` |
| Consent revoked | `consent.revoke` → ABDM HIU access terminated → `consent.audit.log` → `notification.doctor.access_revoked` |
| Follow-up date set | `followup.schedule` → `reminder.followup.queue` (triggered at follow-up date - 7 days) |
| Emergency keyword detected | `ai.emergency.escalate` → `notification.patient.emergency` + call button shown |
| Doctor marks no-show | `booking.noshow` → `refund.policy.evaluate` → `notification.patient.noshow` |

---

## Add-On E: Workflow-to-API/Module Dependency List

| Workflow | API / Module Dependencies |
|---|---|
| OTP Auth | SMS Gateway (Twilio / AWS SNS / MSG91), Auth Service, Session Service |
| ABHA Linking | NHA ABHA API (abha.ndhm.gov.in), Aadhaar OTP Gateway, Demographics Service |
| Profile CRUD | Patient Service, ABHA Service, S3 (profile photo) |
| Slot Management | Schedule Service, Calendar API, Slot Lock (Redis), Timezone Service |
| Payment | Razorpay / Stripe / PhonePe Gateway, Payment Service, Refund Service, GST Calculation |
| Booking | Booking Service, Notification Service (push + SMS + email), Calendar Export |
| Notifications | Firebase Cloud Messaging (push), Twilio (SMS), SendGrid (email), Notification Preference Service |
| Teleconsult Session | WebRTC (Daily.co / Agora / Jitsi), Session Service, Media Server, Call Recording (if enabled), Phone Fallback (Twilio masked calling) |
| EMR | EMR Service, FHIR R4 API, Document Service (S3), Voice-to-Text (future: Whisper API) |
| Prescription | Prescription Service, AYUSH Drug Database, Digital Signature Service, PDF Generator, ABHA HIP Push API |
| Pharmacy / Order | Order Service, Pharmacy Partner API, Logistics Partner API (Shiprocket / Delhivery), Inventory Service |
| Consent | ABDM HIU/HIP API, Consent Service, Audit Log Service, ABHA Consent Manager |
| Health Records | Records Service, FHIR R4, ABHA Health Locker API, S3, Search Service (Elasticsearch) |
| AI (AyurSanvaad) | LLM API (Claude or GPT-4 with AYUSH knowledge base), Intent Classification Service, Emergency Detection Service, Chat Service |
| Analytics | Analytics Service, Data Warehouse (BigQuery / Redshift), Reporting API |
| Verification | HPR API (healthprofessionals.gov.in), Document OCR Service, Manual Review Queue, State Council API (future) |
| Reminders | Cron Service, Reminder Queue (Redis / SQS), Notification Service |
| Family Profiles | Linked Profile Service, Consent Relationship Service, Profile Switching Service |
```

---

*This document is the complete MeyVeda Product & UX Workflow Blueprint. Version 1.0 — June 2026.*
*For wireframing: use Section 8 (Screen breakdown). For engineering: use Add-Ons D and E. For prioritization: use Section 13.*
