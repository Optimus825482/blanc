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

-- Katalog (plan 1.1). Özel gün, alıcı, ürün tipi ve segment eksenleri; tasarımlar bu eksenlere
-- çoktan çoğa bağlanır (matris modeli). Kaynak veri 1.2'de public/assets/js/data.js'den taşınır.
CREATE TABLE IF NOT EXISTS bb_occasions (
  slug text PRIMARY KEY CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL,
  short_title text NOT NULL,
  body text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '',
  root text NOT NULL CHECK (root IN ('ozel-gun', 'mevsim', 'kurumsal')),
  accent text NOT NULL DEFAULT '' CHECK (accent = '' OR accent ~ '^#[0-9A-Fa-f]{6}$'),
  suggested jsonb NOT NULL DEFAULT '{}'::jsonb,
  image text NOT NULL DEFAULT '',
  alt text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bb_recipients (
  slug text PRIMARY KEY CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL,
  short_title text NOT NULL,
  body text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bb_segments (
  slug text PRIMARY KEY CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS bb_product_types (
  slug text PRIMARY KEY CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  draw_type text NOT NULL,
  sizes text[] NOT NULL DEFAULT '{}',
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bb_designs (
  slug text PRIMARY KEY CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  occasion_slug text NOT NULL REFERENCES bb_occasions(slug) ON UPDATE CASCADE,
  product_type_slug text NOT NULL REFERENCES bb_product_types(slug) ON UPDATE CASCADE,
  size text NOT NULL DEFAULT '',
  chocolate text NOT NULL DEFAULT '',
  segment_slug text REFERENCES bb_segments(slug) ON UPDATE CASCADE,
  starting_price numeric(10,2) CHECK (starting_price IS NULL OR starting_price >= 0),
  bestseller boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  tags text[] NOT NULL DEFAULT '{}',
  image text NOT NULL DEFAULT '',
  alt text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bb_design_occasions (
  design_slug text NOT NULL REFERENCES bb_designs(slug) ON DELETE CASCADE ON UPDATE CASCADE,
  occasion_slug text NOT NULL REFERENCES bb_occasions(slug) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (design_slug, occasion_slug)
);
CREATE TABLE IF NOT EXISTS bb_design_recipients (
  design_slug text NOT NULL REFERENCES bb_designs(slug) ON DELETE CASCADE ON UPDATE CASCADE,
  recipient_slug text NOT NULL REFERENCES bb_recipients(slug) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (design_slug, recipient_slug)
);
-- Stüdyo seçenekleri: grup (chocolate, wrap_color, ribbon, card, font, extra, delivery, quantity),
-- grup içinde slug; renk, css ve varsayılan gibi alanlar data içinde tutulur.
CREATE TABLE IF NOT EXISTS bb_studio_options (
  option_group text NOT NULL CHECK (option_group ~ '^[a-z_]{1,30}$'),
  slug text NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (option_group, slug)
);
-- Fiyat kuralları: kind='base' ürün tipi (+ isteğe bağlı boyut) ve adet aralığı için birim fiyat;
-- kind='extra' bir stüdyo ekstrası için ek ücret. mode: per_unit adetle çarpılır, per_order tek sefer.
CREATE TABLE IF NOT EXISTS bb_price_rules (
  id serial PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('base', 'extra')),
  product_type_slug text REFERENCES bb_product_types(slug) ON DELETE CASCADE ON UPDATE CASCADE,
  size text NOT NULL DEFAULT '',
  option_slug text,
  min_qty integer NOT NULL DEFAULT 1 CHECK (min_qty >= 1),
  max_qty integer CHECK (max_qty IS NULL OR max_qty >= min_qty),
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  mode text NOT NULL DEFAULT 'per_unit' CHECK (mode IN ('per_unit', 'per_order')),
  currency text NOT NULL DEFAULT 'TRY',
  note text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((kind = 'base' AND product_type_slug IS NOT NULL) OR (kind = 'extra' AND option_slug IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS bb_designs_published_idx ON bb_designs (published, position);
CREATE INDEX IF NOT EXISTS bb_designs_occasion_idx ON bb_designs (occasion_slug);
CREATE INDEX IF NOT EXISTS bb_designs_product_idx ON bb_designs (product_type_slug);
CREATE INDEX IF NOT EXISTS bb_price_rules_lookup_idx ON bb_price_rules (kind, product_type_slug, size, min_qty);
-- 1.3: ürün tipine altlık fotoğrafı (stüdyo gerçek görsel zemini)
ALTER TABLE bb_product_types ADD COLUMN IF NOT EXISTS image text NOT NULL DEFAULT '';
ALTER TABLE bb_product_types ADD COLUMN IF NOT EXISTS alt text NOT NULL DEFAULT '';
-- 1.6: sıkça sorulan sorular (panelden yönetilir)
CREATE TABLE IF NOT EXISTS bb_faq (
  id serial PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
-- 2.5: teklif talepleri (stüdyo onayı sonrası kayıt; takip kodu müşteriye gösterilir)
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- gen_random_bytes: takip anahtarı varsayılanı
CREATE TABLE IF NOT EXISTS bb_quotes (
  id serial PRIMARY KEY,
  code text NOT NULL UNIQUE CHECK (code ~ '^BB-[A-Z0-9]{4}-[A-Z0-9]{2}$'),
  token text NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  kind text NOT NULL DEFAULT 'personal' CHECK (kind IN ('personal', 'corporate')),
  design_slug text REFERENCES bb_designs(slug) ON DELETE SET NULL ON UPDATE CASCADE,
  occasion_slug text NOT NULL DEFAULT '',
  product_type_slug text NOT NULL DEFAULT '',
  size text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  selections jsonb NOT NULL DEFAULT '{}'::jsonb,
  summary text NOT NULL DEFAULT '',
  estimate numeric(10,2) CHECK (estimate IS NULL OR estimate >= 0),
  delivery_method text NOT NULL DEFAULT '',
  delivery_date date,
  recipient_name text NOT NULL DEFAULT '',
  contact_channel text NOT NULL DEFAULT '' CHECK (contact_channel IN ('', 'whatsapp', 'instagram', 'share', 'download')),
  image_id uuid REFERENCES bb_media(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'confirmed', 'done', 'cancelled')),
  admin_note text NOT NULL DEFAULT '',
  client_hash text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE bb_quotes ADD COLUMN IF NOT EXISTS token text NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex');
CREATE INDEX IF NOT EXISTS bb_quotes_status_idx ON bb_quotes (status, created_at DESC);
CREATE INDEX IF NOT EXISTS bb_quotes_client_idx ON bb_quotes (client_hash, created_at DESC);
