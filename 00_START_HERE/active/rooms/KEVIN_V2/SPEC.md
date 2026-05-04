# KEVIN V2 — 3D PROJECT MANAGER UPGRADE

> **Why:** Kevin V1 is the static cockpit experience. Kevin V2 is a present, on-screen project manager who lives in each room and keeps the user on task.
> **State:** Spec only. Build after A2P is submitted.

---

## What Kevin V2 IS

A photoreal-leaning 3D character who:

1. **Lives in the right side of the room view** (not a popup, not a chat bubble — actually in the scene, like a desk-side coworker).
2. **Knows what room you're in** and reads the room's `YOU_DO_THIS.md` to understand the current phase.
3. **Asks one question at a time**: "Did you take the screenshot? Yes / Not yet / I'm stuck."
4. **Won't let you skip stop conditions.** If the room has unmet pre-flight checks, Kevin blocks the next phase and tells you why.
5. **Hands off to other helpers** explicitly: "This is editing copy — want me to bring in Claude for that?" — then visibly steps aside.

## What Kevin V2 IS NOT

- A chatbot. He has a narrow scope: state of the current room + next action.
- A general assistant. For research, coding, or writing, he summons the right helper.
- A decoration. If he's idle for > 30 seconds and the user is mid-task, he checks in.

---

## Visual upgrade targets (V1 → V2 problem list)

V1's 3D feels unrealistic. V2 needs to fix:

| Issue in V1 | V2 target |
| --- | --- |
| Plastic/unlit shader look | PBR materials, real-time IBL, soft shadows |
| Stiff facial animation | Blendshape-driven expressions + audio-driven lipsync (Rhubarb / Oculus LipSync / NVIDIA Audio2Face) |
| Single static pose | Idle loop + 3-4 contextual poses (thinking, pointing at task list, handing off) |
| No eye contact | Subtle gaze tracking that follows the user's task list focus |
| Voice feels canned | Natural pacing TTS (ElevenLabs v3 or similar) with breath/hesitation tokens |
| Lighting is flat | Three-point lighting baked into scene + a key light that matches the cockpit's gold/navy palette |

---

## Tech path (recommended)

**Option A — Three.js + Ready Player Me (fastest to prototype)**
- RPM gives a rigged, customizable avatar export as `.glb` in minutes.
- Three.js renders it in the existing cockpit HTML — no new app.
- Audio2Face or open-source viseme mapping for lipsync.
- Pros: no native app, runs in the same HTML cockpit. Cons: RPM avatars cap at "stylized realism" not photoreal.

**Option B — Spline + glTF export**
- Design Kevin in Spline, export to web. Easier lighting control.
- Same Three.js render path.
- Pros: better lighting/shaders out of the box. Cons: more design work upfront.

**Option C — Unreal MetaHuman + WebGPU streamer (most realistic, most work)**
- True photoreal. Streamed to the browser via Pixel Streaming or a WebRTC bridge.
- Pros: ceiling is film-quality. Cons: needs a GPU server, weeks of work, overkill for v2.

**Recommendation:** Start with A. If A still feels uncanny after one iteration, jump to C — skip B.

---

## Voice + behavior

- **Voice:** Calm, pace ~140 wpm, slight Western/Southwest US neutral. Avoid customer-service brightness — Kevin is a project manager, not a sales rep.
- **Catchphrases (sparingly):** "What's the next click?" "We're not done with this room yet." "Want me to grab Claude for that?"
- **Failure modes to avoid:** small-talk, motivational filler, asking "is there anything else I can help with?" Kevin only speaks about the current room's next action.

---

## Build order (when greenlit)

1. Pick avatar source (RPM mesh + Mixamo rigging is fine for v0).
2. Drop into a Three.js scene inside `01_website/experiments/kevin_v2.html`.
3. Light it well (one warm key, one cool fill, one navy rim — match cockpit palette).
4. Wire idle loop + 3 poses.
5. Hook a JSON "room state" reader so Kevin knows which `YOU_DO_THIS.md` is active.
6. Voice + lipsync last (gets the most polish-time-per-improvement).
7. Embed in cockpit's room view as a 320px-wide panel on the right.

---

## Out of scope for V2

- Multi-character scenes (no "Kevin and Sarah in the same room")
- Full-body animation
- Mobile rendering
- Anything that requires server-side GPU
