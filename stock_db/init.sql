-- Create schema
CREATE SCHEMA IF NOT EXISTS scrape;

-- Create table for raw_news_pages
CREATE TABLE IF NOT EXISTS scrape.raw_news_pages (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    content_elements TEXT[],
    author_element TEXT,
    post_datetime_element TEXT,
    category_element TEXT,
    content TEXT[],
    author TEXT,
    post_datetime TIMESTAMPTZ,
    category TEXT,
    other_news_links TEXT[],
    other_links TEXT[],
    scrape_status JSONB,
    scraped_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    inserted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create table for scraped_links
CREATE TABLE IF NOT EXISTS scrape.scraped_links (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    last_scraped_at TIMESTAMPTZ
);

-- Create an index on the url column
CREATE INDEX idx_scraped_links_url ON scrape.scraped_links (url);


-- Create table for pending_pages_to_scrape
CREATE TABLE IF NOT EXISTS scrape.pending_pages_to_scrape (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending'
);
