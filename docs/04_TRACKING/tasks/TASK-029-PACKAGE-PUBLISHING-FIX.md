# TASK-029 — Package publishing and versioning correction

**Status:** READY_FOR_VALIDATION  
**Priority:** HIGH  
**Type:** CI/CD + Package Distribution  
**Depends on:** TASK-026  

## Context

The first manual execution of the Design System publishing workflow built and packed `@farutech/design-system@1.0.0`, but GitHub Packages rejected the publication with HTTP 403 because the npm scope did not correspond to the current GitHub repository owner.

The same execution also exposed a Vite deprecation warning caused by `__dirname` and GitHub Actions warnings caused by actions still targeting the deprecated Node 20 runtime.

## Root cause

The repository is currently owned by `faridmaloof`, while the npm package was named `@farutech/design-system`. GitHub Packages therefore attempted to publish under an npm scope that is not owned by the current publisher.

## Corrective design

- Current package identity: `@faridmaloof/design-system`.
- Future organizational identity may become `@farutech/design-system` after repository/ownership migration; that is a deliberate package-identity migration and must not be hidden as a CI workaround.
- Framework.Core keeps the independent NuGet `PackageId`: `EnterpriseAutomation.Framework`.
- Tag-based releases require exact SemVer equality between the tag and package metadata.
- Manual dispatch publishes the explicitly declared package version.
- Design System workflow validates npm scope against `github.repository_owner`.
- Design System workflow executes build, lint, tests and package validation before publication.
- Framework.Core workflow validates package version and uses current Node 24-compatible action major versions.
- Vite uses `import.meta.dirname` instead of `__dirname`.

## Versioning policy

- Design System: `package.json.version` ↔ `design-system-vX.Y.Z`.
- Framework.Core: `<Version>` ↔ `framework-core-vX.Y.Z`.
- Never overwrite a published version with different content.
- MAJOR = incompatible API/package identity changes.
- MINOR = backward-compatible functionality.
- PATCH = backward-compatible fixes.

## Future independent repositories

The package workflows are intentionally self-contained enough to move with the package into independent repositories. During migration, preserve package version history and explicitly decide whether the npm scope changes with repository ownership.

## Validation required

Before merging:

1. Run `npm install --package-lock-only` locally in the Design System package and commit the synchronized lockfile.
2. Run `npm ci`, `npm run build`, `npm run lint`, and `npm test -- --run` locally.
3. Run `dotnet restore`, `dotnet build -c Release`, and `dotnet pack -c Release` for Framework.Core.
4. Execute the Design System workflow manually and with a matching version tag.
5. Confirm the package is published to the intended GitHub Packages namespace.
6. Execute the Framework.Core workflow manually and with a matching version tag.
7. Confirm no credentials are committed.
8. Review documentation and changelog consistency before merge.

## Definition of Done

- [ ] 403 caused by the npm scope mismatch is resolved.
- [ ] Tag/package version mismatch is rejected.
- [ ] Build/lint/test/package validation passes.
- [ ] Vite `__dirname` warning is removed.
- [ ] Node 20 action-runtime warning is removed from these workflows.
- [ ] Package lockfile is synchronized after the local npm operation.
- [ ] Future repository migration is documented without coupling release versions to repository location.
- [ ] Evidence of successful publication is attached to the PR.
