# 🚀 GitHub Actions CI/CD Guide

## 📋 **Overview**

This guide explains the GitHub Actions workflows we've set up for learning modern CI/CD practices with Docker and Kubernetes.

## 🏗️ **Workflow Architecture**

We have **2 main workflows** that work together:

### 1. **CI Pipeline** (`ci.yml`) - Quality & Testing
### 2. **Docker Publish** (`docker-publish.yml`) - Build & Deploy

---

## 🧪 **CI Pipeline Workflow** (`ci.yml`)

**Trigger:** Every push and pull request to `main`/`develop`

### **Jobs Breakdown:**

#### **Job 1: 🧪 Test & Lint**
```yaml
# What it does:
- Checkout code
- Setup Node.js with caching
- Install dependencies (npm ci)
- Run ESLint (code style)
- TypeScript compilation check
- Run tests with coverage
- Upload coverage reports
```

**Learning Point:** This ensures code quality before any deployment.

#### **Job 2: 🔒 Security Scan**
```yaml
# What it does:
- npm audit (check for vulnerable packages)
- CodeQL analysis (GitHub's semantic code scanner)
- Detect security vulnerabilities in code
```

**Learning Point:** Security scanning catches issues early in development.

#### **Job 3: 🐳 Docker Build Test**
```yaml
# What it does:
- Build Docker image (without pushing)
- Test that the image starts correctly
- Verify health endpoint responds
- Use Docker Buildx with caching
```

**Learning Point:** Validates Docker setup before actual deployment.

#### **Job 4: 📦 Dependency Analysis**
```yaml
# What it does:
- Check for outdated packages
- Generate dependency tree
- Upload analysis reports
```

**Learning Point:** Helps maintain up-to-date and secure dependencies.

#### **Job 5: 📊 Build Analysis**
```yaml
# What it does:
- Analyze build size
- Find largest files
- Generate build reports
```

**Learning Point:** Monitors application bundle size and performance.

#### **Job 6: ✅ CI Complete**
```yaml
# What it does:
- Check all job results
- Fail if critical jobs failed
- Provide overall CI status
```

**Learning Point:** Centralized status checking and fail-fast approach.

---

## 🐳 **Docker Publish Workflow** (`docker-publish.yml`)

**Trigger:** Push to `main`/`develop` or manual dispatch

### **Jobs Breakdown:**

#### **Job 1: 🐳 Build & Push Docker Images**
```yaml
# What it does:
- Multi-platform builds (amd64, arm64)
- Push to GitHub Container Registry (ghcr.io)
- Smart tagging strategy
- Advanced layer caching
- Generate SBOM (Software Bill of Materials)

# Tagging Strategy:
main branch    → latest, production, main-sha123
develop branch → staging, develop, develop-sha123
manual         → custom tag + environment
```

**Learning Points:**
- **Multi-platform builds** for different architectures
- **GitHub Packages** as container registry
- **Semantic tagging** for different environments
- **SBOM generation** for security compliance

#### **Job 2: 🔒 Security Scan Image**
```yaml
# What it does:
- Scan Docker image with Trivy
- Check for vulnerabilities in OS packages
- Upload results to GitHub Security tab
- Generate human-readable reports

# Checks for:
- CVE vulnerabilities
- Outdated OS packages  
- Misconfigurations
- Secrets in images
```

**Learning Point:** Container security is critical for production deployments.

#### **Job 3: 🧪 Test Deployed Image**
```yaml
# What it does:
- Run full integration test
- Start PostgreSQL and Redis services
- Test actual image in realistic environment
- Verify API endpoints work
- Test health checks

# Services tested:
- Database connectivity
- Redis connectivity  
- API functionality
- Health endpoints
```

**Learning Point:** End-to-end testing ensures the complete stack works.

#### **Job 4: 📢 Deployment Status**
```yaml
# What it does:
- Determine target environment
- Create deployment summary
- Provide clear success/failure status
- Generate GitHub summary page
```

**Learning Point:** Clear communication about deployment status.

---

## 🎯 **Key Learning Concepts**

### **1. Workflow Triggers**
```yaml
# Different trigger types:
on:
  push:                    # Automatic on code changes
  pull_request:           # On PR creation/updates  
  workflow_dispatch:      # Manual trigger
  schedule:              # Cron-based triggers
```

### **2. Job Dependencies**
```yaml
# Jobs can depend on others:
needs: [test, security]  # Wait for these jobs first
if: always()            # Run even if dependencies fail
```

### **3. Environment Variables**
```yaml
# Global variables:
env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io

# Job-specific variables:
jobs:
  test:
    env:
      CI: true
```

### **4. Caching Strategy**
```yaml
# NPM dependency caching:
cache: 'npm'
cache-dependency-path: '**/package-lock.json'

# Docker layer caching:
cache-from: type=gha
cache-to: type=gha,mode=max
```

### **5. Artifact Management**
```yaml
# Upload build artifacts:
uses: actions/upload-artifact@v4
with:
  name: coverage-report
  path: coverage/
  retention-days: 30
```

### **6. Security Permissions**
```yaml
# Fine-grained permissions:
permissions:
  contents: read          # Read repository
  packages: write        # Push to GitHub Packages
  security-events: write # Upload security results
```

---

## 🔄 **Workflow Flow**

### **Development Flow:**
```
1. Developer pushes code to develop
2. CI Pipeline runs (test, lint, security)
3. If CI passes → Docker Publish runs
4. Image tagged as 'staging'
5. Image tested in isolated environment
6. Deployment summary generated
```

### **Production Flow:**
```
1. Code merged to main branch
2. CI Pipeline runs (same checks)
3. If CI passes → Docker Publish runs  
4. Image tagged as 'latest' and 'production'
5. Full security scan
6. Integration tests
7. Ready for Kubernetes deployment
```

### **Manual Flow:**
```
1. Developer triggers workflow manually
2. Selects environment (dev/staging/prod)
3. Optionally provides custom tag
4. Workflow runs with selected parameters
```

---

## 📊 **Monitoring & Observability**

### **What Gets Tracked:**
- ✅ Test results and coverage
- 🔒 Security vulnerabilities  
- 🐳 Image sizes and layers
- 📦 Dependency status
- 🏗️ Build performance
- 🚀 Deployment success rate

### **Where to Find Results:**
- **Actions tab** → Workflow runs
- **Security tab** → Vulnerability alerts
- **Packages tab** → Published images
- **Artifacts** → Reports and logs

---

## 🎓 **Learning Exercises**

### **Exercise 1: Trigger Workflows**
1. Make a code change and push to `develop`
2. Watch the CI pipeline run
3. Observe the Docker build and push
4. Check the generated artifacts

### **Exercise 2: Security Analysis**
1. Add a vulnerable package to `package.json`
2. Push and see security scan results
3. Fix the vulnerability
4. Verify clean security scan

### **Exercise 3: Manual Deployment**
1. Go to Actions tab
2. Run "Docker Build & Publish" manually
3. Select different environments
4. Compare the generated tags

### **Exercise 4: Failure Handling**
1. Introduce a failing test
2. Push code and watch CI fail
3. Observe that Docker workflow doesn't run
4. Fix test and verify full flow

---

## 🔧 **Configuration Files**

### **Workflow Files:**
```
.github/
└── workflows/
    ├── ci.yml              # Quality & testing pipeline
    └── docker-publish.yml  # Docker build & publish
```

### **Key Features:**
- ✅ **Parallel execution** for faster builds
- 🔄 **Smart caching** to reduce build times  
- 🏷️ **Semantic tagging** for environment management
- 🔒 **Security scanning** built-in
- 📊 **Comprehensive reporting**
- 🚫 **Fail-fast** approach
- 🔀 **Multi-platform** support

---

## 🚀 **Next Steps**

With GitHub Actions set up, you're ready for:

1. **Kubernetes Integration** - Deploy images to K8s
2. **GitOps** - Automated deployments
3. **Advanced Monitoring** - Prometheus/Grafana integration
4. **Blue-Green Deployments** - Zero-downtime releases

---

**🎯 This CI/CD setup follows industry best practices and provides a solid foundation for learning modern DevOps workflows!**
