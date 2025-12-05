#!/bin/bash
# This script creates a weekly report issue in GitLab.

set -e

# --- Configuration ---
# GitLab API URL and private token are expected to be set as environment variables.
# CI_API_V4_URL is a predefined variable in GitLab CI/CD. e.g. https://gitlab.example.com/api/v4
# GITLAB_API_TOKEN is a custom variable you need to set in your project's CI/CD settings.
GITLAB_API_URL="${CI_API_V4_URL}"
PRIVATE_TOKEN="${GITLAB_API_TOKEN}"
# CI_PROJECT_ID is a predefined variable in GitLab CI/CD.
PROJECT_ID="${CI_PROJECT_ID}"

# --- Date setup ---
# Format the date for the issue title, e.g., "12月5日定例メモ"
ISSUE_TITLE=$(date '+%-m月%-d日定例メモ')

# --- Fetch Commits ---
# Fetch commits from the main branch in the last 7 days.
# The format is a simple bullet point with the commit message.
LAST_WEEK_COMMITS=$(git log main --since="7 days ago" --pretty=format:"* %s")

# --- Categorize Commits ---
# Grep for commits based on their prefixes.
FRONTEND_COMMITS=$(echo "${LAST_WEEK_COMMITS}" | grep '\[frontend\]' || echo "なし")
BACKEND_COMMITS=$(echo "${LAST_WEEK_COMMITS}" | grep '\[backend\]' || echo "なし")
COMMON_COMMITS=$(echo "${LAST_WEEK_COMMITS}" | grep '\[common\]' || echo "なし")

# --- Build Issue Body ---
# Using a HEREDOC to build the markdown body for the issue.
ISSUE_BODY=$(cat <<EOF
## 先週やったこと

### frontendチーム
${FRONTEND_COMMITS}

### backendチーム
${BACKEND_COMMITS}

### 共通
${COMMON_COMMITS}

---

## 今週やること
- (ここに記載)

## 定例で確認したい事
- (ここに記載)
EOF
)

# --- Create GitLab Issue ---
# Use curl to post the data to the GitLab API.
# The GitLab API requires the body to be JSON, so we need to escape special characters.
JSON_PAYLOAD=$(jq -n --arg title "$ISSUE_TITLE" --arg body "$ISSUE_BODY" \
  '{title: $title, description: $body}')

echo "Creating issue with title: ${ISSUE_TITLE}"

curl --request POST --header "PRIVATE-TOKEN: ${PRIVATE_TOKEN}" \
     --header "Content-Type: application/json" \
     --data "${JSON_PAYLOAD}" \
     "${GITLAB_API_URL}/projects/${PROJECT_ID}/issues"

echo "Successfully created issue."
