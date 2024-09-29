FROM postgres:13

# Set environment variables
ENV POSTGRES_DB=excel_db
ENV POSTGRES_USER=excel_user
ENV POSTGRES_PASSWORD=${DB_PASSWORD}

# Install additional PostgreSQL contributions
RUN apt-get update && apt-get install -y postgresql-contrib

# Copy initialization script
COPY ./infrastructure/scripts/init-database.sh /docker-entrypoint-initdb.d/

# Configure PostgreSQL to allow connections from all addresses
RUN echo "host all all 0.0.0.0/0 md5" >> /etc/postgresql/13/main/pg_hba.conf && \
    echo "listen_addresses='*'" >> /etc/postgresql/13/main/postgresql.conf

# Expose PostgreSQL port
EXPOSE 5432

# Set up a volume for persistent data storage
VOLUME ["/var/lib/postgresql/data"]

# Add healthcheck
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD pg_isready -U excel_user -d excel_db || exit 1
```

# Human Tasks (Commented)
```
# TODO: Review and set appropriate values for environment variables, especially the database password
# TODO: Ensure the init-database.sh script is created and properly sets up the initial database schema
# TODO: Verify that the volume mount path is correct for the deployment environment