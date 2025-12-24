#!/bin/bash

# Hugo build and deploy script

echo "Building Hugo site..."

# Build the site
hugo

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful!"
    
    # Deploy to GitHub Pages
    cd public
    
    # Initialize git if needed
    if [ ! -d ".git" ]; then
        git init
        git remote add origin https://github.com/ftxj/ftxj.github.io.git
    fi
    
    # Add all files
    git add .
    
    # Commit
    git commit -m "Site updated: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Push to master branch
    git push origin master --force
    
    echo "Deployed to GitHub Pages!"
else
    echo "Build failed!"
    exit 1
fi

