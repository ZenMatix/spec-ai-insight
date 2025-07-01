
import { Card } from "@/components/ui/card";
import { Upload, MessageSquare, Search, CheckCircle, Clock, Shield, Zap, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useUser } from "@clerk/clerk-react";

const HowItWorksSection = () => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.getAttribute('data-step') || '0');
            setVisibleSteps(prev => [...new Set([...prev, stepIndex])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const stepElements = document.querySelectorAll('[data-step]');
    stepElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      icon: Upload,
      title: "Upload Document",
      description:
        "Simply drag and drop your specification documents into our secure platform. We support PDF, Word, and text formats.",
      color: "bg-blue-500",
      badges: ["Secure", "Multi-format"],
      details: "Supports documents up to 100MB with enterprise-grade encryption and automatic format detection."
    },
    {
      icon: MessageSquare,
      title: "Ask Questions",
      description:
        "Type your questions in natural language. Our AI understands technical terminology and engineering context.",
      color: "bg-green-500",
      badges: ["AI-Powered", "Smart"],
      details: "Advanced NLP processes your questions and understands context, technical jargon, and industry standards."
    },
    {
      icon: Search,
      title: "Get Instant Answers",
      description:
        "Receive precise, contextual answers with exact references to relevant sections in your documents.",
      color: "bg-purple-500",
      badges: ["Accurate", "Referenced"],
      details: "90% accuracy rate with direct citations to source material and confidence scoring for each answer."
    },
    {
      icon: CheckCircle,
      title: "Make Informed Decisions",
      description:
        "Use the insights to make faster, more accurate engineering decisions and keep your projects on track.",
      color: "bg-orange-500",
      badges: ["Reliable", "Efficient"],
      details: "Track decision history, export insights, and collaborate with team members on critical project decisions."
    },
  ];

  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const handleGetStarted = () => {
    if (!isSignedIn) {
      toast("Sign in to Vdospec!", {
        description: "Please sign in to access our AI-powered specification analysis platform.",
        duration: 3000,
      });
    } else {
      // Navigate to hero section for signed-in users
      const heroElement = document.querySelector("#home");
      heroElement?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      id="how-it-works" 
      className="py-20 bg-transparent relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto mb-8">
            Transform your specification workflow in four simple steps. Our AI
            makes complex technical documents searchable and understandable.
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Clock, label: "Time Saved", value: "75%" },
              { icon: Target, label: "Accuracy", value: "90%" },
              { icon: Zap, label: "Speed", value: "3x Faster" },
              { icon: Shield, label: "Security", value: "Enterprise" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200/60">
                <stat.icon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps without connecting lines */}
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card
                key={index}
                data-step={index}
                className={`text-center p-6 bg-white/70 backdrop-blur-sm shadow-xl border border-slate-200/60 hover:shadow-2xl transition-all duration-500 cursor-pointer relative group hover:bg-white/90 hover:border-slate-300/80 ${
                  visibleSteps.includes(index) 
                    ? 'animate-fade-in scale-100 opacity-100' 
                    : 'scale-95 opacity-0'
                } ${
                  expandedCard === index ? 'lg:col-span-2 z-10' : ''
                }`}
                onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold animate-pulse">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {step.title}
                </h3>

                <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                  {step.description}
                </p>

                {/* Feature badges */}
                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  {step.badges.map((badge, badgeIndex) => (
                    <span 
                      key={badgeIndex}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Expandable details */}
                {expandedCard === index && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg animate-fade-in">
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {step.details}
                    </p>
                  </div>
                )}

                {/* Hover indicator */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click for details
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="mt-20">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-slate-200/60 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Ready to streamline your workflow?
              </h3>
              
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Join thousands of engineers who are already saving hours every week
                with AI-powered specification analysis.
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={handleGetStarted}
                  className="gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
