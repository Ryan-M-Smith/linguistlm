"use client";

import { JSX, useRef } from "react";
import Image from "next/image";
import { RiNextjsFill, RiReactjsFill, RiGeminiFill, RiTailwindCssFill } from "react-icons/ri";
import { SiNextui, SiElevenlabs } from "react-icons/si";

export default function About(): JSX.Element {
	const carouselRef = useRef<HTMLDivElement | null>(null);
	const techRef = useRef<HTMLDivElement | null>(null);

	const scrollBy = (distance: number, ref = carouselRef) => {
		if (!ref?.current) return;
		ref.current.scrollBy({ left: distance, behavior: "smooth" });
	};

	// scroll helpers that clamp to bounds so prev/next reach the true start/end
	const scrollPrev = (ref = carouselRef) => {
		if (!ref?.current) return;
		const el = ref.current;
		const delta = Math.floor(el.clientWidth * 0.7);
		const target = el.scrollLeft <= delta ? 0 : el.scrollLeft - delta;
		el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
	};

	const scrollNext = (ref = carouselRef) => {
		if (!ref?.current) return;
		const el = ref.current;
		const delta = Math.floor(el.clientWidth * 0.7);
		const maxLeft = el.scrollWidth - el.clientWidth;
		const target = el.scrollLeft + delta >= maxLeft ? maxLeft : el.scrollLeft + delta;
		el.scrollTo({ left: Math.min(maxLeft, target), behavior: "smooth" });
	};

	return (
		<div className="flex flex-col items-center w-full min-h-full bg-llm-lace dark:bg-default-50">
			<div className="max-w-5xl w-full px-6 py-12 space-y-16">
				
				{/* Header */}
				<div className="text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
						About <span className="text-llm-chinois">LinguistLM</span>
					</h1>
					<p className="text-default-600 text-base max-w-2xl mx-auto">
						We're building AI-powered language learning tools to make fluency accessible to everyone.
					</p>
				</div>

				{/* Team Section */}
				<section>
					<h2 className="text-2xl font-bold text-foreground mb-6 text-center">Our Team</h2>
					<div className="relative">
						{/* Prev button */}
						<button
							type="button"
							aria-label="Previous"
							className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-default-100 shadow-md hover:bg-default-200"
							onClick={() => scrollPrev(carouselRef)}
						>
							‹
						</button>

						{/* Carousel */}
						<div
							ref={carouselRef}
							className="flex gap-8 overflow-x-auto py-4 px-14 scroll-smooth snap-x snap-mandatory"
							style={{ scrollPaddingInline: '3.5rem' }}
						>
							{/* each card: min-width prevents wrapping and makes a single-row carousel */}
							{[
								{ src: "/smith_ryan_m.jpg", name: "Ryan Smith", role: "10x Dev", description: "We think he's a wizard" },
								{ src: "/ramsey_simon_a.jpg", name: "Simon Ramsey", role: "5x Dev", description: "Zoned out probably" },
								{ src: "/lunsford_shania_l.jpg", name: "Shania Lunsford", role: "1x Dev", description: "She means business" },
								{ src: "/pokharel_spriha_.jpg", name: "Spriha Pokharel", role: "1x Dev", description: "Fearless leader" },
								{ src: "/kommi_adithya_.jpg", name: "Adithya Kommi", role: "Is he a dev?", description: "Big vibes guy" },
							].map((m) => (
								<div
									key={m.name}
									className="snap-start shrink-0 w-72 bg-default-100 dark:bg-default-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all"
								>
									<div className="w-32 h-32 bg-llm-sea-glass rounded-full mx-auto mb-4 overflow-hidden">
										<Image src={m.src} alt={m.name} width={128} height={128} className="w-full h-full object-cover" />
									</div>
									<h3 className="text-lg font-semibold text-foreground mb-1">{m.name}</h3>
									<p className="text-sm text-llm-chinois mb-2">{m.role}</p>
									<p className="text-xs text-default-600">{m.description}</p>
								</div>
							))}
						</div>

						{/* Next button */}
						<button
							type="button"
							aria-label="Next"
							className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-default-100 shadow-md hover:bg-default-200"
							onClick={() => scrollNext(carouselRef)}
						>
							›
						</button>
					</div>
                 </section>
 
                 {/* Mission Statement - Optional lightweight section */}
                 <section className="bg-llm-sea-glass/30 dark:bg-default-100 rounded-2xl p-8 text-center">
                     <h2 className="text-xl font-bold text-foreground mb-3">Our Mission</h2>
                     <p className="text-default-700 max-w-3xl mx-auto leading-relaxed">
                         Making language learning natural, accessible, and effective through AI technology.
                     </p>
                 </section>
 
				{/* Tech Stack Section (carousel) */}
				<section>
					<h2 className="text-2xl font-bold text-foreground mb-6 text-center">Built With</h2>
					<div className="relative">
						<button
							type="button"
							aria-label="Prev tech"
							className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-default-100 shadow-md hover:bg-default-200"
							onClick={() => scrollPrev(techRef)}
						>
							‹
						</button>

						<div
							ref={techRef}
							className="flex gap-6 overflow-x-auto py-4 px-14 scroll-smooth snap-x snap-mandatory"
							style={{ scrollPaddingInline: '3.5rem' }}
						>
							{[
								{ icon: <RiReactjsFill size={36} />, label: "React" },
								{ icon: <RiNextjsFill size={36} />, label: "Next.js" },
								{ icon: <RiGeminiFill size={36} />, label: "Gemini" },
								{ icon: <RiTailwindCssFill size={36} />, label: "Tailwind" },
								{ icon: <SiNextui size={36} />, label: "NextUI" },
								{ icon: <SiElevenlabs size={36} />, label: "ElevenLabs" },
							].map((t) => (
								<div key={t.label} className="snap-start shrink-0 w-48 bg-llm-blue-flower/10 dark:bg-default-100 border-2 border-default-200 rounded-xl p-6 text-center hover:border-llm-sea-glass hover:shadow-lg transition-all">
									<div className="mb-3 flex items-center justify-center">{t.icon}</div>
									<p className="text-sm font-semibold text-foreground">{t.label}</p>
								</div>
							))}
						</div>

						<button
							type="button"
							aria-label="Next tech"
							className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-default-100 shadow-md hover:bg-default-200"
							onClick={() => scrollNext(techRef)}
						>
							›
						</button>
					</div>
				</section>
			</div>
		</div>
	);
}