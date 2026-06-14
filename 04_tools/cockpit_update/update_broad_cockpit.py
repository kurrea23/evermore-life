#!/usr/bin/env python3
"""Render the broad Evermore HTML cockpit from the latest generated snapshot."""

import argparse
import html
import json
import pathlib
import re
import sys


ROOT = pathlib.Path(__file__).resolve().parents[2]
DEFAULT_COCKPIT = ROOT / "00_START_HERE/active/cockpit/EVERMORE_COCKPIT.html"
START = "<!-- BROAD_COCKPIT_GENERATED_START -->"
END = "<!-- BROAD_COCKPIT_GENERATED_END -->"


def normalize_items(items, empty_message):
    values = [str(item).strip() for item in items if str(item).strip()]
    if values:
        return values
    return [empty_message]


def slugify(value):
    text = re.sub(r"[^a-z0-9]+", "-", str(value).lower()).strip("-")
    return text or "item"


def source_key(label, value):
    return f"{slugify(label)}::{slugify(value)}"


def render_plain_list(items, empty_message, ordered=False):
    values = normalize_items(items, empty_message)
    tag = "ol" if ordered else "ul"
    body = "".join(f"<li>{html.escape(value)}</li>" for value in values)
    return f'<{tag} class="plain-list">{body}</{tag}>'


def render_trackable_list(label, items, empty_message, ordered=False, auto_seed=True):
    values = normalize_items(items, empty_message)
    tag = "ol" if ordered else "ul"
    rows = []
    for value in values:
        key = source_key(label, value)
        rows.append(
            f"""
            <li class="generated-item" data-source-key="{html.escape(key)}"
                data-source-label="{html.escape(label)}"
                data-source-text="{html.escape(value)}"
                data-auto-seed="{str(auto_seed).lower()}">
              <div class="generated-copy">{html.escape(value)}</div>
              <div class="generated-actions">
                <button type="button" class="track-btn">Track in Projects</button>
                <span class="generated-status"></span>
              </div>
            </li>
            """
        )
    return f'<{tag} class="generated-list">{"".join(rows)}</{tag}>'


def render_sources(sources, pill_class):
    if not sources:
        return f'<span class="{pill_class}">No source status supplied</span>'
    return "".join(
        f'<span class="{pill_class}"><strong>{html.escape(str(name))}:</strong> '
        f"{html.escape(str(status))}</span>"
        for name, status in sources.items()
    )


def render_main(snapshot):
    brief = snapshot.get("brief") or {}
    return f"""{START}
    <section id="tab-main" class="tab-panel active">
      <section class="grid two-col">
        <section class="card">
          <h2>Priorities</h2>
          {render_trackable_list("Priority", snapshot.get("priorities", []), "No verified priorities.", ordered=True, auto_seed=True)}
        </section>
        <section class="card">
          <h2>Important Schedule Blocks</h2>
          {render_plain_list(snapshot.get("schedule", []), "No verified schedule items.", ordered=False)}
        </section>
        <section class="card">
          <h2>Actionable Follow-Ups</h2>
          {render_trackable_list("Follow-Up", snapshot.get("followUps", []), "No actionable follow-ups.", ordered=False, auto_seed=True)}
        </section>
        <section class="card">
          <h2>Blockers and Risks</h2>
          {render_trackable_list("Blocker", snapshot.get("risks", []), brief.get("blockers") or "No verified blockers.", ordered=False, auto_seed=True)}
        </section>
      </section>
      <section class="grid two-col">
        <section class="card">
          <h2>Today / Done / Next / Blockers</h2>
          <div class="brief">
            <div class="brief-row"><strong>Today:</strong> {html.escape(str(brief.get("today", "")))}</div>
            <div class="brief-row"><strong>Done:</strong> {html.escape(str(brief.get("done", "")))}</div>
            <div class="brief-row"><strong>Next:</strong> {html.escape(str(brief.get("next", "")))}</div>
            <div class="brief-row"><strong>Blockers:</strong> {html.escape(str(brief.get("blockers", "")))}</div>
          </div>
        </section>
        <section class="card">
          <h2>Source Health</h2>
          <div class="sources">{render_sources(snapshot.get("sources") or {{}}, "source-pill")}</div>
        </section>
      </section>
    </section>
    {END}"""


def render_document(snapshot):
    snapshot_json = json.dumps(snapshot, separators=(",", ":"), ensure_ascii=False).replace("</", "<\\/")
    date = html.escape(str(snapshot.get("date", "")))
    mission = html.escape(str(snapshot.get("mission", "No mission supplied.")))
    next_action = html.escape(str(snapshot.get("nextAction", "No next action supplied.")))
    generated_at = html.escape(str(snapshot.get("generatedAt", "")))

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Evermore Broad Operating Cockpit</title>
<style>
  * {{ box-sizing: border-box; }}
  :root {{
    --bg: #07111d;
    --panel: #0c1829;
    --panel-2: #0f2036;
    --panel-3: #122540;
    --text: #d7dfef;
    --muted: #7e8ca8;
    --gold: #d2af58;
    --cyan: #7dd3fc;
    --orange: #fb923c;
    --green: #4ade80;
    --red: #f87171;
    --border: rgba(125, 211, 252, 0.18);
    --border-strong: rgba(210, 175, 88, 0.25);
  }}
  html, body {{
    margin: 0;
    min-height: 100%;
    background:
      radial-gradient(circle at top, rgba(125, 211, 252, 0.08), transparent 28%),
      linear-gradient(180deg, #050b14 0%, var(--bg) 100%);
    color: var(--text);
    font-family: "Courier New", monospace;
  }}
  body {{
    padding: 20px;
  }}
  .shell {{
    max-width: 1440px;
    margin: 0 auto;
    display: grid;
    gap: 18px;
  }}
  .hero {{
    background: linear-gradient(135deg, rgba(15, 32, 54, 0.96), rgba(8, 20, 35, 0.96));
    border: 1px solid var(--border-strong);
    border-radius: 16px;
    padding: 22px 24px;
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  }}
  .eyebrow {{
    color: var(--gold);
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }}
  .hero-grid {{
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.85fr);
    gap: 18px;
    align-items: start;
    margin-top: 12px;
  }}
  .date {{
    margin: 0 0 10px;
    font-size: 30px;
    line-height: 1;
  }}
  .mission, .next-action {{
    margin: 0 0 10px;
    font-size: 14px;
    line-height: 1.6;
  }}
  .next-action strong {{
    color: var(--orange);
  }}
  .stamp {{
    background: rgba(7, 17, 29, 0.78);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
  }}
  .stamp-label {{
    margin-bottom: 8px;
    color: var(--muted);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }}
  .stamp-value {{
    font-size: 14px;
    line-height: 1.55;
    word-break: break-word;
  }}
  .counts {{
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 14px;
  }}
  .count-card {{
    background: rgba(9, 19, 31, 0.85);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px 14px;
  }}
  .count-label {{
    color: var(--muted);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }}
  .count-value {{
    margin-top: 4px;
    font-size: 22px;
    font-weight: bold;
  }}
  .tabs {{
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }}
  .tab-button {{
    border: 1px solid var(--border);
    border-radius: 999px;
    background: rgba(12, 24, 41, 0.92);
    color: var(--text);
    padding: 10px 16px;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }}
  .tab-button.active {{
    border-color: var(--gold);
    color: var(--gold);
    box-shadow: 0 0 0 1px rgba(210, 175, 88, 0.2) inset;
  }}
  .tab-panel {{
    display: none;
    gap: 18px;
  }}
  .tab-panel.active {{
    display: grid;
  }}
  .grid {{
    display: grid;
    gap: 18px;
  }}
  .two-col {{
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }}
  .card {{
    background: linear-gradient(180deg, rgba(12, 24, 41, 0.96), rgba(9, 17, 29, 0.96));
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 18px;
  }}
  .card h2 {{
    margin: 0 0 12px;
    color: var(--gold);
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }}
  .plain-list, .generated-list {{
    margin: 0;
    padding-left: 20px;
  }}
  .plain-list li {{
    margin-bottom: 8px;
    font-size: 13px;
    line-height: 1.55;
  }}
  .generated-list {{
    display: grid;
    gap: 10px;
    padding-left: 0;
    list-style: none;
  }}
  .generated-item {{
    border: 1px solid rgba(125, 211, 252, 0.16);
    border-radius: 12px;
    background: rgba(15, 32, 54, 0.68);
    padding: 12px 14px;
    display: grid;
    gap: 10px;
  }}
  .generated-copy {{
    font-size: 13px;
    line-height: 1.55;
  }}
  .generated-actions {{
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }}
  .track-btn, .ghost-btn, .danger-btn, .save-btn {{
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 8px 12px;
    background: rgba(7, 17, 29, 0.85);
    color: var(--text);
    font: inherit;
    font-size: 11px;
    cursor: pointer;
  }}
  .track-btn {{
    border-color: rgba(210, 175, 88, 0.3);
    color: var(--gold);
  }}
  .save-btn {{
    border-color: rgba(74, 222, 128, 0.28);
    color: var(--green);
  }}
  .danger-btn {{
    border-color: rgba(248, 113, 113, 0.3);
    color: var(--red);
  }}
  .ghost-btn {{
    color: var(--cyan);
  }}
  .generated-status {{
    color: var(--muted);
    font-size: 11px;
  }}
  .brief {{
    display: grid;
    gap: 10px;
  }}
  .brief-row {{
    padding: 12px 14px;
    border-radius: 12px;
    background: rgba(15, 32, 54, 0.7);
    border: 1px solid rgba(210, 175, 88, 0.14);
    font-size: 13px;
    line-height: 1.55;
  }}
  .brief-row strong {{
    color: var(--gold);
  }}
  .sources {{
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }}
  .source-pill {{
    padding: 8px 10px;
    border-radius: 999px;
    border: 1px solid rgba(125, 211, 252, 0.22);
    background: rgba(15, 32, 54, 0.66);
    color: var(--muted);
    font-size: 12px;
    line-height: 1.45;
  }}
  .source-pill strong {{
    color: var(--cyan);
  }}
  .projects-shell {{
    display: grid;
    gap: 18px;
  }}
  .projects-intro {{
    color: var(--text);
    font-size: 13px;
    line-height: 1.65;
  }}
  .projects-intro strong {{
    color: var(--gold);
  }}
  .project-add {{
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
  }}
  .project-input, .project-notes, .project-title-input {{
    width: 100%;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: rgba(7, 17, 29, 0.82);
    color: var(--text);
    font: inherit;
  }}
  .project-input, .project-title-input {{
    padding: 11px 13px;
    font-size: 13px;
  }}
  .project-notes {{
    min-height: 88px;
    padding: 12px 13px;
    resize: vertical;
    font-size: 12px;
    line-height: 1.55;
  }}
  .project-list {{
    display: grid;
    gap: 12px;
  }}
  .project-card {{
    border: 1px solid rgba(125, 211, 252, 0.18);
    border-radius: 14px;
    background: linear-gradient(180deg, rgba(15, 32, 54, 0.85), rgba(9, 17, 29, 0.92));
    padding: 15px;
    display: grid;
    gap: 10px;
  }}
  .project-meta {{
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    color: var(--muted);
    font-size: 11px;
  }}
  .meta-pill {{
    border: 1px solid rgba(125, 211, 252, 0.18);
    border-radius: 999px;
    padding: 4px 8px;
    background: rgba(7, 17, 29, 0.75);
  }}
  .project-actions {{
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }}
  .empty-state {{
    color: var(--muted);
    font-size: 13px;
    line-height: 1.6;
    padding: 12px 0 4px;
  }}
  .footer {{
    color: var(--muted);
    font-size: 12px;
    line-height: 1.6;
    text-align: center;
    padding-bottom: 8px;
  }}
  .hide {{
    display: none !important;
  }}
  @media (max-width: 920px) {{
    body {{ padding: 14px; }}
    .hero-grid, .counts, .two-col, .project-add {{ grid-template-columns: 1fr; }}
    .date {{ font-size: 24px; }}
  }}
</style>
</head>
<body>
  <main class="shell">
    <section class="hero">
      <div class="eyebrow">Evermore Broad Operating Cockpit</div>
      <div class="hero-grid">
        <div>
          <h1 class="date">{date}</h1>
          <p class="mission"><strong>Mission:</strong> {mission}</p>
          <p class="next-action"><strong>Exact next action:</strong> {next_action}</p>
        </div>
        <div class="stamp">
          <div class="stamp-label">Generated</div>
          <div class="stamp-value">{generated_at}</div>
          <div class="stamp-label" style="margin-top: 12px;">Operating model</div>
          <div class="stamp-value">Generated snapshot stays read-only. Projects is the manual source of truth for active work. Done holds completed work.</div>
        </div>
      </div>
      <div class="counts">
        <div class="count-card">
          <div class="count-label">Tracked Projects</div>
          <div class="count-value" id="count-projects">0</div>
        </div>
        <div class="count-card">
          <div class="count-label">Completed Items</div>
          <div class="count-value" id="count-done">0</div>
        </div>
        <div class="count-card">
          <div class="count-label">Generated Date</div>
          <div class="count-value" style="font-size: 18px;">{date}</div>
        </div>
      </div>
    </section>

    <section class="tabs">
      <button type="button" class="tab-button active" data-tab-target="tab-main">Main</button>
      <button type="button" class="tab-button" data-tab-target="tab-projects">Projects</button>
      <button type="button" class="tab-button" data-tab-target="tab-done">Done</button>
      <button type="button" class="tab-button" id="reload-page">Reload Page</button>
    </section>

    {render_main(snapshot)}

    <section id="tab-projects" class="tab-panel">
      <section class="projects-shell">
        <section class="card">
          <h2>Projects Source Of Truth</h2>
          <div class="projects-intro">
            <strong>Use Projects to mark work off.</strong> Generated priorities, follow-ups,
            and blockers can be tracked here. Once a linked project is marked done,
            it disappears from Main and moves into Done.
          </div>
        </section>
        <section class="card">
          <h2>Add Custom Project</h2>
          <div class="project-add">
            <input id="custom-project-title" class="project-input" type="text" placeholder="Add a project title">
            <button type="button" class="track-btn" id="add-custom-project">Add Project</button>
          </div>
        </section>
        <section class="card">
          <h2>Active Projects</h2>
          <div id="active-project-list" class="project-list"></div>
          <div id="active-projects-empty" class="empty-state hide">No active projects yet.</div>
        </section>
      </section>
    </section>

    <section id="tab-done" class="tab-panel">
      <section class="card">
        <h2>Completed Work</h2>
        <div id="done-project-list" class="project-list"></div>
        <div id="done-projects-empty" class="empty-state hide">Nothing has been marked done yet.</div>
      </section>
    </section>

    <div class="footer">
      Local broad cockpit file: {html.escape(str(DEFAULT_COCKPIT))}<br>
      This page is regenerated from the latest broad snapshot while project completion state stays local in the browser.
    </div>
  </main>

  <script id="broad-snapshot-json" type="application/json">{snapshot_json}</script>
  <script>
    const STORAGE_KEY = "evermore-broad-cockpit-manual-v1";
    const snapshot = JSON.parse(document.getElementById("broad-snapshot-json").textContent);

    function nowIso() {{
      return new Date().toISOString();
    }}

    function defaultState() {{
      return {{
        projects: [],
        dismissedSourceKeys: []
      }};
    }}

    function loadState() {{
      try {{
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultState();
        const parsed = JSON.parse(raw);
        return {{
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          dismissedSourceKeys: Array.isArray(parsed.dismissedSourceKeys) ? parsed.dismissedSourceKeys : []
        }};
      }} catch (error) {{
        return defaultState();
      }}
    }}

    function saveState(state) {{
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }}

    function uid() {{
      return "project-" + Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);
    }}

    function getProjectBySourceKey(state, sourceKey) {{
      return state.projects.find((project) => project.sourceKey === sourceKey) || null;
    }}

    function ensureSeedProjects(state) {{
      let changed = false;
      document.querySelectorAll(".generated-item[data-auto-seed='true']").forEach((item) => {{
        const sourceKey = item.dataset.sourceKey;
        if (!sourceKey) return;
        if (state.dismissedSourceKeys.includes(sourceKey)) return;
        if (getProjectBySourceKey(state, sourceKey)) return;
        state.projects.push({{
          id: uid(),
          title: item.dataset.sourceText || "Untitled project",
          notes: "",
          status: "active",
          sourceKey,
          sourceLabel: item.dataset.sourceLabel || "Generated",
          sourceText: item.dataset.sourceText || "",
          createdAt: nowIso(),
          updatedAt: nowIso()
        }});
        changed = true;
      }});
      return changed;
    }}

    function setActiveTab(tabId) {{
      document.querySelectorAll(".tab-button[data-tab-target]").forEach((button) => {{
        button.classList.toggle("active", button.dataset.tabTarget === tabId);
      }});
      document.querySelectorAll(".tab-panel").forEach((panel) => {{
        panel.classList.toggle("active", panel.id === tabId);
      }});
    }}

    function createProjectFromItem(state, item) {{
      const sourceKey = item.dataset.sourceKey;
      const existing = getProjectBySourceKey(state, sourceKey);
      if (existing) return existing;
      const project = {{
        id: uid(),
        title: item.dataset.sourceText || "Untitled project",
        notes: "",
        status: "active",
        sourceKey,
        sourceLabel: item.dataset.sourceLabel || "Generated",
        sourceText: item.dataset.sourceText || "",
        createdAt: nowIso(),
        updatedAt: nowIso()
      }};
      state.projects.push(project);
      return project;
    }}

    function updateCounts(state) {{
      const activeCount = state.projects.filter((project) => project.status !== "done").length;
      const doneCount = state.projects.filter((project) => project.status === "done").length;
      document.getElementById("count-projects").textContent = String(activeCount);
      document.getElementById("count-done").textContent = String(doneCount);
    }}

    function renderGeneratedItems(state) {{
      document.querySelectorAll(".generated-item").forEach((item) => {{
        const sourceKey = item.dataset.sourceKey;
        const project = getProjectBySourceKey(state, sourceKey);
        const statusNode = item.querySelector(".generated-status");
        const button = item.querySelector(".track-btn");
        const dismissed = state.dismissedSourceKeys.includes(sourceKey);

        if ((project && project.status === "done") || dismissed) {{
          item.classList.add("hide");
          return;
        }}

        item.classList.remove("hide");

        if (project) {{
          statusNode.textContent = project.status === "active" ? "Tracked in Projects" : "Completed";
          button.textContent = "Open in Projects";
        }} else {{
          statusNode.textContent = "Not yet tracked";
          button.textContent = "Track in Projects";
        }}
      }});
    }}

    function projectMeta(project) {{
      const parts = [];
      if (project.sourceLabel) parts.push(`<span class="meta-pill">${{project.sourceLabel}}</span>`);
      if (project.updatedAt) parts.push(`<span class="meta-pill">Updated ${{new Date(project.updatedAt).toLocaleString()}}</span>`);
      return parts.join("");
    }}

    function renderProjects(state) {{
      const activeList = document.getElementById("active-project-list");
      const doneList = document.getElementById("done-project-list");
      const activeEmpty = document.getElementById("active-projects-empty");
      const doneEmpty = document.getElementById("done-projects-empty");

      const activeProjects = state.projects.filter((project) => project.status !== "done");
      const doneProjects = state.projects.filter((project) => project.status === "done");

      activeList.innerHTML = "";
      doneList.innerHTML = "";

      activeProjects.forEach((project) => {{
        const wrapper = document.createElement("article");
        wrapper.className = "project-card";
        wrapper.innerHTML = `
          <input class="project-title-input" data-project-id="${{project.id}}" data-field="title" value="${{escapeHtml(project.title)}}" />
          <div class="project-meta">${{projectMeta(project)}}</div>
          <textarea class="project-notes" data-project-id="${{project.id}}" data-field="notes" placeholder="Project notes">${{escapeHtml(project.notes || "")}}</textarea>
          <div class="project-actions">
            <button type="button" class="save-btn" data-action="save" data-project-id="${{project.id}}">Save</button>
            <button type="button" class="ghost-btn" data-action="done" data-project-id="${{project.id}}">Mark Done</button>
            <button type="button" class="danger-btn" data-action="delete" data-project-id="${{project.id}}">Remove</button>
          </div>
        `;
        activeList.appendChild(wrapper);
      }});

      doneProjects.forEach((project) => {{
        const wrapper = document.createElement("article");
        wrapper.className = "project-card";
        wrapper.innerHTML = `
          <div class="generated-copy">${{escapeHtml(project.title)}}</div>
          <div class="project-meta">${{projectMeta(project)}}</div>
          <div class="brief-row">${{escapeHtml(project.notes || "No notes saved.")}}</div>
          <div class="project-actions">
            <button type="button" class="ghost-btn" data-action="restore" data-project-id="${{project.id}}">Restore</button>
            <button type="button" class="danger-btn" data-action="delete" data-project-id="${{project.id}}">Remove</button>
          </div>
        `;
        doneList.appendChild(wrapper);
      }});

      activeEmpty.classList.toggle("hide", activeProjects.length > 0);
      doneEmpty.classList.toggle("hide", doneProjects.length > 0);
    }}

    function escapeHtml(value) {{
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    }}

    function rerender(state) {{
      updateCounts(state);
      renderGeneratedItems(state);
      renderProjects(state);
      saveState(state);
    }}

    function updateProjectField(state, projectId, field, value) {{
      const project = state.projects.find((entry) => entry.id === projectId);
      if (!project) return;
      project[field] = value;
      project.updatedAt = nowIso();
    }}

    function markProjectDone(state, projectId) {{
      const project = state.projects.find((entry) => entry.id === projectId);
      if (!project) return;
      project.status = "done";
      project.updatedAt = nowIso();
    }}

    function restoreProject(state, projectId) {{
      const project = state.projects.find((entry) => entry.id === projectId);
      if (!project) return;
      project.status = "active";
      project.updatedAt = nowIso();
    }}

    function deleteProject(state, projectId) {{
      const project = state.projects.find((entry) => entry.id === projectId);
      if (project && project.sourceKey && !state.dismissedSourceKeys.includes(project.sourceKey)) {{
        state.dismissedSourceKeys.push(project.sourceKey);
      }}
      state.projects = state.projects.filter((entry) => entry.id !== projectId);
    }}

    const state = loadState();
    if (ensureSeedProjects(state)) {{
      saveState(state);
    }}
    rerender(state);

    document.querySelectorAll(".tab-button[data-tab-target]").forEach((button) => {{
      button.addEventListener("click", () => setActiveTab(button.dataset.tabTarget));
    }});

    document.getElementById("reload-page").addEventListener("click", () => window.location.reload());

    document.querySelectorAll(".generated-item .track-btn").forEach((button) => {{
      button.addEventListener("click", (event) => {{
        const item = event.currentTarget.closest(".generated-item");
        const project = createProjectFromItem(state, item);
        project.updatedAt = nowIso();
        rerender(state);
        setActiveTab("tab-projects");
      }});
    }});

    document.getElementById("add-custom-project").addEventListener("click", () => {{
      const input = document.getElementById("custom-project-title");
      const title = input.value.trim();
      if (!title) return;
      state.projects.push({{
        id: uid(),
        title,
        notes: "",
        status: "active",
        sourceKey: "",
        sourceLabel: "Custom",
        sourceText: "",
        createdAt: nowIso(),
        updatedAt: nowIso()
      }});
      input.value = "";
      rerender(state);
      setActiveTab("tab-projects");
    }});

    document.addEventListener("click", (event) => {{
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const projectId = button.dataset.projectId;
      const action = button.dataset.action;

      if (action === "save") {{
        const titleInput = document.querySelector(`.project-title-input[data-project-id="${{projectId}}"]`);
        const notesInput = document.querySelector(`.project-notes[data-project-id="${{projectId}}"]`);
        updateProjectField(state, projectId, "title", titleInput ? titleInput.value.trim() : "");
        updateProjectField(state, projectId, "notes", notesInput ? notesInput.value : "");
      }}

      if (action === "done") {{
        const titleInput = document.querySelector(`.project-title-input[data-project-id="${{projectId}}"]`);
        const notesInput = document.querySelector(`.project-notes[data-project-id="${{projectId}}"]`);
        updateProjectField(state, projectId, "title", titleInput ? titleInput.value.trim() : "");
        updateProjectField(state, projectId, "notes", notesInput ? notesInput.value : "");
        markProjectDone(state, projectId);
      }}

      if (action === "restore") {{
        restoreProject(state, projectId);
        setActiveTab("tab-projects");
      }}

      if (action === "delete") {{
        deleteProject(state, projectId);
      }}

      rerender(state);
    }});
  </script>
</body>
</html>
"""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--json-file", required=True)
    parser.add_argument("--cockpit-file", default=str(DEFAULT_COCKPIT))
    args = parser.parse_args()

    snapshot = json.loads(pathlib.Path(args.json_file).read_text())
    snapshot = snapshot.get("broad", snapshot.get("generated", snapshot))
    if not snapshot.get("date") or not snapshot.get("generatedAt"):
        raise RuntimeError("Snapshot must include non-empty date and generatedAt values")

    cockpit_path = pathlib.Path(args.cockpit_file)
    cockpit_path.write_text(render_document(snapshot))

    verified = cockpit_path.read_text()
    required = [
        START,
        END,
        str(snapshot["date"]),
        str(snapshot["generatedAt"]),
        "Priorities",
        "Actionable Follow-Ups",
        "Blockers and Risks",
        "Projects Source Of Truth",
        "Completed Work",
    ]
    missing = [value for value in required if value not in verified]
    if missing:
        raise RuntimeError(f"Broad cockpit verification failed; missing: {missing}")

    print(json.dumps({
        "ok": True,
        "cockpit": str(cockpit_path),
        "date": snapshot["date"],
        "generatedAt": snapshot["generatedAt"],
        "priorityCount": len(snapshot.get("priorities", [])),
        "followUpCount": len(snapshot.get("followUps", [])),
        "riskCount": len(snapshot.get("risks", [])),
    }, indent=2))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise
