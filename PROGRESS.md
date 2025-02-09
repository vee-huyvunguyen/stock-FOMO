# Project Progress Plan

## Overview

This project builds a platform for scraping news, performing sentiment analysis, and correlating sentiment with stock performance. We aim to showcase data engineering, web scraping, pipeline orchestration, and analytics capabilities. With an available commitment of 2 hours per day, the following phased plan is proposed.

---

## Phase Breakdown (Monthly Cadence)

### Month 1: Core Pipeline Foundation

- **Scraping & Data Ingestion:**
  - Complete crawlers for CNBC, Reuters, and Fox News.
  - Utilize the mature CNBC crawler as a template to implement Reuters and Fox News versions.
- **Data Storage Setup:**
  - Create the essential PostgreSQL schemas and tables (e.g., `scrape.raw_article_pages`, `scrape.scraped_links`).
- **Basic Sentiment Analysis:**
  - Implement initial sentiment analysis using pre-trained models (e.g., VADER or TextBlob).
- **Orchestration:**
  - Set up Airflow DAGs for orchestrating daily scraping tasks.
- **Initial Dashboard:**
  - Build a basic Streamlit dashboard to display raw scraped data.

> **Docs:**
>
> - The sentiment analysis can be prototyped in Python before integrating with PySpark.
> - Use available tests and CI in the crawler module to ensure reliability.

---

### Month 2: MVP Completion

- **Additional Sources & Enhancements:**
  - Integrate social media scraping (e.g., X, Reddit, Facebook) if feasible.
  - Begin implementing journalist scoring and basic stock-dependency metrics.
- **Enhanced Data Pipeline:**
  - Leverage PySpark for batch processing and data cleaning.
  - Optionally add dbt for transformation stages.
- **Dashboard Expansion:**
  - Enhance the Streamlit dashboard to display:
    - Latest articles per stock.
    - A sentiment timeline.
    - Basic visualizations correlating sentiment with stock performance.
- **Deployment:**
  - Deploy the scraping process online (e.g., on a cloud instance or via Docker) while keeping other components local.
- **Documentation & Testing:**
  - Update project documentation and extend tests for pipelines and dashboards.

> **Comments:**
>
> - Prioritize a working end-to-end pipeline for the MVP before adding complex scoring.

---

### Month 3: Production Readiness

- **Advanced Features:**
  - Integrate GICS code relevance detection for more granular analysis.
  - Develop a caching layer for analytical results.
  - Implement robust error handling and retries in the scrapers.
- **Performance Optimization:**
  - Optimize and scale the data transformation pipelines.
- **Containerization:**
  - Dockerize all components (crawler, Airflow, PostgreSQL, Streamlit).
- **Monitoring:**
  - Set up logging, monitoring, and alerts for production.

> **Docs:**
>
> - Use Docker and cloud orchestration best practices to streamline deployment.

---

### Month 4: Advanced Capabilities

- **Real-Time Integration:**
  - Incorporate real-time stock data streaming (e.g., via Polygon.io).
  - Enhance journalist influence scoring and predictive modeling.
- **CI/CD & Continuous Monitoring:**
  - Set up CI/CD pipelines for continuous integration and deployment.
  - Finalize MC tools for live monitoring and alerting.
- **Polishing & Final Deployment:**
  - Final testing, security audits, and performance tuning.

---

## MVP Requirements

### Core Components:

- **Scraping:**
  - Reliable online scraping of CNBC, Reuters, and Fox News.
- **Sentiment Analysis:**
  - Basic sentiment scoring using pre-trained NLP models.
- **Orchestration & Storage:**
  - Daily processing via Airflow.
  - Local PostgreSQL instance for raw and processed data.
- **Dashboard:**
  - A local Streamlit dashboard displaying:
    - Latest articles per stock.
    - Sentiment scores and timelines.
    - Simple visual correlations between news sentiment and stock performance.

### Deployment:

- **MVP Deployment:**
  - Scraping is deployed online.
  - Display and results processing (dashboard, sentiment analysis) remain local for initial validation.

---

## Time Estimation

Based on a commitment of 2 hours/day (approximately 14 hours/week):

- **MVP Completion:** ~8-10 weeks
- **Crawler Completion:** ~2 weeks (using existing codebase as a foundation)
- **Sentiment Pipeline & Dashboard:** ~3-4 weeks
- **Online Deployment & Testing:** ~1-2 weeks
- **Full Project Completion (Advanced Features):** ~16-20 weeks (4-5 months)

> **Note:** These are estimates; the actual timeline may vary based on troubleshooting, testing, and any re-scoping needed.

---

## Conclusion

This plan provides a clear roadmap for achieving an MVP within 2-3 months, followed by advanced production features over the subsequent months. The modular approach ensures continuous progress with careful validation at every stage.
