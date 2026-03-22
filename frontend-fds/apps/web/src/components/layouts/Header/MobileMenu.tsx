'use client';

import { NavigationLinks } from './NavigationLinks';
import type { UserRole } from '../../../types';

interface MobileMenuProps {
  isOpen: boolean;
  role: UserRole;
  onClose: () => void;
  onLogout: () => void;
}

export function MobileMenu({ isOpen, role, onClose, onLogout }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 border-t border-slate-800">
      <nav className="flex flex-col space-y-3 px-2">
        <NavigationLinks role={role} isMobile onLinkClick={onClose} />
        
        {role === 'guest' ? (
          <a href="/login" onClick={onClose} className="bg-indigo-600 text-center text-white px-3 py-2 mt-4 rounded-lg font-medium hover:bg-indigo-700">
            Sign In
          </a>
        ) : (
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="bg-slate-800 text-center text-red-400 px-3 py-2 mt-4 rounded-lg font-medium hover:bg-slate-700"
          >
            Sign Out
          </button>
        )}
      </nav>
    </div>
  );
}
