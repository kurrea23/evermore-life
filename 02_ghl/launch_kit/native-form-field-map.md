# GHL Native Form Field Map

Form name:

`Evermore Life Quote Request`

Form type:

Native GoHighLevel form embedded on `/optin`.

## Fields

| Order | Label | GHL field type | Required | Notes |
|---:|---|---|---|---|
| 1 | First Name | Contact first name | Yes | Standard contact field |
| 2 | Last Name | Contact last name | Yes | Standard contact field |
| 3 | Phone Number | Contact phone | Yes | Required for call follow-up, but SMS requires optional consent |
| 4 | Email Address | Contact email | No | Useful while A2P is pending |
| 5 | Age | Custom field: number or single-line | Yes | Accept ages 18-85 |
| 6 | State | Custom field: dropdown | Yes | Include all US states, or at minimum launch states |
| 7 | Coverage Type Interested In | Custom field: dropdown | No | Options below |
| 8 | SMS Consent | Checkbox | No | Must not be required or pre-checked |

Coverage type options:

- Not sure yet
- Final Expense
- Term Life
- Indexed Universal Life (IUL)
- Whole Life
- Mortgage Protection
- Annuities
- Multiple / Need guidance

SMS checkbox label:

`Optional: I consent to receive SMS text messages from Evermore Life about my quote request, appointment reminders, and insurance information. Msg & data rates may apply. Message frequency varies. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase.`

Text directly below the form:

`You can submit this quote request without agreeing to SMS. A licensed Evermore Life agent may contact you by phone or email about your request. View our Privacy Policy and Terms of Service.`

Footer links:

- Privacy Policy: `https://evermorelife.org/privacypolicy`
- Terms of Service: `https://evermorelife.org/terms`

Hidden/tracking fields if GHL allows:

- `source_page` = `evermorelife.org/optin`
- `lead_source` = `Evermore Website`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Submission action:

- Show redirect or confirmation page: `https://evermorelife.org/thankyou`
- Add tag in workflow: `evermore-life-lead`

Important A2P details:

- The checkbox must be optional.
- The checkbox must not be pre-selected.
- Privacy and Terms links must be visible near the form.
- If using both marketing and non-marketing SMS later, create separate checkboxes. For launch, keep this as requested quote follow-up and appointment reminders only.
