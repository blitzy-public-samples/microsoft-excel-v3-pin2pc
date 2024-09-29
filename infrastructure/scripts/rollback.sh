#!/bin/bash

# Microsoft Excel Rollback Script
# This script performs a rollback of the deployment for Microsoft Excel components
# in case of issues during deployment or after detecting problems in production.

set -e

# Function to check deployment status
check_deployment_status() {
    echo "Checking deployment status..."
    # Query the status of deployed components using Azure CLI or kubectl
    az webapp show --name myexcelapp --resource-group myResourceGroup --query state -o tsv
    kubectl get pods -l app=excel-app -o jsonpath='{.items[*].status.phase}'
    
    # Return status code based on deployment health
    if [ $? -eq 0 ]; then
        return 0
    else
        return 1
    fi
}

# Function to rollback Azure resources
rollback_azure_resources() {
    echo "Rolling back Azure resources..."
    # Use Azure CLI to revert App Service, Azure SQL, Cosmos DB, and Blob Storage
    az webapp deployment slot swap --name myexcelapp --resource-group myResourceGroup --slot production --target-slot previous
    az sql db restore --resource-group myResourceGroup --server myexcelserver --name myexceldb --time "2023-05-01T00:00:00Z"
    az cosmosdb restore --resource-group myResourceGroup --name myexcelcosmosdb --restore-timestamp "2023-05-01T00:00:00Z"
    az storage blob restore --account-name myexcelstorageaccount --container-name mycontainer --time-to-restore "2023-05-01T00:00:00Z"
    
    if [ $? -eq 0 ]; then
        echo "Azure resources rolled back successfully."
        return 0
    else
        echo "Error rolling back Azure resources."
        return 1
    fi
}

# Function to rollback Kubernetes deployments
rollback_kubernetes_deployments() {
    echo "Rolling back Kubernetes deployments..."
    # Use kubectl to rollback deployments for API, frontend, and database components
    kubectl rollout undo deployment/excel-api
    kubectl rollout undo deployment/excel-frontend
    kubectl rollout undo statefulset/excel-database
    
    # Verify the status of rolled-back pods
    kubectl get pods -l app=excel-app
    
    if [ $? -eq 0 ]; then
        echo "Kubernetes deployments rolled back successfully."
        return 0
    else
        echo "Error rolling back Kubernetes deployments."
        return 1
    fi
}

# Function to restore database
restore_database() {
    echo "Restoring database to last known good state..."
    # Identify the last known good database backup
    LAST_GOOD_BACKUP=$(az sql db list-deleted --resource-group myResourceGroup --server myexcelserver --query '[0].name' -o tsv)
    
    # Restore the database
    az sql db restore --resource-group myResourceGroup --server myexcelserver --name myexceldb --deleted-time $LAST_GOOD_BACKUP
    
    # Verify the integrity of the restored database
    az sql db show --resource-group myResourceGroup --server myexcelserver --name myexceldb --query 'status' -o tsv
    
    if [ $? -eq 0 ]; then
        echo "Database restored successfully."
        return 0
    else
        echo "Error restoring database."
        return 1
    fi
}

# Function to notify team
notify_team() {
    echo "Sending notifications to the development and operations teams..."
    # Compose a message with rollback details and current system status
    MESSAGE="Rollback performed on $(date). Current system status: $(check_deployment_status)"
    
    # Send notifications through predefined channels (e.g., email, Slack)
    # Replace with actual notification mechanism
    echo $MESSAGE | mail -s "Excel Rollback Notification" team@example.com
    curl -X POST -H 'Content-type: application/json' --data '{"text":"'"$MESSAGE"'"}' https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
    
    if [ $? -eq 0 ]; then
        echo "Notifications sent successfully."
        return 0
    else
        echo "Error sending notifications."
        return 1
    fi
}

# Main process
main() {
    echo "Starting Excel rollback process..."
    
    # Parse command-line arguments for rollback options
    while getopts ":a:k:d:n:" opt; do
        case $opt in
            a) ROLLBACK_AZURE=$OPTARG ;;
            k) ROLLBACK_K8S=$OPTARG ;;
            d) RESTORE_DB=$OPTARG ;;
            n) NOTIFY=$OPTARG ;;
            \?) echo "Invalid option -$OPTARG" >&2; exit 1 ;;
        esac
    done
    
    # Check deployment status
    if ! check_deployment_status; then
        echo "Current deployment is in an unhealthy state. Proceeding with rollback..."
        
        # Rollback Azure resources if specified
        if [ "$ROLLBACK_AZURE" = "true" ]; then
            rollback_azure_resources || echo "Azure rollback failed, continuing with other steps..."
        fi
        
        # Rollback Kubernetes deployments if specified
        if [ "$ROLLBACK_K8S" = "true" ]; then
            rollback_kubernetes_deployments || echo "Kubernetes rollback failed, continuing with other steps..."
        fi
        
        # Restore database if specified
        if [ "$RESTORE_DB" = "true" ]; then
            restore_database || echo "Database restoration failed, continuing with other steps..."
        fi
        
        # Notify team if specified
        if [ "$NOTIFY" = "true" ]; then
            notify_team || echo "Team notification failed."
        fi
        
        echo "Rollback process completed. Please verify the system status."
    else
        echo "Current deployment is healthy. No rollback necessary."
    fi
}

# Run the main process
main "$@"

# Exit with appropriate status code
exit $?