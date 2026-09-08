# Task Workflow, Ownership and Quality Gates

**Status:** Accepted operational standard  
**Last updated:** 2026-09-07

## 1. Purpose

This document defines how a FaruTech task moves from definition to implementation, testing, security validation, documentation and final acceptance. It is complementary to individual `TASK-XXX` files and does not replace ADRs.

## 2. Roles

### Technical Lead (`/lider-Tecnico`, `/TL`)

Owns orchestration and final technical acceptance. The TL decides who should perform each activity, coordinates handoffs, resolves technical conflicts and refuses completion when acceptance criteria are not proven.

### Developer

Implements or corrects production code, configuration and infrastructure assigned by the TL. The developer owns product defects.

### QA / Test Automation Specialist

Designs, executes and maintains automated tests. Owns test defects, including false positives and incorrect test expectations, after proving the product behavior independently.

### Repository Architect

Owns architecture analysis and durable design decisions. Helps the TL reconcile implementation with accepted ADRs and proposes new ADRs when required.

### Security Reviewer

Assesses vulnerabilities and security controls. The implementation owner performs remediation; the reviewer validates the result.

### Package Release Specialist

Owns package metadata, versioning, packing, publishing and package-consumption validation for reusable packages.

### Documentation Guardian

Maintains consistency across index, tasks, ADR references, implementation docs and changelog while preserving historical evidence.

## 3. Delegation rule

The TL does not have to perform every activity. The TL must assign the work to the role with the appropriate ownership.

Example:

```text
TASK-XXX
  |
  +--> TL analyzes requirements and dependencies
  |
  +--> Developer implements feature
  |
  +--> QA creates/runs tests
  |       |
  |       +--> failure is product defect -> Developer
  |       +--> false-positive test -> QA
  |
  +--> Security Reviewer validates findings
  |       |
  |       +--> remediation -> Developer
  |
  +--> Documentation Guardian reconciles docs
  |
  +--> TL performs final acceptance
```

The TL remains accountable for the complete result even when execution is delegated.

## 4. Standard lifecycle

```text
READY
  -> ANALYSIS
  -> IN PROGRESS
  -> TESTING
  -> SECURITY VALIDATION
  -> DOCUMENTATION VALIDATION
  -> VALIDATION
  -> DONE
```

A task may instead become `BLOCKED` when a required dependency or environment is unavailable. It may become `SUPERSEDED` when a newer accepted decision replaces it. Historical work may be `ARCHIVED`.

## 5. Acceptance gates

A task cannot be `DONE` until every applicable gate passes.

### Gate A — Requirements

- All acceptance criteria implemented.
- Scope and dependencies satisfied.
- No conflict with accepted ADRs.

### Gate B — Build

- Affected projects compile/build successfully.
- Required solution/workspace build succeeds.
- **0 errors.**
- **0 warnings.**
- No unexplained compiler, analyzer or build diagnostics.
- No warning suppression used as a shortcut.

### Gate C — Tests

- Unit tests pass.
- Integration tests pass where applicable.
- API tests pass where applicable.
- E2E tests pass where applicable.
- No unexplained failure, disabled test or hidden regression.
- Test failures are classified before remediation.

### Gate D — Security

- No known Critical/High vulnerability introduced or left unresolved in the task scope.
- Dependency/security scans applicable to the stack pass.
- No secrets committed.
- Authentication, authorization and input-validation controls are verified where applicable.

Medium/Low findings require an explicit disposition according to project policy; they cannot silently disappear.

### Gate E — Quality

- Architecture and boundaries are coherent.
- SOLID and repository conventions are respected.
- No unnecessary duplication.
- No dead/debug code.
- Errors and logs are handled appropriately.
- Public contracts are stable or intentionally versioned.

### Gate F — Documentation

- Task status/evidence updated.
- Relevant implementation documentation updated.
- ADR updated/created when architecture changed.
- Changelog updated when required.
- Cross-references remain valid.
- Historical documents remain intact and clearly marked when superseded.

## 6. Failure triage

A failing validation is not automatically a developer defect.

| Finding | Owner | Required action |
|---|---|---|
| Production code is incorrect | Developer | Fix production implementation |
| Test expectation is incorrect | QA/Test Automation | Correct test with evidence |
| Test is flaky | QA/Test Automation | Stabilize/rework test and identify root cause |
| Environment/tooling failure | Developer/Infrastructure owner | Correct environment/tooling |
| Vulnerability in implementation | Developer | Remediate |
| Security classification disputed | Security Reviewer | Reassess evidence/severity |
| Architecture conflict | TL + Architect | Reconcile against ADR |
| Documentation inconsistency | Documentation Guardian | Reconcile documentation |
| Package metadata/release failure | Package Release Specialist | Correct packaging/release |

## 7. False-positive test protocol

When a test fails:

1. Reproduce the failure.
2. Determine whether the observed product behavior violates the requirement.
3. If yes, send to Developer.
4. If no, prove why the test expectation is wrong and send to QA/Test Automation.
5. Re-run the relevant test suite.
6. Run the full required validation before completion.

Never change a test solely because it fails.

## 8. Evidence standard

Every completed task should record, where applicable:

- exact build command(s);
- exact test command(s);
- exact security/static-analysis command(s);
- clean result;
- affected files/modules;
- specialist handoffs;
- important decisions;
- known residual risks.

If required validation cannot be run, the task is not `DONE`.

## 9. Continuation command

When the user says **"continúa con la siguiente tarea"**, the TL workflow is:

1. Read `docs/00_INDEX.md`.
2. Read the master plan and active tracking.
3. Find actionable tasks based on status and dependencies.
4. Ignore superseded/archived/duplicate tasks.
5. Select the highest-priority actionable task.
6. Read its complete acceptance criteria.
7. Inspect actual implementation state.
8. Delegate to the required specialist(s).
9. Execute and validate.
10. Update task evidence/status and documentation.
11. Only after reaching `DONE`, identify the next actionable task.

## 10. Non-negotiable rule

**Green code is not enough.** A task is complete only when requirements, build, tests, security, quality and documentation gates are all satisfied with evidence.
