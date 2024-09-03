#!/bin/bash

# Set the new branch name
NEW_BRANCH="sidebar-dashboard-updates"

# Update frontend (notebits)
echo "Updating frontend..."
cd notebits
git checkout -b $NEW_BRANCH
git add .
git commit -m "Fix sidebar visibility and improve Dashboard component"
git push -u origin $NEW_BRANCH

# Update backend (notesback)
echo "Updating backend..."
cd ../notesback
git checkout -b $NEW_BRANCH
git add .
git commit -m "Update backend components"
git push -u origin $NEW_BRANCH

echo "Updating Core branch"
cd ..
git checkout -b $NEW_BRANCH
git add .
git commit -m "Update Core branch with sidebar and dashboard changes"
git push -u origin $NEW_BRANCH

echo "Everything updated on new branch: $NEW_BRANCH!"