// Utility for environment checks

/**
 * Returns true if NODE_ENV is development or preview (e.g. Vercel preview deploys)
 */
export function isDevOrPreviewEnv(): boolean {
  const env = String(process.env.NODE_ENV);
  return ["development", "preview"].includes(env);
}
