const features = [
  {
    title: "Employment Contracts",
    description: "Review employment terms, compensation, and non-compete clauses."
  },
  {
    title: "NDAs & Confidentiality",
    description: "Analyze confidentiality agreements and identify potential risks."
  },
  {
    title: "Service Agreements",
    description: "Evaluate service terms, SLAs, and liability clauses."
  },
  {
    title: "Real Estate Leases",
    description: "Review lease terms, obligations, and tenant responsibilities."
  },
  {
    title: "Sales Contracts",
    description: "Analyze purchase agreements, warranties, and payment terms."
  },
  {
    title: "Partnership Agreements",
    description: "Review profit sharing, responsibilities, and exit clauses."
  }
];

const Features = () => {
  return (
    <section id="features" className="relative py-24 md:py-32 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="relative inline-block mb-16">
          <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur-xl" />
          <div className="relative px-4 py-2 bg-[#0A0A0A] rounded-full text-sm text-[#8491A5] border border-[#1D2839]">
            <span className="flex items-center gap-2">
              Supported Documents
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-20 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#93C5FD] via-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent">
              Analyze Any Legal <br /> Document Type
            </span>
          </h2>
          <p className="text-[#8491A5] text-lg max-w-2xl">
            From employment contracts to complex business agreements, our AI helps you understand the fine print.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-300" />
              
              <div className="relative p-6 rounded-2xl border border-[#1D2839] bg-[#0A0A0A] group-hover:border-blue-500/50 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-[#8491A5]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 