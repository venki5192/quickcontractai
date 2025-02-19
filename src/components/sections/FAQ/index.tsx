"use client";
import { useState } from "react";

const FAQ = () => {
  return (
    <section id="faq" className="relative py-24 md:py-32 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header with glowing tag */}
        {/* <div className="flex justify-center mb-8">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur-xl" />
            <div className="relative px-4 py-2 bg-[#0A0A0A] rounded-full text-sm text-[#8491A5] border border-[#1D2839]">
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-500" fill="currentColor">
                  <path d="M12.0001 4.28907L8.47508 7.81407L9.88908 9.22807L11.9991 7.11807L14.1091 9.22807L15.5231 7.81407L12.0001 4.28907ZM3.28008 12L12.0001 3.28007L20.7201 12L12.0001 20.72L3.28008 12Z" />
                </svg>
                FAQ
              </span>
            </div>
          </div>
        </div> */}

        <div className="flex flex-col items-center gap-4 mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#93C5FD] via-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent">
              Frequently asked questions
            </span>
          </h2>
          <p className="text-[#8491A5] text-lg max-w-2xl">
            Everything you need to know about the product and billing.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQItem = ({ faq }: { faq: { question: string; answer: string } }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      onClick={() => setIsOpen(!isOpen)}
      className="group select-none"
    >
      <div className={`relative p-5 rounded-xl bg-[#0A0A0A] border ${
        isOpen ? 'border-blue-500 bg-blue-500/5' : 'border-[#1D2839]'
      } transition-all duration-200 active:scale-[0.99]`}>
        {/* Question header */}
        <div className="flex items-center justify-between gap-4">
          <h3 className={`text-base ${isOpen ? 'text-blue-500' : 'text-white'}`}>
            {faq.question}
          </h3>
          <svg 
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-500' : 'text-[#8491A5]'
            }`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Collapsible answer */}
        <div 
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            isOpen ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <p className="text-[#8491A5] text-sm">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const faqs = [
  {
    question: "How accurate is the AI contract analysis?",
    answer: "Our AI system provides highly accurate analysis using advanced language models. It evaluates contracts across multiple dimensions including legal compliance, risk assessment, and enforceability, with a consistent scoring system from 0-100."
  },
  {
    question: "What types of contracts can be analyzed?",
    answer: "Our system can analyze various contract types including employment agreements, NDAs, service agreements, lease contracts, and more. The AI is trained to understand legal terminology and standard contract structures."
  },
  {
    question: "How long does the analysis take?",
    answer: "Most contract analyses are completed within 1-2 minutes. The exact time depends on the contract length and complexity, but our system is optimized for quick, thorough analysis."
  },
  {
    question: "Is my contract data secure?",
    answer: "Yes, we take data security seriously. All contracts are encrypted, processed securely, and automatically deleted after analysis. We never store the original contract text, only the analysis results."
  },
  {
    question: "What information does the analysis provide?",
    answer: "Each analysis includes a detailed risk assessment, numerical score, specific clause recommendations, compliance checks, and potential legal issues. The report is comprehensive yet easy to understand."
  }
];

export default FAQ; 