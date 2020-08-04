#!/usr/bin/env bash
# Branch names must follow a convention,
# an extension of what's offered by default w/ Jira & BitBucket.
# Since there is no separate git hook for "branch created" event, we check this in the commit hook.

local_branch="$(git rev-parse --abbrev-ref HEAD)"
project_name="LYNX"

if [ $local_branch == "master" ]; then
    exit 0
fi

# Branch convention is:
# ${branchType}-${Jira issue ID (e.g. LYNX-123)}-your-branch-name-description
valid_branch_regex="^(release|feature|bugfix|hotfix|improvement|chore|documentation)\/$project_name-[0-9]+-[a-z0-9-]+$"

if [[ ! $local_branch =~ $valid_branch_regex ]]; then
    echo "There is something wrong with your branch name."
    echo "Branch names in this project must adhere to this contract: $valid_branch_regex."
    echo "Your commit will be rejected. You should rename your branch to a valid name and try again."
    exit 1
fi
