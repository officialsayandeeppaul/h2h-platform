# Contributing to H2H Platform

## Branch Strategy (Git Flow)

We follow an industry-standard Git branching model to ensure clean collaboration.

### Branch Structure

```
main (stable, production-ready)
  │
  └── develop (integration branch)
        │
        ├── dev/backend (backend team development)
        │
        └── dev/frontend (frontend team development)
```

### Branch Descriptions

| Branch | Purpose | Who Works Here |
|--------|---------|----------------|
| `main` | **STABLE** - Production-ready code only. Never commit directly. | Release Manager |
| `develop` | Integration branch. Merges from feature branches go here. | Team Leads |
| `dev/backend` | Backend development work | Backend Developers |
| `dev/frontend` | Frontend development work | Frontend Developers |

---

## Workflow for Developers

### 1. Starting Work (Backend Developer)

```bash
git checkout dev/backend
git pull origin dev/backend
# Create your feature branch
git checkout -b feature/backend/your-feature-name
```

### 2. Starting Work (Frontend Developer)

```bash
git checkout dev/frontend
git pull origin dev/frontend
# Create your feature branch
git checkout -b feature/frontend/your-feature-name
```

### 3. Making Commits

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat(backend): add user authentication endpoint"
git commit -m "fix(frontend): resolve login form validation"
git commit -m "docs: update API documentation"
```

**Commit Message Format:**
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Scope: backend, frontend, api, ui, auth, etc.
```

### 4. Pushing Your Work

```bash
git push origin feature/backend/your-feature-name
# OR
git push origin feature/frontend/your-feature-name
```

### 5. Creating Pull Requests

1. **Feature → dev/backend** or **Feature → dev/frontend** (for code review)
2. **dev/backend → develop** or **dev/frontend → develop** (after approval)
3. **develop → main** (for releases only)

---

## Rules

### ❌ NEVER DO

- Never push directly to `main`
- Never push directly to `develop` without PR approval
- Never force push to shared branches
- Never commit sensitive data (API keys, passwords)

### ✅ ALWAYS DO

- Pull latest changes before starting work
- Create feature branches for new work
- Write meaningful commit messages
- Request code review via Pull Request
- Test your code before pushing

---

## Quick Reference

```bash
# Backend developers start here
git checkout dev/backend
git pull origin dev/backend

# Frontend developers start here
git checkout dev/frontend
git pull origin dev/frontend

# Create feature branch
git checkout -b feature/<team>/<feature-name>

# Commit changes
git add .
git commit -m "type(scope): description"

# Push feature branch
git push origin feature/<team>/<feature-name>
```

---

## Vercel Deployments

Each branch automatically deploys to Vercel with preview URLs:

| Branch | Environment | URL Pattern |
|--------|-------------|-------------|
| `main` | **Production** | `https://h2h-platform.vercel.app` |
| `develop` | Staging | `https://h2h-platform-git-develop-*.vercel.app` |
| `dev/backend` | Backend Preview | `https://h2h-platform-git-dev-backend-*.vercel.app` |
| `dev/frontend` | Frontend Preview | `https://h2h-platform-git-dev-frontend-*.vercel.app` |

**Every push triggers automatic deployment** - check the Vercel dashboard or GitHub PR for preview links.

---

## Questions?

Contact the team lead before making any changes to `main` or `develop` branches.
