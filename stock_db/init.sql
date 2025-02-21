-- Create schema
CREATE SCHEMA IF NOT EXISTS scrape;
CREATE SCHEMA IF NOT EXISTS cleaned;

-- Create table for raw_article_pages
CREATE TABLE IF NOT EXISTS scrape.raw_article_pages (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    page_title TEXT,
    article_title_element TEXT,
    content_elements TEXT[],
    author_elements TEXT[],
    article_published_datetime_element TEXT,
    article_updated_datetime_element TEXT,
    tag_elements TEXT[],
    tags TEXT[],
    category_element TEXT,
    article_title TEXT,
    content TEXT[],
    author TEXT[],
    article_published_datetime TEXT,
    article_updated_datetime TEXT,
    category TEXT,
    other_article_links TEXT[],
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


-- Create base tables first (no foreign keys)
CREATE TABLE IF NOT EXISTS cleaned.sources (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    parent_source_id INTEGER REFERENCES cleaned.sources(id)
);

CREATE TABLE IF NOT EXISTS cleaned.authors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT UNIQUE,
    source_id INTEGER NOT NULL REFERENCES cleaned.sources(id),
    CONSTRAINT fk_authors_source FOREIGN KEY (source_id) REFERENCES cleaned.sources(id)
);

CREATE TABLE IF NOT EXISTS cleaned.categories (
    id SERIAL PRIMARY KEY,
    name TEXT,
    url TEXT UNIQUE,
    source_id INTEGER NOT NULL,
    parent_category_id INTEGER REFERENCES cleaned.categories(id),
    CONSTRAINT fk_categories_source FOREIGN KEY (source_id) REFERENCES cleaned.sources(id)
);

CREATE TABLE IF NOT EXISTS cleaned.tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    source_id INTEGER NOT NULL,
    url TEXT,
    CONSTRAINT fk_tags_source FOREIGN KEY (source_id) REFERENCES cleaned.sources(id)
);

CREATE TABLE IF NOT EXISTS cleaned.articles (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    title TEXT,
    content TEXT,
    author_id INTEGER REFERENCES cleaned.authors(id),
    source_id INTEGER REFERENCES cleaned.sources(id),
    article_published_datetime TEXT,
    article_updated_datetime TEXT,
    category_id INTEGER REFERENCES cleaned.categories(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_articles_author FOREIGN KEY (author_id) REFERENCES cleaned.authors(id),
    CONSTRAINT fk_articles_source FOREIGN KEY (source_id) REFERENCES cleaned.sources(id),
    CONSTRAINT fk_articles_category FOREIGN KEY (category_id) REFERENCES cleaned.categories(id)
);

CREATE TABLE IF NOT EXISTS cleaned.article_references (
    article_id INTEGER NOT NULL,
    referenced_article_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (article_id, referenced_article_id),
    CONSTRAINT fk_article_references_article FOREIGN KEY (article_id) REFERENCES cleaned.articles(id),
    CONSTRAINT fk_article_references_referenced FOREIGN KEY (referenced_article_id) REFERENCES cleaned.articles(id)
);

CREATE TABLE IF NOT EXISTS cleaned.article_tags (
    article_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    CONSTRAINT fk_article_tags_article FOREIGN KEY (article_id) REFERENCES cleaned.articles(id),
    CONSTRAINT fk_article_tags_tag FOREIGN KEY (tag_id) REFERENCES cleaned.tags(id)
);

CREATE TABLE IF NOT EXISTS cleaned.author_social_links (
    author_id INTEGER NOT NULL,
    social_link TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (author_id, social_link),
    CONSTRAINT fk_author_social_links_author FOREIGN KEY (author_id) REFERENCES cleaned.authors(id)
);
