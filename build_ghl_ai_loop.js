const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, PageOrientation, LevelFormat,
        TabStopType, TabStopPosition, HeadingLevel, BorderStyle, WidthType,
        ShadingType, PageNumber } = require('docx');
const fs = require('fs');

// ---------- helpers ----------
const border = { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const H1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text })]
});
const H2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text })]
});
const H3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  children: [new TextRun({ text })]
});
const P = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, ...opts })],
  spacing: { after: 120 }
});
const Pmix = (runs) => new Paragraph({
  children: runs.map(r => new TextRun(r)),
  spacing: { after: 120 }
});
const Check = (text) => new Paragraph({
  numbering: { reference: "checks", level: 0 },
  children: [new TextRun({ text })]
});
const Bullet = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  children: [new TextRun({ text })]
});
const Numbered = (text) => new Paragraph({
  numbering: { reference: "numbers", level: 0 },
  children: [new TextRun({ text })]
});
const Spacer = () => new Paragraph({ children: [new TextRun("")] });

const Code = (text) => new Paragraph({
  children: [new TextRun({ text, font: "Courier New", size: 18 })],
  shading: { fill: "F4F4F4", type: ShadingType.CLEAR },
  spacing: { after: 120 }
});

// 2-column reference table
const RefTable = (rows) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [3000, 6360],
  rows: rows.map((r, i) => new TableRow({
    children: r.map((cell, j) => new TableCell({
      borders,
      width: { size: j === 0 ? 3000 : 6360, type: WidthType.DXA },
      shading: i === 0
        ? { fill: "1F3A5F", type: ShadingType.CLEAR }
        : { fill: "FFFFFF", type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [new Paragraph({
        children: [new TextRun({
          text: cell,
          bold: i === 0,
          color: i === 0 ? "FFFFFF" : "000000",
          size: 20
        })]
      })]
    }))
  }))
});

// ---------- document ----------
const doc = new Document({
  creator: "Claude",
  title: "GHL + ChatGPT Nesting Loop — Implementation Checklist",
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1F3A5F" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "2E5A8C" },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 23, bold: true, font: "Arial", color: "333333" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "checks",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "☐",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          children: [
            new TextRun({ text: "GHL + ChatGPT Nesting Loop", bold: true, color: "1F3A5F" }),
            new TextRun({ text: "\tImplementation Checklist", color: "666666" })
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", color: "666666", size: 18 }),
            new TextRun({ children: [PageNumber.CURRENT], color: "666666", size: 18 })
          ]
        })]
      })
    },
    children: [
      // ===== TITLE =====
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({
          text: "GHL + ChatGPT Nesting Loop",
          bold: true, size: 44, color: "1F3A5F", font: "Arial"
        })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({
          text: "Step-by-Step Implementation Checklist",
          size: 28, color: "555555", italics: true
        })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 360 },
        children: [new TextRun({
          text: "Tonight-shippable build • SMS first • Make.com + OpenAI",
          size: 20, color: "888888"
        })]
      }),

      // ===== OVERVIEW =====
      H1("1. What We're Building"),
      P("A loop where GoHighLevel (GHL) becomes the outer shell — handling contacts, calendar, and message delivery — and ChatGPT lives inside as the brain. When a lead messages, GHL sends the message to a Make.com scenario, which calls OpenAI, gets a smart reply, and sends it back through GHL. When the lead is ready to book, the AI proposes a real open slot from your GHL calendar, books it, and GHL fires the confirmation and reminder texts automatically."),

      H2("Why this beats native GHL AI"),
      Bullet("Cost: ~$5–$20/month vs. $97–$297/month for GHL Conversation AI add-ons."),
      Bullet("Smarter: full GPT-4-class reasoning with your custom system prompt and brand voice."),
      Bullet("Iterable: change the prompt in one place and the whole bot updates instantly."),
      Bullet("Channel-agnostic: SMS, email, FB/IG DMs, and web chat all funnel through the same loop because GHL unifies them."),

      H2("Architecture (one paragraph)"),
      P("Lead replies in any channel → GHL Workflow \"Inbound Message\" trigger fires → Webhook posts to Make.com → Make pulls the last 10 messages from the contact's conversation history (custom field) → Make calls OpenAI with system prompt + history → OpenAI returns reply text + a JSON tag (intent: chat / book / confirm / human) → Make routes: if \"book,\" Make pulls free slots from GHL calendar API and the next AI turn proposes them; if \"confirm,\" Make books the appointment via GHL API; otherwise Make sends the reply back through GHL. GHL's native confirmation/reminder workflows fire automatically once the appointment is on the calendar."),

      Spacer(),

      // ===== PREREQS =====
      H1("2. Prerequisites — Get These Open in Tabs"),
      RefTable([
        ["Account", "Where / Cost"],
        ["GoHighLevel sub-account", "You already have this. Need: API key + Calendar ID."],
        ["OpenAI API account", "platform.openai.com — add $10 credit. Pay-as-you-go."],
        ["Make.com account", "make.com — free tier (1,000 ops/mo) covers testing. $9/mo Core plan once live."],
        ["Phone number in GHL", "A2P-registered number on the sub-account for SMS."],
        ["Calendar in GHL", "One bookable calendar with availability set."]
      ]),
      Spacer(),

      // ===== PHASE 1 =====
      H1("3. Phase 1 — GHL Setup (15 minutes)"),

      H2("3.1 Get your GHL API key"),
      Check("In GHL sub-account, go to Settings → Business Profile → scroll to API Key."),
      Check("Generate a Location-level API key. Copy it to a notes file."),
      Check("Also grab your Location ID (Settings → Company → ID at the bottom)."),
      Check("Grab your Calendar ID: Calendars → click the calendar → the URL ends in /calendars/<ID>."),

      H2("3.2 Create three custom fields on the Contact"),
      P("Settings → Custom Fields → Add Field. Object = Contact for all three:"),
      Check("ai_history — Type: Large Text. Holds the rolling conversation transcript."),
      Check("ai_intent — Type: Single Line Text. Stores last detected intent (chat / book / confirm / human)."),
      Check("ai_proposed_slot — Type: Single Line Text. Holds the slot the AI just offered, in ISO format."),

      H2("3.3 Create the inbound trigger workflow"),
      Check("Automation → Workflows → Create Workflow → Start From Scratch. Name it: AI Brain — Inbound."),
      Check("Add Trigger: Customer Replied. Filter: Reply Channel = SMS (we'll add others in Phase 4)."),
      Check("Add Action: Webhook. Method: POST. URL: leave blank for now — Make.com will give us this in step 4.2."),
      Pmix([
        { text: "Webhook payload (JSON): ", bold: true },
        { text: "include contact_id, location_id, message body, ai_history, phone, email, first_name. Use GHL's variable picker." }
      ]),
      Check("Save and publish the workflow but leave it OFF until Make is wired."),

      H2("3.4 Create the outbound \"AI Reply\" workflow"),
      Check("New workflow: AI Brain — Send Reply."),
      Check("Trigger: Inbound Webhook. Copy the trigger webhook URL to your notes file."),
      Check("Action: Send SMS. Body = {{inboundWebhookRequest.reply_text}}."),
      Check("Action: Update Contact Field. Set ai_history = {{inboundWebhookRequest.new_history}}."),
      Check("Action: Update Contact Field. Set ai_intent = {{inboundWebhookRequest.intent}}."),
      Check("Save and publish."),

      H2("3.5 Create the \"Book Appointment\" workflow"),
      Check("New workflow: AI Brain — Book."),
      Check("Trigger: Inbound Webhook. Copy this webhook URL too."),
      Check("Action: Create/Update Appointment. Calendar = your booking calendar. Start time = {{inboundWebhookRequest.slot_iso}}. Contact ID = {{inboundWebhookRequest.contact_id}}."),
      Check("Action: Send SMS. Body: \"You're confirmed for {{appointment.start_time}}. We'll text a reminder beforehand. Reply STOP to cancel.\""),
      Check("Save and publish."),

      H2("3.6 Native confirmation + reminder workflow"),
      Check("New workflow: Appointment Reminders."),
      Check("Trigger: Appointment Status — Booked, on the AI calendar."),
      Check("Action: Wait 1 day before appointment → Send SMS reminder."),
      Check("Action: Wait 1 hour before appointment → Send SMS reminder."),
      Check("Save, publish, turn ON."),

      Spacer(),

      // ===== PHASE 2 =====
      H1("4. Phase 2 — Make.com Scenario (45 minutes)"),
      P("This is the brain wiring. We build one scenario with a router. Total modules: about 8."),

      H2("4.1 Create the scenario shell"),
      Check("Make.com → Create a new scenario. Name: GHL AI Brain."),
      Check("Add first module: Webhooks → Custom Webhook. Click Add, name it ghl-inbound, copy the URL."),
      Check("Paste that URL into your GHL \"AI Brain — Inbound\" workflow webhook (step 3.3)."),
      Check("Turn ON the GHL inbound workflow now — send yourself a test SMS to the GHL number, reply once. Make should capture the payload structure. Click \"Determine data structure\" if prompted."),

      H2("4.2 Module 2 — Build the OpenAI message array"),
      Check("Add module: Tools → Set Multiple Variables. Create one variable: messages."),
      Pmix([
        { text: "Value (JSON array): ", bold: true },
        { text: "system message (your prompt — see section 6) + parsed ai_history + the new user message. Use Make's parseJSON() function on ai_history if it's stored as JSON; otherwise split on newlines." }
      ]),

      H2("4.3 Module 3 — Call OpenAI"),
      Check("Add module: OpenAI (ChatGPT, Whisper, DALL-E) → Create a Completion."),
      Check("Connect with your OpenAI API key (paste it once, Make stores it encrypted)."),
      Check("Model: gpt-4o-mini (cheap and fast — ~$0.15 per 1M input tokens). Upgrade to gpt-4o later if needed."),
      Check("Messages: map the messages variable from step 4.2."),
      Check("Response Format: JSON object."),
      Check("Max tokens: 400. Temperature: 0.7."),

      H2("4.4 Module 4 — Parse the AI response"),
      P("Your system prompt (section 6) instructs the AI to always return JSON like: {\"reply\": \"...\", \"intent\": \"chat|book|confirm|human\", \"proposed_slot\": \"ISO8601 or null\"}."),
      Check("Add module: JSON → Parse JSON. Source = OpenAI response.choices[0].message.content. Define data structure once by pasting a sample."),

      H2("4.5 Module 5 — Router"),
      Check("Add a Router after the JSON parser. Three routes:"),
      Bullet("Route A — intent = \"book\": fetch open calendar slots, propose them."),
      Bullet("Route B — intent = \"confirm\": book the appointment."),
      Bullet("Route C — default (chat / human): just send the reply back."),

      H3("Route A — Fetch slots"),
      Check("Module: HTTP → Make a request. Method: GET. URL: https://services.leadconnectorhq.com/calendars/<CALENDAR_ID>/free-slots?startDate=<today_ms>&endDate=<today+7days_ms>&timezone=America/New_York"),
      Check("Headers: Authorization: Bearer <your GHL API key>, Version: 2021-04-15."),
      Check("Module: Tools → Set Variable. Build the reply text: \"I have {{slot1}}, {{slot2}}, or {{slot3}} — which works?\" using the first 3 slots from the response."),
      Check("Send to GHL: HTTP POST to your \"AI Brain — Send Reply\" inbound webhook URL with reply_text + new_history + intent=book."),

      H3("Route B — Book appointment"),
      Check("Module: HTTP POST to your \"AI Brain — Book\" inbound webhook URL. Body: contact_id, slot_iso = the value the AI confirmed (from ai_proposed_slot)."),

      H3("Route C — Default chat reply"),
      Check("Module: HTTP POST to your \"AI Brain — Send Reply\" inbound webhook URL. Body: reply_text, new_history (old + new exchange), intent."),

      H2("4.6 Save and turn the scenario ON"),
      Check("Click Save. Toggle scenario to ON, set scheduling to Immediately."),

      Spacer(),

      // ===== PHASE 3 =====
      H1("5. Phase 3 — Test the SMS Loop (20 minutes)"),

      H2("5.1 Smoke test: chat"),
      Check("From your personal phone, text the GHL number: \"hey, what do you guys do?\""),
      Check("Within 10–20 seconds you should get an AI reply on-brand."),
      Check("In Make: open the scenario → History tab → verify the run shows green at every module."),
      Check("In GHL: open the contact, check that ai_history was updated with both turns."),

      H2("5.2 Booking test"),
      Check("Text: \"I'd like to book a call.\""),
      Check("AI should detect intent=book and reply with 3 real slots from your calendar."),
      Check("Reply: \"1pm works.\" AI should detect intent=confirm with the matching ISO slot."),
      Check("Check GHL Calendar — the appointment should now be on it."),
      Check("You should also receive the confirmation SMS automatically (from step 3.5)."),

      H2("5.3 Reminder test"),
      Check("Manually move the test appointment to start in 2 minutes (just to verify the reminder workflow fires)."),
      Check("Confirm reminder SMS arrives. Then delete the test appointment."),

      H2("5.4 Edge cases to try"),
      Bullet("\"I want to talk to a human\" → intent should = human; AI should stop replying and add a tag like NEEDS_HUMAN. Add an action in the Send Reply workflow that fires you a notification when ai_intent = human."),
      Bullet("\"Cancel\" or \"STOP\" → GHL handles natively, AI never sees it."),
      Bullet("Lead asks for a slot that's already booked → AI should ask for an alternative."),

      Spacer(),

      // ===== PHASE 4 =====
      H1("6. Phase 4 — Add the Other Channels (10 minutes)"),
      P("This is why we built it through GHL workflows: every channel funnels through Conversations, so we just expand the trigger filter."),
      Check("Open AI Brain — Inbound workflow. Edit the trigger."),
      Check("Add reply channels: Email, Facebook, Instagram, Web Chat — keep them all enabled."),
      Check("In your Send Reply workflow, replace the static \"Send SMS\" action with a conditional based on the original message channel: Send SMS / Send Email / Send Facebook Message / Send Instagram Message / Send Web Chat."),
      Check("Test each channel with one message."),

      Spacer(),

      // ===== SYSTEM PROMPT =====
      H1("7. The System Prompt (Copy This Into Make Step 4.2)"),
      P("This is the heart of the build. Tune the bracketed parts to your business. Keep the JSON contract intact — the router depends on it."),
      Code("You are the AI assistant for [BUSINESS NAME], a [WHAT YOU DO]."),
      Code("Speak warmly, briefly, like a sharp human. 1–3 sentences max per reply."),
      Code("Your job: answer common questions, qualify the lead, and book a call when they're ready."),
      Code(""),
      Code("Booking flow:"),
      Code("1. If they signal interest (e.g. \"I want a call\", \"sounds good\", \"how do I sign up\"),"),
      Code("   ask: morning, afternoon, or evening?"),
      Code("2. When the system gives you available slots, offer 2–3 specific times."),
      Code("3. When they pick one, repeat it back and confirm."),
      Code("4. After they say yes, set intent to \"confirm\" and put the chosen ISO slot in proposed_slot."),
      Code(""),
      Code("Always respond with valid JSON in this exact shape:"),
      Code("{\"reply\": \"<your message to the lead>\", \"intent\": \"chat|book|confirm|human\", \"proposed_slot\": \"<ISO8601 or null>\"}"),
      Code(""),
      Code("Use intent=human if they're frustrated, asking for a person, or you're stuck."),
      Code("Never invent prices, policies, or guarantees."),
      Code("Time zone for all slots: America/New_York."),

      Spacer(),

      // ===== TROUBLESHOOTING =====
      H1("8. Troubleshooting Quick Reference"),
      RefTable([
        ["Symptom", "Fix"],
        ["AI never replies", "Check Make scenario History — if no run, the GHL webhook isn't firing. Verify the workflow is published AND turned on, and the webhook URL matches."],
        ["Reply comes through but is generic", "OpenAI module is hitting an error. Open the module — likely API key invalid or out of credit."],
        ["AI hallucinates time slots", "Slot module isn't running OR isn't passing slots into the prompt. Check Route A is actually building reply text from real slot data."],
        ["Appointment not creating", "GHL Book workflow webhook is wrong, or contact_id / slot_iso missing in payload. Inspect the GHL workflow execution log."],
        ["Confirmations not sending", "Appointment Reminders workflow is off, or the wait timers haven't elapsed yet."],
        ["Loops / AI replies to itself", "Add a filter in the Inbound workflow: skip if message direction = outbound."]
      ]),
      Spacer(),

      // ===== COSTS =====
      H1("9. Expected Monthly Cost"),
      RefTable([
        ["Item", "Cost"],
        ["OpenAI gpt-4o-mini", "~$2–$8/mo at moderate volume (500–2,000 conversations)"],
        ["Make.com Core plan", "$9/mo (free tier of 1,000 ops works while testing)"],
        ["GHL SMS / phone fees", "Whatever you already pay — unchanged"],
        ["Total new spend", "~$11–$17/mo vs. ~$97–$297/mo for native GHL AI add-ons"]
      ]),
      Spacer(),

      // ===== NEXT =====
      H1("10. After It's Live"),
      Numbered("Watch the first 20 real conversations. Edit the system prompt every time the AI says something off-brand."),
      Numbered("Add a tag-on-intent: when ai_intent = book, tag the contact HOT. When = human, tag NEEDS_HUMAN and notify yourself."),
      Numbered("Add a memory cap: trim ai_history to the last 20 turns to keep token costs flat."),
      Numbered("Once stable, clone the Make scenario per niche — different system prompt, same plumbing."),
      Numbered("Optional upgrade: swap gpt-4o-mini for gpt-4o on high-value leads only (route by tag or pipeline stage)."),

      Spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 },
        children: [new TextRun({
          text: "Built tonight. Iterated tomorrow. Owned forever.",
          italics: true, color: "888888", size: 20
        })]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/Users/k9smac/Desktop/EVERMORE-LIFE/GHL_AI_Loop_Implementation.docx", buffer);
  console.log("Saved.");
});
