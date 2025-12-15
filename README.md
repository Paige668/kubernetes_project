# Feedback Collector on Kubernetes

## 1. What it is
A lightweight feedback collection tool for early-stage user testing.
- **Tech**: Next.js (TypeScript), Docker, Kubernetes (Kind), Ingress NGINX
- **Purpose**: Demonstrate end-to-end containerized web app deployment & exposure via Ingress.

## 2. Architecture
User Request Flow:
```text
Browser (http://localhost)
   │
   ▼
[ Ingress Controller (Host Port 80) ]
   │
   │ (Routing: / -> feedback-web:80)
   ▼
[ Service: feedback-web (ClusterIP) ]
   │
   ▼
[ Deployment: feedback-web (2 Replicas) ]
   │
   ├─ [ Pod 1: Next.js App ]
   └─ [ Pod 2: Next.js App ]
```

## 3. Prerequisites
- **Docker Desktop** (Engine running)
- **kubectl**
- **kind** (Kubernetes IN Docker)
- *(Optional)* helm

## 4. Quick Start
From the project root (`kubernetes_project/`), navigate to the app directory first:

```bash
cd feedback-k8s
```

Then run the following commands to go from zero to accessed:

```bash
# 1. Create Kind cluster (config maps localhost:80 to cluster)
kind create cluster --name feedback --config k8s/kind-config.yaml

# 2. Install Ingress NGINX (wait for it to be ready)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl -n ingress-nginx rollout status deployment/ingress-nginx-controller

# 3. Build & Load Image (Kind needs image loaded manually)
docker build -t feedback-k8s:1.0 .
kind load docker-image feedback-k8s:1.0 --name feedback

# 4. Deploy Manifests (Deployment, Service, Ingress)
kubectl apply -f k8s/app.yaml
kubectl -n feedback rollout status deployment/feedback-web

# 5. Access
# Open http://localhost/ in your browser
```

## 5. Verification
Verify the deployment status with these commands:

```bash
# Check App Resources (Pods should be Running)
kubectl -n feedback get pods,svc,ingress

# Check Ingress Controller
kubectl -n ingress-nginx get pods
```

## 6. Limitations / Next Steps
- **Current**: Application uses in-memory storage (data is lost on restart).
- **Next Steps**: Integrate **PostgreSQL** with **Secret/ConfigMap** management and schema migrations to enable persistent data storage (Production-grade Setup).