#!/bin/bash

# Microsoft Excel Project Deployment Script
# This script deploys the Microsoft Excel project to the Azure cloud environment.

# Exit immediately if a command exits with a non-zero status
set -e

# Function to display error messages
error_exit() {
    echo "Error: $1" >&2
    exit 1
}

# Function to update Azure infrastructure using Terraform
update_infrastructure() {
    echo "Updating Azure infrastructure..."
    cd ./infrastructure/terraform || error_exit "Failed to change directory to Terraform"
    terraform init || error_exit "Failed to initialize Terraform"
    terraform apply -auto-approve || error_exit "Failed to apply Terraform changes"
    cd - || error_exit "Failed to return to original directory"
}

# Function to build and push Docker images
build_and_push_images() {
    echo "Building and pushing Docker images..."
    docker build -t excel-api:$VERSION ./infrastructure/docker/api.Dockerfile || error_exit "Failed to build API image"
    docker build -t excel-frontend:$VERSION ./infrastructure/docker/frontend.Dockerfile || error_exit "Failed to build frontend image"
    docker build -t excel-database:$VERSION ./infrastructure/docker/database.Dockerfile || error_exit "Failed to build database image"
    
    docker tag excel-api:$VERSION $ACR_NAME.azurecr.io/excel-api:$VERSION
    docker tag excel-frontend:$VERSION $ACR_NAME.azurecr.io/excel-frontend:$VERSION
    docker tag excel-database:$VERSION $ACR_NAME.azurecr.io/excel-database:$VERSION
    
    az acr login --name $ACR_NAME || error_exit "Failed to login to Azure Container Registry"
    docker push $ACR_NAME.azurecr.io/excel-api:$VERSION || error_exit "Failed to push API image"
    docker push $ACR_NAME.azurecr.io/excel-frontend:$VERSION || error_exit "Failed to push frontend image"
    docker push $ACR_NAME.azurecr.io/excel-database:$VERSION || error_exit "Failed to push database image"
}

# Function to deploy or update Kubernetes resources
deploy_kubernetes_resources() {
    echo "Deploying Kubernetes resources..."
    az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_CLUSTER_NAME || error_exit "Failed to get AKS credentials"
    
    kubectl apply -f ./infrastructure/kubernetes/api-deployment.yaml || error_exit "Failed to apply API deployment"
    kubectl apply -f ./infrastructure/kubernetes/frontend-deployment.yaml || error_exit "Failed to apply frontend deployment"
    kubectl apply -f ./infrastructure/kubernetes/database-statefulset.yaml || error_exit "Failed to apply database statefulset"
    
    kubectl set image deployment/excel-api excel-api=$ACR_NAME.azurecr.io/excel-api:$VERSION || error_exit "Failed to update API image"
    kubectl set image deployment/excel-frontend excel-frontend=$ACR_NAME.azurecr.io/excel-frontend:$VERSION || error_exit "Failed to update frontend image"
    kubectl set image statefulset/excel-database excel-database=$ACR_NAME.azurecr.io/excel-database:$VERSION || error_exit "Failed to update database image"
    
    kubectl rollout status deployment/excel-api || error_exit "Failed to rollout API deployment"
    kubectl rollout status deployment/excel-frontend || error_exit "Failed to rollout frontend deployment"
    kubectl rollout status statefulset/excel-database || error_exit "Failed to rollout database statefulset"
}

# Function to run database migrations and initialization
run_database_migrations() {
    echo "Running database migrations and initialization..."
    ./infrastructure/scripts/init-database.sh || error_exit "Failed to initialize database"
    # Add any additional migration steps here
}

# Function to perform post-deployment checks
perform_post_deployment_checks() {
    echo "Performing post-deployment checks..."
    # Add checks for service health, endpoints, etc.
    # Example:
    # kubectl get pods -l app=excel-api | grep Running || error_exit "API pods are not running"
    # kubectl get pods -l app=excel-frontend | grep Running || error_exit "Frontend pods are not running"
    # kubectl get pods -l app=excel-database | grep Running || error_exit "Database pods are not running"
}

# Main deployment process
main() {
    echo "Starting deployment process for Microsoft Excel project..."

    # Login to Azure
    az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET --tenant $AZURE_TENANT_ID || error_exit "Failed to login to Azure"
    az account set --subscription $AZURE_SUBSCRIPTION_ID || error_exit "Failed to set Azure subscription"

    update_infrastructure
    build_and_push_images
    deploy_kubernetes_resources
    run_database_migrations
    perform_post_deployment_checks

    echo "Deployment completed successfully!"
}

# Check if required environment variables are set
if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ] || [ -z "$AZURE_SUBSCRIPTION_ID" ] || [ -z "$AZURE_TENANT_ID" ]; then
    error_exit "Required environment variables are not set. Please set ENVIRONMENT, VERSION, AZURE_SUBSCRIPTION_ID, and AZURE_TENANT_ID."
fi

# Additional required variables
: ${RESOURCE_GROUP:?"RESOURCE_GROUP is not set"}
: ${AKS_CLUSTER_NAME:?"AKS_CLUSTER_NAME is not set"}
: ${ACR_NAME:?"ACR_NAME is not set"}
: ${AZURE_CLIENT_ID:?"AZURE_CLIENT_ID is not set"}
: ${AZURE_CLIENT_SECRET:?"AZURE_CLIENT_SECRET is not set"}

# Run the main deployment process
main

# List of pending human tasks
: <<'HUMAN_TASKS'
- Review and update the deployment process to align with the latest Azure best practices and Excel project requirements
- Implement a rollback mechanism in case of deployment failure
- Set up alerts and monitoring for the deployment process
- Ensure that the script is integrated with the CI/CD pipeline and tested thoroughly
HUMAN_TASKS