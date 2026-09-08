# Reconciliation Matrix — Architecture, Tasks and Documentation

**Date:** 2026-09-07  
**Status:** Active control document

## Purpose

Centralize the relationships between current decisions, historical work and executable tasks so future agents do not infer architecture from obsolete material.

| Area | Current source of truth | Historical/superseded | Executable next work |
|---|---|---|---|
| Admin URL | ADR-008 | ADR-001/ADR-006 | TASK-025 |
| Admin ownership | ADR-008 | TASK-009/010/011/015 | TASK-025 |
| Website backend | ADR-005 + ADR-008 | old `apps/api` references | validation/reconciliation |
| Platform scope | ADR-007 + SPEC-003 | none | future, not current cycle |
| Package distribution | ADR-009 | previous duplicate ADR-007 package file | TASK-026 |
| Infrastructure topology | ADR-008 | TASK-017 | TASK-027 |
| Automation framework | Framework.Core + relevant docs | old duplicated test paths | TASK-012 / affected feature tasks |
| Agent orchestration | `AGENTS.md` + `.github/agents/technical-lead.md` | previous ad-hoc prompts | TL workflow |

## Mandatory interpretation rule

If a historical task or document conflicts with an accepted newer ADR, the ADR wins. The historical item must be marked `SUPERSEDED` or `ARCHIVED` rather than silently rewritten away.

## Task ownership rule

The Technical Lead owns orchestration and acceptance. Specialists own execution within their domain. A failing test must be classified before assigning remediation.

## Global Definition of Done

No task is `DONE` without evidence of applicable acceptance criteria, clean build (0 errors/0 warnings), required tests passing, security validation, documentation reconciliation and recorded commands/results.
