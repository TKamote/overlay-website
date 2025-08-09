#!/bin/bash

echo "🚀 Deploying tkamot.com overlay website..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check if dist directory exists
    if [ -d "dist" ]; then
        echo "📁 Dist directory found"
        echo "📊 Build size:"
        du -sh dist/
        
        echo ""
        echo "🎯 Next steps:"
        echo "1. Upload the contents of the 'dist' folder to your web server"
        echo "2. Ensure your web server is configured for tkamot.com"
        echo "3. Check that the CNAME file is properly configured"
        echo ""
        echo "📋 Files to deploy:"
        ls -la dist/
        
    else
        echo "❌ Dist directory not found!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
