# Evermore Life A2P / GHL Handoff

I am setting up A2P 10DLC compliance in GoHighLevel for Evermore Life LLC.

## Current Website Status

Live pages are working:

- Home: https://evermorelife.org/
- Opt-in form: https://evermorelife.org/optin
- Terms: https://evermorelife.org/terms
- Privacy Policy: https://evermorelife.org/privacy
- Thank You: https://evermorelife.org/thank-you

The site has custom pages, GHL embedded forms, Terms, Privacy Policy, opt-in language, and working extensionless routes. The chat widget path was abandoned because Home/Opt-In collect phone numbers, so the cleaner route is custom website form opt-in.

## A2P Direction

- Campaign type shown in GHL: Low Volume Mixed
- Use website form opt-in, not chat widget opt-in.
- Remove the chat widget from Body Tracking.
- Use non-promotional wording: quote request confirmation, appointment coordination, application/service updates, customer-care follow-up.
- Avoid words like special offers, promotions, discounts, marketing.

## Form Consent Setup

Use one optional SMS checkbox only. It should be unchecked by default and not required. Hide/delete the marketing/promotional checkbox for now.

Checkbox copy:

Optional: I consent to receive SMS messages from Evermore Life LLC about my quote request, appointment reminders, application updates, and related service communications at the phone number I provide. Message frequency may vary. Message and data rates may apply. Reply HELP for help or STOP to opt out. Consent is not a condition of purchase.

## GHL User Consent Screen

Opt-in Form URL:

https://evermorelife.org/optin

How contacts opt in:

Contacts opt in by visiting https://evermorelife.org/optin, entering their phone number, and checking the optional SMS consent box. The form explains message purpose, frequency, message/data rates, STOP/HELP instructions, and links to the Privacy Policy and Terms of Service.

Opt-in message:

Evermore Life LLC: You are opted in to receive texts about your quote request, appointment reminders, and related follow-up. Msg frequency varies. Msg & data rates may apply. Reply STOP to opt out or HELP for help.

## Sample Messages

Hi {{contact.first_name}}, this is Evermore Life LLC. We received your quote request and a licensed agent will follow up shortly. Reply STOP to opt out or HELP for help.

Hi {{contact.first_name}}, this is Evermore Life LLC following up on your quote request. Please reply here if you have questions or need to reschedule. Reply STOP to opt out.

## Checkbox Guidance

- Embedded link: checked if texts may include evermorelife.org or booking links.
- Phone number: checked only if texts may include a phone number in the message body.
- Age gated content: unchecked.
- Financial services / loan arrangement: leave unchecked unless GHL requires it.

## Remaining Risk / To Verify

The GHL checklist asks that the same business address, email, and phone used for brand verification are visible on the website. Confirm the exact business phone and address from GHL Contact Info and add them visibly to the footer / Terms / Privacy if missing.

Also repaste the corrected Privacy Policy if needed, because older live copy included the word "affiliates" in the SMS no-sharing sentence.
