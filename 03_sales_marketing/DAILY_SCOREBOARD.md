# Evermore Daily Ads Scoreboard

Use one row per day. Record only verified numbers from Meta, GHL, and completed sales activity.

## Daily Metrics

| Date | Ad Spend | Impressions | Clicks | Funnel Visitors | Leads | Sarah Starts | Appointments Booked | Appointments Shown | Quotes Started | Applications Submitted | Policies Issued | Est. Commission | CPL | Cost / Booked Call |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

## Daily Sales Activity

| Date | Calls Made | Contacts Reached | Follow-Ups Due | Follow-Ups Completed | Notes / Blockers |
| --- | ---: | ---: | ---: | ---: | --- |
|  |  |  |  |  |  |

## Weekly Summary

| Week Starting | Spend | Leads | Booked Calls | Shows | Applications | Issued | CPL | Cost / Booked Call | Close Rate | Est. Commission |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
|  |  |  |  |  |  |  |  |  |  |  |

## Calculations

- `CPL = Ad Spend / Leads`
- `Cost / Booked Call = Ad Spend / Appointments Booked`
- `Show Rate = Appointments Shown / Appointments Booked`
- `Application Rate = Applications Submitted / Appointments Shown`
- `Close Rate = Policies Issued / Applications Submitted`

Use `N/A`, not zero, when the denominator is zero or the source is unavailable.

## Decision Rules

- **Any lead-routing failure:** Pause ads immediately. Repair and pass a controlled test lead before resuming.
- **CPL above $30 after at least 500 impressions:** Do not scale. Check click-through rate, landing-page conversion, creative retention, targeting, and form friction.
- **Clicks but no leads:** Inspect destination URL, mobile experience, page load, CTA clarity, form, and Pixel events.
- **Leads but no booked calls:** Improve speed-to-lead, Sarah flow, follow-up, and booking CTA before increasing budget.
- **Booked calls but low show rate:** Add confirmation and reminder steps; verify SMS is used only after A2P approval and consent.
- **One ad produces verified booked calls:** Keep it running and introduce one controlled challenger at a time.
