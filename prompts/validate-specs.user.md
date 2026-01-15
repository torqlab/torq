Validate the following complete specification set.

This input represents the **ENTIRE** universe of specifications.
There is **NO** target specification.
All specifications **MUST** be validated together as a system.

Instructions:
- Validate every specification against the meta checklist
- Validate every specification against level rules
- Validate cross-spec interactions and conflicts
- Determine a single global validation result

If **ANY** mandatory check fails → result **MUST** be **INVALID**.

Return a **SINGLE** validation result using this contract:

{
  "result": "VALID | CONDITIONALLY_VALID | INVALID",
  "violations": [
    {
      "spec_id": "<id or null if global>",
      "rule": "<meta rule reference>",
      "severity": "CONDITIONALLY_VALID | INVALID"
      "description": "<precise, mechanical description>"
    }
  ],
  "notes": []
}

Now validate the following specifications:
