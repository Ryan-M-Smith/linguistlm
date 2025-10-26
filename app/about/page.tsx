"use client";

import { JSX, useEffect, useRef, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";

interface Feature {
	icon: string;
	title: string;
	description: string;
}

const features: Feature[] = [
	{
		icon: "🗣️",
		title: "Interactive Speaking",
		description: "Practice pronunciation with AI-powered speech recognition and get real-time feedback"
	},
	{
		icon: "📚",
		title: "Reading Comprehension",
		description: "Improve your reading skills with adaptive content that scales with your level"
	},
	{
		icon: "✍️",
		title: "Writing Practice",
		description: "Enhance your writing through AI-assisted corrections and suggestions"
	},
	{
		icon: "🧠",
		title: "AI-Powered Learning",
		description: "Powered by Google's Gemini AI for personalized, intelligent language learning"
	}
];

const benefits: Feature[] = [
	{
		icon: "🎯",
		title: "Personalized Learning Path",
		description: "AI adapts to your pace, identifies strengths and weaknesses, and creates custom lessons"
	},
	{
		icon: "⚡",
		title: "Real-Time Feedback",
		description: "Get instant corrections and suggestions as you practice, learning from mistakes immediately"
	},
	{
		icon: "🌍",
		title: "Multiple Languages",
		description: "Learn multiple languages with consistent, high-quality AI assistance across all platforms"
	}
];

const tips: Feature[] = [
	{
		icon: "💡",
		title: "Practice Daily",
		description: "Consistency is key. Even 15 minutes daily yields better results than sporadic long sessions"
	},
	{
		icon: "🎤",
		title: "Use All Features",
		description: "Combine speaking, reading, and writing practice for comprehensive language mastery"
	},
	{
		icon: "🔄",
		title: "Review Feedback",
		description: "Pay attention to AI corrections and explanations to understand patterns and improve"
	},
	{
		icon: "🎨",
		title: "Experiment",
		description: "Try different conversation topics and writing styles to expand your vocabulary naturally"
	}
];

export default function About(): JSX.Element {
	const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
	const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const observers: IntersectionObserver[] = [];
		
		sectionRefs.current.forEach((section, index) => {
			if (!section) return;
			
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						setVisibleSections(prev => new Set(Array.from(prev).concat([index])));
					}
				},
				{
					threshold: 0.1,
					rootMargin: "0px 0px -100px 0px"
				}
			);
			
			observer.observe(section);
			observers.push(observer);
		});

		return () => {
			observers.forEach(observer => observer.disconnect());
		};
	}, []);

	const isVisible = (index: number) => visibleSections.has(index);

  return (
		<div className="min-h-screen bg-llm-lace">
			{/* Skip to main content link for screen readers */}
			<a 
				href="#main-content" 
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-llm-chinois focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-llm-blue-flower"
			>
				Skip to main content
			</a>
			
			{/* Hero Section */}
			<section aria-label="LinguistLM Introduction" className="relative overflow-hidden bg-gradient-to-br from-llm-chinois via-llm-sea-glass to-llm-blue-flower py-20 px-4">
				<div className="max-w-7xl mx-auto text-center">
					<div className="animate-fade-in-up">
						<Chip 
							color="warning" 
							variant="flat" 
							className="mb-4"
							aria-label="AI-powered language learning tag"
						>
							AI-Powered Language Learning
						</Chip>
						
						<h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
							Your Journey to Fluency
						</h1>
						
						<p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8" role="region" aria-label="Platform description">
							Experience the future of language learning with LinguistLM—an intelligent platform powered by Google's Gemini AI that adapts to your learning style and helps you master languages effortlessly.
						</p>
						
						<div className="flex flex-wrap justify-center gap-4">
							<div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-4">
								<p className="text-white/70 text-sm">Platform</p>
								<p className="text-white font-semibold">Next.js 16</p>
							</div>
							<div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-4">
								<p className="text-white/70 text-sm">AI Model</p>
								<p className="text-white font-semibold">Google Gemini</p>
							</div>
							<div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-4">
								<p className="text-white/70 text-sm">Languages</p>
								<p className="text-white font-semibold">Multiple</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* What is LinguistLM Section */}
			<section 
				ref={el => { sectionRefs.current[0] = el as HTMLDivElement | null; }}
				aria-label="What is LinguistLM"
				className={`py-20 px-4 bg-white transition-all duration-1000 ease-in-out ${
					isVisible(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
				}`}
			>
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<Chip className="mb-4 text-llm-chinois bg-llm-sea-glass/20">
							What is LinguistLM?
						</Chip>
						<h2 className="text-4xl md:text-5xl font-bold text-llm-masala mb-6">
							An AI-Powered Language Learning Platform
						</h2>
						<p className="text-xl text-llm-chinois/70 max-w-3xl mx-auto leading-relaxed">
							LinguistLM is a cutting-edge language learning platform that leverages Google's Gemini AI 
							to provide personalized, interactive language instruction. Whether you want to speak, 
							read, or write in a new language, our AI adapts to your pace and learning style.
            </p>
          </div>
          
					<div id="main-content" className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12" role="region" aria-label="Platform features">
						<Card 
							className="bg-gradient-to-br from-llm-sea-glass/10 to-llm-blue-flower/10 border-2 border-llm-sea-glass/30 hover:scale-105 hover:shadow-xl hover:border-llm-golden/50 transition-all duration-300"
							tabIndex={0}
							role="article"
							aria-label="Speech Practice feature"
						>
							<CardHeader>
								<div className="text-5xl mb-4" aria-hidden="true">🗣️</div>
								<h3 className="text-2xl font-bold text-llm-masala">Speech Practice</h3>
							</CardHeader>
							<CardBody>
								<p className="text-llm-chinois/80">
									Practice real conversations with AI that understands pronunciation, 
									accent, and fluency. Get instant feedback on your speaking skills.
								</p>
							</CardBody>
						</Card>

						<Card 
							className="bg-gradient-to-br from-llm-blue-flower/10 to-llm-chinois/10 border-2 border-llm-blue-flower/30 hover:scale-105 hover:shadow-xl hover:border-llm-golden/50 transition-all duration-300"
							tabIndex={0}
							role="article"
							aria-label="Reading Mastery feature"
						>
							<CardHeader>
								<div className="text-5xl mb-4" aria-hidden="true">📚</div>
								<h3 className="text-2xl font-bold text-llm-masala">Reading Mastery</h3>
							</CardHeader>
							<CardBody>
								<p className="text-llm-chinois/80">
									Improve comprehension with AI-generated content that adapts to your level. 
									Learn vocabulary in context and at your own pace.
								</p>
							</CardBody>
						</Card>

						<Card 
							className="bg-gradient-to-br from-llm-lace to-llm-sea-glass/10 border-2 border-llm-chinois/20 hover:scale-105 hover:shadow-xl hover:border-llm-golden/50 transition-all duration-300"
							tabIndex={0}
							role="article"
							aria-label="Writing Excellence feature"
						>
							<CardHeader>
								<div className="text-5xl mb-4" aria-hidden="true">✍️</div>
								<h3 className="text-2xl font-bold text-llm-masala">Writing Excellence</h3>
							</CardHeader>
							<CardBody>
								<p className="text-llm-chinois/80">
									Enhance your writing skills with AI-powered grammar checks, style suggestions, 
									and personalized corrections tailored to your goals.
								</p>
							</CardBody>
						</Card>

						<Card 
							className="bg-gradient-to-br from-llm-chinois/5 to-llm-blue-flower/10 border-2 border-llm-chinois/20 hover:scale-105 hover:shadow-xl hover:border-llm-golden/50 transition-all duration-300"
							tabIndex={0}
							role="article"
							aria-label="AI Intelligence feature"
						>
							<CardHeader>
								<div className="text-5xl mb-4" aria-hidden="true">🧠</div>
								<h3 className="text-2xl font-bold text-llm-masala">AI Intelligence</h3>
							</CardHeader>
							<CardBody>
								<p className="text-llm-chinois/80">
									Powered by Google Gemini, our AI provides intelligent, context-aware assistance 
									that makes learning natural and effective.
								</p>
							</CardBody>
						</Card>
          </div>
        </div>
			</section>

			{/* Why Was It Created Section */}
			<section 
				ref={el => { sectionRefs.current[1] = el as HTMLDivElement | null; }}
				aria-label="Why LinguistLM Was Created"
				className={`py-20 px-4 bg-gradient-to-b from-llm-lace to-white transition-all duration-1000 ease-in-out ${
					isVisible(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
				}`}
			>
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<Chip className="mb-4 text-llm-chinois bg-llm-sea-glass/20">
							Why LinguistLM Was Created
						</Chip>
						<h2 className="text-4xl md:text-5xl font-bold text-llm-masala mb-6">
							Making Language Learning Accessible and Effective
						</h2>
						<p className="text-xl text-llm-chinois/70 max-w-3xl mx-auto leading-relaxed">
							Traditional language learning often feels rigid, expensive, and disconnected from real-world usage. 
							LinguistLM was created to bridge that gap—combining AI intelligence with personalized 
							learning to make fluency achievable for everyone.
              </p>
            </div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="region" aria-label="Key benefits">
						{benefits.map((benefit, index) => (
							<Card 
								key={index}
								tabIndex={0}
								role="article"
								className={`bg-white border-2 transition-all duration-500 hover:shadow-2xl hover:border-llm-golden/70 transform hover:-translate-y-2 focus-within:outline-2 focus-within:outline-llm-blue-flower focus-within:outline-offset-2 ${
									isVisible(1) 
										? "opacity-100 translate-y-0" 
										: "opacity-0 translate-y-8"
								}`}
								style={{
									transitionDelay: `${index * 100}ms`,
									borderColor: index % 2 === 0 ? "#77C5C5" : "#97E5E5"
								}}
							>
								<CardHeader className="flex flex-col items-center text-center pb-4">
									<div className="text-5xl mb-4 animate-bounce" aria-hidden="true">{benefit.icon}</div>
									<h3 className="text-xl font-bold text-llm-masala">
										{benefit.title}
									</h3>
								</CardHeader>
								<CardBody className="pt-0">
									<p className="text-llm-chinois/70 text-center">
										{benefit.description}
									</p>
								</CardBody>
							</Card>
						))}
            </div>
          </div>
			</section>

			{/* CTA Section */}
			<section 
				className="py-20 px-4 bg-gradient-to-r from-llm-chinois to-llm-sea-glass"
			>
				<div className="max-w-4xl mx-auto text-center" role="region" aria-label="Call to action">
					<h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Ready to Start Learning?
					</h3>
					<p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
						Begin your language journey today with AI-powered personalized instruction
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<a 
							href="/" 
							className="px-8 py-4 bg-white text-llm-chinois font-semibold rounded-lg hover:bg-llm-golden hover:text-llm-masala transition-all duration-300 transform hover:scale-105 focus:outline-2 focus:outline-offset-2 focus:outline-white"
							aria-label="Navigate to home page to get started"
						>
							Get Started
						</a>
						<a 
							href="/speak" 
							className="px-8 py-4 bg-llm-blue-flower text-llm-chinois font-semibold rounded-lg hover:bg-llm-golden hover:text-llm-masala transition-all duration-300 transform hover:scale-105 focus:outline-2 focus:outline-offset-2 focus:outline-white"
							aria-label="Start practicing speaking skills"
						>
							Try Speaking
						</a>
						<a 
							href="/write" 
							className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-llm-golden hover:text-llm-masala border-llm-golden hover:border-transparent transition-all duration-300 transform hover:scale-105 focus:outline-2 focus:outline-offset-2 focus:outline-white"
							aria-label="Start practicing writing skills"
						>
							Start Writing
						</a>
            </div>
          </div>
			</section>
        </div>
  );
}