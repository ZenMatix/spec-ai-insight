
import { Mail, MessageSquare, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Use Cases', href: '#use-cases' },
      { label: 'Demo', href: '#get-started' },
      { label: 'Pricing', href: '#contact' },
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Contact', href: '#contact' },
      { label: 'Careers', href: '#contact' },
      { label: 'Blog', href: '#contact' },
    ],
    support: [
      { label: 'Help Center', href: '#contact' },
      { label: 'Documentation', href: '#contact' },
      { label: 'API Reference', href: '#contact' },
      { label: 'Status', href: '#contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#contact' },
      { label: 'Terms of Service', href: '#contact' },
      { label: 'Security', href: '#contact' },
      { label: 'Compliance', href: '#contact' },
    ],
  };

  const handleLinkClick = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                Vdospec AI
              </span>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed max-w-md">
              Transforming how engineering teams understand manufacturing specifications 
              with AI-powered document analysis and real-time question answering.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300">inquiry@vdospec.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300">+1 (555) 123-VDOS</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300">Live Chat Available</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-slate-700 pt-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h4 className="text-xl font-semibold mb-2">Stay Updated</h4>
              <p className="text-slate-300">
                Get the latest updates on new features and industry insights.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              © {currentYear} Vdospec AI. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6">
              {footerLinks.legal.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleLinkClick(link.href)}
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-slate-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              🔒 Enterprise-grade security • SOC 2 Type II Compliant • GDPR Ready
            </div>
            <div className="text-slate-400 text-sm">
              Made with ❤️ for Engineering Teams
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
