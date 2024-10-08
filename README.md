# Overview
- a platform that show/predict stock changes (up,down, by how much ?)
- relevant to news articles (sentiment analysis)

# Requirements
	to learn scala and rust
## Functional requirements
- show average news' polarity (negative/positive/neutral) towards a company (stock)
- How FOMO they are
	- show how a stock is dependent on
		- news polarity 
		- specific journalists' opinions
	- show how an industry is dependent on news
- Update daily
## Technical requirements
- web crawling with rust (using **spider-rs**) -> to learn
- serving api -> scala -> to learn
- batch/realtime calculation -> scala
- front end -> python + streamlit
- the dashboard can be filtered based on stock code (company), news source, polarity, journalists, industry, datetime
- Optional: 
    - redis for caching
# Solutions
## Tech stack
- scraping with **spider-rs**
- batch calculation and realtime inference with **apache-spark** + **Scala**
- backend serving with **Scala**
- realtime/history stock data with **vnstock-python-framework**
## Steps
- For news article parallel scraping with **spider-rs**
- for sentiment analysis 
	- On-time: Create reviews dataset with: scraping reviews data on shopee with **spider-rs**
	- Generate "words polarity weight" database using
		- Batch calculation with apache spark
		- Storing the "words polarity weight" in key-value store **MySQL**
	- Realtime inference -> Spark + "weight" from **apache-cassandra**
- Stock market info serving:
	- Query and save all stock history data in **MySQL**
	- Streaming new stock market info from **vnstock-python-framework**
	- backend API serve data only from the database, not **vnstock-python-framework** 
- For serving API -> https://www.playframework.com/
- Front end:
	- serving dashboard with **Streamlit**
- Optional: 
	- **cache** with **redis**
# Development
## Code base folder structure
- stock_db
- scrape_jobs
- spark_jobs
- backend
- frontend
- credentials
- README.md

# Reference
- spider-rs: https://docs.rs/spider/latest/spider/