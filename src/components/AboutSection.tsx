
import { Card } from "@/components/ui/card";
import { Target, Users, Zap, Award } from "lucide-react";
import { Bot, FileText, BadgeCheck } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To eliminate the time engineers spend searching through specification documents, enabling them to focus on what they do best - engineering.",
    },
    {
      icon: Users,
      title: "Built by Engineers",
      description:
        "Our team understands the frustration of specification reviews because we've been there. We're building the tool we always wished we had.",
    },
    {
      icon: Zap,
      title: "AI-First Approach",
      description:
        "We leverage cutting-edge AI technology to understand technical documents the way humans do - with context, nuance, and domain expertise.",
    },
    {
      icon: Award,
      title: "Industry Focus",
      description:
        "Unlike generic AI tools, we're specifically designed for manufacturing and industrial specifications, ensuring accuracy and relevance.",
    },
  ];

  return (
    <section 
      id="about" 
      className="py-20 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            About Vdospec AI
          </h2>
          <p className="text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
            We're transforming how engineering teams interact with technical
            specifications. Born from the frustration of spending countless
            hours searching through complex documents, Vdospec AI brings
            intelligent document analysis to manufacturing.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 lg:p-12 mb-16 border border-slate-200/60 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                Empowering Engineers with AI
              </h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Every day, engineers and technical professionals spend valuable
                time manually searching through specification documents. What
                should take minutes often takes hours, and critical details can
                be missed in the process.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Vdospec AI changes this. Our intelligent platform understands
                technical language, recognizes industry standards, and provides
                instant, accurate answers to your specification questions.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-200/60 shadow-lg">
                <div className="text-center">
                  <div className="w-24 h-24 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800">
                    AI-Powered
                  </h4>
                  <p className="text-slate-600 mt-2">Specification Analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => (
            <Card
              key={index}
              className="p-8 bg-white/70 backdrop-blur-sm shadow-xl border border-slate-200/60 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">
                    {value.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Technology Section */}
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl p-8 lg:p-12 text-white border border-slate-700/50 shadow-2xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              Built on Modern AI Technology
            </h3>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our platform combines state-of-the-art language models with
              domain-specific training to understand manufacturing and
              industrial specifications with unprecedented accuracy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Natural Language Processing",
                description:
                  "Advanced NLP models trained on technical documentation understand context and industry terminology.",
                icon: <Bot className="w-8 h-8 text-white" />,
              },
              {
                title: "Document Intelligence",
                description:
                  "AI-powered document parsing that preserves structure, tables, and relationships between sections.",
                icon: <FileText className="w-8 h-8 text-white" />,
              },
              {
                title: "Domain Expertise",
                description:
                  "Specialized knowledge of manufacturing standards, codes, and industry best practices.",
                icon: <BadgeCheck className="w-8 h-8 text-white" />,
              },
            ].map((tech, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-500/80 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
                  {tech.icon}
                </div>
                <h4 className="text-lg font-semibold mb-3">{tech.title}</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        

        
      </div>
    </section>
  );
};

export default AboutSection;
