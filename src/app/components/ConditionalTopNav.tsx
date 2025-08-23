'use client';

import { usePathname } from 'next/navigation';
import TopNav from './TopNav';

export function ConditionalTopNav() {
  const pathname = usePathname() || '';
  
  // Hide TopNav on admin and check-in pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/checkin')) {
    return null;
  }
  
  return <TopNav />;
}
