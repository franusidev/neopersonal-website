---
title: "DevOps Code Examples Showcase"
date: 2025-01-20
readTime: "8 min read"
tags: ["DevOps", "Code Examples", "Multi-Language", "Showcase"]
category: "Infrastructure"
excerpt: "A comprehensive showcase of different programming languages and tools used in DevOps workflows."
---

# DevOps Code Examples Showcase

This post demonstrates various **code examples** across different languages and tools commonly used in DevOps workflows.

## Terraform Configuration

Infrastructure as Code with Terraform:

```hcl
# Define provider and required version
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment   = var.environment
      Project       = var.project_name
      ManagedBy     = "Terraform"
      Owner         = var.owner
    }
  }
}

# Create VPC with dynamic configuration
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "${var.environment}-${var.project_name}-vpc"
  }
}
```

## Kubernetes Deployment

YAML configuration for Kubernetes:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: production
  labels:
    app: nginx
    version: v1.21
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
        version: v1.21
    spec:
      containers:
      - name: nginx
        image: nginx:1.21-alpine
        ports:
        - containerPort: 80
          name: http
          protocol: TCP
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: production
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
```

## Python Automation Script

DevOps automation with Python:

```python
#!/usr/bin/env python3
"""
AWS Resource Monitoring Script
Monitors EC2 instances and sends alerts when thresholds are exceeded.
"""

import boto3
import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class AWSMonitor:
    """Monitor AWS resources and send alerts."""
    
    def __init__(self, region: str = 'us-east-1'):
        """Initialize AWS clients."""
        self.region = region
        self.ec2 = boto3.client('ec2', region_name=region)
        self.cloudwatch = boto3.client('cloudwatch', region_name=region)
        self.sns = boto3.client('sns', region_name=region)
    
    def get_running_instances(self) -> List[Dict[str, Any]]:
        """Get all running EC2 instances."""
        try:
            response = self.ec2.describe_instances(
                Filters=[
                    {'Name': 'instance-state-name', 'Values': ['running']}
                ]
            )
            
            instances = []
            for reservation in response['Reservations']:
                for instance in reservation['Instances']:
                    instances.append({
                        'InstanceId': instance['InstanceId'],
                        'InstanceType': instance['InstanceType'],
                        'LaunchTime': instance['LaunchTime'],
                        'State': instance['State']['Name']
                    })
            
            logger.info(f"Found {len(instances)} running instances")
            return instances
            
        except Exception as e:
            logger.error(f"Error getting instances: {str(e)}")
            return []
    
    def get_cpu_utilization(self, instance_id: str, hours: int = 1) -> float:
        """Get average CPU utilization for an instance."""
        try:
            end_time = datetime.utcnow()
            start_time = end_time - timedelta(hours=hours)
            
            response = self.cloudwatch.get_metric_statistics(
                Namespace='AWS/EC2',
                MetricName='CPUUtilization',
                Dimensions=[
                    {'Name': 'InstanceId', 'Value': instance_id}
                ],
                StartTime=start_time,
                EndTime=end_time,
                Period=300,  # 5 minutes
                Statistics=['Average']
            )
            
            if response['Datapoints']:
                avg_cpu = sum(dp['Average'] for dp in response['Datapoints'])
                avg_cpu /= len(response['Datapoints'])
                return round(avg_cpu, 2)
            
            return 0.0
            
        except Exception as e:
            logger.error(f"Error getting CPU metrics for {instance_id}: {str(e)}")
            return 0.0
    
    def check_thresholds_and_alert(self, threshold: float = 80.0) -> None:
        """Check CPU thresholds and send alerts if exceeded."""
        instances = self.get_running_instances()
        alerts = []
        
        for instance in instances:
            instance_id = instance['InstanceId']
            cpu_usage = self.get_cpu_utilization(instance_id)
            
            if cpu_usage > threshold:
                alert = {
                    'instance_id': instance_id,
                    'cpu_usage': cpu_usage,
                    'threshold': threshold,
                    'timestamp': datetime.utcnow().isoformat()
                }
                alerts.append(alert)
                logger.warning(
                    f"ALERT: Instance {instance_id} CPU usage: {cpu_usage}% "
                    f"(threshold: {threshold}%)"
                )
        
        if alerts:
            self.send_alerts(alerts)
    
    def send_alerts(self, alerts: List[Dict[str, Any]]) -> None:
        """Send alerts via SNS."""
        message = {
            'alert_type': 'CPU_THRESHOLD_EXCEEDED',
            'total_alerts': len(alerts),
            'alerts': alerts
        }
        
        try:
            # Replace with your SNS topic ARN
            topic_arn = 'arn:aws:sns:us-east-1:123456789012:devops-alerts'
            
            self.sns.publish(
                TopicArn=topic_arn,
                Message=json.dumps(message, indent=2),
                Subject=f'AWS CPU Alert: {len(alerts)} instances exceeded threshold'
            )
            
            logger.info(f"Sent alert for {len(alerts)} instances")
            
        except Exception as e:
            logger.error(f"Error sending alerts: {str(e)}")

def main():
    """Main function to run monitoring."""
    monitor = AWSMonitor(region='us-east-1')
    monitor.check_thresholds_and_alert(threshold=75.0)

if __name__ == "__main__":
    main()
```

## Bash Deployment Script

Shell script for automated deployments:

```bash
#!/bin/bash
set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="myapp"
DOCKER_REGISTRY="my-registry.com"
NAMESPACE="production"
DEPLOYMENT_TIMEOUT=300

# Functions
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if required tools are installed
    local required_tools=("docker" "kubectl" "helm")
    
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            error "$tool is not installed or not in PATH"
            exit 1
        fi
    done
    
    # Check if we can connect to Kubernetes cluster
    if ! kubectl cluster-info &> /dev/null; then
        error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    
    success "All prerequisites met"
}

# Build and push Docker image
build_and_push() {
    local version="$1"
    local image_tag="${DOCKER_REGISTRY}/${APP_NAME}:${version}"
    
    log "Building Docker image: $image_tag"
    
    # Build the image
    docker build -t "$image_tag" .
    
    # Tag as latest
    docker tag "$image_tag" "${DOCKER_REGISTRY}/${APP_NAME}:latest"
    
    # Push to registry
    log "Pushing image to registry..."
    docker push "$image_tag"
    docker push "${DOCKER_REGISTRY}/${APP_NAME}:latest"
    
    success "Image built and pushed successfully"
}

# Deploy to Kubernetes
deploy_to_k8s() {
    local version="$1"
    local image_tag="${DOCKER_REGISTRY}/${APP_NAME}:${version}"
    
    log "Deploying to Kubernetes namespace: $NAMESPACE"
    
    # Update deployment with new image
    kubectl set image \
        "deployment/${APP_NAME}" \
        "${APP_NAME}=${image_tag}" \
        --namespace="$NAMESPACE"
    
    # Wait for rollout to complete
    log "Waiting for deployment to complete (timeout: ${DEPLOYMENT_TIMEOUT}s)..."
    
    if kubectl rollout status \
        "deployment/${APP_NAME}" \
        --namespace="$NAMESPACE" \
        --timeout="${DEPLOYMENT_TIMEOUT}s"; then
        success "Deployment completed successfully"
    else
        error "Deployment failed or timed out"
        
        # Show recent events for debugging
        warn "Recent events:"
        kubectl get events \
            --namespace="$NAMESPACE" \
            --sort-by='.lastTimestamp' \
            --limit=10
        
        exit 1
    fi
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Check if pods are running
    local ready_pods
    ready_pods=$(kubectl get pods \
        --namespace="$NAMESPACE" \
        --selector="app=${APP_NAME}" \
        --field-selector=status.phase=Running \
        --no-headers | wc -l)
    
    if [ "$ready_pods" -gt 0 ]; then
        success "Deployment verification passed: $ready_pods pod(s) running"
        
        # Show pod status
        kubectl get pods \
            --namespace="$NAMESPACE" \
            --selector="app=${APP_NAME}"
    else
        error "Deployment verification failed: No running pods found"
        exit 1
    fi
}

# Main deployment function
main() {
    local version="${1:-$(date +%Y%m%d-%H%M%S)}"
    
    log "Starting deployment of $APP_NAME version: $version"
    
    check_prerequisites
    build_and_push "$version"
    deploy_to_k8s "$version"
    verify_deployment
    
    success "Deployment completed successfully! 🚀"
}

# Run main function with all arguments
main "$@"
```

## Docker Configuration

Multi-stage Dockerfile for Node.js application:

```dockerfile
# Multi-stage build for Node.js application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Build application
RUN yarn build

# Production stage
FROM node:18-alpine AS production

# Install security updates
RUN apk update && apk upgrade

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production=true && \
    yarn cache clean

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", "dist/server.js"]
```

## JSON Configuration

Example of a complex JSON configuration:

```json
{
  "apiVersion": "v1",
  "kind": "ConfigMap",
  "metadata": {
    "name": "app-config",
    "namespace": "production",
    "labels": {
      "app": "myapp",
      "version": "v1.0.0"
    }
  },
  "data": {
    "database.json": "{\n  \"host\": \"db.example.com\",\n  \"port\": 5432,\n  \"database\": \"myapp_prod\",\n  \"ssl\": true,\n  \"pool\": {\n    \"min\": 2,\n    \"max\": 10\n  }\n}",
    "redis.json": "{\n  \"host\": \"redis.example.com\",\n  \"port\": 6379,\n  \"password\": \"${REDIS_PASSWORD}\",\n  \"db\": 0\n}",
    "logging.json": "{\n  \"level\": \"info\",\n  \"format\": \"json\",\n  \"transports\": [\n    {\n      \"type\": \"file\",\n      \"filename\": \"/var/log/app.log\",\n      \"maxsize\": \"10MB\",\n      \"maxFiles\": 5\n    },\n    {\n      \"type\": \"console\",\n      \"colorize\": true\n    }\n  ]\n}"
  }
}
```

---

These examples showcase the **bold, readable code styling** that matches our energetic design theme! 🚀
