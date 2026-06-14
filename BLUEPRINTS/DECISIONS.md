# Evermore Decision Log

Record only consequential decisions that a human approved. Append new decisions;
do not rewrite history.

## Template

### YYYY-MM-DD - Decision title

- **Status:** proposed | approved | reversed
- **Decision:** What was chosen?
- **Why:** What evidence or constraint drove it?
- **Consequences:** What changes now?
- **Evidence:** Links to reports, source files, or verified live proof
- **Owner:** Who owns the next move?

---

## 2026-06-14 - Adopt Local-First Agent Cartography

- **Status:** approved
- **Decision:** Use `BLUEPRINTS/` as Evermore's durable cross-surface navigation,
  report, overlap, and decision layer.
- **Why:** Important intelligence must survive individual chats, models, and
  agents without creating a duplicate source of truth.
- **Consequences:** Meaningful mapping work ends with a local report; canonical
  files and live evidence remain authoritative.
- **Evidence:** `AGENTS.md`, `BLUEPRINTS/README.md`, `BLUEPRINTS/MAP.md`
- **Owner:** Evermore operator

## 2026-06-14 - Govern first-wave state pages from one status registry

- **Status:** approved
- **Decision:** Use `01_website/state-pages/data/states.json` as the governing
  state-page service-mode registry. Arizona and Texas are active; Arkansas is
  pending.
- **Why:** The human operator corrected the state status during the build, a
  Texas license artifact exists, and older website, GHL, Sarah, and campaign
  sources conflict with the correction.
- **Consequences:** Arizona and Texas receive active draft conversion pages.
  Arkansas receives an unindexed availability-update page with no quote,
  booking, phone, or active-nurture path. Live GHL, Sarah, and campaign rules
  must be corrected and verified before traffic.
- **Evidence:** `01_website/state-pages/data/states.json`,
  `STATE LICENSES/TEXAS INSURANCE LICENSE.pdf`,
  `02_ghl/launch_kit/STATE_SERVICE_GATE_UPDATE_HANDOFF.md`,
  `BLUEPRINTS/reports/2026-06-14_state-page-swarm-foundation.md`
- **Owner:** Evermore operator

### 2026-06-14 - Use Projects and Done as the broad cockpit completion layer

- **Status:** approved
- **Decision:** The local broad cockpit should keep generated Main state read
  only, track actionable completion in Projects, and move finished items into
  Done instead of leaving retired work in the active Main view.
- **Why:** The operator confirmed that older May 11, EDC, IRS-call, contracting,
  and old-LLC A2P items were already done or retired, but they remained visible
  because no completion layer was driving active-vs-done display.
- **Consequences:** The broad cockpit now exposes `Main`, `Projects`, and
  `Done`, and older handoffs must be overridden when operator-corrected state
  says a former blocker is no longer live.
- **Evidence:** `00_START_HERE/OPERATOR_STATE_UPDATE_2026-06-14.md`,
  `BLUEPRINTS/reports/2026-06-14_broad-cockpit-project-source-of-truth.md`
- **Owner:** Evermore operator
