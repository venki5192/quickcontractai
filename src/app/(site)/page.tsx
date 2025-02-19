"use client";

import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
	return (
		<main className="min-h-screen bg-black">
			<Navbar />
			<Hero />
			<Features />
			<Pricing />
			<FAQ />
			<Footer />
		</main>
	);
}
