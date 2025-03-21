1. The problem expanded much more, when account for articles that don't mention a company, but is highly relevent
    - E.g.: Petrol Companies <-> Any news mentioning the Ruso-Ukranian war, and wars in Middle East
    - Can use the other referenced articles inside the page -> group them -> improve relevancy estimation
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
    - A Method to vectorize the documents (article, GICS codes' definitions, companies' definitions).
        - Preffered: Hybrid approach: Cache domain-specific entities (company names/GICS codes) while processing full documents
    - A vector database
    - Calculate the metrics above in **2.**
4. Physical Components:
    - SparkNLP
    - Weaviate
5. Reference:
- https://medium.com/john-snow-labs/the-experts-guide-to-keyword-extraction-from-texts-with-spark-nlp-and-python-9741a076d2d7


