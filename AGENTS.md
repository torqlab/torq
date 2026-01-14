# PACE: Personal Activity Canvas Engine (Strava Activity Image Generator)

## OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

## System Purpose

This system is an **AI-powered image generator for Strava activities** that creates personalized, artistic visualizations based on activity data. The system transforms structured Strava activity metadata into safe, deterministic, and aesthetically pleasing images that capture the essence of athletic achievements.

## Guardrails

Guardrails are explicit constraints that ensure predictable, safe, and consistent behavior of AI-driven components. Guardrails are part of the system specification. Any behavior not allowed by guardrails is considered undefined and must be prevented or safely handled by the implementation.

These guardrails apply to the whole system. Code that violates these guardrails is considered incorrect, even if it appears to work.

The complete guardrails specification is maintained in OpenSpec format:

- **[Input Guardrails](openspec/specs/guardrails-input/spec.md)**: Activity data validation, user-provided text processing, and tag handling
- **[Image Generation Prompt Guardrails](openspec/specs/guardrails-image-generation-prompt/spec.md)**: Image generation prompt content rules and size limits
- **[Image Guardrails](openspec/specs/guardrails-image/spec.md)**: Image style, output characteristics, retry/fallback strategies, failure handling, and determinism

## System Architecture

The system is designed as a modular, service-oriented architecture with clear separation of concerns and well-defined interfaces between components.

The complete system architecture specification is maintained in OpenSpec format:

- **[System Architecture](openspec/specs/system-architecture/spec.md)**: Architectural requirements, service orchestration, and data flow
- **[System Architecture Design](openspec/specs/system-architecture/design.md)**: Service definitions, interfaces, diagrams, and technical patterns

For detailed requirements, service interfaces, data flows, and architectural decisions, refer to the specifications in `openspec/specs/system-architecture/`.

## Summary

This AI image generator transforms Strava activities into artistic visualizations through a **deterministic, safe, and extensible pipeline**. By combining strict guardrails with semantic signal processing, the system creates personalized images that celebrate athletic achievements while maintaining predictable behavior and content safety.
