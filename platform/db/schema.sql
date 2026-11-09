CREATE TABLE IF NOT EXISTS bb_media (
  id uuid PRIMARY KEY,
  bytes bytea NOT NULL,
  width integer NOT NULL CHECK (width > 0),
  height integer NOT NULL CHECK (height > 0)
);
CREATE TABLE IF NOT EXISTS bb_content (
  key text PRIMARY KEY,
  title text NOT NULL,
  body text NOT NULL,
  image text NOT NULL,
  alt text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bb_categories (
  slug text PRIMARY KEY CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL,
  body text NOT NULL,
  image text NOT NULL,
  alt text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bb_login_limits (
  bucket timestamptz PRIMARY KEY,
  attempts integer NOT NULL
);
CREATE TABLE IF NOT EXISTS bb_instagram (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  account_id text NOT NULL,
  username text NOT NULL,
  token_cipher text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bb_settings (
  key text PRIMARY KEY CHECK (key ~ '^[a-z_]{1,40}$'),
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
