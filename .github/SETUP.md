# 

*This setup ensures your repository has professional-grade automation and protection configured.*

---

- [ ] PR template appears automatically
- [ ] Issue templates are available
- [ ] AI analysis works (if configured)
- [ ] CTRF reports are generated
- [ ] Artifacts are uploaded correctly
- [ ] Required status checks appear
- [ ] Workflows run successfully on push/PR
- [ ] Branch protection rules are active

After setup, verify everything works:

## ✅ Verification Checklist

```md
npm install -g @github/super-linter
# Check workflow syntax (optional)

npm test
# Run initial test to verify setup

npx playwright install
# Install Playwright browsers

npm install
# Install dependencies

cd playwright-advanced-testing
git clone https://github.com/jfisher94002/playwright-advanced-testing.git
# Clone the repository
```bash

Run these commands to set up your local environment:

## 🚀 Quick Setup Commands

- `ready-to-merge` (green) - Ready for merging
- `needs-review` (orange) - Needs code review
- `in-progress` (blue) - Currently being worked on

- `priority-low` (yellow) - Low priority
- `priority-medium` (orange) - Medium priority
- `priority-high` (red) - High priority

- `automation` (green) - CI/CD and workflow related
- `dependencies` (purple) - Dependency updates
- `documentation` (yellow) - Improvements or additions to documentation
- `enhancement` (blue) - New feature or request
- `bug` (red) - Something isn't working

Create these labels for better organization:

## 🏷️ Labels Setup

- ✅ Secret scanning alerts
- ✅ Dependabot security updates
- ✅ Dependabot alerts
- ✅ Dependency graph
**Settings > Security & analysis**:

- ✅ Enable Discussions for community Q&A
**Settings > Features**:

## 📊 Repository Insights

```

Closes #[issue_number]

## 🔗 Related Issues

- [ ] No breaking changes (or documented)
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Self-review completed
- [ ] Code follows project style guidelines

## ✅ Checklist

Add screenshots here.

## 📸 Screenshots (if applicable)

- [ ] Manual testing completed
- [ ] New tests added for new functionality
- [ ] All tests pass locally

## 🧪 Testing

Brief description of changes made.

## 📋 Description

```markdown

Create `.github/pull_request_template.md`:

## 🔄 Pull Request Template

```

Add any other context or screenshots about the feature request here.

## 📋 Additional Context

Why is this feature needed? What problem does it solve?

## 💡 Motivation

A clear and concise description of what you want to happen.

## 🚀 Feature Description

---

## assignees: ''
labels: enhancement
title: '[FEATURE] '
about: Suggest an idea for this project
name: 🚀 Feature Request

```markdown

Create `.github/ISSUE_TEMPLATE/feature_request.md`:

```

Add any other context about the problem here.

## 📋 Additional Context

- OS: [e.g. iOS]
- Version: [e.g. 22]
- Browser: [e.g. Chrome, Firefox]

## 🌍 Environment

If applicable, add screenshots to help explain your problem.

## 📸 Screenshots

A clear description of what you expected to happen.

## ✅ Expected Behavior

4. See error
5. Scroll down to '....'
6. Click on '....'
7. Go to '...'

## 🔄 Steps to Reproduce

A clear and concise description of what the bug is.

## 🐛 Bug Description

---

## assignees: ''
labels: bug
title: '[BUG] '
about: Create a report to help us improve
name: 🐛 Bug Report

```markdown

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

## 📋 Issue Templates

- ✅ Allow GitHub Actions to create and approve pull requests
- ✅ Read and write permissions
**Settings > Actions > General > Workflow permissions**:

- ✅ Allow actions by Marketplace verified creators
- ✅ Allow actions created by GitHub
- ✅ Allow all actions and reusable workflows
**Settings > Actions > General**:

- ✅ Automatically delete head branches
- ✅ Allow rebase merging
- ✅ Allow squash merging
- ✅ Allow merge commits

## ⚙️ Repository Settings

```

PROD_API_URL=https://api.example.com
STAGING_API_URL=https://api-staging.example.com
DEV_API_URL=https://api-dev.example.com

# API endpoints

PROD_BASE_URL=https://example.com
STAGING_BASE_URL=https://staging.example.com
DEV_BASE_URL=https://dev.example.com

# Base URLs for different environments

```bash

Add environment variables in **Settings > Secrets and variables > Actions > Variables**:

```

CTRF_API_KEY=your_ctrf_api_key_here

# For external reporting (optional)

DISCORD_WEBHOOK_URL=your_discord_webhook_here
SLACK_WEBHOOK_URL=your_slack_webhook_here

# For notifications (optional)

ANTHROPIC_API_KEY=your_claude_key_here
OPENAI_API_KEY=your_openai_key_here

# If using external AI services (optional)

```bash

Add these secrets in **Settings > Secrets and variables > Actions**:

## 🔐 Repository Secrets

- ✅ Restrict pushes that create files larger than 100MB
- ✅ Require review from code owners
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require pull request reviews before merging

     - `build`
     - `test (webkit)`
     - `test (firefox)` 
     - `test (chromium)`
   - ✅ Required status checks:
   - ✅ Require branches to be up to date before merging
   - ✅ Require status checks to pass before merging
3. Enable:
2. Add rule for `main` branch
1. Go to **Settings > Branches**

Set up branch protection for `main` branch:

## 🛡️ Branch Protection Rules

This guide helps you configure your GitHub repository to work optimally with the included workflows.
 🔧 GitHub Repository Setup Guide
```