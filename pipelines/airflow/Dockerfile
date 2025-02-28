FROM quay.io/astronomer/astro-runtime:12.7.1

USER root

# Install OpenJDK-17
RUN apt update && \
    apt-get install -y openjdk-17-jdk && \
    apt-get install -y ant && \
    # Add PostgreSQL development libraries
    apt-get install -y libpq-dev postgresql-server-dev-all && \
    apt-get clean;

RUN python -m venv dbt_venv && source dbt_venv/bin/activate && \
    pip install psycopg2-binary dbt-postgres && \
    deactivate

# Set JAVA_HOME
ENV JAVA_HOME /usr/lib/jvm/java-17-openjdk-amd64/
RUN export JAVA_HOME

USER astro