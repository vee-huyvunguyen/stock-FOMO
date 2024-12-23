# Overview
- a platform that show/predict stock changes (up,down, by how much ?)
	- relevant to news articles (sentiment analysis)

# Requirements
	to showcase my data engineering and web scraping skills
## Functional requirements
- show average news' polarity (negative/positive/neutral) towards a company (stock)
- How FOMO they are
	- show how a stock is dependent on
		- news polarity 
		- specific journalists' opinions
	- show how an industry is dependent on news
- Update daily
## Technical requirements
- Web crawling news articles from: CNBC, Reuters, Wall Street Journal
- Saving data in postgresql:
	- Scraped data
	- Checkpoints (websites and their last scraped datetime)
- serving api -> fastapi
- batch calculation, and sentiment analysis -> pyspark
- front end -> python + streamlit
- the dashboard can be filtered based on stock code (company), news source, polarity, journalists, industry, datetime
- Optional: 
    - redis for caching
# Solutions
## Tech stack
- scraping with **crawlee+typescript+puppeteer+cheerio**
- batch calculation and realtime inference with **apache-spark+Pythohn**
- backend serving with **FastAPI**
- realtime/history stock data with [**polygon-io**](https://github.com/polygon-io/client-python)
- Data warehouse: **Postgres**
## Steps
- For news article parallel scraping with **crawlee**
- for sentiment analysis 
	- On-time: Create reviews dataset with: scraping reviews data on amazone with **crawlee**
	- Generate "words polarity weight" database using
		- Batch calculation with apache spark
		- Storing the "words polarity weight" in key-value store **postgres**
	- Realtime inference -> Spark + "weight" from **postgres**
- Stock market info serving:
	- Query and save all stock history data in **postgres**
	- Streaming new stock market info from **polygon-io**
	- backend API serve data only from the database, not **polygon-io** 
- For serving API -> https://fastapi.tiangolo.com/
- Front end:
	- serving dashboard with **Streamlit**
- Optional: 
	- **cache** with **redis**
# Development
## Code base folder structure
- `stock_db/`
- `scrape_jobs/`
- `spark_jobs/`
- `backend/`
- `frontend/`
- `credentials/`
- `README.md`