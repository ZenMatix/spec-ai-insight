
const GetStartedFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-center md:text-left">
          <div className="text-2xl font-bold mb-3 md:mb-0">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Vdospec AI
            </span>
          </div>
          <div className="space-y-2 md:space-y-0 md:space-x-6 md:flex md:items-center">
            <div className="text-gray-600 text-sm">
              Need help? Contact us at <span className="text-blue-600 font-medium">inquiry@vdospec.com</span>
            </div>
            <div className="text-gray-500 text-sm">
              © {currentYear} Vdospec AI. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GetStartedFooter;
