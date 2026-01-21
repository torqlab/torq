# Specs Validate with AI

## Purpose

Define requirements for AI-based validation of OpenSpec specifications to ensure deterministic, rule-bound, and auditable validation processes.

## Requirements

### Requirement: AI Validation Determinism

An AI validator SHALL produce identical output for identical inputs. An AI validator SHALL NOT depend on execution order, use randomness, or use probabilistic interpretation.

#### Scenario: Identical inputs produce identical outputs
- **GIVEN** identical specification inputs
- **WHEN** validation is performed
- **THEN** the validator SHALL produce identical output

#### Scenario: No execution order dependency
- **GIVEN** specifications provided in different orders
- **WHEN** validation is performed
- **THEN** the validator SHALL produce identical results regardless of order

#### Scenario: No randomness in validation
- **GIVEN** a validation process
- **WHEN** validation is performed
- **THEN** the validator SHALL NOT introduce randomness

### Requirement: AI Validation Rule-Bound Behavior

An AI validator SHALL validate specifications strictly against OpenSpec rules. An AI validator SHALL treat specifications as static text. An AI validator SHALL NOT infer unstated intent, invent rules, or assume correctness.

#### Scenario: Validation against OpenSpec rules
- **GIVEN** specifications to validate
- **WHEN** validation is performed
- **THEN** the validator SHALL validate strictly against OpenSpec rules

#### Scenario: Specifications treated as static text
- **GIVEN** specification content
- **WHEN** validation is performed
- **THEN** the validator SHALL treat specifications as authoritative, static text

#### Scenario: No intent inference
- **GIVEN** a specification with ambiguous or incomplete content
- **WHEN** validation is performed
- **THEN** the validator SHALL NOT infer unstated intent

#### Scenario: No rule invention
- **GIVEN** a specification that doesn't explicitly state a rule
- **WHEN** validation is performed
- **THEN** the validator SHALL NOT invent rules

### Requirement: AI Validation Prohibited Behaviors

An AI validator SHALL NOT suggest fixes, propose implementations, rewrite specifications, or introduce new rules.

#### Scenario: No fix suggestions
- **GIVEN** a validation that identifies violations
- **WHEN** validation output is produced
- **THEN** the validator SHALL NOT suggest fixes

#### Scenario: No implementation proposals
- **GIVEN** a validation process
- **WHEN** validation is performed
- **THEN** the validator SHALL NOT propose implementations

#### Scenario: No specification rewriting
- **GIVEN** specifications with violations
- **WHEN** validation is performed
- **THEN** the validator SHALL NOT rewrite specifications

### Requirement: OpenSpec Format Compliance

The validator SHALL validate that specifications follow OpenSpec format requirements. Specifications SHALL contain Requirements sections with Requirement headers. Each Requirement SHALL have at least one Scenario. Scenarios SHALL use the proper format with GIVEN/WHEN/THEN structure.

#### Scenario: Requirements section present
- **GIVEN** a specification file
- **WHEN** validating format compliance
- **THEN** the specification SHALL contain a Requirements section

#### Scenario: Requirement headers present
- **GIVEN** a specification file
- **WHEN** validating format compliance
- **THEN** requirements SHALL use ### Requirement: headers

#### Scenario: Scenarios present for requirements
- **GIVEN** a requirement in a specification
- **WHEN** validating format compliance
- **THEN** the requirement SHALL have at least one scenario

#### Scenario: Scenario format compliance
- **GIVEN** a scenario in a specification
- **WHEN** validating format compliance
- **THEN** the scenario SHALL use #### Scenario: header and GIVEN/WHEN/THEN structure

### Requirement: Cross-Spec Compatibility Validation

The validator SHALL detect rule conflicts, rule shadowing, rule duplication, and behavioral overlaps between specifications.

#### Scenario: Rule conflict detection
- **GIVEN** multiple specifications with conflicting rules
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report conflicts

#### Scenario: Rule shadowing detection
- **GIVEN** specifications that redefine existing rules under different names
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report shadowing

#### Scenario: Rule duplication detection
- **GIVEN** specifications with semantically equivalent rules
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report duplication

#### Scenario: Behavioral overlap detection
- **GIVEN** multiple specifications affecting the same behavior
- **WHEN** validation is performed
- **THEN** the validator SHALL verify ownership is explicit and one spec is authoritative

### Requirement: Cross-Spec Constraint Validation

The validator SHALL verify that specifications do not contradict each other, weaken requirements, or introduce unauthorized exceptions.

#### Scenario: Contradiction detection
- **GIVEN** specifications with contradictory requirements
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report contradictions

#### Scenario: Requirement weakening detection
- **GIVEN** a specification that weakens a requirement from another specification
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report weakening

#### Scenario: Unauthorized exception detection
- **GIVEN** a specification that introduces exceptions without authorization
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report unauthorized exceptions

### Requirement: Global Determinism Validation

The validator SHALL verify that combined application of all specifications results in deterministic outcomes, no conflicting randomness sources, and no order-dependent interpretation.

#### Scenario: Deterministic outcome verification
- **GIVEN** a complete set of specifications
- **WHEN** validating global determinism
- **THEN** the validator SHALL verify combined application results in deterministic outcomes

#### Scenario: Randomness source conflict detection
- **GIVEN** specifications that introduce conflicting randomness sources
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report conflicts

#### Scenario: Order dependency detection
- **GIVEN** specifications with order-dependent interpretation
- **WHEN** validation is performed
- **THEN** the validator SHALL detect and report order dependencies

### Requirement: Validation AI Prompts

The validator SHALL use canonical AI prompts defined for specification validation. The system prompt SHALL instruct the AI to act as a formal specification validation engine that validates specifications against OpenSpec rules. The user prompt SHALL provide instructions for validating a complete set of specifications and the expected output format.

The canonical system prompt SHALL be:

```
You are a formal specification validation engine.

Your task is to validate a **COMPLETE SET** of provided specifications as a single system.

You **MUST** comply with:
- The OpenSpec rules

You **MUST** treat all specifications as authoritative, static text.
You **MUST NOT** assume intent.
You **MUST NOT** invent rules.
You **MUST NOT** infer missing behavior.
You **MUST NOT** suggest fixes or improvements.

You **MUST** validate:
- Each specification individually
- The combined behavior of all provided specifications together

You **MUST** apply:
- All general checks
- All cross-spec compatibility checks

You **MUST** detect:
- OpenSpec rule violations
- Cross-level conflicts
- Rule shadowing
- Rule duplication
- Constraint violations
- Non-determinism introduced by combination

You **MUST** produce deterministic output.
Identical inputs **MUST** result in identical output.

You **MUST** output **ONLY** valid JSON. No prose. No markdown. No explanations.
```

The canonical user prompt SHALL be:

```
Validate the following complete specification set.

This input represents the **SUBSET** of specifications.
All provided specifications **MUST** be validated together as a system.

Instructions:
- Validate every specification against the OpenSpec
- Validate cross-spec interactions and conflicts
- Determine a single global validation result

If **ANY** mandatory check fails → result **MUST** be **INVALID**.

Return a **SINGLE** validation result using this contract:

{
  "result": "VALID | INVALID",
  "violations": [
    {
      "spec_id": "<id or null if global>",
      "rule": "<meta rule reference>",
      "description": "<precise, mechanical description>"
    }
  ],
  "notes": []
}

Now validate the following specifications:
```

#### Scenario: System prompt usage
- **GIVEN** a validation process is initiated
- **WHEN** configuring the AI validator
- **THEN** the system prompt SHALL instruct the AI to act as a formal specification validation engine

#### Scenario: System prompt content
- **GIVEN** the system prompt
- **WHEN** examining the prompt content
- **THEN** the prompt SHALL specify compliance with OpenSpec rules, treating specifications as static text, and prohibiting intent inference

#### Scenario: User prompt usage
- **GIVEN** specifications to validate
- **WHEN** constructing the validation request
- **THEN** the user prompt SHALL provide instructions for validating the complete specification set

#### Scenario: User prompt output format
- **GIVEN** the user prompt
- **WHEN** examining the prompt content
- **THEN** the prompt SHALL specify the expected JSON output format with result and violations fields

#### Scenario: Prompt determinism
- **GIVEN** identical specifications
- **WHEN** using the canonical prompts
- **THEN** the prompts SHALL ensure deterministic validation output

### Requirement: Validation Output Contract

The validator SHALL produce output in a defined JSON format. The output SHALL include a validation result, violations array, and optional notes. The result SHALL be VALID or INVALID.

#### Scenario: JSON output format
- **GIVEN** a validation process completes
- **WHEN** output is produced
- **THEN** the output SHALL be valid JSON

#### Scenario: Result field present
- **GIVEN** validation output
- **WHEN** examining the output
- **THEN** the output SHALL contain a result field with value VALID or INVALID

#### Scenario: Violations array present
- **GIVEN** validation output
- **WHEN** examining the output
- **THEN** the output SHALL contain a violations array

#### Scenario: Violation structure
- **GIVEN** a violation in the output
- **WHEN** examining the violation
- **THEN** the violation SHALL contain spec_id, rule, and description fields

### Requirement: Validation Process Scope

The validator SHALL validate each specification individually and the combined behavior of all specifications together. The validator SHALL validate a complete set of specifications as a single system.

#### Scenario: Individual specification validation
- **GIVEN** a set of specifications
- **WHEN** validation is performed
- **THEN** each specification SHALL be validated individually

#### Scenario: Combined system validation
- **GIVEN** a set of specifications
- **WHEN** validation is performed
- **THEN** the combined behavior of all specifications SHALL be validated together

#### Scenario: Complete set validation
- **GIVEN** a complete set of specifications
- **WHEN** validation is performed
- **THEN** all specifications SHALL be validated together as a single system

### Requirement: Validation Failure Handling

If validation cannot be completed due to incomplete or inconsistent inputs, the validator SHALL return INVALID result with appropriate violation description.

#### Scenario: Incomplete input handling
- **GIVEN** incomplete specification inputs
- **WHEN** validation is attempted
- **THEN** the validator SHALL return INVALID result with violation describing incomplete inputs

#### Scenario: Inconsistent input handling
- **GIVEN** inconsistent specification inputs
- **WHEN** validation is attempted
- **THEN** the validator SHALL return INVALID result with violation describing inconsistency

### Requirement: GitHub Actions Workflow for AI Validation

The system SHALL provide a GitHub Actions workflow that executes AI-based specification validation. The workflow SHALL trigger on pushes to the main branch when OpenSpec-related files change, support manual triggering with optional spec selection, require manual approval before execution, detect changed spec files, execute validation, extract validated spec paths, render validation summaries, and expose validation results as outputs.

#### Scenario: Workflow trigger on OpenSpec changes
- **GIVEN** a push to the main branch
- **WHEN** files in openspec/**, packages/specs-guardrails/validate-specs-with-ai, or .github/workflows/specs-validate-with-ai.yml are modified
- **THEN** the AI validation workflow SHALL trigger

**Note**: The path `packages/specs-guardrails/validate-specs-with-ai` matches the actual package structure.

#### Scenario: Manual workflow trigger with spec selection
- **GIVEN** a GitHub Actions workflow_dispatch event
- **WHEN** the AI validation workflow is manually triggered with specs input
- **THEN** the workflow SHALL accept an optional specs input parameter (comma-separated spec paths or "*" for all specs)
- **AND** if specs is "*", the workflow SHALL validate all specs
- **AND** if specs contains paths, the workflow SHALL validate only those specified specs

#### Scenario: Changed spec files detection
- **GIVEN** the workflow is triggered by a push event
- **WHEN** detecting changed spec files
- **THEN** the workflow SHALL compare the current commit with the previous commit
- **AND** the workflow SHALL identify all changed .spec.md files within the openspec directory (matching pattern `^openspec/.*spec\.md$`)
- **AND** the workflow SHALL convert changed file paths to absolute paths

#### Scenario: Validated spec paths extraction
- **GIVEN** validation execution context is available
- **WHEN** extracting validated spec paths
- **THEN** if changed specs were detected, the workflow SHALL extract spec paths from the changed specs output
- **AND** if no changed specs were detected, the workflow SHALL find all files matching pattern `*spec.md` in the `./openspec/specs` directory only
- **AND** the workflow SHALL convert relative paths to absolute paths
- **AND** the workflow SHALL store the list of validated spec paths as a JSON array
- **AND** the workflow SHALL output debug information showing found spec files and the resulting JSON

#### Scenario: Validation summary rendering
- **GIVEN** validation results are parsed
- **WHEN** rendering the summary
- **THEN** the workflow SHALL render a markdown table in GitHub Step Summary showing result status, violation count, and notes count (if any)

#### Scenario: Complete validation results rendering
- **GIVEN** validation results and validated spec paths are available
- **WHEN** rendering validation results
- **THEN** the workflow SHALL render a markdown table in GitHub Step Summary showing all validated specs with spec ID, status, rule, and description columns
- **AND** for valid specs (no violations), the workflow SHALL show "✅ Valid" status with "No issues found" message
- **AND** for invalid specs (with violations), the workflow SHALL show each violation with "❌ Invalid" status, rule, and description
- **AND** the workflow SHALL extract display spec IDs from paths using the same logic as violation spec_id extraction

#### Scenario: Global violations handling
- **GIVEN** validation results contain violations without spec_id
- **WHEN** rendering validation results
- **THEN** the workflow SHALL render global violations in a separate "Global Issues" subsection
- **AND** global violations SHALL be displayed with "global" as the spec ID

#### Scenario: Validation result exposure
- **GIVEN** validation results are available
- **WHEN** exposing results as outputs
- **THEN** the workflow SHALL base64-encode the validation summary JSON and expose it as validation-summary-json output

#### Scenario: Validation execution error handling
- **GIVEN** the validation script execution fails
- **WHEN** handling the failure
- **THEN** the workflow SHALL create a valid error JSON response with INVALID result and notes describing the failure
- **AND** the workflow SHALL continue execution to render summaries and expose outputs

#### Scenario: Validation scope limitation
- **GIVEN** the workflow validates all specs (no changed specs detected)
- **WHEN** executing validation
- **THEN** the workflow SHALL validate only specs in the `./openspec/specs` directory using `--rootDir $(pwd)/openspec/specs` parameter
- **AND** the workflow SHALL NOT validate specs from `node_modules/`, `specs/`, or other directories outside `./openspec/specs`

#### Scenario: Execution error detection
- **GIVEN** validation results contain notes
- **WHEN** checking for execution errors
- **THEN** the workflow SHALL check if notes_count is non-zero
- **AND** if notes exist, the workflow SHALL display a warning message listing all notes indicating validation script execution issues

#### Scenario: Prompt logging
- **GIVEN** the workflow is executing
- **WHEN** before running validation
- **THEN** the workflow SHALL log the system prompt and user prompt contents (without injected specs) for debugging purposes

### Requirement: Manual Approval Before AI Validation

The system SHALL require manual approval before executing AI-based specification validation. The validation job SHALL use the validate-specs-with-ai-approval environment to pause workflow execution and wait for manual approval from designated reviewers before proceeding with AI validation steps.

#### Scenario: Approval gate on workflow trigger
- **GIVEN** the specs-validate-with-ai workflow is triggered
- **WHEN** the validate-specs-with-ai job starts
- **THEN** the workflow SHALL pause and wait for approval from the validate-specs-with-ai-approval environment

#### Scenario: Validation execution after approval
- **GIVEN** approval is granted from the validate-specs-with-ai-approval environment
- **WHEN** the validate-specs-with-ai job proceeds
- **THEN** the workflow SHALL execute AI validation steps including detecting changed spec files, running validation, and producing validation results

#### Scenario: Environment configuration requirement
- **GIVEN** the validate-specs-with-ai job
- **WHEN** examining the job configuration
- **THEN** the job SHALL reference the validate-specs-with-ai-approval environment

### Requirement: Approval Gate for AI Fixes

The system SHALL require manual approval before automatically fixing specification validation failures using AI. The approval gate SHALL trigger when AI-assisted validation fails, require approval from the fix-specs-with-ai-approval environment, and only proceed to fix execution after approval is granted.

#### Scenario: Approval gate trigger on AI validation failure
- **GIVEN** AI-assisted validation fails
- **WHEN** validation status is INVALID
- **THEN** the fix-specs-with-ai-approval job SHALL trigger and wait for approval from the fix-specs-with-ai-approval environment

#### Scenario: Fix workflow execution after approval
- **GIVEN** approval is granted
- **WHEN** the fix-specs-with-ai job executes
- **THEN** the workflow SHALL call the fix-specs-with-ai.yml reusable workflow with the validation summary JSON

#### Scenario: Finalization job execution
- **GIVEN** validation and fix jobs complete
- **WHEN** the finally job executes
- **THEN** the workflow SHALL run a finalization job that depends on both validation and fix jobs
- **AND** if validation status is INVALID, the workflow SHALL exit with code 1 and display a failure message

### Requirement: Automated Spec Fix Workflow

The system SHALL provide a reusable GitHub Actions workflow that automatically fixes specification validation failures using AI. The workflow SHALL accept a validation summary as input, checkout the repository, setup CodeMie CLI, authenticate, prepare a task with the fix-specs prompt and validation summary, execute CodeMie to fix violations, and create a pull request with the fixes.

#### Scenario: Fix workflow input acceptance
- **GIVEN** the fix-specs-with-ai workflow is called
- **WHEN** receiving inputs
- **THEN** the workflow SHALL accept a required summary input (base64-encoded validation summary JSON)

#### Scenario: Fix workflow environment setup
- **GIVEN** the fix workflow is executing
- **WHEN** setting up the environment
- **THEN** the workflow SHALL checkout the repository without persisting credentials, setup Node.js version 24, install CodeMie CLI globally, and authenticate with CodeMie

#### Scenario: Fix task preparation
- **GIVEN** the validation summary is available
- **WHEN** preparing the fix task
- **THEN** the workflow SHALL combine prompts/fix-specs.user.md with the decoded validation summary into a task file

#### Scenario: CodeMie execution
- **GIVEN** the fix task is prepared
- **WHEN** executing CodeMie
- **THEN** the workflow SHALL run codemie-code with model gpt-5-mini-2025-08-07 and the prepared task, and display git status after execution

#### Scenario: Pull request creation
- **GIVEN** CodeMie has made changes
- **WHEN** creating a pull request
- **THEN** the workflow SHALL create a pull request with branch name agent/fix-specs-{run_id}, title "🤖 Agent: Fix Specs", body describing automatic generation, and labels "agent" and "specs"

### Requirement: Fix Workflow Prompt Usage

The fix workflow SHALL use the prompt defined in prompts/fix-specs.user.md when preparing the fix task.

#### Scenario: Fix workflow prompt
- **GIVEN** the fix workflow is executing
- **WHEN** preparing the fix task
- **THEN** the workflow SHALL use prompts/fix-specs.user.md as the base prompt

### Requirement: Fix Workflow Permissions

The fix workflow SHALL require contents: write and pull-requests: write permissions to create pull requests with fixes.

#### Scenario: Fix workflow permissions
- **GIVEN** the fix-specs-with-ai workflow
- **WHEN** examining permissions
- **THEN** the workflow SHALL have contents: write and pull-requests: write permissions
