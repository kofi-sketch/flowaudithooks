'use client';

import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  user: {
    email?: string | null;
  } | null;
}

export function TopBar({ user }: TopBarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/signin');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <header className="h-16 bg-[#2d2d2d] border-b border-[#353535] px-6 flex items-center justify-between">
      {/* Left side - could add breadcrumbs or page title here */}
      <div className="flex-1" />

      {/* Right side - User profile & actions */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            {/* User info */}
            <div className="flex items-center gap-3 px-4 py-2 bg-[#2a2a2a] border border-[#353535] rounded-lg">
              <User className="w-5 h-5 text-[#a0a0a0]" />
              <span className="text-sm text-white">{user.email || 'User'}</span>
            </div>

            {/* Sign out button */}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-[#a0a0a0] bg-transparent border border-[#353535] rounded-lg hover:bg-[#2a2a2a] hover:text-white transition-all duration-150"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
