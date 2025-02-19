const Footer = () => {
	return (
		<footer className="border-t border-[#1D2839] bg-black">
			<div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					<div className="col-span-2 md:col-span-1">
						<span className="text-xl font-bold text-white">QuickContractAI</span>
						<p className="mt-4 text-[#8491A5] text-sm">
							AI-powered contract analysis platform for modern businesses.
						</p>
					</div>
					
					<div>
						<h3 className="text-white font-semibold mb-4">Product</h3>
						<ul className="space-y-3">
							{['Features', 'Pricing', 'How it Works'].map((item) => (
								<li key={item}>
									<a href={`/#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-[#8491A5] hover:text-white transition-colors text-sm">
										{item}
									</a>
								</li>
							))}
						</ul>
					</div>
					
					<div>
						<h3 className="text-white font-semibold mb-4">Company</h3>
						<ul className="space-y-3">
							{['About', 'Contact', 'FAQ'].map((item) => (
								<li key={item}>
									<a href={`/#${item.toLowerCase()}`} className="text-[#8491A5] hover:text-white transition-colors text-sm">
										{item}
									</a>
								</li>
							))}
						</ul>
					</div>
					
					<div>
						<h3 className="text-white font-semibold mb-4">Legal</h3>
						<ul className="space-y-3">
							{['Privacy Policy', 'Terms of Service'].map((item) => (
								<li key={item}>
									<a href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-[#8491A5] hover:text-white transition-colors text-sm">
										{item}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>
				
				<div className="mt-8 pt-8 border-t border-[#1D2839]">
					<p className="text-[#8491A5] text-sm">
						© 2024 QuickContractAI. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
