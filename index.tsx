import { Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Sprout, MessageSquare, Microscope, Cloud, TrendingUp, Users, FileText, Syringe, Star, ArrowRight, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const features = [
  { icon: MessageSquare, title: "AI Chat Assistant", titleTa: "AI உதவியாளர்", desc: "Get instant answers in Tamil & English about crops, livestock, and farming practices.", color: "bg-green-100 text-green-700" },
  { icon: Microscope, title: "Disease Detection", titleTa: "நோய் கண்டறிதல்", desc: "Upload photos to detect crop and animal diseases with AI-powered analysis.", color: "bg-blue-100 text-blue-700" },
  { icon: FileText, title: "Govt Schemes", titleTa: "அரசு திட்டங்கள்", desc: "Discover 15+ government schemes for farmers with eligibility and application details.", color: "bg-amber-100 text-amber-700" },
  { icon: Cloud, title: "Weather Dashboard", titleTa: "வானிலை", desc: "Real-time weather with farming recommendations tailored to your location.", color: "bg-sky-100 text-sky-700" },
  { icon: TrendingUp, title: "Market Prices", titleTa: "சந்தை விலைகள்", desc: "Live crop prices from Tamil Nadu APMCs with trend charts and history.", color: "bg-purple-100 text-purple-700" },
  { icon: Users, title: "Expert Consultation", titleTa: "நிபுணர் ஆலோசனை", desc: "Connect with agricultural and veterinary experts for personalized guidance.", color: "bg-rose-100 text-rose-700" },
];

const testimonials = [
  { name: "Rajan Kumar", location: "Thanjavur, Tamil Nadu", role: "Paddy Farmer", text: "AgriVet AI helped me identify blast disease in my rice crop early. The Tamil language support makes it very easy to use!", rating: 5 },
  { name: "Meenakshi Devi", location: "Erode, Tamil Nadu", role: "Dairy Farmer", text: "I found the PM-KISAN scheme through this app and got ₹6,000 directly in my account. The AI chat answered all my questions in Tamil.", rating: 5 },
  { name: "Selvam Gopal", location: "Madurai, Tamil Nadu", role: "Goat Farmer", text: "The vaccination reminder feature saved my goats from PPR disease. The expert consultation helped me treat my sick animals quickly.", rating: 5 },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Helmet>
        <title>AgriVet AI — AI-Powered Agriculture & Livestock Platform for Tamil Nadu Farmers</title>
        <meta name="description" content="AgriVet AI helps Tamil Nadu farmers with crop guidance, livestock health, government schemes, disease detection, weather updates, and market prices in Tamil and English." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-green-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-green-800 font-heading">AgriVet AI</span>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard" className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-green-700 font-medium text-sm hover:text-green-900 px-3 py-2">Login</Link>
                  <Link to="/register" className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-6">
                <Sprout className="w-4 h-4" />
                Tamil Nadu's #1 AgriTech Platform
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight mb-4">
                AI-Powered Agriculture &<br />
                <span className="text-amber-400">Livestock Platform</span>
              </h1>
              <p className="text-green-200 text-lg mb-3">
                Empowering Tamil Nadu farmers with AI guidance, disease detection, government schemes, and expert consultations.
              </p>
              <p className="text-green-300 text-base mb-8 font-medium">
                தமிழ்நாடு விவசாயிகளுக்கு AI வழிகாட்டுதல், நோய் கண்டறிதல், அரசு திட்டங்கள் மற்றும் நிபுணர் ஆலோசனைகள்.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={isAuthenticated ? "/dashboard" : "/register"} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all flex items-center gap-2 shadow-lg">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-green-800 text-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "10,000+", label: "Farmers Registered", labelTa: "பதிவு செய்த விவசாயிகள்" },
                { value: "15+", label: "Govt Schemes", labelTa: "அரசு திட்டங்கள்" },
                { value: "12+", label: "Crops Covered", labelTa: "பயிர்கள்" },
                { value: "20+", label: "Diseases in Database", labelTa: "நோய்கள்" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-amber-400 font-heading">{stat.value}</div>
                  <div className="text-green-200 text-sm mt-1">{stat.label}</div>
                  <div className="text-green-400 text-xs">{stat.labelTa}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-3">Everything a Farmer Needs</h2>
              <p className="text-gray-600 text-lg">விவசாயிக்கு தேவையான அனைத்தும் ஒரே இடத்தில்</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 font-heading">{f.title}</h3>
                  <p className="text-green-700 text-sm font-medium mb-2">{f.titleTa}</p>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 font-heading mb-6">Why Choose AgriVet AI?</h2>
                <div className="space-y-4">
                  {[
                    "Tamil & English bilingual AI assistant",
                    "Voice input and voice output support",
                    "Real-time weather with farming advice",
                    "Government scheme eligibility checker",
                    "AI-powered crop & animal disease detection",
                    "Live market prices from Tamil Nadu APMCs",
                    "Vaccination schedule reminders",
                    "Expert consultation system",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
                <Link to="/register" className="mt-8 inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors">
                  Start for Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl p-8 border border-green-100">
                <div className="space-y-4">
                  {[
                    { icon: Syringe, title: "Vaccination Reminders", desc: "Never miss a vaccination schedule for your livestock" },
                    { icon: Sprout, title: "Crop Cultivation Guides", desc: "Step-by-step guides for 12+ Tamil Nadu crops" },
                    { icon: Users, title: "Expert Network", desc: "Connect with certified agricultural and veterinary experts" },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4 bg-white rounded-xl p-4 shadow-sm">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                        <p className="text-gray-600 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-green-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading mb-2">Trusted by Tamil Nadu Farmers</h2>
              <p className="text-green-300">தமிழ்நாடு விவசாயிகளின் நம்பகமான தளம்</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-green-800 rounded-2xl p-6 border border-green-700">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-green-100 text-sm mb-4 italic">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-green-400 text-xs">{t.role} • {t.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-amber-500">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white font-heading mb-3">Ready to Transform Your Farm?</h2>
            <p className="text-amber-100 mb-8">Join thousands of Tamil Nadu farmers already using AgriVet AI</p>
            <Link to="/register" className="bg-white text-amber-600 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-amber-50 transition-colors inline-flex items-center gap-2">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-green-700 rounded-lg flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white font-heading">AgriVet AI</span>
              </div>
              <p className="text-sm">© 2024 AgriVet AI. Empowering Tamil Nadu Farmers.</p>
              <div className="flex gap-4 text-sm">
                <Link to="/login" className="hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="hover:text-white transition-colors">Register</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
