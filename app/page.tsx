import { JSX } from "react";
import { Divider } from "@heroui/divider";

/**
 * Home page (combined)
 *
 * The sections previously separated into small components have been combined
 * into this single `Home` component at your request to reduce fragmentation.
 * The markup, classNames and content are preserved.
 */

export default function Home(): JSX.Element {
    return (
        <div className="overflow-x-hidden relative">

            {/* Combined sections: hero -> features -> languages -> how it works -> cta/footer */}

            <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 snap-y snap-mandatory bg-llm-sea-glass">

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            Master Any Language with <span className="text-llm-chinois">AI-Powered</span> Learning
                        </h1>

                        <div className="bg-default-50 border-4 border-llm-chinois rounded-xl p-4 mb-6">
                            <p className="text-lg md:text-xl text-foreground leading-relaxed">
                                Learn to read, write, and speak with confidence. Get personalized AI tutoring in dozens of languages, anytime, anywhere.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a href="#" className="bg-llm-chinois text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all">Start Learning Free</a>
                            <a href="#how-it-works" className="bg-default-100 text-foreground px-8 py-4 rounded-full font-semibold text-lg border-2 border-default-200 hover:bg-default-200 transition-all">Explore Features</a>
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <div className="bg-default-50 rounded-3xl p-8 shadow-lg max-w-md w-full fade-in-up border-llm-sea-glass border-2">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-default-200">
                                <div className="w-14 h-14 bg-llm-chinois rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">AI</div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Your French Tutor</h3>
                                    <p className="text-default-500 text-sm flex items-center gap-1">
                                        <span className="w-2 h-2 bg-success rounded-full inline-block"></span>
                                        Live conversation
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-default-100 p-4 rounded-2xl slide-in">
                                    <p className="text-foreground">Bonjour! Let's practice introducing yourself. Try saying "My name is..." in French.</p>
                                </div>
                                <div className="bg-llm-chinois text-primary-foreground p-4 rounded-2xl ml-8 slide-in">
                                    <p>Je m'appelle Sarah. Enchanté!</p>
                                </div>
                                <div className="bg-default-100 p-4 rounded-2xl slide-in">
                                    <p className="text-foreground">Excellent! Your pronunciation is great. Now let's practice asking someone their name...</p>
                                </div>
                                <div className="flex gap-2 px-4">
                                    <div className="w-2 h-2 bg-llm-sea-glass rounded-full typing-dot"></div>
                                    <div className="w-2 h-2 bg-llm-sea-glass/80 rounded-full typing-dot"></div>
                                    <div className="w-2 h-2 bg-llm-sea-glass/60 rounded-full typing-dot"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
						<Divider className="bg-llm-sea-glass" />
            <section className="py-20 px-6 bg-llm-lace dark:bg-default-50 snap-y snap-mandatory" id="features">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">Complete Language Learning Experience</h2>
                        <p className="text-lg text-default-700">Master reading, writing, and speaking with AI that adapts to your unique learning journey</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-llm-sea-glass/40 p-8 rounded-3xl border-2 border-default-200 hover:border-primary hover:shadow-xl hover:-translate-y-2 transition-all">
                            <div className="w-16 h-16 bg-llm-blue-flower/60 rounded-2xl flex items-center justify-center text-3xl mb-6">📖</div>
                            <h3 className="text-2xl font-bold mb-4 text-foreground">Reading Practice</h3>
                            <p className="text-default-700 leading-relaxed">Build comprehension with curated texts, real-world articles, and instant translations. Progress from beginner to advanced materials at your pace.</p>
                        </div>

                        <div className="bg-llm-sea-glass/40 p-8 rounded-3xl border-2 border-default-200 hover:border-primary hover:shadow-xl hover:-translate-y-2 transition-all">
                            <div className="w-16 h-16 bg-llm-blue-flower/60 rounded-2xl flex items-center justify-center text-3xl mb-6">✍️</div>
                            <h3 className="text-2xl font-bold mb-4 text-foreground">Writing Skills</h3>
                            <p className="text-default-700 leading-relaxed">Get instant feedback on grammar, vocabulary, and style. Practice everything from casual messages to formal essays with detailed corrections.</p>
                        </div>

                        <div className="bg-llm-sea-glass/40 p-8 rounded-3xl border-2 border-default-200 hover:border-primary hover:shadow-xl hover:-translate-y-2 transition-all">
                            <div className="w-16 h-16 bg-llm-blue-flower/60 rounded-2xl flex items-center justify-center text-3xl mb-6">💬</div>
                            <h3 className="text-2xl font-bold mb-4 text-foreground">Speaking Fluency</h3>
                            <p className="text-default-700 leading-relaxed">Have real conversations with AI that responds naturally. Practice pronunciation, build confidence, and develop conversational fluency through daily dialogue.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-default-100 p-6 rounded-2xl hover:shadow-lg transition-all">
                            <div className="text-3xl mb-4">🎯</div>
                            <h4 className="text-xl font-semibold mb-3 text-foreground">Personalized Learning</h4>
                            <p className="text-default-700">AI adapts to your skill level, interests, and learning style for a truly customized experience.</p>
                        </div>

                        <div className="bg-default-100 p-6 rounded-2xl hover:shadow-lg transition-all">
                            <div className="text-3xl mb-4">⚡</div>
                            <h4 className="text-xl font-semibold mb-3 text-foreground">Instant Feedback</h4>
                            <p className="text-default-700">Get immediate corrections and explanations to accelerate your learning progress.</p>
                        </div>

                        <div className="bg-default-100 p-6 rounded-2xl hover:shadow-lg transition-all">
                            <div className="text-3xl mb-4">⏰</div>
                            <h4 className="text-xl font-semibold mb-3 text-foreground">Learn Anytime</h4>
                            <p className="text-default-700">24/7 access means you can practice whenever it fits your schedule. No appointments needed.</p>
                        </div>

                        <div className="bg-default-100 p-6 rounded-2xl hover:shadow-lg transition-all">
                            <div className="text-3xl mb-4">📊</div>
                            <h4 className="text-xl font-semibold mb-3 text-foreground">Track Progress</h4>
                            <p className="text-default-700">Monitor your improvement with detailed analytics and celebrate milestones along the way.</p>
                        </div>

                        <div className="bg-default-100 p-6 rounded-2xl hover:shadow-lg transition-all">
                            <div className="text-3xl mb-4">🌟</div>
                            <h4 className="text-xl font-semibold mb-3 text-foreground">Real-World Practice</h4>
                            <p className="text-default-700">Learn practical vocabulary and phrases you'll actually use in everyday conversations.</p>
                        </div>

                        <div className="bg-default-100 p-6 rounded-2xl hover:shadow-lg transition-all">
                            <div className="text-3xl mb-4">🏆</div>
                            <h4 className="text-xl font-semibold mb-3 text-foreground">Stay Motivated</h4>
                            <p className="text-default-700">Achievement badges, streaks, and progress milestones keep you engaged and excited to learn.</p>
                        </div>
                    </div>
                </div>
            </section>
						<Divider className="bg-llm-sea-glass" />
            <section className="py-20 px-6 bg-llm-sea-glass snap-y snap-mandatory" id="languages">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">Learn From a Wide Range of Languages</h2>
                        <p className="text-lg text-default-700">Whether you're learning for travel, work, or personal growth, we support dozens of languages to help you achieve your goals</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        <div className="bg-llm-chinois p-6 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="text-4xl mb-3">🇪🇸</div>
                            <p className="font-semibold text-foreground">Spanish</p>
                        </div>
                        <div className="bg-llm-chinois p-6 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="text-4xl mb-3">🇫🇷</div>
                            <p className="font-semibold text-foreground">French</p>
                        </div>
                        <div className="bg-llm-chinois p-6 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="text-4xl mb-3">🇩🇪</div>
                            <p className="font-semibold text-foreground">German</p>
                        </div>
                        <div className="bg-llm-chinois p-6 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="text-4xl mb-3">🇮🇹</div>
                            <p className="font-semibold text-foreground">Italian</p>
                        </div>
                        <div className="bg-llm-chinois p-6 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="text-4xl mb-3">🇯🇵</div>
                            <p className="font-semibold text-foreground">Japanese</p>
                        </div>
                        <div className="bg-llm-chinois p-6 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="text-4xl mb-3">🇨🇳</div>
                            <p className="font-semibold text-foreground">Mandarin</p>
                        </div>
                        <div className="bg-llm-chinois p-6 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="text-4xl mb-3">🇰🇷</div>
                            <p className="font-semibold text-foreground">Korean</p>
                        </div>
                        <div className="bg-llm-chinois p-6 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="text-4xl mb-3">🇵🇹</div>
                            <p className="font-semibold text-foreground">Portuguese</p>
                        </div>
                        <div className="bg-llm-chinois p-6 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="text-4xl mb-3">🇷🇺</div>
                            <p className="font-semibold text-foreground">Russian</p>
                        </div>
                        <div className="bg-llm-chinois p-6 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="text-4xl mb-3">🇸🇦</div>
                            <p className="font-semibold text-foreground">Arabic</p>
                        </div>
                        <div className="bg-llm-chinois p-6 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="text-4xl mb-3">🇮🇳</div>
                            <p className="font-semibold text-foreground">Hindi</p>
                        </div>
                        <div className="bg-llm-chinois p-6 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="text-4xl mb-3">🌍</div>
                            <p className="font-semibold text-foreground">+40 More</p>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-default-700 text-lg">From widely spoken languages to niche dialects, start learning the language that matters to you</p>
                    </div>
                </div>
            </section>
						<Divider className="bg-llm-sea-glass" />
            <section className="py-20 px-6 bg-llm-lace dark:bg-default-50 snap-y snap-mandatory" id="how-it-works">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">Getting Started is Simple</h2>
                        <p className="text-lg text-default-700">Begin your language learning journey in just three easy steps</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-llm-sea-glass rounded-full flex items-center justify-center text-primary-foreground font-bold text-3xl mx-auto mb-6">1</div>
                            <h3 className="text-2xl font-bold mb-4 text-foreground">Choose Your Language</h3>
                            <p className="text-default-700 leading-relaxed">Select from dozens of languages and tell us your current skill level and learning goals.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-llm-sea-glass rounded-full flex items-center justify-center text-primary-foreground font-bold text-3xl mx-auto mb-6">2</div>
                            <h3 className="text-2xl font-bold mb-4 text-foreground">Start Practicing</h3>
                            <p className="text-default-700 leading-relaxed">Jump into reading, writing, or speaking exercises. Your AI tutor adapts to your pace and provides instant guidance.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-llm-sea-glass rounded-full flex items-center justify-center text-primary-foreground font-bold text-3xl mx-auto mb-6">3</div>
                            <h3 className="text-2xl font-bold mb-4 text-foreground">Track Your Growth</h3>
                            <p className="text-default-700 leading-relaxed">Watch your skills improve day by day with progress tracking, achievements, and personalized feedback.</p>
                        </div>
                    </div>
                </div>
            </section>
						<Divider className="bg-llm-sea-glass" />
            <section className="py-20 px-6 bg-llm-sea-glass text-primary-foreground">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Ready to Start Your Language Journey?</h2>
                    <p className="text-xl mb-10 opacity-95">Join learners worldwide who are achieving fluency with AI-powered tutoring. Start learning today, completely free.</p>
                    <a href="#" className="inline-block bg-llm-chinois text-foreground px-10 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all">Start Learning Free</a>
                    <p className="mt-6 text-sm opacity-80">No credit card required • Access all features • Cancel anytime</p>
                </div>
            </section>
						<Divider className="bg-llm-sea-glass" />
            <footer className="bg-llm-lace dark:bg-default-50 text-foreground py-12 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
                    <div>
                        <h4 className="font-bold text-lg mb-4">LinguistIM</h4>
                        <p className="text-sm text-default-700">AI-powered language learning for everyone, everywhere.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-default-700">
                            <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Languages</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-default-700">
                            <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-default-700">
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-default-200 text-center text-sm text-default-600">
                    <p>&copy; 2025 LinguistLM. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
