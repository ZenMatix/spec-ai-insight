import { ChevronRight, Award, Shield, Zap, Target, Wrench } from "lucide-react";

const OurExpertiseSection = () => {
  const expertiseAreas = [
    {
      id: "asme",
      logo: "ASME",
      icon: Wrench,
      title: "American Society of Mechanical Engineers (ASME)",
      description:
        "A global organization advancing the engineering profession through knowledge, collaboration, and innovation.",
      website: "https://www.asme.org",
      color: "from-blue-600 to-blue-800",
      bgGradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      hoverBorder: "hover:border-blue-400",
    },
    {
      id: "api",
      logo: "API",
      icon: Shield,
      title: "American Petroleum Institute (API)",
      description:
        "Setting standards for the oil and natural gas industry to ensure safety, environmental protection, and efficiency.",
      website: "https://www.api.org",
      color: "from-emerald-600 to-emerald-800",
      bgGradient: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      hoverBorder: "hover:border-emerald-400",
    },
    {
      id: "sae",
      logo: "SAE",
      icon: Zap,
      title: "Society of Automotive Engineers (SAE)",
      description:
        "A professional association for engineers in the automotive, aerospace, and commercial vehicle industries.",
      website: "https://www.sae.org",
      color: "from-purple-600 to-purple-800",
      bgGradient: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      hoverBorder: "hover:border-purple-400",
    },
    {
      id: "asnt",
      logo: "ASNT",
      icon: Target,
      title: "American Society for Non-Destructive Testing (ASNT)",
      description:
        "The world's largest technical society for nondestructive testing professionals.",
      website: "https://www.asnt.org",
      color: "from-orange-600 to-orange-800",
      bgGradient: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      hoverBorder: "hover:border-orange-400",
    },
    {
      id: "aws",
      logo: "AWS",
      icon: Award,
      title: "American Welding Society (AWS)",
      description:
        "Advancing the science, technology, and application of welding and allied joining disciplines.",
      website: "https://www.aws.org",
      color: "from-red-600 to-red-800",
      bgGradient: "from-red-50 to-red-100",
      borderColor: "border-red-200",
      hoverBorder: "hover:border-red-400",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-xl">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight text-center sm:text-center">
            <span className="block">Our</span>
            <span className="block bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              Expertise
            </span>
            
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8 rounded-full shadow-lg"></div>
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 max-w-5xl mx-auto leading-relaxed font-light px-4 sm:px-0">
            Our team specializes in multiple industry standards, ensuring
            accurate and reliable solutions for your{" "}
            <span className="font-semibold text-slate-800">
              engineering needs
            </span>
            .
          </p>
        </div>

        {/* Expertise Grid */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8">
          {expertiseAreas.map((area, index) => {
            const IconComponent = area.icon;
            return (
              <div
                key={area.id}
                onClick={() => window.open(area.website, "_blank")}
                className={`group relative bg-white/80 backdrop-blur-sm border-2 ${area.borderColor} ${area.hoverBorder} rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer overflow-hidden`}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${area.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                ></div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative z-10 flex items-start space-x-6 sm:space-x-8">
                  {/* Enhanced Logo */}
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${area.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {area.logo}
                      </span>
                    </div>
                    {/* Icon overlay */}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                      <IconComponent className="w-5 h-5 text-slate-700" />
                    </div>
                  </div>

                  {/* Content */}
                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-800 transition-colors duration-300 leading-tight">
                      {area.title}
                    </h3>
                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium group-hover:text-slate-700 transition-colors duration-300">
                      {area.description}
                    </p>
                  </div>

                  {/* Progress bar animation
                    <div className="mt-6 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${area.color} rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}></div>
                    </div>
                  </div> */}

                  {/* Enhanced Arrow */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                      <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-slate-700 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>

                {/* Subtle border animation */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 sm:mt-20">
          <div className="inline-flex items-center space-x-2 text-slate-600 font-medium">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-slate-400"></div>
            <span className="text-sm uppercase tracking-wider">
              Trusted by Industry Leaders
            </span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-slate-400"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurExpertiseSection;
