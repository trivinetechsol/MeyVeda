# MeyVeda MVP: 25 Core Screen Specifications
This document contains the complete layout, component architecture, CTA logic, microcopy, and UI developer handoff specifications for the 25 core screens of the MeyVeda AYUSH digital health platform.

---

## Module 1: Patient Onboarding & Identity

### Screen 1: Welcome & Brand Manifesto
*   **Goal:** Establish brand identity, express the "Reinvent You" vision, and initiate signup.
*   **User:** New or returning patient.
*   **Layout Hierarchy:**
    1.  *Background:* Luminous Ivory base with soft, ambient botanical shadow overlay.
    2.  *Top:* MeyVeda monogram logo (minimalist copper leaf design).
    3.  *Center:* Text slider displaying the brand manifesto: *"India's ancient medical wisdom, verified for your modern life."*
    4.  *Bottom:* Stacked buttons: Primary CTA, Secondary login option, and a footer indicating ABDM alignment.
*   **Components:**
    *   `Manifesto Text Carousel` (Automated 5-second fade transition).
    *   `Pill Stepper Indicator` (3 dots, copper active state).
    *   `Get Started Button` (Primary action).
    *   `Login Option` (Secondary text button).
*   **CTA Logic:** Pressing *"Get Started"* transitions the user to Screen 2 (OTP Verification).
*   **Microcopy Guidance:**
    *   *Main Header:* "Reinvent You."
    *   *Manifesto String:* "A single digital ecosystem for Ayurveda, Yoga, Naturopathy, Unani, Siddha, and Homeopathy."
    *   *Footer:* "ABDM Compliant. Consent-controlled secure health data."
*   **States:**
    *   *Default:* Animated text carousel cycles.
    *   *Loading:* Disabled buttons during initial config fetch.
*   **Handoff Notes:** The background shadow overlay should use an organic SVG path with CSS animation simulating gentle breeze movement (soft blur, 0.05 opacity).

---

### Screen 2: Mobile Number & OTP Verification
*   **Goal:** Secure authentication using a simple, mobile-first OTP process.
*   **User:** All users signing in.
*   **Layout Hierarchy:**
    1.  *Header:* Back navigation button and title: *"Verify Your Mobile."*
    2.  *Center:* Mobile number input field with country code prefix (+91).
    3.  *Sub-Center:* Hidden-by-default OTP input block (appears after mobile entry).
    4.  *Footer:* Resend timer link and verify button.
*   **Components:**
    *   `Numeric Input Field` (Underlined, active botanical green cursor).
    *   `OTP Digit Fields` (4 adjacent input blocks with auto-tabbing).
    *   `Primary Button` (Disabled until 10 digits or 4 OTP digits are entered).
    *   `Timer Countdown` (Muted grey caption).
*   **CTA Logic:** Tapping *"Send OTP"* displays the OTP input. Tapping *"Verify"* submits OTP. Valid verification routes to Screen 3.
*   **Microcopy Guidance:**
    *   *Input Helper:* "We will send a 4-digit code to verify your identity."
    *   *Resend String:* "Didn’t receive the code? Resend in 00:45."
*   **States:**
    *   *Error State:* Border turns sandalwood red, displaying: *"Invalid OTP. Please try again."*
    *   *Loading State:* Button displays a loading spinner.
*   **Handoff Notes:** Input fields must auto-focus on load. Disable keyboard layouts containing alphabet keys.

---

### Screen 3: Account Type Selection
*   **Goal:** Guide users to the correct interface based on their role (Patient vs. Provider/Clinic).
*   **User:** Authenticated user signing in for the first time.
*   **Layout Hierarchy:**
    1.  *Top:* Step progress bar (Step 2 of 4). Title: *"Tell us who you are."*
    2.  *Center:* Grid layout presenting two distinct cards: Patient vs. Practitioner.
    3.  *Bottom:* Quick link for Clinic Admin portals.
*   **Components:**
    *   `Selection Cards` (Large rounded rectangles with line-art illustrations).
    *   `Information Badges` (Explaining details for each role).
    *   `Continue Button` (Primary action).
*   **CTA Logic:** Selecting a card highlights it. Pressing *"Continue"* routes to the respective onboarding flow (Patient ──► Screen 4, Practitioner ──► Screen 23).
*   **Microcopy Guidance:**
    *   *Patient Card:* "Seeking Care: Consult doctors, track wellness routines, and order remedies."
    *   *Practitioner Card:* "MeyVeda Pro: Configure calendars, write digital prescriptions, and access EMRs."
*   **States:**
    *   *Default:* No card selected; Continue button is disabled.
    *   *Selected:* Highlighting card with a solid border and enabling button.
*   **Handoff Notes:** Card hover/select states should feature a scale animation (`scale: 1.02`) and border-color transitions.

---

### Screen 4: ABHA ID Integration
*   **Goal:** Securely link the user's government-issued health identity (ABHA) or support new card creation.
*   **User:** Newly registered patients.
*   **Layout Hierarchy:**
    1.  *Top:* Progress indicator. Header: *"Link Your Digital Health Identity."*
    2.  *Center:* Dual-option container. Option A: Input Aadhaar/ABHA Number. Option B: Register from scratch.
    3.  *Bottom:* ABDM certification stamps and Skip link.
*   **Components:**
    *   `Aadhaar Input Field` (12-digit layout).
    *   `NHA Security Seal` (Official badge).
    *   `Confirm Aadhaar Button` (Active state).
    *   `Skip Text Button` (Muted gray link).
*   **CTA Logic:** Pressing *"Confirm"* triggers Aadhaar-OTP. Tapping *"Skip"* bypasses to Screen 5.
*   **Microcopy Guidance:**
    *   *Header explanation:* "Linking your ABHA enables your doctors to securely access your medical timeline."
    *   *Safety tag:* "Data is shared only with your explicit, time-bound consent."
*   **States:**
    *   *Success:* Shows patient's photo retrieved from the government database.
    *   *Error:* Aadhaar-OTP validation failure message.
*   **Handoff Notes:** The skip option must trigger a confirmation popup explaining the limitations of not linking ABHA.

---

### Screen 5: Baseline Wellness Intake
*   **Goal:** Determine user body constitution (*Prakriti* / *Mizaj*) and primary health goals.
*   **User:** Onboarded patients.
*   **Layout Hierarchy:**
    1.  *Top:* Header: *"Personalize Your Journey."*
    2.  *Center:* Scrollable multi-select chips listing health goals (e.g., Sleep, Digestion, Immunity, Stress).
    3.  *Sub-Center:* Dropdown selectors for metabolic tendencies (appetite, energy cycles).
    4.  *Bottom:* Primary save button.
*   **Components:**
    *   `Multi-select Pill Chips` (Toggles on tap).
    *   `Single-choice Dropdown Lists` (Custom layout).
    *   `Save & Finish Button` (Triggers home feed initialization).
*   **CTA Logic:** Tapping *"Save"* commits data to the user profile and opens Screen 6.
*   **Microcopy Guidance:**
    *   *Goal Tag:* "Select at least 2 areas you wish to improve."
    *   *Helper Option:* "This questionnaire is based on AYUSH diagnostic principles."
*   **States:**
    *   *Progressive Loading:* Show skeleton placeholders while personalizing the dashboard feed.
*   **Handoff Notes:** Keep vertical scroll physics fluid, applying subtle transitions as card headers fade into view.

---

## Module 2: Patient App Discovery & Booking

### Screen 6: Patient Home Dashboard
*   **Goal:** The main landing workspace for patients. Displays routines, upcoming consults, and AI.
*   **User:** Onboarded patients.
*   **Layout Hierarchy:**
    1.  *Header:* Hello greeting, ABHA status badge, and profile button.
    2.  *Daily Routine Widget (Dinacharya):* Habits list showing time and check boxes.
    3.  *Consult Shortcut:* Large callout button: *"Consult an AYUSH Specialist."*
    4.  *Upcoming Appointments Card:* Displays active consultations and a direct *"Join Waiting Room"* button.
    5.  *AyurSanvaad AI Banner:* Quick-access entry point for AI chat.
    6.  *Bottom Navigation:* Sticky tab bar (Home, Consult, Records, Apothecary, Profile).
*   **Components:**
    *   `Dinacharya Task Row` (Swipe to complete habit).
    *   `Appointment Banner` (With countdown timer).
    *   `Bottom Tab Navigation` (Icons and text labels).
*   **CTA Logic:** Tapping *"Consult"* launches Screen 7. Tapping the AI Banner opens Screen 19.
*   **Microcopy Guidance:**
    *   *Daily Greeting:* "Good Morning, Rohit. Maintain your Pitta balance today."
    *   *Dinacharya task:* "07:30 AM : Sip warm water with lemon."
*   **States:**
    *   *No Appointments:* Card displays a clean placeholder illustration: *"No consults scheduled. Ready to consult a specialist?"*
*   **Handoff Notes:** The Dinacharya row must support a swipe-right gesture to check off tasks, displaying a subtle green celebration feedback.

---

### Screen 7: Specialty Discovery Hub
*   **Goal:** Introduce and explain the 6 AYUSH disciplines to guide user selection.
*   **User:** Patients looking to book care.
*   **Layout Hierarchy:**
    1.  *Header:* Back arrow, Search bar. Title: *"Explore Specialties."*
    2.  *Center Grid:* 6 clean cards representing Ayurveda, Yoga, Naturopathy, Unani, Siddha, Homeopathy.
    3.  *Footer Card:* Educational snippet regarding Sowa-Rigpa.
*   **Components:**
    *   `Specialty Cards` (Custom illustrations, HPR verification stats).
    *   `Global Search Bar` (Symptom/Doctor search).
*   **CTA Logic:** Tapping a card opens Screen 9, filtered by that specialty. Tapping the search bar triggers Screen 8.
*   **Microcopy Guidance:**
    *   *Ayurveda details:* "Holistic herbal remedies and body constitution balance."
    *   *Verification indicator:* "1,200+ HPR Verified Doctors."
*   **States:**
    *   *Focus:* Search input triggers typing auto-suggestions.
*   **Handoff Notes:** Cards must have equal dimensions. Use SVGs for specialty icons to ensure scalability on diverse device screens.

---

### Screen 8: Symptom-Led Guided Search
*   **Goal:** Enable users to find providers based on symptoms without needing to know which discipline they require.
*   **User:** Symptomatic patients.
*   **Layout Hierarchy:**
    1.  *Header:* Search bar with active keyboard focus.
    2.  *Center:* Grouped lists under categories: *"Common Concerns"*, *"Digestion"*, *"Joint Pain"*, *"Sleep & Stress"*.
    3.  *Bottom:* Recommendation banner displaying relevant AYUSH disciplines.
*   **Components:**
    *   `Categorized Chip Lists` (Rounded border tags).
    *   `Recommendation Drawer` (Slides up from the bottom).
*   **CTA Logic:** Selecting a chip (e.g., *"Acid Reflux"*) opens the drawer suggesting: *"We recommend consulting Ayurveda or Homeopathy for this issue."* Tapping a recommended discipline opens Screen 9.
*   **Microcopy Guidance:**
    *   *Search Placeholder:* "Search symptoms like bloating, insomnia, migraine..."
    *   *Recommendation Title:* "Recommended disciplines based on clinical standards."
*   **States:**
    *   *Empty State:* *"We couldn't find matching symptoms. Try consulting AyurSanvaad AI for guidance."*
*   **Handoff Notes:** The recommendation drawer should animate using spring mechanics for a natural slide-up transition.

---

### Screen 9: Practitioner Search Results Directory
*   **Goal:** Present a list of matching doctors with filters to facilitate selection.
*   **User:** Booking patients.
*   **Layout Hierarchy:**
    1.  *Header:* Search summary, filter pills row (Availability, Price, Distance, Consultation Mode).
    2.  *List Body:* Vertical scrollable list of practitioner cards.
    3.  *Footer:* "Not sure who to book? Ask AyurSanvaad AI."
*   **Components:**
    *   `Filter Chips` (Active/inactive states).
    *   `Practitioner Summary Card` (Avatar, Name, Specialty, Experience, Rating, Fee, HPR verified badge).
*   **CTA Logic:** Tapping a doctor card routes to Screen 10.
*   **Microcopy Guidance:**
    *   *Results Indicator:* "Found 42 Verified Ayurveda Doctors."
    *   *Fee Label:* "Consultation fee starts at ₹499."
*   **States:**
    *   *Filter Active:* Pill border shifts to botanical green with a small close icon.
    *   *No Results:* Displays: *"No matches found for active filters. Clear filters to see all."*
*   **Handoff Notes:** Standardize list container dimensions. Implement infinite scroll with a skeletal loading animation footer.

---

### Screen 10: Practitioner Profile & Availability
*   **Goal:** Provide full credentials, qualifications, and booking triggers for a doctor.
*   **User:** Booking patients.
*   **Layout Hierarchy:**
    1.  *Top:* Back arrow, Share button. Hero header with doctor picture, name, HPR registry badge.
    2.  *Profile Body:* Tabbed view (About, Experience, Reviews, Clinic locations).
    3.  *Calendar Block:* Horizontal date slider.
    4.  *Bottom:* Sticky action banner displaying selected slot info and the checkout button.
*   **Components:**
    *   `HPR Verification Badge` (Triggers modal with registry details).
    *   `Horizontal Date Selector` (Scrollable timeline).
    *   `Time Slots Grid` (Separated into Morning, Afternoon, Evening).
    *   `Sticky Footer Button` (Disabled until time slot selection).
*   **CTA Logic:** Selecting date & time updates the sticky button. Tapping the button opens Screen 11.
*   **Microcopy Guidance:**
    *   *About summary:* "Senior Ayurvedic Physician with 15+ years experience in chronic joint management."
    *   *HPR badge text:* "HPR Verified: Registry ID: 4902-8822."
*   **States:**
    *   *Default:* Slots are blank until a date is tapped.
    *   *Booked out:* Slots are grayed out displaying *"Full"*.
*   **Handoff Notes:** Ensure that dates and slots update dynamically without page reloads using a performant state manager.

---

### Screen 11: Booking Customizer
*   **Goal:** Let users configure booking parameters (Consult Mode, Patient profile, Vitals intake).
*   **User:** Booking patients.
*   **Layout Hierarchy:**
    1.  *Header:* Title: *"Configure Your Appointment."*
    2.  *Consultation Mode:* Segmented control: `[ Video Call ]  [ In-Clinic Visit ]`.
    3.  *Patient Selector:* Row of avatars representing family profiles.
    4.  *Brief Intake Form:* Text area input for symptoms and a files attachment card.
    5.  *Bottom:* Continue button.
*   **Components:**
    *   `Segmented Mode Switcher` (Clean sliding highlight).
    *   `Family Member Add Pill` (Pulsing "+" button).
    *   `Intake Text Area` (With word counter).
    *   `Attachment Button` (File/Image upload tracker).
*   **CTA Logic:** Clicking *"Continue"* saves details and routes to checkout Screen 12.
*   **Microcopy Guidance:**
    *   *Mode helper:* "Video Consultations are conducted on secure, encrypted channels."
    *   *Intake placeholder:* "Briefly describe your current symptoms and health history..."
*   **States:**
    *   *File Uploading:* Progress ring on attachment card.
*   **Handoff Notes:** The family selector must feature a smooth horizontal slide when adding profiles.

---

### Screen 12: Checkout & Payment Page
*   **Goal:** Present the final invoice details and securely process payments.
*   **User:** Booking patients.
*   **Layout Hierarchy:**
    1.  *Header:* Title: *"Summary & Payment."*
    2.  *Summary Card:* Doctor details, date, time, and consultation mode.
    3.  *Invoice breakdown:* Consult fee, taxes, transaction fees, discounts, and Total Payable.
    4.  *Payment Mode:* UPI options (GPay, PhonePe, UPI ID input), Net Banking, Cards.
    5.  *Bottom:* Primary pay action button.
*   **Components:**
    *   `Detailed Invoice Table` (Right-aligned numbers).
    *   `UPI Payment Radio Group` (Selectable item list).
    *   `Pay Now Button` (Displaying total amount on button label).
*   **CTA Logic:** Selecting payment and tapping *"Pay Now"* launches the payment gateway interface. Success transitions to Screen 13.
*   **Microcopy Guidance:**
    *   *Price summary:* "Total Payable: ₹588.00."
    *   *Security Tag:* "Secure gateway. 256-bit encryption."
*   **States:**
    *   *Processing:* Button displays: *"Authorizing Payment..."* with all page controls disabled.
    *   *Failure:* sand red modal: *"Payment Declined. Try another method."*
*   **Handoff Notes:** The UPI selection list should deep-link directly to local payment apps, bypass redirects where possible, and return to the app's confirmation screen.

---

### Screen 13: Booking Confirmation & Pre-consult Instructions
*   **Goal:** Acknowledge payment success and outline preparation guidelines for the user.
*   **User:** Confirmed booking patients.
*   **Layout Hierarchy:**
    1.  *Top:* Full screen celebrate backdrop. Large green check mark, text: *"Booking Confirmed."*
    2.  *Center:* Animated card showing appointment details and diagnostic attachments status.
    3.  *Pre-consult Instructions:* Bullet points showing specific preparation guidelines.
    4.  *Bottom:* Stacked actions: *"Add to Calendar"*, *"Back to Dashboard"*.
*   **Components:**
    *   `Lottie Confetti Animation` (First-load only).
    *   `Google Calendar API Link` (Text action).
    *   `Return to Dashboard Button` (Primary action).
*   **CTA Logic:** Tapping *"Back to Dashboard"* returns the user to Screen 6.
*   **Microcopy Guidance:**
    *   *Main banner:* "You're scheduled with Dr. Shastri."
    *   *AYUSH Instruction:* "Ayurveda consultation tips: Avoid coffee or heavy meals 2 hours before the call to ensure accurate pulse reading."
*   **States:**
    *   *Default:* Active confirmation details.
*   **Handoff Notes:** Use a high-quality, lightweight Lottie file for the checkout success animation to ensure smooth rendering on budget devices.

---

## Module 3: Patient Telehealth & EMR

### Screen 14: Telehealth Waiting Room & Diagnostics Upload
*   **Goal:** Prepare patients before their call starts and gather last-minute medical documents.
*   **User:** Patients waiting for their consult.
*   **Layout Hierarchy:**
    1.  *Top:* Status indicator bar: *"Meeting starts in 04:50."*
    2.  *Video Box:* Self-camera preview window (helps check layout/lighting).
    3.  *Center:* List of uploaded documents and a button: *"Add Reports."*
    4.  *Bottom:* Muted system status indicators: camera check, mic check, network status check.
*   **Components:**
    *   `Self-Camera View Box` (Rounded corners, mirroring camera feed).
    *   `Hardware Status Badges` (Green check marks).
    *   `Upload Reports Button` (Direct folder link).
*   **CTA Logic:** Doctor launching the call triggers Screen 15.
*   **Microcopy Guidance:**
    *   *Waiting text:* "Please stay on this screen. Dr. Shastri will join you shortly."
    *   *Hardware Check:* "Mic & Camera verified. Network: Excellent."
*   **States:**
    *   *Permissions Denied:* Red indicator with a button: *"Grant Camera Permission"*.
*   **Handoff Notes:** The camera component must use standard WebRTC frameworks and prompt for system permissions on page enter.

---

### Screen 15: Video Consultation Room (Patient View)
*   **Goal:** Secure split video call between patient and practitioner.
*   **User:** Telehealth patients.
*   **Layout Hierarchy:**
    1.  *Main Space:* Full-bleed view of the practitioner video feed.
    2.  *Overlay (Top-Right):* Small picture-in-picture view of the patient’s feed.
    3.  *Overlay (Bottom Center):* Floating controls bar (Mute, Camera off, Share Document, Hang Up).
    4.  *Right Slide-out Drawer:* Optional chat window or prescription tracker.
*   **Components:**
    *   `Doctor Video Feed` (Full viewport).
    *   `Patient Feed Box` (Draggable container).
    *   `Floating Control Row` (Glassmorphism icons).
*   **CTA Logic:** Pressing the red *"End Call"* button prompts for confirmation before exiting to Screen 16.
*   **Microcopy Guidance:**
    *   *Security Header:* "Encrypted consult room."
    *   *End Call Warning:* "Are you sure you want to exit this consultation?"
*   **States:**
    *   *Muted:* Icon changes to copper slash indicator.
    *   *Connection Loss:* Overlay displays: *"Reconnecting video feed..."* keeping the audio channel active.
*   **Handoff Notes:** Design floating controls to hide during inactive states to maximize screen visibility.

---

### Screen 16: Digital Prescription & Action Plan
*   **Goal:** Review diagnosis, prescribed formulations, lifestyle guidelines, and ordering steps.
*   **User:** Consulted patients.
*   **Layout Hierarchy:**
    1.  *Header:* Title: *"Your Care Plan"*, doctor details, date.
    2.  *Diagnosis summary:* Clinical assessment fields (Prakriti, symptom metrics).
    3.  *Prescribed Formulations:* Cards detailing herbal formulas, doses, and vehicles.
    4.  *Lifestyle & Diet Advice:* Customized food/habit adjustments.
    5.  *Bottom:* Primary button: *"Order Prescribed Medicines"*.
*   **Components:**
    *   `Prescribed Remedy Row` (Name, dosage, vehicle).
    *   `Lifestyle Accordion` (Click to expand diet details).
    *   `Direct Purchase Trigger` (Sticky CTA).
*   **CTA Logic:** Tapping *"Order Medicines"* launches checkout Screen 21 with items pre-filled.
*   **Microcopy Guidance:**
    *   *Remedy Title:* "Ashwagandha Churna | 1 tsp twice daily."
    *   *Vehicle instruction:* "Take with warm milk before sleep."
*   **States:**
    *   *Default:* Detailed list of recommendations.
    *   *Remedies out of stock:* Display warning pill: *"Some formulations must be sourced from custom partner pharmacies."*
*   **Handoff Notes:** Text spacing must remain clean even with long traditional names. Keep lines clear and legible.

---

### Screen 17: Longitudinal Wellness Timeline
*   **Goal:** A chronological record of all medical reports, prescriptions, and health tracking metrics.
*   **User:** Patients reviewing historical data.
*   **Layout Hierarchy:**
    1.  *Header:* Title: *"Health Timeline"*, search bar, and filter tabs (All, Consultations, Lab Reports, Trackers).
    2.  *Timeline Body:* Vertical line with nodes indicating date-marked events.
    3.  *Node detail:* Event type, provider name, downloadable files.
*   **Components:**
    *   `Timeline Navigation Tabs` (Swipeable controls).
    *   `Timeline Node Card` (Includes title, description, doctor name, and download icon).
*   **CTA Logic:** Tapping a node expands details. Tapping the download icon exports the EMR PDF.
*   **Microcopy Guidance:**
    *   *Header subtitle:* "ABDM Interoperable Health History."
    *   *Node title:* "Ayurveda Consultation | Dr. Shastri."
*   **States:**
    *   *Empty State:* *"Your wellness history is blank. Book your first consult to start your timeline."*
*   **Handoff Notes:** Timeline layout needs vertical lines aligned with cards. Implement lazy loading for historical records.

---

### Screen 18: Consent Manager Dashboard
*   **Goal:** Manage active/expired permission authorizations for medical records sharing.
*   **User:** Patients controlling records access.
*   **Layout Hierarchy:**
    1.  *Header:* Title: *"Access Authorizations."*
    2.  *Center:* Tabbed view showing Active Consents vs. Expired Consents.
    3.  *Consent Rows:* Doctor profile, clinic name, date, authorized data types.
    4.  *Footer:* Link to government ABDM security guidelines.
*   **Components:**
    *   `Consent Detail Card` (Lists data access permissions).
    *   `Revoke Access Button` (Red outlines, secondary style).
*   **CTA Logic:** Tapping *"Revoke"* terminates the consent token instantly.
*   **Microcopy Guidance:**
    *   *Status pill:* "Active Access | Expires in 22 Hours."
    *   *Revoke warning:* "Revoking access prevents this clinic from viewing future EMR updates."
*   **States:**
    *   *Confirm Action:* Show verification dialogue before revoking access.
*   **Handoff Notes:** This screen connects directly with the ABDM sandbox API for consent records and must reflect live sync status.

---

## Module 4: AyurSanvaad AI & Commerce

### Screen 19: AyurSanvaad AI Chat Interface
*   **Goal:** Conversational wellness assistant for routine planning, triage, and follow-ups.
*   **User:** Patients seeking general advice.
*   **Layout Hierarchy:**
    1.  *Header:* Title: *"AyurSanvaad AI"*, status badge: *"AI Companion"*.
    2.  *Chat Window:* Chronological bubbles showing user queries and assistant suggestions.
    3.  *Quick Action Pills:* Preset question tags (e.g., *"Configure Dinacharya"*, *"How to balance Pitta?"*).
    4.  *Bottom:* Text input field with a microphone option.
*   **Components:**
    *   `Message Bubble Rows` (User vs. AI layouts).
    *   `Typing Indicator Animation` (Three bouncing dots).
    *   `Quick Prompt Carousels` (Horizontal scrolling pills).
    *   `Voice Input Button` (Microphone icon).
*   **CTA Logic:** Sending a query updates the message log. Prompts suggesting doctor consults trigger Screen 9.
*   **Microcopy Guidance:**
    *   *Default Greeting:* "Hello Rohit, I can help you structure your daily routine or guide you to AYUSH specialties. How are you feeling today?"
    *   *Safety disclaimer:* "Not a doctor substitute."
*   **States:**
    *   *Emergency Trigger:* Shows the high-contrast emergency banner and locks input, displaying emergency contact links.
*   **Handoff Notes:** Message bubble corners should change dynamically depending on whether they are sent in sequence (grouped messages).

---

### Screen 20: Apothecary Storefront
*   **Goal:** Discover and buy general AYUSH formulations, health foods, and supplements.
*   **User:** Patients purchasing wellness supplies.
*   **Layout Hierarchy:**
    1.  *Header:* Search bar, cart icon (with item counter badge).
    2.  *Prescription upload banner:* Highlight card: *"Upload Doctor’s Prescription."*
    3.  *Category Scroll:* Circles showing Ayurvedic Oils, Herbal Teas, Homeopathy dilutions.
    4.  *Product list grid:* 2-column list of items.
*   **Components:**
    *   `Prescription Upload Card` (Dashed border box).
    *   `Product Item Card` (Product image, title, weight, price, add to cart button).
    *   `Cart Badge Icon` (Red accent number).
*   **CTA Logic:** Tapping *"Add to Cart"* increments the cart badge. Tapping the cart icon launches Screen 21.
*   **Microcopy Guidance:**
    *   *Banner Text:* "Order prescribed formulations from verified traditional pharmacies."
    *   *Authenticity Check:* "100% certified organic remedies."
*   **States:**
    *   *Out of stock:* Item card disables button, displaying: *"Unavailable in your area."*
*   **Handoff Notes:** Product grids need smooth image loading placeholders (lazy load) to preserve performance during scroll.

---

### Screen 21: Shopping Cart & Prescription Verification
*   **Goal:** Review items in cart, confirm doctor prescriptions, and proceed to checkout.
*   **User:** Patients purchasing remedies.
*   **Layout Hierarchy:**
    1.  *Header:* Title: *"Apothecary Cart."*
    2.  *Prescription Verification Panel:* Displays verified Rx attachments.
    3.  *Cart List:* Rows showing product item, quantity selectors, and price.
    4.  *Price Breakdown:* Item totals, shipping, discount, final amount.
    5.  *Bottom:* Proceed button.
*   **Components:**
    *   `Rx Verification Badge` (Green status indicating: "Prescription Attached & Validated").
    *   `Quantity Selectors` (Plus/minus buttons).
    *   `Checkout Button` (Primary action).
*   **CTA Logic:** Tapping *"Proceed"* routes to payment steps (similar flow to Screen 12).
*   **Microcopy Guidance:**
    *   *Verification subtitle:* "Attached: Rx-Dr.Aditi-05-Jun.pdf."
    *   *Total cost:* "Cart Total: ₹980.00."
*   **States:**
    *   *Rx Required Warning:* Displays: *"This item requires a prescription. Tap to upload."*
*   **Handoff Notes:** Cart quantity transitions should update cart totals instantly on screen without loading spinners.

---

### Screen 22: Delivery Tracker & Refill Scheduler
*   **Goal:** Track shipment status and set automatic replenishment dates for chronic remedies.
*   **User:** Patients awaiting orders.
*   **Layout Hierarchy:**
    1.  *Header:* Title: *"Track Order"*, Order ID details.
    2.  *Map Widget:* Visual tracking showing parcel location.
    3.  *Logistics status:* Vertical stepper: *"Ordered"*, *"Packed"*, *"Shipped"*, *"Out for Delivery"*.
    4.  *Refill Scheduler Panel:* Toggle card option for automatic monthly re-ordering.
*   **Components:**
    *   `Map Component` (Integrated location tracking).
    *   `Logistic Timeline Stepper` (Green/grey check indicators).
    *   `Refill Scheduler Switch` (Toggle slide button).
*   **CTA Logic:** Tapping the Refill toggle opens a date-picker to set monthly orders.
*   **Microcopy Guidance:**
    *   *Delivery status:* "Out for delivery. Expected by 2:00 PM."
    *   *Refill label:* "Schedule monthly automatic refills for this prescription."
*   **States:**
    *   *Delayed:* Yellow highlight, displaying: *"Slight delay due to logistics. Expected tomorrow."*
*   **Handoff Notes:** The location map should be lightweight (static map overlay with periodic updates) to conserve device battery.

---

## Module 5: Practitioner Portal (MeyVeda Pro)

### Screen 23: Doctor Dashboard & Active Patient Queue
*   **Goal:** Help doctors manage their daily consult queue, review schedules, and launch calls.
*   **User:** AYUSH doctors.
*   **Layout Hierarchy:**
    1.  *Header:* Profile overview, active clinic location switcher, and availability switch.
    2.  *Daily Vitals summary:* Total consults, average duration, pending queue number.
    3.  *Live Queue:* Vertical list of today's patients with status badges (Checked-in, Waiting, Completed).
    4.  *Bottom Navigation:* Dashboard, Calendar, EMR Vault, Profile.
*   **Components:**
    *   `Availability Toggle Switch` (Green online indicator).
    *   `Live Queue Card` (Patient name, consult mode, timing, check-in status, start call button).
*   **CTA Logic:** Tapping *"Start Call"* launches Screen 24 (or Screen 15 if video).
*   **Microcopy Guidance:**
    *   *Status pill:* "Patient has checked in. Waiting in room."
    *   *Vitals summary:* "Completed: 8 | Remaining: 4."
*   **States:**
    *   *Offline:* Board turns grey, displaying: *"You are currently offline. Turn toggle on to receive bookings."*
*   **Handoff Notes:** The patient queue list should refresh dynamically (via WebSockets) to show real-time clinic check-ins.

---

### Screen 24: SOAP EMR Note Draft Area & Formulator
*   **Goal:** Provide custom AYUSH medical notes templates and a fast digital prescription builder.
*   **User:** AYUSH doctors.
*   **Layout Hierarchy:**
    1.  *Top Bar:* Patient overview (Name, age, constitution, history link) and Sign/Submit button.
    2.  *Center Columns (Split Layout):*
        *   *Left Column:* Standard clinical SOAP notes (Subjective, Objective, Assessment).
        *   *Right Column:* AYUSH parameters (Prakriti, Pulse, Tongue status).
    3.  *Bottom Section:* Formulation builder search field and active prescription card list.
*   **Components:**
    *   `AYUSH Dropdowns` (Pulse patterns, body types).
    *   `Formula Search Input` (Auto-completing herb dictionary).
    *   `Remedy Row Card` (Includes dose timing and vehicle dropdowns).
*   **CTA Logic:** Clicking *"Sign and Upload"* creates the digital record and sends it to the ABDM gateway.
*   **Microcopy Guidance:**
    *   *Input guide:* "Enter clinical findings..."
    *   *Dosage instruction:* "Anupana: Take with warm honey-water."
*   **States:**
    *   *Validation Alert:* Highlight missing required fields (e.g., diagnosis code) before submission.
*   **Handoff Notes:** The auto-completing search bar must have a localized herb dataset to ensure fast lookups without server lag.

---

## Module 6: Clinic Admin (MeyVeda Enterprise)

### Screen 25: Clinic Front-Desk Command Center
*   **Goal:** Manage physical registrations, walk-ins, scheduling, and billing for clinic receptionists.
*   **User:** Clinic receptionists.
*   **Layout Hierarchy:**
    1.  *Header:* Clinic name selector, calendar view toggles (Day, Week, Month).
    2.  *Main Space:* Grid showing multiple doctor columns and scheduled slots.
    3.  *Right Sidebar:* Quick-action panel: *"Check In Walk-in"*, *"Generate Invoice"*, *"Queue Status"*.
*   **Components:**
    *   `Multi-Doctor Calendar Grid` (Color-coded by discipline).
    *   `Action Button Panel` (Large icon list).
    *   `Checked-In Status Tag` (Updates patient row).
*   **CTA Logic:** Tapping *"Check In Walk-in"* opens a modal matching mobile number to ABHA registry.
*   **Microcopy Guidance:**
    *   *Doctor column:* "Dr. Shastri | Ayurveda | Room 4."
    *   *Status label:* "Checked in. Estimated wait: 12 minutes."
*   **States:**
    *   *Double booking:* Red outline warning on overlapping blocks, requesting confirmation.
*   **Handoff Notes:** The multi-practitioner calendar must stay fluid on tablet displays. Drag-and-drop capability for moving slots is recommended.
