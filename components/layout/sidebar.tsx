'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TestTube, Bookmark, BarChart3, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Test Interface', href: '/test', icon: TestTube },
  { name: 'Saved Hooks', href: '/saved', icon: Bookmark },
  { name: 'Analytics', href: '/admin', icon: BarChart3 },
  { name: 'Settings', href: '#', icon: Settings, disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo/Branding */}
      <div className="px-6 py-8">
        <h1 className="text-xl font-semibold text-white">Hook Tester</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.disabled ? '#' : item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium
                transition-all duration-150 ease-in-out
                ${isActive
                  ? 'bg-[#3a3a3a] text-white'
                  : 'text-[#a0a0a0] hover:bg-[#3a3a3a] hover:text-white'
                }
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              aria-disabled={item.disabled}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#353535]">
        <p className="text-xs text-[#6b6b6b]">Hook Tester v1.0</p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#2d2d2d] border border-[#353535] text-white"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-60 bg-[#2a2a2a] border-r border-[#353535] h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`
          lg:hidden fixed inset-y-0 left-0 z-40 w-60 bg-[#2a2a2a] border-r border-[#353535]
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full pt-16">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
