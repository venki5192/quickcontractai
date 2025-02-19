'use client';

import { useRouter } from 'next/navigation';

interface DashboardNavProps {
  activeTab: string;
}

const DashboardNav = ({ activeTab }: DashboardNavProps) => {
  const router = useRouter();

  return (
    <nav className="hidden md:flex items-center gap-6">
      <a 
        href="/dashboard" 
        className={`text-sm ${activeTab === 'dashboard' ? 'text-white' : 'text-[#8491A5] hover:text-white'} transition-colors`}
      >
        Dashboard
      </a>
      <a 
        href="/dashboard/billing" 
        className={`text-sm ${activeTab === 'billing' ? 'text-white' : 'text-[#8491A5] hover:text-white'} transition-colors`}
      >
        Billing
      </a>
    </nav>
  );
};

export default DashboardNav; 