# Specs Validate with OpenSpec

## Purpose

Define requirements for the GitHub Actions CI/CD pipeline that validates OpenSpec specifications using the OpenSpec CLI tool for static validation, ensuring specifications comply with OpenSpec rules and maintain consistency across the specification set.

## Requirements

### Requirement: OpenSpec CLI Validation Workflow

The system SHALL provide a GitHub Actions workflow that validates specifications using the OpenSpec CLI tool. The workflow SHALL trigger on pushes to the main branch when OpenSpec-related files change, and SHALL be manually triggerable. The workflow SHALL run on ubuntu-latest runners, install dependencies, execute OpenSpec CLI validation with --all --strict --no-interactive --json flags, parse results, render summaries, and expose validation results as outputs.

#### Scenario: Workflow trigger on OpenSpec changes
- **GIVEN** a push to the main branch
- **WHEN** files in openspec/**, packages/validate-specs/validate-specs-with-openspec/**, or .github/workflows/specs-validate-with-openspec.yml are modified
- **THEN** the OpenSpec CLI validation workflow SHALL trigger

#### Scenario: Manual workflow trigger
- **GIVEN** a GitHub Actions workflow_dispatch event
- **WHEN** the OpenSpec CLI validation workflow is manually triggered
- **THEN** the workflow SHALL execute validation

#### Scenario: Workflow environment setup
- **GIVEN** the OpenSpec CLI validation workflow is triggered
- **WHEN** the workflow executes
- **THEN** the workflow SHALL checkout the repository, setup Node.js version 24, setup Bun latest version, ensure jq is available, and install dependencies using bun install

#### Scenario: OpenSpec CLI validation execution
- **GIVEN** the workflow environment is set up
- **WHEN** executing validation
- **THEN** the workflow SHALL run the validate-specs-with-openspec script with --rootDir parameter pointing to the openspec/specs directory
- **AND** the script SHALL internally invoke the OpenSpec CLI tool with flags --all --strict --no-interactive --json
- **AND** the workflow SHALL write results to .specs-validation/openspec/result.json

#### Scenario: OpenSpec validation scope
- **GIVEN** the workflow executes validation
- **WHEN** determining which files to validate
- **THEN** the workflow SHALL validate only specifications in the openspec/specs/ directory
- **AND** all other spec files outside openspec/specs/ SHALL be neglected and not validated
- **AND** the OpenSpec CLI SHALL scan only the openspec/specs/ directory recursively for spec files matching its validation criteria

#### Scenario: Validation result parsing
- **GIVEN** validation results are available
- **WHEN** parsing the results
- **THEN** the workflow SHALL extract success status, exit code, total items, passed count, and failed count from the JSON result

#### Scenario: Validation summary rendering
- **GIVEN** validation results are parsed
- **WHEN** rendering the summary
- **THEN** the workflow SHALL render a markdown table in GitHub Step Summary showing status, total items, passed count, and failed count

### Requirement: Complete Validation Results Display

The workflow SHALL render all validated specs in the GitHub Step Summary, not just failures. The workflow SHALL display both valid and invalid specs to provide complete visibility into the validation process.

#### Scenario: All validated specs rendering
- **GIVEN** validation results are available
- **WHEN** rendering validation results
- **THEN** the workflow SHALL render a markdown table showing all validated specs regardless of validation status

#### Scenario: Valid specs display
- **GIVEN** a spec passes validation
- **WHEN** rendering validation results
- **THEN** the workflow SHALL display the spec with "✅ Valid" status and "No issues found" message

#### Scenario: Invalid specs display
- **GIVEN** a spec fails validation
- **WHEN** rendering validation results
- **THEN** the workflow SHALL display each validation issue for the spec with the issue level and message

#### Scenario: Validation results rendering
- **GIVEN** validation results are available
- **WHEN** rendering validation results
- **THEN** the workflow SHALL render a markdown table in GitHub Step Summary showing all validated specs with spec ID, status, and message columns
- **AND** for valid specs, the workflow SHALL show "✅ Valid" status with "No issues found" message
- **AND** for invalid specs, the workflow SHALL show each issue with the issue level and message

#### Scenario: Validation result exposure
- **GIVEN** validation results are available
- **WHEN** exposing results as outputs
- **THEN** the workflow SHALL base64-encode the validation summary JSON and expose it as validation-summary-json output

#### Scenario: Validation failure reporting
- **GIVEN** validation status is false
- **WHEN** reporting the failure
- **THEN** the workflow SHALL exit with code 1 and display a message indicating OpenSpec validation failed

### Requirement: Approval Gate for AI Fixes

The system SHALL require manual approval before automatically fixing specification validation failures using AI. The approval gate SHALL trigger when OpenSpec CLI validation fails, require approval from the fix-specs-with-ai-approval environment, and only proceed to fix execution after approval is granted.

#### Scenario: Approval gate trigger on OpenSpec validation failure
- **GIVEN** OpenSpec CLI validation fails
- **WHEN** validation status is false
- **THEN** the fix-specs-with-ai-approval job SHALL trigger and wait for approval from the fix-specs-with-ai-approval environment

#### Scenario: Fix workflow execution after approval
- **GIVEN** approval is granted
- **WHEN** the fix-specs-with-ai job executes
- **THEN** the workflow SHALL call the fix-specs-with-ai.yml reusable workflow with the validation summary JSON

### Requirement: Automated Spec Fix Workflow

The system SHALL provide a reusable GitHub Actions workflow that automatically fixes specification validation failures using AI. The workflow SHALL accept a validation summary as input, checkout the repository, setup CodeMie CLI, authenticate, prepare a task with the fix-specs prompt and validation summary, execute CodeMie to fix violations, and create a pull request with the fixes. The workflow SHALL only fix specifications in the openspec/specs/ directory, and all other spec files SHALL be neglected.

#### Scenario: Fix workflow input acceptance
- **GIVEN** the fix-specs-with-ai workflow is called
- **WHEN** receiving inputs
- **THEN** the workflow SHALL accept a required summary input (base64-encoded validation summary JSON)

#### Scenario: Fix workflow scope restriction
- **GIVEN** the fix-specs-with-ai workflow is executing
- **WHEN** fixing specification validation failures
- **THEN** the workflow SHALL only fix specifications located in the openspec/specs/ directory
- **AND** all other spec files outside openspec/specs/ SHALL be neglected and not modified

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

### Requirement: Validation Output Format

The OpenSpec CLI validation SHALL produce JSON output with success, exitCode, summary.totals.items, summary.totals.passed, summary.totals.failed, items array, version, and stderr fields.

#### Scenario: OpenSpec CLI validation output structure
- **GIVEN** OpenSpec CLI validation completes
- **WHEN** examining the output JSON
- **THEN** the output SHALL contain success (boolean), exitCode (number), summary.totals.items (number), summary.totals.passed (number), summary.totals.failed (number), items array with validation details, version (string), and stderr (string) fields

#### Scenario: Validation item structure
- **GIVEN** a validation item in the output
- **WHEN** examining the item
- **THEN** the item SHALL contain id, valid (boolean), and issues array fields

#### Scenario: Validation issue structure
- **GIVEN** a validation issue in an item
- **WHEN** examining the issue
- **THEN** the issue SHALL contain level and message fields

### Requirement: Workflow Output Exposure

The OpenSpec CLI validation workflow SHALL expose validation-status and validation-summary-json as job outputs. The validation-status SHALL indicate success (boolean) or failure. The validation-summary-json SHALL be base64-encoded JSON containing the complete validation results.

#### Scenario: OpenSpec CLI validation outputs
- **GIVEN** OpenSpec CLI validation completes
- **WHEN** examining job outputs
- **THEN** the job SHALL expose validation-status (success boolean) and validation-summary-json (base64-encoded result.json)

### Requirement: Workflow Permissions

The OpenSpec CLI validation workflow SHALL require contents: read permission. The fix workflow SHALL require contents: write and pull-requests: write permissions.

#### Scenario: OpenSpec CLI validation permissions
- **GIVEN** the OpenSpec CLI validation workflow
- **WHEN** examining permissions
- **THEN** the workflow SHALL have contents: read permission

#### Scenario: Fix workflow permissions
- **GIVEN** the fix-specs-with-ai workflow
- **WHEN** examining permissions
- **THEN** the workflow SHALL have contents: write and pull-requests: write permissions

### Requirement: Fix Workflow Prompt Usage

The fix workflow SHALL use the prompt defined in prompts/fix-specs.user.md when preparing the fix task.

#### Scenario: Fix workflow prompt
- **GIVEN** the fix workflow is executing
- **WHEN** preparing the fix task
- **THEN** the workflow SHALL use prompts/fix-specs.user.md as the base prompt

### Requirement: Error Handling and Resilience

The OpenSpec CLI validation workflow SHALL handle execution errors gracefully. The workflow SHALL capture output even when the validation script fails, parse available results, and continue execution to render summaries and expose outputs.

#### Scenario: OpenSpec CLI validation script failure handling
- **GIVEN** the OpenSpec CLI validation script fails
- **WHEN** handling the failure
- **THEN** the workflow SHALL capture output with || true, parse available results from the JSON output, and continue execution to render summaries

#### Scenario: Always valid output
- **GIVEN** any validation execution scenario
- **WHEN** producing output
- **THEN** the workflow SHALL always produce valid JSON output that can be parsed and processed by downstream jobs
