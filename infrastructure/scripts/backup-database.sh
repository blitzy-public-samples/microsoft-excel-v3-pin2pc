#!/bin/bash

# Microsoft Excel Database Backup Script
# This script performs automated backups of the Microsoft Excel database(s)

# Load configuration if exists
if [ -f "/etc/excel-backup.conf" ]; then
    source /etc/excel-backup.conf
fi

# Default variables (can be overridden in the configuration file)
BACKUP_DIR=${BACKUP_DIR:-"/var/backups/excel"}
DB_NAME=${DB_NAME:-"excel_db"}
AZURE_STORAGE_ACCOUNT=${AZURE_STORAGE_ACCOUNT:-"excelbackups"}
AZURE_CONTAINER=${AZURE_CONTAINER:-"database-backups"}
RETENTION_DAYS=${RETENTION_DAYS:-30}

# Ensure required environment variables are set
if [ -z "$AZURE_STORAGE_KEY" ]; then
    echo "Error: AZURE_STORAGE_KEY is not set. Please set it in the environment or configuration file."
    exit 1
fi

# Function to perform the database backup
perform_backup() {
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="${BACKUP_DIR}/${DB_NAME}_${timestamp}.sql.gz"

    # Ensure backup directory exists
    mkdir -p "$BACKUP_DIR"

    # Perform the backup (adjust the command based on your database type)
    # For PostgreSQL:
    # PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | gzip > "$backup_file"
    # For MySQL:
    # mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME | gzip > "$backup_file"

    # For demonstration, we'll use a placeholder command:
    echo "Backing up database $DB_NAME..." | gzip > "$backup_file"

    if [ $? -eq 0 ]; then
        echo "Backup created successfully: $backup_file"
        return 0
    else
        echo "Error: Backup creation failed"
        return 1
    fi
}

# Function to upload the backup to Azure Blob Storage
upload_to_azure() {
    local backup_file=$1
    local blob_name=$(basename "$backup_file")

    echo "Uploading $backup_file to Azure Blob Storage..."
    az storage blob upload --account-name "$AZURE_STORAGE_ACCOUNT" \
                           --account-key "$AZURE_STORAGE_KEY" \
                           --container-name "$AZURE_CONTAINER" \
                           --name "$blob_name" \
                           --file "$backup_file"

    if [ $? -eq 0 ]; then
        echo "Upload successful"
        return 0
    else
        echo "Error: Upload failed"
        return 1
    fi
}

# Function to clean up old backups
cleanup_old_backups() {
    echo "Cleaning up local backups older than $RETENTION_DAYS days..."
    find "$BACKUP_DIR" -type f -name "${DB_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete

    echo "Cleaning up Azure Blob Storage backups older than $RETENTION_DAYS days..."
    local cutoff_date=$(date -d "$RETENTION_DAYS days ago" +"%Y-%m-%d")
    az storage blob delete-batch --account-name "$AZURE_STORAGE_ACCOUNT" \
                                 --account-key "$AZURE_STORAGE_KEY" \
                                 --source "$AZURE_CONTAINER" \
                                 --if-unmodified-since "$cutoff_date"
}

# Main script execution
echo "Starting Excel database backup process at $(date)"

if perform_backup; then
    backup_file="${BACKUP_DIR}/${DB_NAME}_$(date +"%Y%m%d_%H%M%S").sql.gz"
    if upload_to_azure "$backup_file"; then
        cleanup_old_backups
        echo "Backup process completed successfully at $(date)"
    else
        echo "Backup process failed during upload at $(date)"
        exit 1
    fi
else
    echo "Backup process failed during backup creation at $(date)"
    exit 1
fi

# List of pending human tasks (commented out in the script)
: <<'HUMAN_TASKS'
Human tasks:
1. Review and adjust backup retention policy (Required)
2. Ensure proper credentials and permissions are set up for Azure Blob Storage access (Critical)
3. Test the script in a staging environment before deploying to production (Required)
4. Set up monitoring and alerting for backup job failures (Required)
HUMAN_TASKS

exit 0