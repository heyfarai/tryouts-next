// Utility to get absolute URLs sitewide (for meta tags, emails, etc.)

/**
 * Returns the absolute URL for a given path, using NEXT_PUBLIC_SITE_URL if available,
 * else falls back to window.location.origin (client-side), or a default domain.
 * @param path The path, e.g. "/social-image.jpg" or "/"
 * @param opts Optional: override siteUrl or default fallback
 */
// Accepts optional req for server-side, works on client too
export function getAbsoluteUrl(
  path: string = "/",
  opts?: {
    siteUrl?: string;
    fallback?: string;
    req?: any; // NextRequest, Node request, or similar
  }
): string {
  let siteUrl = opts?.siteUrl;

  if (!siteUrl) {
    if (typeof window !== "undefined") {
      // Client side
      siteUrl = window.location.origin;
    } else if (opts?.req) {
      // Server side with request object
      const req = opts.req;
      // Next.js 13/14 API route: req.headers.get('host') and req.nextUrl.protocol
      // Node: req.headers.host
      const host = req.headers?.get
        ? req.headers.get("host")
        : req.headers?.host;
      const protocol = req.headers?.get
        ? req.nextUrl?.protocol?.replace(":", "") || "https"
        : req.connection?.encrypted
        ? "https"
        : "http";
      if (host) {
        siteUrl = `${protocol}://${host}`;
      }
    }
    if (!siteUrl) {
      // Fallback to env or default
      siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        opts?.fallback ||
        "http://localhost:3000";
    }
  }
  return (
    siteUrl.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path)
  );
}

