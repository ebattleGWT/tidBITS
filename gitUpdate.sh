#!/bin/bash

# Set the new branch name
NEW_BRANCH="design_update"

# Update frontend (notebits)
echo "Updating frontend..."
cd notebits
git checkout -b $NEW_BRANCH
git add .
git commit -m "Fixed menu for the notes"
git push -u origin $NEW_BRANCH

# Update backend (notesback)
echo "Updating backend..."
cd ../notesback
git checkout -b $NEW_BRANCH
git add .
git commit -m "Updated backend components"
git push -u origin $NEW_BRANCH

echo "Updating Core branch"
cd ..
git checkout -b $NEW_BRANCH
git add .
git commit -m "Update Core branch with minor design updates"
git push -u origin $NEW_BRANCH

echo "Everything updated on new branch: $NEW_BRANCH!"