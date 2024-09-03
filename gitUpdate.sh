#!/bin/bash

# Update frontend (notebits)
echo "Updating frontend..."
cd notebits
git add .
git commit -m "updated sidebar and removed top bar"
git push origin master

# Update backend (notesback)
echo "Updating backend..."
cd ../notesback
git add .
git commit -m "Update backend components"
git push origin master

echo "Updating Core branch"
cd ..
git add .
git commit -m "Update Core branch"
git push origin origin/core

echo "Everything updated!"