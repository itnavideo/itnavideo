---
name: git-push-policy
description: Strict Git Push Policy - NEVER run git push origin main automatically. Only push when explicitly commanded by the founder.
always_on: true
---

# Strict Git Push Policy (Founder Directive)

> [!CAUTION]
> **ABSOLUTE RULE**: Do NOT run `git push` or `git push origin main` automatically after tasks, code edits, or daily work.
> Pushing to GitHub multiple times a day wastes network bandwidth/time, causes hanging background processes on slow connections, and disrupts rapid iteration.

## 1. Zero Automatic Git Push
- ❌ **NEVER automatically run `git push` or `git push origin main`** after completing a feature, bugfix, or prompt.
- ❌ **NEVER start background tasks running `git push`**.
- Frequent daily git pushes are strictly forbidden. Updating GitHub once a week (or at major milestones) is completely sufficient.

## 2. Strict Exception: Founder Explicit Order Only
- A git push is permitted **ONLY and EXCLUSIVELY** when the founder explicitly commands it in their prompt, such as:
  - *"git push karo"*
  - *"push to github"*
  - *"push origin main"*
- Without this explicit user prompt, the AI must keep all development, testing, and verification strictly local.
