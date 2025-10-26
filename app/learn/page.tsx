"use client";

import { JSX, useState } from "react";
import { Button } from "@heroui/button";

export default function Onboarding(): JSX.Element {
	const [selectedLanguage, setSelectedLanguage] = useState<string>("");
	const [selectedArea, setSelectedArea] = useState<string>("");

	const languages = [
		{ code: "es", name: "Spanish", flag: "🇪🇸" },
		{ code: "fr", name: "French", flag: "🇫🇷" },
		{ code: "de", name: "German", flag: "🇩🇪" },
		{ code: "it", name: "Italian", flag: "🇮🇹" },
		{ code: "ja", name: "Japanese", flag: "🇯🇵" },
		{ code: "zh", name: "Mandarin", flag: "🇨🇳" },
		{ code: "ko", name: "Korean", flag: "🇰🇷" },
		{ code: "pt", name: "Portuguese", flag: "🇵🇹" },
		{ code: "ru", name: "Russian", flag: "🇷🇺" },
		{ code: "ar", name: "Arabic", flag: "🇸🇦" },
		{ code: "hi", name: "Hindi", flag: "🇮🇳" },
		{ code: "other", name: "Other", flag: "🌍" },
	];

	const learningAreas = [
		{
			id: "read",
			title: "Read",
			icon: "📖",
			description: "Build comprehension with curated texts and real-world articles. Get instant translations and practice at your own pace.",
		},
		{
			id: "write",
			title: "Write",
			icon: "✍️",
			description: "Get instant feedback on grammar, vocabulary, and style. Practice everything from casual messages to formal essays.",
		},
		{
			id: "speak",
			title: "Speak",
			icon: "💬",
			description: "Have real conversations with AI that responds naturally. Practice pronunciation and build conversational fluency.",
		},
	];

	const canProceed = selectedLanguage && selectedArea;

	return (
		<div className="flex flex-col items-center w-full min-h-full bg-llm-lace dark:bg-default-50 overflow-y-auto">
			<div className="max-w-4xl w-full px-6 py-12 space-y-12">
				
				{/* Header */}
				<div className="text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
						Let's Get <span className="text-llm-chinois">Started</span>
					</h1>
					<p className="text-default-600 text-base">
						Choose your language and learning area to begin your journey
					</p>
				</div>

				{/* Step 1: Select Language */}
				<section>
					<div className="mb-4">
						<h2 className="text-xl font-bold text-foreground mb-1">
							Step 1: Select Your Language
						</h2>
						<p className="text-sm text-default-600">
							Which language would you like to learn?
						</p>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
						{languages.map((lang) => (
							<button
								key={lang.code}
								onClick={() => setSelectedLanguage(lang.code)}
								className={`
									p-4 rounded-xl text-center transition-all border-2
									${selectedLanguage === lang.code
										? "bg-llm-chinois border-llm-chinois shadow-lg scale-105"
										: "bg-default-100 dark:bg-default-100 border-default-200 hover:border-llm-sea-glass hover:shadow-md"
									}
								`}
							>
								<div className="text-3xl mb-2">{lang.flag}</div>
								<p className={`text-sm font-semibold ${
									selectedLanguage === lang.code ? "text-primary-foreground" : "text-foreground"
								}`}>
									{lang.name}
								</p>
							</button>
						))}
					</div>
				</section>

				{/* Step 2: Select Learning Area */}
				<section>
					<div className="mb-4">
						<h2 className="text-xl font-bold text-foreground mb-1">
							Step 2: Choose Your Learning Area
						</h2>
						<p className="text-sm text-default-600">
							What would you like to practice today?
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-4">
						{learningAreas.map((area) => (
							<button
								key={area.id}
								onClick={() => setSelectedArea(area.id)}
								className={`
									p-6 rounded-2xl text-left transition-all border-4
									${selectedArea === area.id
										? "bg-llm-sea-glass/40 border-llm-chinois shadow-xl scale-105"
										: "bg-default-100 dark:bg-default-100 border-default-200 hover:border-llm-sea-glass hover:shadow-lg"
									}
								`}
							>
								<div className="text-4xl mb-3">{area.icon}</div>
								<h3 className="text-lg font-bold text-foreground mb-2">{area.title}</h3>
								<p className="text-sm text-default-700 leading-relaxed">
									{area.description}
								</p>
							</button>
						))}
					</div>
				</section>

				{/* Step 3: Go Button */}
				<section className="flex flex-col items-center pt-6">
					<Button
						size="lg"
						disabled={!canProceed}
						className={`
							px-12 py-6 text-lg font-semibold rounded-full transition-all
							${canProceed
								? "bg-llm-chinois text-primary-foreground hover:shadow-2xl hover:scale-105"
								: "bg-default-200 text-default-500 cursor-not-allowed"
							}
						`}
						onPress={() => {
							if (canProceed) {
								console.log("Selected:", { language: selectedLanguage, area: selectedArea });
								// Navigate to the selected learning area
								// e.g., router.push(`/${selectedArea}?lang=${selectedLanguage}`);
							}
						}}
					>
						{canProceed ? "Let's Go! 🚀" : "Select Language & Area"}
					</Button>
					{canProceed && (
						<p className="text-xs text-default-500 mt-3">
							Ready to start learning {languages.find(l => l.code === selectedLanguage)?.name}!
						</p>
					)}
				</section>

			</div>
		</div>
	);
}