// Shared logic to get the correct payment amount (with test param override)

export function getPaymentAmount(): number {
  // Default from env
  const defaultAmount = Number(process.env.NEXT_PUBLIC_PAYMENT_AMOUNT_PER_PLAYER) || 3000;

  // Only check window if in browser
  if (typeof window !== 'undefined') {
    try {
      const url = new URL(window.location.href);
      // Only specific discount codes trigger reduced price
      const discountCode = url.searchParams.get('discount');
      if (discountCode === 'EARLY_BIRD_2024') {
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
    // Only specific discount codes trigger reduced price
    const discountCode = url.searchParams.get('discount');
    if (discountCode === 'EARLY_BIRD_2024') {
      return 100;
    }
  } catch (e) {}
  return defaultAmount;
}
