#!/bin/bash

# Quick start script for Hugo site

echo "======================================"
echo "Hugo Site Quick Start"
echo "======================================"
echo ""

# Check if Hugo is installed
if ! command -v hugo &> /dev/null; then
    echo "❌ Hugo is not installed!"
    echo ""
    echo "Please install Hugo first:"
    echo "  macOS: brew install hugo"
    echo "  Linux: snap install hugo"
    echo "  Or download from: https://github.com/gohugoio/hugo/releases"
    echo ""
    exit 1
fi

echo "✅ Hugo found: $(hugo version)"
echo ""

# Show current directory
echo "📁 Current directory: $(pwd)"
echo ""

# Show options
echo "What would you like to do?"
echo ""
echo "  1) Start local server (preview site)"
echo "  2) Build site"
echo "  3) Deploy to GitHub Pages"
echo "  4) Create new post"
echo "  5) Show site info"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting Hugo server..."
        echo "   Open http://localhost:1313 in your browser"
        echo "   Press Ctrl+C to stop"
        echo ""
        hugo server -D
        ;;
    2)
        echo ""
        echo "🔨 Building site..."
        hugo
        if [ $? -eq 0 ]; then
            echo "✅ Build successful! Output in public/"
        else
            echo "❌ Build failed!"
        fi
        ;;
    3)
        echo ""
        echo "📤 Deploying to GitHub Pages..."
        ./deploy.sh
        ;;
    4)
        echo ""
        read -p "Enter post title: " title
        filename=$(echo "$title" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
        hugo new "posts/$filename.md"
        echo "✅ Created: content/posts/$filename.md"
        ;;
    5)
        echo ""
        echo "📊 Site Information:"
        echo "   Base URL: $(grep baseURL config.toml)"
        echo "   Title: $(grep '^title' config.toml)"
        echo "   Theme: $(grep '^theme' config.toml)"
        echo ""
        echo "📝 Content Statistics:"
        echo "   Posts: $(find content/posts -name "*.md" 2>/dev/null | wc -l | tr -d ' ')"
        echo "   Pages: $(find content -name "*.md" -not -path "*/posts/*" 2>/dev/null | wc -l | tr -d ' ')"
        ;;
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac

