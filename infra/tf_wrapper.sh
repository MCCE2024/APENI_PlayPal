#!/bin/bash
# Wrapper script to map Exoscale credentials to Terraform S3 Backend and Input Variables

# Ensure Exoscale credentials are present
if [ -z "$EXOSCALE_API_KEY" ] || [ -z "$EXOSCALE_API_SECRET" ]; then
  echo "Error: EXOSCALE_API_KEY and EXOSCALE_API_SECRET environment variables must be set."
  exit 1
fi

# Export credentials for S3 Backend (Exoscale Object Storage)
export AWS_ACCESS_KEY_ID=$EXOSCALE_API_KEY
export AWS_SECRET_ACCESS_KEY=$EXOSCALE_API_SECRET

# Export credentials for Terraform Input Variables
export TF_VAR_exoscale_api_key=$EXOSCALE_API_KEY
export TF_VAR_exoscale_api_secret=$EXOSCALE_API_SECRET

# Execute Terraform with passed arguments
terraform "$@"
