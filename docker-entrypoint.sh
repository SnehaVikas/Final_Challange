#!/bin/sh

# Generate the env.js file from environment variables at runtime
# This allows Cloud Run environment variables to be accessible in the browser
cat <<EOF > /usr/share/nginx/html/env.js
window.__ENV__ = {
  VITE_GEMINI_API_KEY: "${VITE_GEMINI_API_KEY}",
  VITE_FIREBASE_API_KEY: "${VITE_FIREBASE_API_KEY}",
  VITE_FIREBASE_AUTH_DOMAIN: "${VITE_FIREBASE_AUTH_DOMAIN}",
  VITE_FIREBASE_PROJECT_ID: "${VITE_FIREBASE_PROJECT_ID}",
  VITE_FIREBASE_STORAGE_BUCKET: "${VITE_FIREBASE_STORAGE_BUCKET}",
  VITE_FIREBASE_MESSAGING_SENDER_ID: "${VITE_FIREBASE_MESSAGING_SENDER_ID}",
  VITE_FIREBASE_APP_ID: "${VITE_FIREBASE_APP_ID}",
  VITE_YOUTUBE_API_KEY: "${VITE_YOUTUBE_API_KEY}"
};
EOF

# Start nginx
nginx -g "daemon off;"
