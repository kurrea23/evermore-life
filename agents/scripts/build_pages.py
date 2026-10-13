#!/usr/bin/env python3
"""Build the public directory and profiles from the reviewed agent registry."""
from datetime import date
from html import escape
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
E = lambda value: escape(str(value), quote=True)


def pretty(value):
    d = date.fromisoformat(value)
    return f"{d:%B} {d.day}, {d.year}"


def frame(title, description, body):
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(title)} | Evermore Life</title><meta name="description" content="{E(description)}">
<meta name="robots" content="noindex, nofollow"><link rel="stylesheet" href="/agents/assets/agents.css?v=20261012-5"></head>
<body><a class="skip" href="#main">Skip to content</a>
<header class="nav"><div class="shell"><a href="https://evermorelife.org/" aria-label="Evermore Life home"><img class="logo" src="/01_website/v2/assets/evermorelife-llc-logo-nav.png" alt="Evermore Life Insurance LLC" width="186" height="72"></a>
<nav class="nav-links" aria-label="Main navigation"><a href="/agents/">Our people</a><a href="#contact">Contact ↗</a></nav></div></header>
<main id="main">{body}</main>
<footer class="footer"><div class="shell"><div><p>© 2026 Evermore Life Insurance LLC · Your legacy moves on.</p><p>Coverage depends on state availability, carrier approval and underwriting. A conversation carries no obligation to purchase.</p></div><nav class="footer-links" aria-label="Legal"><a href="https://evermorelife.org/brand">Brand Kit</a><a href="https://evermorelife.org/privacy">Privacy</a><a href="https://evermorelife.org/terms">Terms</a></nav></div></footer>
</body></html>'''


def portrait(a, caption=True):
    label = f'<div class="portrait-label"><h2>{E(a["name"])}</h2><p>{E(a["role"])} · Evermore Life</p></div>' if caption else ''
    return f'<div class="portrait-wrap"><div class="portrait"><img src="{E(a["portrait_source"])}" alt="{E(a["name"])}" width="1622" height="969"></div>{label}</div>'


def contacts(a):
    return f'''<div class="contact-links"><a href="tel:{E(a['phone'])}"><small>Call {E(a['first_name'])}</small><strong>{E(a['phone_display'])} ↗</strong></a><a href="mailto:{E(a['email'])}"><small>Email</small><strong>{E(a['email'])} ↗</strong></a><a href="tel:{E(a['office_phone'])}"><small>Arkansas office</small><strong>{E(a['office_phone_display'])} ↗</strong></a></div>'''


def profile(a):
    licenses = []
    for license in a['licenses']:
        status = license['status'] + ' at verification'
        if date.fromisoformat(license['expires']) < date.today():
            status = 'Renewal needs verification'
        licenses.append(f'''<article class="license"><div class="license-top"><h3>{E(license['state'])}</h3><span class="status">{E(status)}</span></div><p>{E(license['type'])}</p><dl><dt>License number</dt><dd>{E(license['number'])}</dd><dt>Lines of authority</dt><dd>{E(license['lines'])}</dd><dt>Effective</dt><dd>{pretty(license['effective'])}</dd><dt>Expires</dt><dd>{pretty(license['expires'])}</dd></dl><a href="{E(license['source'])}" target="_blank" rel="noopener noreferrer">Check official state record ↗</a></article>''')
    about = ''
    if a.get('about'):
        details = a['about']
        paragraphs = ''.join(f'<p>{E(paragraph)}</p>' for paragraph in details['paragraphs'])
        experience = ''.join(f'<li>{E(item)}</li>' for item in details['experience'])
        about = f'<section class="section about" id="about"><div class="shell about-grid"><div><p class="eyebrow">About {E(a["first_name"])}</p><h2>{E(details["heading"])}</h2>{paragraphs}<p class="about-signature">{E(a["name"])}</p></div><aside class="experience"><p class="eyebrow">A background in</p><ul>{experience}</ul><p>Thoughtful questions.<br>Clear conversations.<br>Your next step, at your pace.</p></aside></div></section>'
    about_link = '<a class="about-link" href="#about">A little about me <span aria-hidden="true">↓</span></a>' if about else ''
    trust = '<div class="trustline"><span>A direct conversation</span><span>Plain-language guidance</span><span>Credentials you can check</span></div>'
    if a.get('licensing_preparation'):
        badges = []
        for badge in a['licensing_preparation']['badges']:
            if badge['icon'] not in {'fingerprint', 'live-scan', 'background-check'}:
                raise ValueError('Screening badge must use a reviewed icon')
            badges.append(f'<li title="{E(badge["description"])}" aria-label="{E(badge["description"])}"><span class="screening-icon"><img src="/agents/assets/{E(badge["icon"])}.svg" alt="" aria-hidden="true" width="28" height="28"></span><span>{E(badge["label"])}</span></li>')
        trust = f'<ul class="screening-badges" aria-label="Completed licensing screening steps">{"".join(badges)}</ul>'
    return frame(f"Meet {a['name']}", f"Meet {a['name']} at Evermore Life. Direct contact and state insurance license details, explained clearly.", f'''
<section class="hero"><div class="shell"><p class="breadcrumb"><a href="/agents/">Our people</a> / {E(a['name'])}</p><div class="hero-grid"><div><p class="eyebrow">Meet {E(a['first_name'])} · Evermore Life</p><h1>A real person<br>in <em>your corner.</em></h1><p class="lede">Life insurance starts with the people you care about. Bring your questions, your plans, or just a place to start. Let’s talk it through, one step at a time.</p><div class="actions"><a class="button" href="tel:{E(a['phone'])}">Call {E(a['first_name'])} <span aria-hidden="true">↗</span></a><a class="button secondary" href="mailto:{E(a['email'])}">Send an email</a></div><p class="small">Your questions. Your pace. No obligation.</p>{about_link}</div>{portrait(a)}</div>{trust}</div></section>
{about}
<section class="section"><div class="shell"><div class="intro"><p class="eyebrow">Real people. Real help.</p><h2>You don’t need to have<br>it all figured out.</h2><p>A conversation is a place to ask what coverage means for your family, what it might cost, and what to look at next.</p></div><div class="steps"><article class="step"><span class="step-number">01</span><h3>Start with your life.</h3><p>Share what matters to you: your family, your home, or the expenses you want to prepare for.</p></article><article class="step"><span class="step-number">02</span><h3>Make room for questions.</h3><p>Talk through coverage, cost, eligibility and policy details in words that make sense.</p></article><article class="step"><span class="step-number">03</span><h3>Choose your next step.</h3><p>Take time to review. Ask another question. Decide what fits your needs and your budget.</p></article></div></div></section>
<section class="section credentials" id="licenses"><div class="shell"><div class="credentials-head"><div class="intro"><p class="eyebrow">Know who you’re talking to</p><h2>Credentials, in the open.</h2><p>Official state records checked {pretty(a['verified_on'])}.</p></div><p class="npn">National Producer Number <strong>{E(a['npn'])}</strong></p></div><div class="license-grid">{''.join(licenses)}</div><p class="license-note">Status reflects the date checked and may change. Use the official links for the current record. In Texas, select Individual and search by name or license number. Insurance licensing does not establish securities registration or a carrier appointment.</p></div></section>
<section class="section"><div class="shell"><div class="contact" id="contact"><div><p class="eyebrow">Whenever you’re ready</p><h2>Let’s start with<br>a conversation.</h2><p>Reach {E(a['first_name'])} directly by phone or email. Please keep health, payment and identification details out of email; ask about a secure way to share them.</p></div>{contacts(a)}</div><div class="faq"><details><summary>What should I bring to the first conversation?</summary><p>Your questions and an idea of who or what you want to protect. You can discuss goals and budget before choosing whether to apply.</p></details><details><summary>How can I check an insurance license?</summary><p>Use the official state links above. Search for {E(a['name'])}, NPN {E(a['npn'])}, or the listed state license number. An NPN identifies a producer; the state record shows the license and its status.</p></details></div></div></section>''')


def directory(agents):
    cards = []
    for a in agents:
        states = ' · '.join(E(item['state']) for item in a['licenses'])
        cards.append(f'''<article class="agent-feature">{portrait(a, False)}<div class="agent-feature-copy"><p class="eyebrow">{E(a['role'])}</p><h2>{E(a['name'])}</h2><p class="state-list">{states}</p><p>Start with a question. Talk with a real person about the people you want to protect and the options you want to understand.</p><p class="small">State records checked {pretty(a['verified_on'])} · NPN {E(a['npn'])}</p><div class="actions"><a class="button" href="/agents/{E(a['slug'])}/">Meet {E(a['first_name'])} ↗</a><a class="button secondary" href="tel:{E(a['phone'])}">Call directly</a></div></div></article>''')
    return frame('Real people. Real help.', 'Meet the people behind Evermore Life. Start with Keenan Urrea, explore verified credentials, and reach out directly.', f'''<div class="shell"><section class="directory-hero"><p class="eyebrow">The people behind the promise</p><h1>Real people.<br><em>Real help.</em></h1><p class="lede">Insurance can feel like a lot. Knowing who you’re talking to should be simple. Meet the people here to help you take the next step.</p></section>{''.join(cards)}<section class="section" id="contact"><div class="intro"><p class="eyebrow">A place to start</p><h2>Have a question?<br>That’s enough.</h2><p>Choose a profile to see credentials and direct contact details. Reach out at your own pace.</p></div></section></div>''')


def main():
    agents = json.loads((ROOT / 'data/profiles.json').read_text())['agents']
    if not agents:
        raise ValueError('At least one reviewed profile is required')
    seen = set()
    for a in agents:
        if not re.fullmatch(r'[a-z]+(?:-[a-z]+)*', a['slug']) or a['slug'] in seen:
            raise ValueError('Agent slugs must be unique and contain only lowercase words')
        seen.add(a['slug'])
        date.fromisoformat(a['verified_on'])
        for license in a['licenses']:
            if license['status'] != 'Active' or not license['source'].startswith('https://'):
                raise ValueError('Review license status and official evidence before adding a profile')
        destination = ROOT / a['slug'] / 'index.html'
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(profile(a))
        print(destination.relative_to(ROOT.parent))
    (ROOT / 'index.html').write_text(directory(agents))
    print('agents/index.html')


if __name__ == '__main__':
    main()
