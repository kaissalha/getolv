import { CTA } from "./components/sections/cta";
import { Disciplines } from "./components/sections/disciplines";
import { Faqs } from "./components/sections/faqs";
import { Features } from "./components/sections/features";
import { Footer } from "./components/sections/footer";
import { Hero } from "./components/sections/hero";
import { HowItWorks } from "./components/sections/how-it-works";
import { Navbar } from "./components/sections/navbar";
import { Pricing } from "./components/sections/pricing";
import { Trust } from "./components/sections/trust";

export default async function Home() {
	return (
		<div className='bg-olive-50'>
			<Navbar />
			<main className='max-w-dvw overflow-x-hidden'>
				<Hero />
				<HowItWorks />
				<Features />
				<Trust />
				<Disciplines />
				<Faqs />
				<Pricing />
				<CTA />
			</main>
			<Footer />
		</div>
	);
}
