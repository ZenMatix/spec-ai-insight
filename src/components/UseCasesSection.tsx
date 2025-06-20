
import { Card } from '@/components/ui/card';
import { Wrench, Shield, Cog, Building } from 'lucide-react';

const UseCasesSection = () => {
  const useCases = [
    {
      icon: Wrench,
      title: "Quality Engineers",
      description: "Quickly find tolerance requirements, testing procedures, and quality standards",
      examples: [
        "What are the dimensional tolerances for part XYZ?",
        "Which testing methods are required for material verification?",
        "What quality standards must be met?"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Welding Inspectors",
      description: "Instantly access welding codes, procedures, and acceptance criteria",
      examples: [
        "What welding process is specified for joint type A?",
        "What are the NDT requirements for critical welds?",
        "Which welding consumables are approved?"
      ],
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Cog,
      title: "Manufacturing Teams",
      description: "Understand material specifications, machining requirements, and assembly procedures",
      examples: [
        "What material grade is specified for this component?",
        "What surface finish requirements are needed?",
        "Which assembly sequence should be followed?"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Building,
      title: "Project Managers",
      description: "Get quick overviews of deliverables, timelines, and compliance requirements",
      examples: [
        "What are the key deliverables for Phase 2?",
        "Which standards and codes apply to this project?",
        "What inspection hold points are required?"
      ],
      color: "from-orange-500 to-orange-600"
    }
  ];

  const industries = [
    "Oil & Gas",
    "Aerospace",
    "Steel Fabrication",
    "Shipbuilding",
    "Power Generation",
    "Mining",
    "Petrochemical",
    "Infrastructure"
  ];

  return (
    <section id="use-cases" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Built for Manufacturing Teams
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Every role in your organization can benefit from instant access to specification insights. 
            Here's how different teams use Vdospec AI to work more efficiently.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {useCases.map((useCase, index) => (
            <Card key={index} className="p-8 bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4 mb-6">
                <div className={`w-14 h-14 bg-gradient-to-r ${useCase.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <useCase.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">Example Questions:</p>
                <div className="space-y-2">
                  {useCase.examples.map((example, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-slate-600">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Industries Section */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Trusted Across Industries
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From offshore platforms to aerospace manufacturing, Vdospec AI helps teams 
              in every sector understand their specifications faster.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div 
                key={index}
                className="text-center p-4 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-200"
              >
                <p className="font-semibold text-slate-700">{industry}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {[
            {
              metric: "75%",
              label: "Time Saved",
              description: "Average reduction in specification review time"
            },
            {
              metric: "90%",
              label: "Accuracy",
              description: "Precision in finding relevant specification details"
            },
            {
              metric: "10x",
              label: "Faster",
              description: "Speed improvement over manual document search"
            }
          ].map((stat, index) => (
            <Card key={index} className="p-6 bg-white shadow-lg border-0 text-center">
              <div className="text-4xl font-bold text-gradient mb-2">
                {stat.metric}
              </div>
              <div className="text-lg font-semibold text-slate-900 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-slate-600">
                {stat.description}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
