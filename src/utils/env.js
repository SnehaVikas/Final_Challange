/**
 * Utility to access environment variables consistently across local development (Vite)
 * and production deployment (Cloud Run runtime environment).
 */
export const getEnv = (key) => {
  // Check Vite build-time env first, then fall back to runtime window.__ENV__
  return import.meta.env[key] || window.__ENV__?.[key] || "";
};
