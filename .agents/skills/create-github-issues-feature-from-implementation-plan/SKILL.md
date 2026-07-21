---
name: create-github-issues-feature-from-implementation-plan
description: 'Create GitHub Issues from implementation plan phases using feature_request.yml or chore_request.yml templates.'
---

# Create GitHub Issue from Implementation Plan

Create GitHub Issues for the implementation plan at `${file}`.

## Process

1. Analyze plan file to identify phases
2. Check existing issues using `search_issues`
3. Create new issue per phase using `create_issue` or update existing.
