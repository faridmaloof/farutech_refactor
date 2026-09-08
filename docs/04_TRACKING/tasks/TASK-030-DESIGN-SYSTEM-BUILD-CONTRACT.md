# TASK-030 — Design System build contract and package isolation

**Status:** BLOCKED_FOR_LOCAL_VALIDATION  
**Priority:** CRITICAL  
**Depends on:** TASK-026  
**Related PR:** fix/design-system-build-contract

## Context

The manual Design System publishing run exposed that the package was not actually build-clean. The failure was not limited to GitHub Packages authentication: TypeScript declaration generation failed across reusable components before publication.

The errors revealed three classes of problems:

1. application-specific code was imported by the reusable Design System (`ServerErrorPage`);
2. public component contracts had drifted (`PushNotificationItem`, menu model, module store, locale store);
3. React type versions were inconsistent with the React 18 consumers in the monorepo, producing `ReactNode`/Headless UI incompatibilities.

## Required corrections

- Design System source must not import pages owned by an application.
- Public types must be exported from the component/store that owns the contract.
- Menu categories and menu items must use one coherent public type model.
- `ModuleSwitcher` and `moduleStore` must agree on the current module representation.
- `localeStore` must expose the API consumed by `DateControls` and `Scheduler`.
- Design System development React types must remain compatible with the supported React 18 consumer baseline.
- Package version and release tag must remain exact SemVer matches.

## Validation required before merge

From `packages/design-system/src`:

```bash
npm install --package-lock-only
npm ci
npm run build
npm run lint
npm test -- --run
npm pack --dry-run
```

The generated `package-lock.json` must be committed and must not contain an unresolved mismatch with `package.json`.

Then execute the Design System workflow manually and with the matching release tag.

## Definition of Done

- build: 0 errors, 0 warnings;
- lint/type checks: clean;
- tests: all applicable tests pass;
- package tarball contains only intended public artifacts;
- no application-specific imports remain in the package;
- package lock is synchronized;
- package scope matches the current GitHub owner;
- release tag equals package version;
- no credentials are committed;
- documentation and changelog are updated.
