#!/bin/bash

# EdVerse Deployment Script for Local Testing

echo "🚀 Starting EdVerse Deployment Preparation..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi
echo "✅ Server dependencies installed"
echo ""

echo "📦 Installing client dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi
echo "✅ Client dependencies installed"
echo ""

# Build server
echo "🔨 Building server..."
cd ../server
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Server build failed"
    exit 1
fi
echo "✅ Server build successful"
echo ""

# Build client
echo "🔨 Building client..."
cd ../client
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Client build failed"
    exit 1
fi
echo "✅ Client build successful"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ EdVerse is ready for deployment!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Deployment Steps:"
echo "1. Backend (Render):"
echo "   - Go to https://render.com"
echo "   - Connect your GitHub repository"
echo "   - Use render.yaml for configuration"
echo ""
echo "2. Frontend (Vercel):"
echo "   - Go to https://vercel.com"
echo "   - Connect your GitHub repository"
echo "   - Set VITE_API_URL environment variable"
echo ""
echo "3. Set environment variables in both platforms"
echo ""
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
