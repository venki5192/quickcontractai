"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const router = useRouter();

  return (
    <section className="relative py-24 md:py-32 px-4" id="pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Reduced gap after the tag */}
        <div className="flex justify-center mb-8">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur-xl" />
            <div className="relative px-4 py-2 bg-[#0A0A0A] rounded-full text-sm text-[#8491A5] border border-[#1D2839]">
              <span className="flex items-center gap-2">
                
                Pricing Plans
              </span>
            </div>
          </div>
        </div>

        {/* Reduced gaps between title and description */}
        <div className="flex flex-col items-center gap-4 mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#93C5FD] via-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent">
              Simple, transparent pricing
            </span>
          </h2>
          <p className="text-[#8491A5] text-lg max-w-2xl text-center">
            No hidden fees, no surprises. Choose the plan that works best for you.
          </p>
        </div>

        {/* Reduced gap before toggle */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-[#8491A5]'}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-12 h-6 bg-[#1D2839] rounded-full p-1 transition-colors hover:bg-[#2D3849]"
          >
            <div className={`w-4 h-4 bg-blue-500 rounded-full transition-transform ${isAnnual ? 'translate-x-6' : ''}`} />
          </button>
          <span className={`text-sm ${isAnnual ? 'text-white' : 'text-[#8491A5]'}`}>
            Annual <span className="text-blue-500 text-xs ml-1">Save 20%</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border ${
                plan.popular ? 'border-blue-500' : 'border-[#1D2839]'
              } bg-[#0A0A0A] hover:border-blue-500/50 transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur-lg" />
                    <span className="relative px-4 py-1 bg-blue-500 text-white text-sm rounded-full">
                      Most Popular
                    </span>
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-2 text-[#8491A5]">{plan.description}</p>
                
                <div className="mt-6">
                  <span className="text-4xl font-bold text-white">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-[#8491A5]">
                    /{isAnnual ? 'year' : 'month'}
                  </span>
                </div>

                <button 
                onClick={() => router.push('/sign-in')}
                className={`mt-8 w-full py-3 px-4 rounded-full font-medium ${
                  plan.name === 'Enterprise' 
                    ? 'border border-[#1D2839] text-[#8491A5] hover:bg-[#1D2839]/50'
                    : plan.popular 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'border border-[#1D2839] text-[#8491A5] hover:bg-[#1D2839]/50'
                } transition-colors`}>
                  {plan.name === 'Enterprise' ? 'Contact Us' : 'Get Started'}
                </button>

                <ul className="mt-8 space-y-4 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-[#8491A5]">
                      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const pricingPlans = [
  {
    name: "Free",
    description: "For individual users",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      "1 Contract Analysis/month",
      "Basic Risk Assessment",
      "Standard AI Model",
      "PDF & Word Support",
      "Community Support",
      "3-Day History"
    ],
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_FREE_PRICE_ID
  },
  {
    name: "Professional",
    description: "For professionals & small teams",
    monthlyPrice: 29,
    annualPrice: 279,
    features: [
      "10 Contract Analyses/month",
      "Advanced Risk Assessment",
      "AI Model Selection",
      "Priority Processing",
      "Report Export",
      "Email Support",
      "30-Day History",
      "Team Sharing"
    ],
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    monthlyPrice: null,
    annualPrice: null,
    features: [
      "Unlimited Analyses",
      "Custom AI Model Training",
      "Batch Processing",
      "API Access",
      "Custom Integration",
      "Advanced Analytics",
      "Unlimited History",
      "24/7 Support",
      "Dedicated Account Manager"
    ],
    popular: false,
    priceId: null // No Stripe integration for Enterprise
  }
];

export default Pricing; 