"use client";

import { JSX } from "react";
import Link from "next/link";

export default function Onboarding(): JSX.Element {
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

	return (
		<div className="flex flex-col items-center w-full min-h-full bg-llm-lace dark:bg-default-50 overflow-y-auto">
			<div className="max-w-4xl w-full px-6 py-12 space-y-12">

				{/* Header */}
				<div className="text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
						Choose a <span className="text-llm-chinois">Learning Area</span>
					</h1>
					<p className="text-default-600 text-base">
						Pick one of the areas below to go straight to that practice page.
					</p>
				</div>

				{/* Learning Areas */}
				<section>
					<div className="grid md:grid-cols-3 gap-4">
						{learningAreas.map((area) => (
							<div
								key={area.id}
								className={
									`p-6 rounded-2xl text-left transition-all border-4 bg-default-100 dark:bg-default-100 border-default-200 hover:border-llm-sea-glass hover:shadow-lg`
								}
							>
              <Link href={`/${area.id}`}>
								<div className="text-4xl mb-3">{area.icon}</div>
								<h3 className="text-lg font-bold text-foreground mb-2">{area.title}</h3>
								<p className="text-sm text-default-700 leading-relaxed mb-4">
									{area.description}
								</p>
								</Link>
							</div>
						))}
					</div>
				</section>

			</div>
		</div>
	);
}