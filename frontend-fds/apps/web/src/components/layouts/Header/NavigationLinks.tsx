'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, FileText } from 'lucide-react';
import type { UserRole } from '../../../types';

interface NavigationLinksProps {
  role: UserRole;
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export function NavigationLinks({ role, isMobile = false, onLinkClick }: NavigationLinksProps) {
  const pathname = usePathname();

  const baseClassName = isMobile
    ? "text-left hover:text-indigo-400 transition-colors py-2 flex items-center space-x-2 w-full"
    : "flex items-center space-x-1 hover:text-indigo-400 transition-colors";

  const activeClassName = "text-indigo-400 font-medium";

  return (
    <>
      <a
        href={process.env.NEXT_PUBLIC_SHOP_URL || 'http://localhost:3032'}
        className={baseClassName}
        onClick={onLinkClick}
      >
        <Store className="w-4 h-4" />
        <span>Store</span>
      </a>


      {role === 'client' && (
        <>
          <Link
            href="/bidding/new"
             className={`${baseClassName} ${pathname === '/bidding/new' ? activeClassName : ''}`}
            onClick={onLinkClick}
          >
            <FileText className="w-4 h-4" />
            <span>Request Quote</span>
          </Link>
          <Link
            href="/dashboard/client"
             className={`${baseClassName} ${pathname === '/dashboard/client' ? activeClassName : ''}`}
            onClick={onLinkClick}
          >
            <span>My Orders</span>
          </Link>
        </>
      )}

      {role === 'provider' && (
        <Link
          href="/dashboard/provider"
           className={`${baseClassName} ${pathname.includes('/provider') ? activeClassName : ''}`}
          onClick={onLinkClick}
        >
          <span>Available Jobs</span>
        </Link>
      )}
    </>
  );
}
