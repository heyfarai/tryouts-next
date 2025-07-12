// Shared logic to get the correct payment amount (with test param override)

export function getPaymentAmount(): number {
  // Default from env
  const defaultAmount = Number(process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_PER_PLAYER) || 3000;

  // Only check window if in browser
  if (typeof window !== 'undefined') {
    try {
      const url = new URL(window.location.href);
      // Root path and any search param triggers discount
      if ((url.pathname === '/' || url.pathname === '') && url.search.length > 1) {
        return 100;
      }
    } catch (e) {
      // fallback to default
    }
  }
  return defaultAmount;
}

// For server-side/Edge (API routes)
export function getPaymentAmountFromUrl(urlString: string): number {
  const defaultAmount = Number(process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_PER_PLAYER) || 3000;
  try {
    const url = new URL(urlString, 'http://dummy');
    if ((url.pathname === '/' || url.pathname === '') && url.search.length > 1) {
      return 100;
    }
  } catch (e) {}
  return defaultAmount;
}
