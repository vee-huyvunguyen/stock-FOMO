1. The problem expanded much more, when account for articles that don't mention a company, but is highly relevent
    - E.g.: Petrol Companies <-> Any news regarding the Ruso-Ukranian war, and Middle East Wars
2. The "stock-article" dependency will be devided into 4 steps:
    - Quantify the revelancy of the article to a set of [GICS codes](https://www.msci.com/our-solutions/indexes/gics)
    - Quantify the revelancy of the article to The companies inside those codes.
    - Quantify the tone of the article (from negative, netraul, to positive )
    - Filter Only high relevancy stock-article
    - Compare the tone of the article, and stock price history -> p-score.
        - By Author,
        - By Article Categories
        - By News Source.
3. Logical Components:
    - A Model for vectorizing the words, companies/org names
    - A Model for quantify the keywords inside an article
    - A vector database for keywords' vectors (from articles)
    - Calculate the metrics above in **2.**
4. Physical Components:
    - SparkNLP
    - Weaviate
5. Reference:
- https://medium.com/john-snow-labs/the-experts-guide-to-keyword-extraction-from-texts-with-spark-nlp-and-python-9741a076d2d7
