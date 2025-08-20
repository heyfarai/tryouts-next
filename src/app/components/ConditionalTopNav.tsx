'use client';

import { usePathname } from 'next/navigation';
import TopNav from './TopNav';

export function ConditionalTopNav() {
  const pathname = usePathname();
  
  // Hide TopNav on admin pages
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }
  
  return <TopNav />;
}
