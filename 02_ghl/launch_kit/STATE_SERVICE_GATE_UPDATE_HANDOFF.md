# State Service Gate Update Handoff

**Date:** June 14, 2026  
**Approval state:** Human status correction received; live GHL changes not made  
**Current governing status:** Arizona and Texas active; Arkansas pending

## Why This Exists

The state-page project now uses the operator-confirmed service status above.
Several older GHL, Sarah, campaign, and handoff files still encode Arizona and
Arkansas as active and Texas as pending. Those rules are stale and create a
high-risk routing conflict.

## Required GHL Gate

Apply this immediately after a lead's state is known and before opportunity,
booking, Sarah qualification, SMS, or active nurture:

| Lead state | Required action |
| --- | --- |
| Arizona (`AZ`) | Continue through approved active-state workflow |
| Texas (`TX`) | Continue through approved active-state workflow |
| Arkansas (`AR`) | Add pending-state tag, send availability-only response, notify owner, stop |
| Any other state | Add unsupported-state tag, send unavailable response, notify owner, stop |

## Arkansas Pending-State Rules

- Do not create an opportunity.
- Do not offer a coverage review, quote, appointment, or Sarah qualification.
- Do not enter active SMS or email nurture.
- Use a dedicated email-only availability-interest workflow if one is approved
  and built.
- Do not promise a launch date or future availability.

## Before Texas Traffic

1. Confirm the live workflow accepts `TX`.
2. Confirm Texas leads receive the approved active-state tags, opportunity,
   notification, and follow-up.
3. Confirm Texas licensing attribution and product/carrier availability with
   the appropriate compliance owner.
4. Submit one controlled Texas test lead and document every result.
5. Confirm Arkansas is stopped before active conversion actions.

## Known Conflicting Sources

- `CODEX_MASTER_HANDOFF.md`
- `00_START_HERE/ADS_LAUNCH_CONTROL.md`
- `02_ghl/launch_kit/GHL_WORKFLOW_COMPLETE_SPEC.md`
- `04_content_narrative/GHL_SARAH_FULL_CONVERSATION_TREE.md`
- `04_content_narrative/ad_campaign_scaffold/META_ADS_MANAGER_HANDOFF.md`

Do not bulk-rewrite or treat these files as current until their owners review
the new status contract. The state-page source of truth is:

`01_website/state-pages/data/states.json`

## Live Status

Unknown. No GHL account change or end-to-end Texas/Arkansas routing test was
performed during the state-page build.

