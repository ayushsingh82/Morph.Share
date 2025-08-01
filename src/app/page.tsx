'use client';

const NOUNS_IMAGE_BASE = "https://noun.pics/";

export default function Home() {
  // Generate array of Noun IDs from 1300 to 1310
  const nounIds = Array.from({ length: 11 }, (_, i) => 1300 + i);

  return (
    <main className="min-h-screen">
      {/* Hero Section - Dynamic Background */}
      <section className="relative min-h-screen bg-gradient-to-b from-green-500 via-green-600 to-green-700 overETH-hidden">
        {/* Noun Images */}
        <div className="absolute inset-0 overETH-hidden pointer-events-none">
          {/* Left Noun */}
          <div className="absolute left-0 top-20 w-72 h-72 opacity-100 z-10">
            <img
              src={`${NOUNS_IMAGE_BASE}1300.png`}
              alt="NOUN 1300"
              className="w-full h-full object-contain drop-shadow-2xl rounded-full "
            />
          </div>
          {/* Right Noun */}
          <div className="absolute right-0 top-40 w-64 h-64 opacity-100 z-10">
            <img
              src={`${NOUNS_IMAGE_BASE}1301.png`}
              alt="NOUN 1301"
              className="w-full h-full object-contain drop-shadow-2xl rounded-full"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-20">
          {/* Main Title with 3D Effect */}
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-8xl font-black mb-6 text-black" style={{
              textShadow: '-4px 4px 0 #ffffff',
              WebkitTextStroke: '2px #ffffff'
            }}>
              Friend.
              <span className="text-yellow-500">Share</span>
            </h1>
            <p className="text-xl md:text-2xl text-white font-bold max-w-3xl mx-auto">
              Smart group payments & savings with DeFi simplicity, AI-driven automation, and social coordination
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <div className="bg-blue-600 p-6 rounded-xl border border-white/20 text-white transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">SHARED SAVINGS</h3>
              <p className="text-white/90">Set deadlines, contributions per person, and milestone-based unlocks</p>
            </div>
            <div className="bg-blue-600 p-6 rounded-xl border border-white/20 text-white transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">SPLIT BILLS</h3>
              <p className="text-white/90">Split bills instantly with smart group coordination and AI reminders</p>
            </div>
            <div className="bg-blue-600 p-6 rounded-xl border border-white/20 text-white transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">FUND CAUSES</h3>
              <p className="text-white/90">Pool money and fund causes with public-good-friendly features</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-yellow-500 text-black rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors transform hover:scale-105">
              Create Group
            </button>
            <button className="px-8 py-4 bg-black/80 text-white rounded-full font-bold text-lg hover:bg-black transition-colors transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-blue-600 relative overETH-hidden">
        {/* Noun Images */}
        <div className="absolute inset-0 overETH-hidden pointer-events-none">
          {/* Left Noun */}
          <div className="absolute left-0 top-1/4 w-64 h-64 opacity-100 z-10">
            <img
              src={`${NOUNS_IMAGE_BASE}1302.png`}
              alt="NOUN 1302"
              className="w-full h-full object-contain drop-shadow-2xl rounded-full"
            />
          </div>
          {/* Right Noun */}
          <div className="absolute right-0 top-1/3 w-56 h-56 opacity-100 z-10">
            <img
              src={`${NOUNS_IMAGE_BASE}1303.png`}
              alt="NOUN 1303"
              className="w-full h-full object-contain drop-shadow-2xl rounded-full"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent animate-gradient">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-xl border border-white/30 text-white text-center transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-bold mb-4">Connect</h3>
              <p className="text-white/90">Link your wallet & invite friends</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-xl border border-white/30 text-white text-center transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-4">Set Goals</h3>
              <p className="text-white/90">Create savings goals or split bills</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-xl border border-white/30 text-white text-center transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-4">AI Automation</h3>
              <p className="text-white/90">Smart reminders & automated payments</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-xl border border-white/30 text-white text-center transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-bold mb-4">Grow Together</h3>
              <p className="text-white/90">Achieve goals & build community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-[#FF8C00] via-[#FF7F50] to-[#CC5500] relative overETH-hidden">
        {/* Noun Images */}
        <div className="absolute inset-0 overETH-hidden pointer-events-none">
          {/* Left Noun */}
          <div className="absolute left-0 top-1/3 w-60 h-60 opacity-100 z-10">
            <img
              src={`${NOUNS_IMAGE_BASE}1304.png`}
              alt="NOUN 1304"
              className="w-full h-full object-contain drop-shadow-2xl rounded-full"
            />
          </div>
          {/* Right Noun */}
          <div className="absolute right-0 top-1/4 w-52 h-52 opacity-100 z-10">
            <img
              src={`${NOUNS_IMAGE_BASE}1305.png`}
              alt="NOUN 1305"
              className="w-full h-full object-contain drop-shadow-2xl rounded-full"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent animate-gradient">
            Why Choose Friend.Share
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 text-white transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-4">DeFi Simplicity</h3>
              <p className="text-lg">Blockchain-powered payments with the simplicity of traditional apps. No technical knowledge required.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 text-white transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-4">AI-Driven Automation</h3>
              <p className="text-lg">Smart reminders, automated payments, and intelligent coordination to keep everyone on track.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 text-white transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-4">Social Coordination</h3>
              <p className="text-lg">Built-in chat, progress tracking, and milestone celebrations to keep groups motivated.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 text-white transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold mb-4">Public Good Friendly</h3>
              <p className="text-lg">Fund causes, support communities, and make a positive impact with transparent, accountable payments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-b from-[#4F46E5] via-[#7C3AED] to-[#1E40AF] relative overETH-hidden">
        {/* Noun Images */}
        <div className="absolute inset-0 overETH-hidden pointer-events-none">
          {/* Left Noun */}
          <div className="absolute left-0 top-1/4 w-56 h-56 opacity-100 z-10">
            <img
              src={`${NOUNS_IMAGE_BASE}1306.png`}
              alt="NOUN 1306"
              className="w-full h-full object-contain drop-shadow-2xl rounded-full"
            />
          </div>
          {/* Right Noun */}
          <div className="absolute right-0 top-1/3 w-48 h-48 opacity-100 z-10">
            <img
              src={`${NOUNS_IMAGE_BASE}1307.png`}
              alt="NOUN 1307"
              className="w-full h-full object-contain drop-shadow-2xl rounded-full"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            Perfect For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 text-white text-center transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-bold mb-4">Roommates</h3>
              <p className="text-white/90">Split rent, utilities, and household expenses with automatic reminders</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 text-white text-center transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold mb-4">Events & Trips</h3>
              <p className="text-white/90">Plan group vacations, parties, and events with shared expense tracking</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 text-white text-center transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-4">Savings Goals</h3>
              <p className="text-white/90">Save together for big purchases, investments, or charitable causes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#8B5CF6] via-[#BA55D3] to-[#673AB7] relative overETH-hidden">
        {/* Noun Images */}
        <div className="absolute inset-0 overETH-hidden pointer-events-none">
          {/* Left Noun */}
          <div className="absolute left-0 top-1/4 w-56 h-56 opacity-100 z-10">
            <img
              src={`${NOUNS_IMAGE_BASE}1308.png`}
              alt="NOUN 1308"
              className="w-full h-full object-contain drop-shadow-2xl rounded-full"
            />
          </div>
          {/* Right Noun */}
          <div className="absolute right-0 top-1/3 w-48 h-48 opacity-100 z-10">
            <img
              src={`${NOUNS_IMAGE_BASE}1309.png`}
              alt="NOUN 1309"
              className="w-full h-full object-contain drop-shadow-2xl rounded-full"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Share & Save?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of users who are already pooling money, splitting costs, and funding causes with Friend.Share
          </p>
          <button className="px-12 py-5 bg-white text-[#8B5CF6] rounded-full font-bold text-xl hover:bg-white/90 transition-colors transform hover:scale-105 shadow-lg">
            Start Your Group Today
          </button>
        </div>
      </section>
    </main>
  );
}
