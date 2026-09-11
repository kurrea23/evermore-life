CREATE TABLE IF NOT EXISTS growth_applications (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  agency TEXT NOT NULL,
  website_url TEXT,
  states_licensed TEXT,
  operating_model TEXT NOT NULL,
  active_agents TEXT,
  production_range TEXT,
  current_ad_spend TEXT,
  desired_ad_budget TEXT,
  current_lead_sources TEXT,
  current_crm TEXT,
  biggest_acquisition_problem TEXT NOT NULL,
  package_interest TEXT NOT NULL,
  preferred_contact_method TEXT,
  contact_consent INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_growth_applications_created ON growth_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_growth_applications_package ON growth_applications(package_interest);
