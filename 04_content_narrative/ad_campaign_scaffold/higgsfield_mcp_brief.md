# Higgsfield MCP Video Brief

This file is the handoff contract for generating Evermore ad videos through a future Higgsfield MCP.

If the Higgsfield MCP becomes available, Codex should use this file as the source of truth for batch jobs, asset naming, and output placement.

## Global Style

Evermore Life videos should feel warm, cinematic, intimate, and realistic. The ad should feel like a quiet human story first, then an insurance offer second.

Visual rules:

- Photorealistic, natural people, no glossy stock-ad look.
- Warm but not orange-heavy.
- Shallow depth of field where appropriate.
- Real homes, fields, cars, kitchens, and family spaces.
- No text generated inside the video unless explicitly requested; add captions in editing.
- Avoid distorted hands, unreadable papers, fake logos, visible brand names, or medical/insurance paperwork with fake legal text.
- Avoid fear-heavy disaster imagery.

Preferred outputs:

- `mp4`
- 1080x1920 for vertical ads
- 1080x1080 for square retargeting
- 1920x1080 for hero or YouTube placements
- 6-8 second clips for cinematic scenes
- 20-35 second full ad assemblies only when model supports coherent multi-shot output

## MCP Output Contract

When a video job is generated, save or reference it using this shape:

```json
{
  "creative_id": "ELC_2026_Q2_TOF_SoccerDad_Legacy_9x16_v01",
  "provider": "higgsfield",
  "status": "Needs Review",
  "prompt_name": "Soccer Dad Legacy Short",
  "aspect_ratio": "9:16",
  "duration_seconds": 30,
  "raw_output_path": "04_content_narrative/ad_campaign_scaffold/assets/generated/ELC_2026_Q2_TOF_SoccerDad_Legacy_9x16_v01_take01.mp4",
  "notes": "Track take quality, prompt drift, and edit needs here."
}
```

## Prompt Queue

### 1. Soccer Dad Legacy Short

Creative ID: `ELC_2026_Q2_TOF_SoccerDad_Legacy_9x16_v01`

Format: vertical 9:16, 30 seconds, cinematic short-form ad.

Prompt:

```text
Create a cinematic vertical short film for a life insurance brand called Evermore Life. No visible logos or text in the generated footage.

Story arc:
1. Golden hour close-up of a teenage soccer player running with the ball, gifted and full of possibility.
2. Cut to a modest home: a tired father in his early 30s holding a newborn baby, his face changing from exhaustion to love.
3. Quick warm montage: muddy cleats, a parent on the sideline, hands packing a child's lunch, driving home at night.
4. Final emotional image: an older father in stadium light watching his grown son play, quiet and proud.

Mood: warm, honest, cinematic, naturalistic, emotionally restrained. Real people, real locations, film grain, soft golden light, shallow depth of field.

Avoid: stock ad smiles, fake documents, visible brand logos, dramatic hospital scenes, fear-based imagery, exaggerated tears.
```

Editing overlay after generation:

```text
He was the best player in his county.
Then he had a son.
He spent the next 20 years making sure his son's dream had every chance his didn't.
That's not a sad story.
That's what love looks like.
Make sure your love outlasts you.
```

### 2. Mom Handled It Final Expense Short

Creative ID: `ELC_2026_Q2_TOF_MomHandledIt_FinalExpense_9x16_v01`

Format: vertical 9:16, 30 seconds, quiet emotional ad.

Prompt:

```text
Create a cinematic vertical short film about an adult child remembering their mother after she passed. No visible logos or text in the generated footage.

Story arc:
1. Morning light on an empty chair in a modest family home.
2. Hands at a kitchen table organizing simple family papers, a framed photo nearby, no readable text.
3. A quiet adult child finding a folder that shows their mother had prepared for final expenses, but do not show readable forms.
4. Close-up of the adult child's face: grief mixed with relief and gratitude.
5. Final image: sunlight across the empty chair and family photo, peaceful and still.

Mood: tender, restrained, intimate, warm natural light, respectful. The feeling is "she was still taking care of us."

Avoid: hospital beds, funeral homes, heavy crying, readable policy documents, fear tactics, melodrama.
```

Editing overlay after generation:

```text
When my mom passed, I expected chaos.
Funeral costs. Paperwork. Family stress.
But she had already handled it.
Quietly. Without telling us.
We got to grieve.
We didn't have to scramble.
Give your parents this gift.
```

### 3. Sarah How It Works Explainer

Creative ID: `ELC_2026_Q2_MOF_Sarah_HowItWorks_9x16_v01`

Format: vertical 9:16, 30 seconds, warm process explainer.

Prompt:

```text
Create a clean vertical video showing a parent calmly using a phone at a kitchen table to start a simple coverage review with an AI assistant. No readable UI text, no brand logos, no fake app screens.

Story arc:
1. Parent sits at kitchen table after bedtime, soft lamp light, phone in hand.
2. Gentle close-up of the phone interaction from angles that do not reveal readable text.
3. Parent answers a few simple questions, relaxed and focused.
4. Visual metaphor: simple cards or soft abstract option shapes appear near the phone, representing coverage choices without showing actual numbers.
5. Parent leans back with visible relief.

Mood: practical, simple, reassuring, low pressure, modern but human.

Avoid: complex financial dashboards, fake prices, medical forms, guarantee language, overly futuristic AI visuals.
```

Editing overlay after generation:

```text
Here's exactly what happens when you apply.
Step one: talk to Sarah.
Step two: answer a few simple questions.
Step three: see what options may fit.
Step four: choose whether to talk with an advisor.
Start in under 15 minutes.
```

### 4. Sarah No Pressure Retargeting Clip

Creative ID: `ELC_2026_Q2_BOF_Sarah_NoPressure_1x1_v01`

Format: square 1:1, 20 seconds, retargeting ad.

Prompt:

```text
Create a quiet square video for warm retargeting. A parent or adult child pauses at home with a phone nearby, thinking about life insurance but not pressured. The tone should be calm and human.

Scene:
Warm evening interior, kitchen or living room. The person looks at their phone, hesitates, then smiles slightly with relief as they continue. No readable UI text. No logos.

Mood: low pressure, clear, trustworthy, gentle.

Avoid: urgency, countdowns, fear imagery, fake app screens, exaggerated emotion.
```

Editing overlay after generation:

```text
Still thinking about it?
Sarah can walk you through your options.
No pressure.
No pushy call.
Just a simple coverage review.
```

### 5. Funeral Costs Education Clip

Creative ID: `ELC_2026_Q2_TOF_FuneralCosts_Education_9x16_v01`

Format: vertical 9:16, 30 seconds, education-first.

Prompt:

```text
Create a clean, warm vertical education video about planning for final expenses. Use calm home and family visuals, not funeral imagery.

Story arc:
1. Adult child at kitchen table with notebook and calculator, thoughtful but calm.
2. Parent and adult child having a respectful conversation over coffee.
3. Close-up of hands writing a simple plan in a notebook, no readable financial details.
4. Adult child closes notebook with relief.
5. Warm family photo on a shelf in soft light.

Mood: practical, respectful, reassuring, family-centered.

Avoid: funeral homes, cemeteries, debt panic, unreadable fake documents, fear-based visuals.
```

Editing overlay after generation:

```text
Funeral costs can surprise families.
Final expense coverage exists to prevent scrambling.
Many plans are simple.
Some do not require a medical exam.
Sarah can help you see what your parent may qualify for.
```

## After Generation

For every output:

1. Save the raw file into `assets/generated/`.
2. Add a row to `creative_output_tracker.md`.
3. Mark any quality issues: face drift, hand distortion, stock feel, unreadable fake text, wrong age, wrong mood, policy claim risk.
4. Approve only clips that feel emotionally real and legally conservative.
