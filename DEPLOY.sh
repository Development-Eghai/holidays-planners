#!/bin/bash
# SEO Deployment & Verification Checklist
# Located: d:\27-Oct-25\frontend\DEPLOY.sh
# Execute this to verify all SEO fixes are in place

set -e

echo "🔍 SEO Implementation Verification Checklist"
echo "============================================"
echo ""

# 1. Check server.js exists
if [ -f "server.js" ]; then
    echo "✅ server.js (SSR + bot detection)"
else
    echo "❌ server.js NOT FOUND"
    exit 1
fi

# 2. Check prerender script exists
if [ -f "scripts/prerender.js" ]; then
    echo "✅ scripts/prerender.js (prerendering)"
else
    echo "❌ scripts/prerender.js NOT FOUND"
    exit 1
fi

# 3. Check package.json has express
if grep -q '"express"' package.json; then
    echo "✅ package.json includes express"
else
    echo "❌ package.json missing express"
    exit 1
fi

# 4. Check package.json has build:ssr script
if grep -q '"build:ssr"' package.json; then
    echo "✅ package.json has 'build:ssr' script"
else
    echo "❌ package.json missing 'build:ssr' script"
    exit 1
fi

# 5. Check robots.txt
if [ -f "public/robots.txt" ]; then
    if grep -q "Sitemap:" public/robots.txt; then
        echo "✅ public/robots.txt with sitemap reference"
    else
        echo "❌ public/robots.txt missing sitemap"
        exit 1
    fi
else
    echo "❌ public/robots.txt NOT FOUND"
    exit 1
fi

# 6. Check llms.txt
if [ -f "public/llms.txt" ]; then
    echo "✅ public/llms.txt (AI crawler reference)"
else
    echo "❌ public/llms.txt NOT FOUND"
    exit 1
fi

# 7. Check Home.jsx has schema
if grep -q "TravelAgency" src/pages/user/Home/Home.jsx; then
    echo "✅ Home.jsx includes TravelAgency schema"
else
    echo "❌ Home.jsx missing TravelAgency schema"
    exit 1
fi

# 8. Check HeroSection H1 updated
if grep -q "Explore India's Best Tour Packages" src/components/home/HeroSection.jsx; then
    echo "✅ HeroSection.jsx has unique H1"
else
    echo "❌ HeroSection.jsx H1 not updated"
    exit 1
fi

# 9. Check Header logo alt text
if grep -q "Holidays Planners.*India travel" src/components/layout/Header.jsx; then
    echo "✅ Header.jsx has descriptive logo alt"
else
    echo "❌ Header.jsx logo alt not descriptive"
    exit 1
fi

# 10. Check sitemap script
if [ -f "scripts/generate-sitemap.js" ]; then
    echo "✅ scripts/generate-sitemap.js (sitemap generation)"
else
    echo "❌ scripts/generate-sitemap.js NOT FOUND"
    exit 1
fi

echo ""
echo "============================================"
echo "✅ All SEO implementation files verified!"
echo ""
echo "Next steps:"
echo "  1. npm install"
echo "  2. npm run build:ssr"
echo "  3. npm run serve:ssr"
echo "  4. Test: curl -A Googlebot http://localhost:3000"
echo ""
