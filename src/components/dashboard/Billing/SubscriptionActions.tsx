'use client';

import { formatDate } from '@/lib/utils';

interface SubscriptionActionsProps {
  isSubscribed: boolean;
  currentPeriodEnd: string | null;
}

export default function SubscriptionActions({ isSubscribed, currentPeriodEnd }: SubscriptionActionsProps) {
  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/manage-subscription');
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreateCheckoutSession = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isSubscribed) {
    return (
      <div className="space-y-2">
        {currentPeriodEnd && (
          <p className="text-sm text-[#8491A5]">
            Next billing date: {formatDate(currentPeriodEnd)}
          </p>
        )}
        <button
          onClick={handleManageSubscription}
          className="w-full px-4 py-2 border border-[#1D2839] rounded-full text-white hover:bg-[#1D2839]/10 transition-colors"
        >
          Manage Subscription
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleCreateCheckoutSession}
      className="w-full px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
    >
      Upgrade to Pro
    </button>
  );
} 