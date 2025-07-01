import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    type: 'general'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Environment variable for API URL (fallback to localhost for development)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        description: "Name, email, and message are required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Show loading toast
      toast({
        title: "Sending message...",
        description: "Please wait while we send your message.",
      });

      // Send data to backend
      const response = await fetch(`${API_URL}/api/inquiry-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          type: formData.type
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Success
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you within 24 hours.",
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          message: '',
          type: 'general'
        });
      } else {
        // Error from backend
        toast({
          title: "Failed to send message",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Network error or other issues
      console.error('Error sending email:', error);
      toast({
        title: "Network error",
        description: "Unable to send message. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactOptions = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help with technical questions",
      contact: "support@vdospec.com",
      action: "Send Email"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our team during business hours",
      contact: "Available 9 AM - 6 PM EST",
      action: "Start Chat"
    },
    {
      icon: Phone,
      title: "Schedule Demo",
      description: "See Vdospec AI in action",
      contact: "30-minute demo call",
      action: "Book Demo"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Get in Touch
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Have questions about Vdospec AI? Want to see a demo? Our team is here to help 
            you understand how AI can transform your specification workflow.
          </p>
        </div>

        {/* <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {contactOptions.map((option, index) => (
            <Card key={index} className="p-6 bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <option.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {option.title}
              </h3>
              <p className="text-slate-600 mb-3">
                {option.description}
              </p>
              <p className="text-sm text-slate-500 mb-4">
                {option.contact}
              </p>
              <Button className="w-full gradient-primary text-white hover:scale-105 transition-transform duration-200">
                {option.action}
              </Button>
            </Card>
          ))}
        </div> */}

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 lg:p-12 bg-white shadow-xl border-0">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Send Us a Message
              </h3>
              <p className="text-lg text-slate-600">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@company.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-slate-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company name"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-semibold text-slate-700 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="demo">Request Demo</option>
                    <option value="support">Technical Support</option>
                    {/* <option value="partnership">Partnership</option>
                    <option value="pricing">Pricing Information</option> */}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us about your specification challenges and how we can help..."
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="text-center">
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="gradient-primary text-white px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isLoading ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-lg text-slate-600">
              Quick answers to common questions about Vdospec AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                question: "What file formats does Vdospec AI support?",
                answer: "We support PDF, DOCX, DOC, and TXT files up to 10MB. We're continuously adding support for more formats based on user feedback."
              },
              {
                question: "How secure is my document data?",
                answer: "We use enterprise-grade encryption and follow industry best practices for data security. Your documents are processed securely and never shared with third parties."
              },
              
            ].map((faq, index) => (
              <Card key={index} className="p-6 bg-white shadow-lg border-0">
                <h4 className="text-lg font-semibold text-slate-900 mb-3">
                  {faq.question}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;