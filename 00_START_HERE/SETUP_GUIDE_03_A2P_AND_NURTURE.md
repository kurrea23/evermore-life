# SETUP GUIDE 03 — A2P Registration & Lead Nurture
## Unlock SMS, build your follow-up sequences, complete the machine
**Do Guides 00–02 first. You need the fake lead test screenshots from Guide 00.**

> **Current status, June 13, 2026:** A2P submission is on hold pending EIN.
> Evidence screenshots, compliant nurture drafts, Sarah flow, and the live
> booking calendar are ready. SMS stays disabled. See
> `GUIDES_00_03_COMPLETION_HANDOFF.md`.

---

## What You're Doing in This Guide

1. Submit A2P 10DLC registration (unlocks SMS in GHL)
2. Build your email nurture sequence in GHL (5 emails)
3. Build your SMS nurture sequence in GHL (activate after A2P approves)
4. Set up the Sarah AI conversation flow

**Time estimate: 2–3 hours**

---

## STEP 1 — A2P 10DLC Registration

Without this, GHL will NOT let you send marketing SMS. This is not optional.

**All the content you need is already written in:**
`02_ghl/launch_kit/a2p-registration-pack.md`
`02_ghl/launch_kit/a2p-messaging-use-case-paste.md`
`02_ghl/launch_kit/a2p-sample-messages.csv`

**In GHL:**
1. Go to: **Settings → Phone Numbers → SMS Registration / A2P**
2. Click **Register Campaign / Brand**
3. Fill in your brand info:
   - Business Name: `Evermore Life Insurance LLC`
   - EIN: (your LLC EIN)
   - Business Type: LLC
   - Industry: Insurance
   - Website: `https://evermorelife.org`

4. Register your campaign (use case):
   - Use Case: **Mixed** or **Low Volume Mixed**
   - Campaign Description: (copy from `a2p-messaging-use-case-paste.md`)
   - Sample Message 1: `Evermore Life: Thanks for requesting a life insurance quote. Sarah here. I can help you review options and book a quick call. Reply STOP to opt out or HELP for help.`
   - Sample Message 2: `Evermore Life: Reminder for your scheduled life insurance consultation. Reply YES to confirm or reply STOP to opt out. Msg/data rates may apply.`
   - Sample Message 3: `Evermore Life: We received your quote request and can help compare options. What is the best time today for a quick call? Reply STOP to opt out or HELP for help.`

5. Upload screenshots from Step 7 of Guide 00 (optin page, consent checkbox, privacy, terms)

6. Submit and wait — approval typically takes 1–7 business days

**While you wait for A2P → build the SMS sequence now, just don't activate it yet.**

---

## STEP 2 — Build Email Nurture Sequence in GHL

This does NOT require A2P. Launch it now.

In GHL → **Automation → Workflows** → open `Evermore Life — New Lead Intake` (from Guide 00)

After the Call Task step, add these email steps:

**Email 1 (immediate — already in the workflow):**
- Subject: `You're one step closer — here's what happens next`
- Body:
```
Hi {{contact.firstName}},

Thanks for reaching out to Evermore Life.

I'm Sarah, and I help families compare life insurance options — from protecting your income and mortgage, to building for retirement, to making sure final expenses are handled.

Here's what happens next:
1. A licensed broker reviews your information
2. We compare options from multiple carriers that fit your situation
3. We walk you through what makes sense for your age, health, budget, and goals — no pressure

Ready to take the next step? Pick a time that works for you:
[CALENDLY LINK]

Or just reply to this email with any questions.

Warm regards,
Sarah
Evermore Life Insurance LLC
evermorelife.org | Licensed in Arizona & Texas

Coverage options vary by age, health, state, carrier, and eligibility. Not all applicants qualify.
```

**Email 2 (Day 2 — add Wait step then Email):**
- Wait: 1 day after form submission
- Subject: `Term, IUL, or final expense — which one fits you?`
- Body:
```
Hi {{contact.firstName}},

Life insurance isn't one-size-fits-all. Here's a quick breakdown:

📋 TERM LIFE — Best for income/mortgage protection while your family depends on you. Most affordable. No cash value.

🌱 IUL (Indexed Universal Life) — Permanent coverage + cash value that can grow tax-advantaged. Good for retirement planning alongside protection.

⚖️ FINAL EXPENSE — Smaller whole life policy ($5K–$25K) for burial costs and final bills. Easier to qualify for.

Which one fits depends on your age, health, goals, and budget. That's exactly what a coverage review helps figure out.

Ready to see your options? [CALENDLY LINK]

Sarah
Evermore Life

Coverage options vary by age, health, state, carrier, and eligibility.
```

**Email 3 (Day 4):**
- Wait: 2 more days
- Subject: `What actually affects your life insurance premium`
- Body:
```
Hi {{contact.firstName}},

Three things affect your premium more than anything:

1. Your age — the younger you are, the lower your rate. Every year you wait costs you.
2. Your health — most conditions don't disqualify you, but they affect your options.
3. Type of coverage — term is most affordable. Whole life and IUL cost more but build value.

We can't tell you your exact rate without knowing your situation — but we can show you a range once we talk.

Takes about 15 minutes. [CALENDLY LINK]

Sarah
Evermore Life
```

**Email 4 (Day 6):**
- Wait: 2 more days
- Subject: `How Evermore Life actually works`
- Body:
```
Hi {{contact.firstName}},

Quick clarification on who we are:

Evermore Life is an independent brokerage. That means we're not locked into one insurance company. We compare options from multiple carriers to find what fits YOUR situation.

Our job is not to sell you the most expensive policy. It's to match the right coverage to the right person.

If you're still thinking about it, I'm here whenever you're ready. [CALENDLY LINK]

Sarah
Evermore Life

Coverage options vary by age, health, state, carrier, and eligibility. Not all applicants qualify.
```

**Email 5 (Day 8):**
- Wait: 2 more days
- Subject: `Still thinking? No rush.`
- Body:
```
Hi {{contact.firstName}},

Last follow-up from me — I promise I won't keep filling your inbox.

If the timing isn't right, that's completely fine. When you're ready, we're here.

A couple of questions people ask a lot:
- "What if I have health issues?" — Many conditions don't disqualify you. Let's look at what's available.
- "What if I can't afford it?" — Coverage starts lower than most people think. Worth seeing the numbers.

[CALENDLY LINK]

You can also just reply to this email. I check it.

Sarah
Evermore Life Insurance LLC
```

Save and publish the updated workflow.

---

## STEP 3 — Build SMS Nurture Sequence (Build Now, Activate After A2P)

In GHL → same workflow → after the Email 5 step, add these SMS steps with an IF/ELSE gate:

**Gate:** IF SMS Consent = true AND [A2P_APPROVED flag] = true

Inside the YES branch:

**SMS Day 1 (1 hour after form):**
```
Hi {{contact.firstName}}, it's Sarah w/ Evermore Life! You started a coverage review — pick a time to finish it? [LINK] Reply STOP to opt out.
```

**Wait 23 hours →**

**SMS Day 2:**
```
Hey {{contact.firstName}}, Sarah here. Most families are underinsured — took 2 min to see where you stand: [LINK] Reply STOP anytime.
```

**Wait 2 days →**

**SMS Day 4:**
```
{{contact.firstName}} — many people think they can't afford coverage. Term life can start around $1/day. See what fits: [LINK] Reply STOP to opt out.
```

**Wait 2 days →**

**SMS Day 6 (final):**
```
Hey {{contact.firstName}}, last one from me. Ready when you are: [LINK] Or just reply and I'll help. Reply STOP to opt out, HELP for help. -Sarah, Evermore Life
```

**Keep this branch INACTIVE until A2P approval comes through.**
When A2P approves → come back, flip the gate condition to active, publish.

---

## STEP 4 — Set Up Sarah AI Conversation Flow in GHL

The full conversation tree reference is in:
`04_content_narrative/GHL_SARAH_AI_FLOW.md`

In GHL → **Conversations → AI Bot / Chat Widget**

**Sarah's opening message:**
```
Hi! I'm Sarah with Evermore Life. 👋

I help families compare life insurance options — from protecting your income and mortgage, to planning for retirement, to covering final expenses.

To help you find the best fit, I have a few quick questions. Sound good?
```

**Question 1:**
```
What's your main goal right now?

A) Protect my family if something happens to me
B) Supplement my retirement income
C) Protect my mortgage
D) Cover final expenses for my family
E) I'm not sure yet
```

**Based on answer → branch:**

- **A or C → Family/Mortgage path:**
```
Got it. Are you between 25–45, or 45–60?
```
  → Then: "What's your approximate monthly budget for coverage? Under $50 / $50–$100 / $100–$200 / $200+"

- **B → IUL/Retirement path:**
```
Retirement planning with life insurance is actually a great strategy — especially with an IUL. Are you currently contributing to a 401k or other retirement account?
```

- **D → Final Expense path:**
```
Final expense coverage is a great way to give your family clarity. Are you looking to cover $10,000–$15,000 or more like $20,000–$30,000?
```

- **E → General:**
```
No problem — that's actually the most common answer. Let me ask a couple quick questions and we can figure it out together.
```

**All paths → Health question:**
```
One more quick one: How would you describe your current health?

A) Excellent — no major conditions
B) Good — maybe one managed condition
C) Fair — a couple of things going on
D) I have some significant health history
```

**Then → Booking:**
```
Thanks, {{contact.firstName}}! Based on what you've shared, there are options worth looking at.

The fastest next step is a quick 15-minute call with a licensed broker who can walk you through what's available in {{contact.state}}.

Want to pick a time? [CALENDLY LINK]

Or if you'd rather I have someone call you, just say "call me" and give me a good time.
```

**Objection — "I need to think about it":**
```
Totally understand. No pressure at all.

Can I ask — is there something specific you're unsure about? I'm happy to answer any questions right here, no commitment needed.
```

**Objection — "I already have coverage":**
```
That's great! A lot of people find their coverage is outdated or doesn't fully fit their current situation — especially if life has changed (new home, new kid, new income).

Would a free second opinion be helpful? Takes 15 minutes and there's zero obligation.
```

**STOP handling:**
```
You've been removed from our list. No further messages will be sent. If you change your mind, visit evermorelife.org anytime.
```

---

## STEP 5 — Replace Calendly Link Placeholders

Every guide says `[CALENDLY LINK]`. Here's how to get yours:

1. Go to `calendly.com` → create a free account
2. Create an event type: "15-Minute Coverage Review"
3. Connect your calendar
4. Set availability
5. Copy your booking link: `https://calendly.com/evermorelife/coverage-review`
6. Do a find-and-replace in ALL files: replace `[CALENDLY LINK]` with your real URL

Files to update:
- All 5 GHL emails (above)
- All 4 GHL SMS messages (above)
- Sarah AI conversation (above)
- `04_content_narrative/FUNNEL_PAGE.html`
- `01_website/v2/pages/thank-you.html`

---

## ✅ GUIDE 03 COMPLETE WHEN:
- [ ] A2P submitted (waiting for approval)
- [ ] All 5 emails are in the GHL workflow and active
- [ ] SMS sequence is built in GHL (inactive — waiting for A2P)
- [ ] Sarah AI conversation is configured in GHL
- [ ] Calendly link is live and replaced in all files
- [ ] Test the full flow: submit form → receive Email 1 → click Calendly link → book a test call

---

## WHAT HAPPENS AFTER GUIDE 03

Once all 4 guides are done:

1. **You post your first organic video** (use the scripts from `04_content_narrative/STORY_SCRIPTS/`)
2. **Ads are live** (from Guide 02)
3. **Someone fills the form** → Sarah greets them → they book a call → you close
4. **You check your daily scoreboard** (`03_sales_marketing/DAILY_SCOREBOARD.md`)
5. **After 7 days** → we look at the numbers together and decide what to scale and what to kill

The machine is running. Now it's about optimization — not setup.
