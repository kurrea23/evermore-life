# Evermore SMS Nurture Sequence

**Build now; activate only after A2P approval.**

Every send requires:

- Explicit optional SMS consent recorded on the contact.
- Approved A2P campaign.
- Contact is not DND or opted out.
- The lead has not booked and has not entered a terminal pipeline stage.

## Day 1 - One Hour After Submission

Hi {{contact.first_name}}, this is Sarah with Evermore Life LLC. We received your coverage request. Pick a time here: https://api.leadconnectorhq.com/widget/booking/NzsTTtQ0xBDAMXVhly7L Reply STOP to opt out or HELP for help.

## Day 2

Hi {{contact.first_name}}, Sarah here with Evermore Life LLC. A coverage review helps clarify what options may fit your goals and budget. https://api.leadconnectorhq.com/widget/booking/NzsTTtQ0xBDAMXVhly7L Reply STOP to opt out.

## Day 3

Hi {{contact.first_name}}, Evermore Life LLC here. Pricing and eligibility depend on age, health, state, product, and carrier. A licensed professional can help review available options: https://api.leadconnectorhq.com/widget/booking/NzsTTtQ0xBDAMXVhly7L Reply STOP to opt out.

## Day 5 - Final Automated Follow-Up

Hi {{contact.first_name}}, last automated follow-up from Evermore Life LLC. We are here when you are ready: https://api.leadconnectorhq.com/widget/booking/NzsTTtQ0xBDAMXVhly7L Reply STOP to opt out or HELP for help.

## Appointment Confirmation

Hi {{contact.first_name}}, Evermore Life LLC confirmed your coverage review for {{appointment.start_time}}. Reply STOP to opt out or HELP for help.

## No-Show Reschedule

Hi {{contact.first_name}}, sorry we missed you. Reply here if you would like to reschedule your Evermore Life LLC coverage review. Reply STOP to opt out.

## Compliance Notes

- Do not add promotional broadcasts to this customer-care sequence.
- Do not use unsupported price examples, approval promises, urgency, or guaranteed language.
- STOP must immediately suppress future SMS.
- HELP must return support contact information.
