#!/bin/bash

# Script to run tests and automatically open the browser debug URL
# This allows you to watch the remote browser execution in real-time

echo "🚀 Starting test with BrowserBase cloud execution..."
echo "📺 Watch for the debug URL in the output - it will let you see the browser in action!"
echo "🌐 Running with USE_LOCAL_BROWSER=false (cloud mode)"
echo ""

# Run the test and capture output (using elements test)
node --import tsx/esm ./node_modules/.bin/cucumber-js --config=cucumber.cjs features/elements.feature 2>&1 | tee /tmp/test_output.log &

# Wait a moment for the test to start and capture session info
sleep 5

# Look for various debug URL patterns that Stagehand might output
DEBUG_URL=$(grep -o 'https://www\.browserbase\.com/[^[:space:]]*' /tmp/test_output.log | head -1)

if [ -z "$DEBUG_URL" ]; then
    # Try alternative pattern for inspector URLs
    DEBUG_URL=$(grep -o 'https://[^[:space:]]*browserbase[^[:space:]]*' /tmp/test_output.log | head -1)
fi

if [ -z "$DEBUG_URL" ]; then
    # Look for session ID and construct URL
    SESSION_ID=$(grep -o 'session[[:space:]]*[ID]*[[:space:]]*[a-zA-Z0-9-]*' /tmp/test_output.log | head -1 | grep -o '[a-zA-Z0-9-]*$')
    if [ ! -z "$SESSION_ID" ]; then
        DEBUG_URL="https://www.browserbase.com/devtools/inspector.html?wsUrl=wss://connect.browserbase.com/v1/sessions/$SESSION_ID/devtools"
    fi
fi

if [ ! -z "$DEBUG_URL" ]; then
    echo ""
    echo "🎯 BROWSER DEBUG URL FOUND:"
    echo "👀 Open this URL to watch the browser automation:"
    echo "$DEBUG_URL"
    echo ""
    echo "💡 Copy and paste the URL above into your browser to watch the test execute!"
    echo "🌐 You'll see the AI controlling the browser in real-time on BrowserBase!"
else
    echo "⏳ Debug URL not yet available - checking test output..."
    echo ""
    echo "📋 Recent test output:"
    tail -n 20 /tmp/test_output.log | grep -E "(session|browserbase|debug|url)" || echo "No debug info found yet"
    echo ""
    echo "💡 Alternative: Check your BrowserBase dashboard at https://www.browserbase.com/dashboard"
fi

# Continue monitoring for debug URL while test runs
echo ""
echo "⏰ Continuing to monitor for debug URL..."
for i in {1..10}; do
    sleep 2
    NEW_DEBUG_URL=$(grep -o 'https://[^[:space:]]*browserbase[^[:space:]]*' /tmp/test_output.log | head -1)
    if [ ! -z "$NEW_DEBUG_URL" ] && [ -z "$DEBUG_URL" ]; then
        echo "🎯 DEBUG URL FOUND: $NEW_DEBUG_URL"
        break
    fi
done

# Wait for the background process to complete
wait
