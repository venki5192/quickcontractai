'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SubscriptionActions from '@/components/dashboard/Billing/SubscriptionActions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function BillingPage() {
  const { session, isLoading } = useSessionContext();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  useEffect(() => {
    if (!session && !isLoading) {
      router.replace('/sign-in');
      return;
    }

    async function fetchSubscription() {
      if (!session?.user) return;

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .single();

      setSubscriptionData(data);
    }

    fetchSubscription();
  }, [session, isLoading, router, supabase]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(#1D2839 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      }} />
      
      <div className="relative z-10">
        <DashboardHeader userEmail={session.user.email ?? ''} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Billing & Subscription</h1>
            <p className="text-[#8491A5]">Manage your subscription and billing details</p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-8">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-2">Subscription Plans</h2>
                <p className="text-[#8491A5]">Choose the plan that best fits your needs</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Free Plan */}
                <div className={`relative p-6 rounded-lg border ${
                  !subscriptionData ? 'bg-[#1D2839]/10 border-[#1D2839]' : 'bg-[#0A0A0A] border-[#1D2839]'
                }`}>
                  <h3 className="text-xl font-semibold text-white mb-4">Free Plan</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-white">$0</span>
                    <span className="text-[#8491A5]">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-[#8491A5]">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      1 Contract Analysis/month
                    </li>
                    <li className="flex items-center text-[#8491A5]">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Basic Risk Assessment
                    </li>
                    <li className="flex items-center text-[#8491A5]">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      3-Day History
                    </li>
                  </ul>
                  {!subscriptionData && (
                    <div className="text-center text-sm text-[#8491A5] bg-[#1D2839]/20 py-1 rounded-full">
                      Current Plan
                    </div>
                  )}
                </div>

                {/* Pro Plan */}
                <div className={`relative p-6 rounded-lg border ${
                  subscriptionData ? 'bg-[#1D2839]/10 border-blue-500' : 'bg-blue-500/5 border-blue-500/20'
                }`}>
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-blue-500 text-white text-xs rounded-full">
                    Recommended
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Pro Plan</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-white">$29</span>
                    <span className="text-[#8491A5]">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-[#8491A5]">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      10 Contract Analyses/month
                    </li>
                    <li className="flex items-center text-[#8491A5]">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Advanced Risk Assessment
                    </li>
                    <li className="flex items-center text-[#8491A5]">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Priority Processing
                    </li>
                    <li className="flex items-center text-[#8491A5]">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      30-Day History
                    </li>
                  </ul>
                  <SubscriptionActions 
                    isSubscribed={!!subscriptionData} 
                    currentPeriodEnd={subscriptionData?.current_period_end || null}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 