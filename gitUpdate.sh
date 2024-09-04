#!/bin/bash

# Set the new branch name
NEW_BRANCH="frontend-patch-1"

# Update frontend (notebits)
echo "Updating frontend..."
cd notebits
git checkout -b $NEW_BRANCH
git add .
git commit -m "frontend patch since the frontend wasnt syncing with github"
git push -u origin $NEW_BRANCH

# Update backend (notesback)
echo "Updating backend..."
cd ../notesback
git checkout -b $NEW_BRANCH
git add .
git commit -m "add gitignore to the backend"
git push -u origin $NEW_BRANCH

echo "Updating Core branch"
cd ..
git checkout -b $NEW_BRANCH
git add .
git commit -m "Update Core branch with minor design updates"
git push -u origin $NEW_BRANCH

echo "Everything updated on new branch: $NEW_BRANCH!"