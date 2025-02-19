"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const supabase = createClientComponentClient();
	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			const { data: { session } } = await supabase.auth.getSession();
			setIsLoggedIn(!!session);
		};

		checkAuth();

		// Listen for auth state changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			setIsLoggedIn(!!session);
		});

		return () => subscription.unsubscribe();
	}, [supabase]);

	const authButton = {
		text: isLoggedIn ? 'Dashboard' : 'Login',
		href: isLoggedIn ? '/dashboard' : '/sign-in',
	};

	const navLinks = [
		{ text: 'Features', id: 'features' },
		{ text: 'Pricing', id: 'pricing' },
		{ text: 'FAQ', id: 'faq' }
	];

	const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
		e.preventDefault();
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
			setIsOpen(false); // Close mobile menu after clicking
		}
	};

	return (
		<nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-sm border-b border-[#1D2839]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-20">
					{/* Logo */}
					<Link href="/" className="text-2xl font-bold text-white">
						QuickContractAI
					</Link>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center gap-8">
						{/* Navigation Links */}
						<div className="flex items-center gap-8">
							{navLinks.map((item) => (
								<a
									key={item.id}
									href={`#${item.id}`}
									onClick={(e) => handleScroll(e, item.id)}
									className="text-[#8491A5] hover:text-white transition-colors text-sm"
								>
									{item.text}
								</a>
							))}
						</div>

						{/* Auth Button */}
						<Link 
							href={authButton.href}
							className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/90 transition-colors text-sm font-medium"
						>
							{authButton.text}
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<button 
						className="md:hidden p-2"
						onClick={() => setIsOpen(!isOpen)}
					>
						<div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
						<div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${isOpen ? 'opacity-0' : ''}`} />
						<div className={`w-6 h-0.5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			<div className={`md:hidden border-t border-[#1D2839] transition-all ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
				<div className="px-4 py-4 space-y-4">
					{navLinks.map((item) => (
						<a
							key={item.id}
							href={`#${item.id}`}
							onClick={(e) => handleScroll(e, item.id)}
							className="block text-[#8491A5] hover:text-white transition-colors text-sm"
						>
							{item.text}
						</a>
					))}
					<Link 
						href={authButton.href}
						className="block text-[#8491A5] hover:text-white transition-colors text-sm"
					>
						{authButton.text}
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
