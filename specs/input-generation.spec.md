---
id: prompt-generation
version: 0.0.2
---

# Prompt Generation Specification

## Purpose

This document defines how textual prompts for image generation
are constructed from activity data.

Prompt generation is a deterministic, rule-based process that:
- Transforms structured activity input into visual descriptions
- Extracts semantic signals from user-provided text
- Enforces global guardrails
- Produces predictable and safe prompts for AI image models

This specification defines behavior, not implementation.

## Scope

This specification applies to:
- All AI-generated images based on activity data
- All supported activity types (run, ride, trail, walk, hike, yoga, etc.)
- All visual styles allowed by the system

## Dependencies

Prompt generation MUST comply with:
- `guardrails.spec.md`
- Activity input specification
- Image generation specification

## Input

### Required Fields

Prompt generation requires the following activity fields:

- `type`

If required fields are missing:
- Prompt generation MUST NOT proceed
- A fallback strategy MUST be applied upstream

### Optional Fields

The following fields MAY be used if present:

- `name`
- `description`
- `tags`
- `gear`
- `avg_hr`
- `distance`
- `pace`
- `elevation_gain`
- `time_of_day`
- `weather`
- `duration`

Absence of optional fields MUST NOT cause failure.

## User-Provided Text Handling

### Supported Text Sources

User-provided text MAY originate from:
- `activity.name`
- `activity.description`
- `activity.tags`
- `activity.gear`

These fields MUST be treated as untrusted input.

### Text Processing Rules

User-provided text:
- MUST NOT be copied verbatim into prompts
- MUST be processed through semantic signal extraction
- MUST comply with all guardrails

Only normalized signals MAY influence:
- mood
- intensity
- environment
- scene composition
- contextual details

## Brand Usage

Brand names MAY be used under the following rules:

- Brands MUST originate from gear, name, or description
- Brands MUST NOT be inferred or hallucinated
- Brand references MUST be contextual
- Excessive brand emphasis MUST be avoided

## Output

Prompt generation MUST return the following structure:

```yml
    prompt:
      text: string
      style: string
      mood: string
      scene: string
```

- text MUST be a single plain-text prompt
- style MUST match allowed styles
- mood and scene MUST be descriptive and generic

## Prompt Structure

Generated prompt text MUST follow this logical structure:

1. Main subject
2. Activity context
3. Environment / scene
4. Mood / emotional tone
5. Artistic style

Example (logical structure):

```text
    A trail runner during a steady outdoor run,
    forest trail environment with gentle hills,
    focused and calm mood,
    cartoon illustration style
```

## Activity Classification Rules

### By Activity Type

| Activity Type | Subject Description |
|---------------|---------------------|
| Run           | runner              |
| Ride          | cyclist             |
| Trail Run     | trail runner        |
| Walk          | walker              |
| Hike          | hiker               |
| Yoga          | person practicing yoga |

### By Intensity

Intensity SHOULD be classified as:

- Low: easy, relaxed, calm
- Medium: steady, focused
- High: intense, demanding, exhausting

Derived from:
- heart rate
- pace
- elevation gain
- duration
- semantic cues from tags or description

Default: medium

### By Elevation

- `elevation_gain > 300` → mountainous or hilly
- `elevation_gain ≤ 300` → flat or rolling
- missing → neutral outdoor

### By Time of Day

- morning → soft light
- day → neutral daylight
- evening → warm light
- night → dark, calm or dramatic

Unknown → neutral daylight

## Tag Processing

### Supported Tags

Examples:
- `long run`
- `recovery`
- `race`
- `commute`
- `with kid`
- `easy`
- `workout`

### Tag Influence Rules

Tags MAY influence:
- mood
- intensity
- atmosphere

Tags MUST NOT:
- appear as literal text
- introduce forbidden content

Examples:
- `recovery` → calm, low intensity
- `with kid` → playful atmosphere
- `long run` → endurance-oriented scene

## Style Selection

Allowed styles:
- `cartoon`
- `minimal`
- `abstract`
- `illustrated`

Rules:
- Default: `cartoon`
- High intensity → may bias illustrated
- Fallback: `minimal`

Selection MUST be deterministic.

## Mood Selection

Mood descriptors MUST be:
- abstract
- emotional
- non-narrative

Examples:
- `calm`
- `focused`
- `intense`
- `peaceful`
- `determined`

## Prompt Constraints

Generated prompts MUST:
- avoid real persons
- avoid text or typography
- avoid political, military, sexual content
- be ≤ 400 characters

## Determinism

Identical inputs MUST produce identical:
- prompt text
- style
- mood
- scene

## Validation

Before return:
- validate length
- validate forbidden content
- validate style
- validate brand usage

If validation fails:
- sanitize or regenerate

## Failure Behavior

If a valid prompt cannot be produced:
- use a safe fallback
- style = `minimal`
- mood = `calm`

Fallback example:

```text
    A simple abstract illustration inspired by an outdoor endurance activity,
    minimal style, calm atmosphere
```

## Versioning

Any change to:
- signal extraction
- classification logic
- prompt structure
- style or mood selection

MUST bump the version.

Prompt generation MUST always match the current spec version.
