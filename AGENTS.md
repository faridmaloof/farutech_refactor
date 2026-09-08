# FaruTech Repository Agent Contract

## Purpose
This file is the portable entry point for AI coding agents working in this repository. It defines the minimum operating rules. Detailed specialist instructions live under `.github/agents/`.

## Source of truth
Before changing architecture, implementation, tests, or documentation, read:

1. `docs/00_INDEX.md`
2. `docs/README.md` (when present)
3. Current ADRs under `docs/01_ARCHITECTURE/adr/`
4. Active tasks under `docs/04_TRACKING/`
5. Relevant implementation documentation under `docs/03_IMPLEMENTATION/`
6. Relevant historical material under `docs/99_ARCHIVE/` only when tracing prior decisions or migrations

Never treat archived or superseded documents as the current architecture.

## Current architectural decisions
- The Admin is served at `<domain>/admin`.
- `admin.<domain>` is not the target architecture.
- The Admin belongs to `apps/website`.
- Admin backend functionality belongs under `apps/website/src/backend`.
- Do not create, restore, or extend `apps/admin` as a target application.
- Historical references to `apps/admin` may remain in `docs/99_ARCHIVE` when they are explicitly identified as legacy/superseded evidence.
- Reusable automation belongs in `packages/framework-automation/src/Framework.Core` and should be consumed as a package when publication is the selected distribution mechanism.
- `Examples/tests/framework-automation` is a reference/example project and must not become a second automation framework.
- The Design System and Framework.Core are independently versioned/publishable packages.

## Mandatory working method
For every task:

1. Identify the authoritative task and its acceptance criteria.
2. Inspect the real repository state before assuming a feature exists.
3. Check relevant ADRs for architectural constraints.
4. Trace task -> implementation -> tests -> documentation.
5. Make the smallest coherent change that satisfies the criteria.
6. Validate builds/tests/static checks where feasible.
7. Update documentation and task status when implementation changes reality.
8. Record important architectural decisions in an ADR instead of hiding them in code comments.
9. Preserve useful historical evidence; do not rewrite history to make old decisions disappear.
10. Do not mark work `DONE` without evidence.

## Task continuation protocol
When asked to "continúa con la siguiente tarea":

- Read the master index and active task tracking.
- Select the first task that is actionable according to documented dependencies and priority.
- Do not blindly follow numeric order if dependencies or an ADR make another task the correct next task.
- Verify the task is not obsolete, duplicated, superseded, or already implemented.
- Execute only the defined scope plus necessary corrective work.
- Validate it, update its evidence/status, and then identify the next actionable task.

## Documentation rules
- Use the existing documentation taxonomy; do not create a parallel documentation system.
- Use explicit statuses: `TODO`, `READY`, `IN PROGRESS`, `BLOCKED`, `VALIDATION`, `DONE`, `SUPERSEDED`, `ARCHIVED`.
- Every task should identify scope, dependencies, acceptance criteria, evidence, validation, and follow-up work where applicable.
- If code and documentation disagree, investigate first; then update the appropriate source and record the reconciliation.
- Do not delete historical ADRs or audits merely because they are obsolete.

## Quality and security
- Prefer SOLID, cohesive boundaries, explicit contracts, least privilege, secure defaults, dependency hygiene, deterministic builds, and automated validation.
- Never commit credentials, tokens, private keys, or local secrets.
- Treat package publication credentials as local/CI secrets, never repository content.
- Do not introduce duplicate implementations when an existing package/framework can be reused.

## Specialist agents
See `.github/agents/README.md` and the specialist files in `.github/agents/` for focused roles such as architecture, automation, package release, documentation, and security review.
