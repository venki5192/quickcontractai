"use client";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen pt-20 md:pt-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center max-w-7xl mx-auto w-full">
        {/* Header tag with blue glow */}
        <div className="relative">
          {/* Blue glow effect */}
          <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur-xl" />
          
          <div className="relative px-4 py-2 bg-[#0A0A0A] rounded-full text-sm text-[#8491A5] border border-[#1D2839]">
            <span className="flex items-center gap-2">
              AI-Powered Contract Analysis
            </span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-[#93C5FD] via-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent">
          Uncover Hidden <br />
          Clauses  with AI
          </span>
        </h1>
        
        <p className="text-[#8491A5] text-lg md:text-xl max-w-2xl">
          Analyze contracts instantly with AI. Get detailed risk assessments, compliance checks, and recommendations in minutes.
        </p>

        <div className="flex flex-row items-center gap-4 w-full justify-center">
          <a 
            href="/sign-in"
            className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-white text-black hover:bg-white/90 transition-colors text-sm md:text-base"
          >
            Start Analysis
          </a>
          <button className="px-6 md:px-8 py-3 md:py-4 rounded-full border border-[#1D2839] text-[#8491A5] hover:bg-white/5 transition-colors text-sm md:text-base">
          <a 
            href="/#faq"
          
          >
          Read FAQ
          </a>
          </button>
        </div>

        {/* Larger Dashboard Preview */}
        <div className="relative w-[85%] md:w-[80%] mt-16">
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-[#0F1117] border border-[#1D2839]">
            <div className="absolute inset-0 bg-[#0F1117]" />
            
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `radial-gradient(#1D2839 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent" />
          </div>

          {/* Enhanced glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500/5 to-transparent blur-2xl opacity-50" />
        </div>
      </div>
    </section>
  );
};

export default Hero; 