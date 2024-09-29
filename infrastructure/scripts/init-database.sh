#!/bin/bash

# Microsoft Excel Project - Database Initialization Script
# This script initializes and sets up the database for the Microsoft Excel project.
# It creates necessary database structures, applies initial schemas, and potentially seeds default data.

# Error handling
set -e
set -o pipefail

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Check for required environment variables
required_vars=("DATABASE_SERVER" "DATABASE_NAME" "ADMIN_USERNAME" "ADMIN_PASSWORD")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: Required environment variable $var is not set."
        exit 1
    fi
done

# Function to run SQL commands
run_sql_command() {
    sqlcmd -S "$DATABASE_SERVER" -d "$DATABASE_NAME" -U "$ADMIN_USERNAME" -P "$ADMIN_PASSWORD" -Q "$1"
}

# Function to run SQL files
run_sql_file() {
    sqlcmd -S "$DATABASE_SERVER" -d "$DATABASE_NAME" -U "$ADMIN_USERNAME" -P "$ADMIN_PASSWORD" -i "$1"
}

echo "Initializing database for Microsoft Excel project..."

# Create database if it doesn't exist
run_sql_command "IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'$DATABASE_NAME')
BEGIN
    CREATE DATABASE [$DATABASE_NAME];
END"

echo "Database created or already exists."

# Apply initial schema
echo "Applying initial schema..."
run_sql_file "src/database/migrations/initialSchema.ts"

# Create tables
echo "Creating tables..."
run_sql_command "
-- Workbooks table
CREATE TABLE Workbooks (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    CreatedDate DATETIME2 NOT NULL,
    ModifiedDate DATETIME2 NOT NULL,
    OwnerId UNIQUEIDENTIFIER NOT NULL
);

-- Worksheets table
CREATE TABLE Worksheets (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    WorkbookId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    Index INT NOT NULL,
    FOREIGN KEY (WorkbookId) REFERENCES Workbooks(Id)
);

-- Cells table
CREATE TABLE Cells (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    WorksheetId UNIQUEIDENTIFIER NOT NULL,
    Column NVARCHAR(3) NOT NULL,
    Row INT NOT NULL,
    Value NVARCHAR(MAX),
    DataType NVARCHAR(50) NOT NULL,
    FOREIGN KEY (WorksheetId) REFERENCES Worksheets(Id)
);

-- Formulas table
CREATE TABLE Formulas (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    CellId UNIQUEIDENTIFIER NOT NULL,
    Expression NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (CellId) REFERENCES Cells(Id)
);

-- Charts table
CREATE TABLE Charts (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    WorksheetId UNIQUEIDENTIFIER NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    Title NVARCHAR(255),
    XAxis NVARCHAR(MAX),
    YAxis NVARCHAR(MAX),
    Data NVARCHAR(MAX),
    FOREIGN KEY (WorksheetId) REFERENCES Worksheets(Id)
);

-- Users table
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL
);
"

echo "Tables created successfully."

# Set up indexes and constraints
echo "Setting up indexes and constraints..."
run_sql_command "
-- Indexes
CREATE INDEX IX_Worksheets_WorkbookId ON Worksheets(WorkbookId);
CREATE INDEX IX_Cells_WorksheetId ON Cells(WorksheetId);
CREATE INDEX IX_Formulas_CellId ON Formulas(CellId);
CREATE INDEX IX_Charts_WorksheetId ON Charts(WorksheetId);

-- Constraints
ALTER TABLE Workbooks ADD CONSTRAINT FK_Workbooks_Users FOREIGN KEY (OwnerId) REFERENCES Users(Id);
"

echo "Indexes and constraints set up successfully."

# Apply initial data migrations
echo "Applying initial data migrations..."
run_sql_file "src/database/migrations/addVersioningSupport.ts"

# Seed default data if necessary
echo "Seeding default data..."
run_sql_file "src/database/seeders/devDataSeeder.ts"

echo "Database initialization completed successfully."

# List of human tasks
: '
Human tasks:
1. Review and adjust the database schema and initial data based on the latest Excel project requirements
2. Ensure that the script uses secure methods to retrieve database credentials, preferably from Azure Key Vault
3. Test the script in a staging environment before using it in production
'