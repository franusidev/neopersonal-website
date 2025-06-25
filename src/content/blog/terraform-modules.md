---
title: "Terraform Modules: Building Reusable Infrastructure"
date: 2025-01-10
readTime: "7 min read"
tags: ["Terraform", "Infrastructure as Code", "Modules", "AWS"]
category: "Automation"
excerpt: "Learn how to create reusable Terraform modules for scalable infrastructure management."
---

# Terraform Modules: Building Reusable Infrastructure

Creating **reusable Terraform modules** is essential for maintaining consistent infrastructure across multiple environments and projects.

## What Are Terraform Modules?

Terraform modules are containers for multiple resources that are used together. They allow you to:

- **Organize** configuration
- **Encapsulate** groups of resources
- **Provide** consistency
- **Share** and **re-use** configurations

## Basic Module Structure

```
modules/
├── vpc/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── README.md
└── ec2/
    ├── main.tf
    ├── variables.tf
    └── outputs.tf
```

## Example: VPC Module

### variables.tf
```hcl
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "environment" {
  description = "Environment name"
  type        = string
}
```

### main.tf
```hcl
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.environment}-igw"
  }
}

# Create public subnets
resource "aws_subnet" "public" {
  count = length(var.public_subnet_cidrs)
  
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.environment}-public-subnet-${count.index + 1}"
    Type = "Public"
  }
}
```

### outputs.tf
```hcl
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}
```

## Using the Module

```hcl
module "vpc" {
  source = "./modules/vpc"
  
  vpc_cidr    = "10.0.0.0/16"
  environment = "production"
}

output "vpc_id" {
  value = module.vpc.vpc_id
}
```

## Best Practices

### 1. Version Your Modules
```hcl
module "vpc" {
  source  = "git::https://github.com/company/terraform-modules.git//vpc?ref=v1.0.0"
  # ...
}
```

### 2. Use Semantic Versioning
- `v1.0.0` - Major release
- `v1.1.0` - Minor release  
- `v1.1.1` - Patch release

### 3. Document Everything
> Always include comprehensive README files with examples, requirements, and usage instructions.

## Module Testing

Test your modules with:

1. **terraform plan** - Validate syntax
2. **terraform validate** - Check configuration
3. **terratest** - Automated testing framework
4. **tflint** - Linting tool

### Automated Testing Example

```typescript
// terratest example in TypeScript
import { execSync } from 'child_process';
import * as path from 'path';

interface TerraformOptions {
  terraformDir: string;
  vars?: Record<string, any>;
}

class TerraformTest {
  private options: TerraformOptions;

  constructor(options: TerraformOptions) {
    this.options = options;
  }

  async init(): Promise<void> {
    console.log('Initializing Terraform...');
    execSync('terraform init', { 
      cwd: this.options.terraformDir,
      stdio: 'inherit' 
    });
  }

  async plan(): Promise<string> {
    const command = 'terraform plan -out=tfplan';
    return execSync(command, { 
      cwd: this.options.terraformDir,
      encoding: 'utf8' 
    });
  }

  async apply(): Promise<void> {
    execSync('terraform apply -auto-approve tfplan', {
      cwd: this.options.terraformDir,
      stdio: 'inherit'
    });
  }

  async destroy(): Promise<void> {
    execSync('terraform destroy -auto-approve', {
      cwd: this.options.terraformDir,
      stdio: 'inherit'
    });
  }
}

// Usage
const test = new TerraformTest({
  terraformDir: './modules/vpc',
  vars: { environment: 'test' }
});

await test.init();
await test.plan();
await test.apply();
```

## Key Benefits

- **Consistency** across environments
- **Reduced** code duplication
- **Easier** maintenance
- **Faster** deployment

---

**Pro Tip**: Start with simple modules and gradually add complexity as your team becomes more comfortable with the pattern!
