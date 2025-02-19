'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import DashboardNav from './DashboardNav';

interface DashboardHeaderProps {
  userEmail: string;
}

const DashboardHeader = ({ userEmail }: DashboardHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  
  const getActiveTab = () => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname === '/dashboard/billing') return 'billing';
    return 'dashboard';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/sign-in');
  };

  return (
    <header className="border-b border-[#1D2839] bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a 
            href="/dashboard" 
            className="text-white font-bold hover:text-blue-400 transition-colors"
          >
            QuickContractAI
          </a>
          <DashboardNav activeTab={getActiveTab()} />
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-[#8491A5]">{userEmail}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-[#8491A5] hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden border-t border-[#1D2839] transition-all ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
        <div className="px-4 py-4 space-y-4">
          <a 
            href="/dashboard" 
            className={`block text-sm ${getActiveTab() === 'dashboard' ? 'text-white' : 'text-[#8491A5]'}`}
          >
            Dashboard
          </a>
          <a 
            href="/dashboard/billing" 
            className={`block text-sm ${getActiveTab() === 'billing' ? 'text-white' : 'text-[#8491A5]'}`}
          >
            Billing
          </a>
          <div className="pt-4 border-t border-[#1D2839]">
            <span className="block text-sm text-[#8491A5] mb-4">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-[#8491A5] hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;