# Agent Operating Model

## Purpose

This document explains how different AI coding tools can collaborate using the same repository instructions. The model is provider-neutral; `.github/agents/` is a repository convention, not a guarantee that every AI product auto-loads those files.

## Portable contract

`AGENTS.md` is the primary repository-level contract. A compatible agent should read it before changing the repository. `.github/agents/*.md` contains role-specific contracts.

If a tool does not automatically discover `.github/agents/`, provide the relevant role file to the agent or configure the tool to load it. The repository remains the source of truth regardless of provider.

## Roles

`/TL` or `/lider-Tecnico` → Technical Lead orchestration.

The TL may delegate to Developer, QA/Test Automation, Architect, Security, Package Release or Documentation roles.

## Handoff contract

Every handoff contains:

- task ID;
- acceptance criterion(s);
- current evidence;
- assigned owner;
- expected result;
- validation required before return.

## Acceptance contract

The TL cannot accept a task merely because an agent reports success. The repository must provide evidence for the applicable gates:

1. requirements;
2. build — zero errors and zero warnings;
3. static quality;
4. tests;
5. security;
6. documentation;
7. final evidence.

## Failure routing

- Product defect → Developer.
- Test defect/false positive/flaky behavior → QA/Test Automation.
- Architecture conflict → Architect + TL.
- Security finding → Security + implementation owner.
- Package/release problem → Package Release Specialist.
- Documentation inconsistency → Documentation Guardian.
- Infrastructure/tooling problem → Infrastructure/Developer.

## Cross-provider usage

Claude, Gemini, ChatGPT/Codex, Copilot, Cursor, Windsurf and other agents can follow this model when their repository context includes `AGENTS.md` and the relevant specialist instructions. Automatic discovery is tool-specific; the contracts themselves are plain Markdown and intentionally portable.
