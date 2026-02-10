#!/bin/bash

# Tracks lines added/modified in a session and blocks if over 1000 lines.
# Reads the changed file path and session ID from stdin,
# counts lines changed using git diff, updates a session counter,
# and blocks if the total exceeds 1000 lines.

# Read entire stdin once.
INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id')
CHANGED_FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# Validate SESSION_ID is not null or empty.
if [ "$SESSION_ID" = "null" ] || [ -z "$SESSION_ID" ]; then
  exit 0
fi

# Ensure tmp directory exists
mkdir -p "$CLAUDE_PROJECT_DIR/tmp"

# Session line tracking.
COUNTER_FILE="$CLAUDE_PROJECT_DIR/tmp/claude-session-$SESSION_ID-lines"
CURRENT_LINES=$(cat "$COUNTER_FILE" 2>/dev/null || echo "0")

# Count lines added/modified and update session counter.
if [ -f "$CHANGED_FILE_PATH" ]; then
  # Get lines added in this file using numstat (format: added<tab>deleted<tab>filename).
  LINES_CHANGED=$(git diff --numstat HEAD -- "$CHANGED_FILE_PATH" 2>/dev/null | awk '{print $1}' || echo "0")
  if [ "$LINES_CHANGED" = "" ] || [ "$LINES_CHANGED" = "-" ]; then LINES_CHANGED=0; fi
  NEW_TOTAL=$((CURRENT_LINES + LINES_CHANGED))
  
  # Check session line budget (1000 lines).
  if [ "$NEW_TOTAL" -gt 1000 ]; then
    echo "{\"hookSpecificOutput\": {\"hookEventName\": \"PostToolUse\", \"permissionDecision\": \"deny\", \"permissionDecisionReason\": \"Session limit: 1000 lines exceeded ($NEW_TOTAL/1000)\"}}"
    exit 2
  fi
  
  # Update counter.
  echo "$NEW_TOTAL" > "$COUNTER_FILE"
fi

# Success.
exit 0
