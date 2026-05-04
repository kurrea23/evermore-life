# Evermore Life — Sarah AI Appointment Flow
## GoHighLevel (GHL) Configuration Guide

**Source:** Imported from Cinematic Legacy Campaign (07_GHL_AI_Appointment_Flow.md)
**Purpose:** Configure the Sarah AI assistant and GHL pipeline for lead capture → appointment booking → broker call

---

## Lead Flow Overview

```
Ad / Organic Video
        ↓
Funnel Page (FUNNEL_PAGE.html)
        ↓
Native GHL Form or Chat Widget (Sarah)
        ↓
GHL Contact Created
        ↓
Opportunity Pipeline Stage: "New Coverage Review"
        ↓
AI / SMS / Email Follow-Up (Sarah)
        ↓
Appointment Set
        ↓
Broker Call
        ↓
Application → Follow-Up → Nurture
```

---

## Pipeline Stages

| Stage | Description |
|-------|-------------|
| 1. New Lead | Contact just created, no outreach yet |
| 2. AI Contacted | Sarah has sent initial message |
| 3. Needs Info | Lead responded but missing qualification info |
| 4. Appointment Requested | Lead has asked to book |
| 5. Appointment Set | Calendar invite confirmed |
| 6. No Show | Did not attend booked call |
| 7. Quoted | Options presented on call |
| 8. Application Started | Client began application |
| 9. Application Submitted | Application sent to carrier |
| 10. Approved / Issued | Policy active |
| 11. Not Qualified | Cannot be placed with available carriers |
| 12. Nurture | Long-term follow-up sequence |

---

## Sarah AI Assistant Configuration

### Name
Sarah

### Tone
Warm, simple, professional, non-pushy. She is a knowledgeable friend, not a call center rep.

### Avatar/Persona
If using a visual AI presenter (HeyGen): warm female presenter, 30s, professional but approachable. Friendly, unhurried.

---

## Sarah's Conversation Script

### Opening Message

> Hi, I'm Sarah with Evermore Life 🌳
> I can help you start a simple coverage review. I'll ask a few basic questions so a licensed broker can better understand what options may fit your situation.
> Ready to get started?

---

### Qualification Questions (in order)

**Q1 — State**
> What state do you live in?

**Q2 — Age Range**
> What is your age range?
> (Options: 18–29 / 30–39 / 40–49 / 50–59 / 60–69 / 70+)

**Q3 — Goal**
> What are you most interested in protecting?
> (Options: Final expenses / Mortgage or home / Spouse or family income / Children's future / Business or key person / Not sure yet)

**Q4 — Existing Coverage**
> Do you currently have any life insurance?
> (Options: Yes / No / Not sure)

**Q5 — Budget**
> Is there a monthly budget range you'd feel comfortable with?
> (Options: Under $30/mo / $30–$60/mo / $60–$100/mo / Over $100/mo / Not sure yet)

**Q6 — Contact Preference**
> Do you prefer a phone call or text first?

**Q7 — Scheduling**
> What day and time works best for a quick coverage review call? (Usually 15–20 minutes)

---

## Sarah's Guardrails

Sarah **must not:**
- Quote exact premium amounts without broker/carrier/application context
- Promise approval ("you will definitely qualify")
- Recommend one specific policy type as definitively best without licensed review
- Diagnose health or predict underwriting outcomes
- Pressure the prospect toward urgency they haven't expressed
- Use fear-heavy language ("you could leave your family with nothing")

**When asked about price or eligibility, Sarah says:**
> Pricing and eligibility depend on your age, health, state, coverage amount, product type, and carrier underwriting. A licensed broker will review options that may fit your specific situation — that's what the call is for.

---

## Automated Message Templates

### Appointment Confirmation (SMS)
> Hi {{contact.first_name}}, this is Sarah with Evermore Life 🌳
> You're scheduled for a coverage review with a licensed broker on {{appointment.start_time}}.
> They'll help review your goals, budget, and available coverage options.
> Reply STOP to opt out.

### 24-Hour Reminder (SMS)
> Hi {{contact.first_name}} — just a reminder that your Evermore Life coverage review is tomorrow at {{appointment.start_time}}. Looking forward to helping you explore your options. Reply STOP to opt out.

### No-Show Follow-Up (SMS — Day 0)
> Hi {{contact.first_name}}, sorry we missed you today. Life gets busy — would you like to reschedule your coverage review? It only takes a few minutes to restart. Reply STOP to opt out.

### No-Show Re-Engage (SMS — Day 3)
> Hi {{contact.first_name}}, this is Sarah with Evermore Life. I wanted to check in — would a different time work better for your coverage review? Reply YES and I'll get you rebooked. Reply STOP to opt out.

### Warm Nurture (for long-term non-responders — Day 14)
> You don't have to figure life insurance out alone. Different families need different coverage — final expense, term, whole life, or other options depending on age, health, budget, and goals. Reply REVIEW if you'd like to take the next step with Evermore Life. Reply STOP to opt out.

---

## Form Fields (Native GHL Form on Funnel Page)

| Field | Type | Required |
|-------|------|---------|
| First Name | Text | Yes |
| Last Name | Text | Yes |
| Phone | Phone | Yes |
| Email | Email | Yes |
| State | Dropdown (50 states) | Yes |
| Age Range | Dropdown | Yes |
| What are you most interested in protecting? | Multi-select | Yes |
| Preferred contact method | Radio (call/text/email) | No |
| SMS Consent Checkbox | Checkbox | Yes |

### SMS Consent Checkbox Copy (Required)
> By checking this box, I agree to receive calls, texts, and emails from Evermore Life regarding my insurance inquiry. Message and data rates may apply. Message frequency may vary. Reply STOP to unsubscribe. Consent is not a condition of purchase.

---

## GHL Workflow Triggers

| Trigger | Action |
|---------|--------|
| Form submitted | Create contact → Create opportunity (Stage: New Lead) → Send Sarah welcome SMS |
| Sarah sends Q7 | Trigger calendar booking link |
| Appointment booked | Move to Stage: Appointment Set → Send confirmation SMS |
| Appointment missed | Move to Stage: No Show → Trigger no-show SMS sequence |
| Lead replies STOP | Remove from all SMS sequences immediately |
| 30 days no response | Move to Stage: Nurture → Add to long-term drip |

---

## Calendly / GHL Calendar Setup

- **Meeting type:** Coverage Review (15–20 minutes)
- **Host:** Licensed broker (or round-robin for multiple agents)
- **Buffer:** 15 minutes between appointments
- **Availability:** M–F, 9am–7pm (local time of lead's state)
- **Reminder:** Automatic 24hr + 1hr email/SMS reminders from GHL
- **Zoom/phone:** Include dial-in or Zoom link in confirmation

---

## Integration Notes

- GHL webhook → Zapier or native GHL API → CRM
- Lead source tracking: all UTMs from ad campaigns should pass through to GHL contact record
- Tag leads by ICP: `ICP1_protective_parent` or `ICP2_adult_child` based on Q3 answer
- Tag leads by product intent: `final_expense` / `term_income` / `general_inquiry`
