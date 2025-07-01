import { Upload, X, CheckCircle, AlertCircle, FileText, Send, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import GetStartedFooter from '@/components/GetStartedFooter';

const HumanResponse = () => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => setPopup(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const formatPhoneNumber = (number: string) => {
    let formattedNumber = number.replace(/\D/g, '');
    if (countryCode === '+1') {
      if (formattedNumber.length > 3 && formattedNumber.length <= 6) {
        formattedNumber = `(${formattedNumber.slice(0, 3)}) ${formattedNumber.slice(3)}`;
      } else if (formattedNumber.length > 6) {
        formattedNumber = `(${formattedNumber.slice(0, 3)}) ${formattedNumber.slice(3, 6)}-${formattedNumber.slice(6, 10)}`;
      }
    } else if (countryCode === '+91') {
      if (formattedNumber.length > 5) {
        formattedNumber = `${formattedNumber.slice(0, 5)}-${formattedNumber.slice(5, 10)}`;
      }
    }
    return formattedNumber;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhoneNumber(e.target.value));
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPopup(null);

    if (!name || !email || !message) {
      setPopup({ type: 'error', message: 'Please fill in all required fields.' });
      setLoading(false);
      return;
    }

    const fullPhoneNumber = `${countryCode} ${phoneNumber.replace(/\D/g, '')}`;
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('name', name);
    formData.append('email', email);
    if (phoneNumber) formData.append('phone', fullPhoneNumber);
    formData.append('message', message);

    try {
      const response = await fetch('http://localhost:3002/send-email', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setPopup({ type: 'success', message: 'Message sent successfully! We\'ll get back to you soon.' });

      // Reset form after submission
      setFile(null);
      setName('');
      setEmail('');
      setCountryCode('+1');
      setPhoneNumber('');
      setMessage('');
    } catch (error) {
      setPopup({ type: 'error', message: 'There was an error sending your message. Please try again.' });
    }

    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: 'url(/Bg-2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="flex-1 relative z-10">
        <div className="pt-24 sm:pt-32 pb-6 sm:pb-12">
          <section className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 items-center">
              
              {/* Left Side - Info Section (Hidden on mobile, visible on large screens) */}
              <div className="hidden lg:block lg:col-span-2 space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-200">
                    <span className="text-blue-600 font-medium text-sm">Write To Us</span>
                  </div>
                  
                  <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                    Ask us any 
                    <span className="text-gradient block">Questions</span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed">
                    We'd love to hear from you. 
                    Send us a message and we'll respond as soon as possible.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-lg">
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email Us</h3>
                      <p className="text-gray-600">hello@vdospec.ai</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-lg">
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Call Us</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form Section */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl border border-gray-200">
                  
                  {/* Mobile Header */}
                  <div className="lg:hidden text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gradient mb-2 sm:mb-3">
                      Ask us any Questions
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      We're here to help! Fill out the form below and we'll get back to you.
                    </p>
                  </div>

                  {/* Desktop Header */}
                  <div className="hidden lg:block mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      Send us a Message
                    </h2>
                    <p className="text-gray-600">
                      Fill out the form below and our team will get back to you within 24 hours.
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 font-semibold text-gray-700 text-sm sm:text-base">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                          <span>
                            Full Name <span className="text-blue-500">*</span>
                            </span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 text-sm sm:text-base bg-white hover:bg-white focus:bg-white"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 font-semibold text-gray-700 text-sm sm:text-base">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                          <span>
                            Email Address <span className="text-blue-500">*</span>
                          </span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 text-sm sm:text-base bg-white hover:bg-white focus:bg-white"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 font-semibold text-gray-700 text-sm sm:text-base">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                        <span>Phone Number</span>
                      </label>
                      <div className="flex gap-2 sm:gap-3">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="px-2 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 text-sm sm:text-base bg-white hover:bg-white focus:bg-white"
                        >
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+91">🇮🇳 +91</option>
                        </select>
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          className="flex-1 px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 text-sm sm:text-base bg-white hover:bg-white focus:bg-white"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 font-semibold text-gray-700 text-sm sm:text-base">
                        <Upload className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                        <span>Attach File</span>
                      </label>
                      <div
                        className={`relative border-2 border-dashed rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all duration-300 bg-white ${
                          dragActive 
                            ? 'border-blue-500 bg-blue-50 transform scale-[1.02]' 
                            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        
                        {file ? (
                          <div className="flex items-center justify-between bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate block">{file.name}</span>
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={removeFile}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors flex-shrink-0 ml-2"
                            >
                              <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-12 h-12 sm:w-16 sm:h-16 gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <p className="text-gray-700 font-medium mb-1 text-sm sm:text-base">Drop your file here, or browse</p>
                            <p className="text-xs sm:text-sm text-gray-500">Supports: PDF, DOC, Images (Max 10MB)</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 font-semibold text-gray-700 text-sm sm:text-base">
                        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                          Your Message <span className="text-blue-500">*</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 text-sm sm:text-base resize-none bg-white hover:bg-white focus:bg-white"
                        placeholder="Tell us about your project, questions, or how we can help you..."
                      />
                    </div>

                    <div className="pt-2 sm:pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white gradient-primary rounded-lg sm:rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                      >
                        <div className="relative flex items-center justify-center space-x-2 sm:space-x-3">
                          {loading ? (
                            <>
                              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Sending Message...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                              <span>Send Message</span>
                            </>
                          )}
                        </div>
                        
                        {loading && (
                          <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
                            <div className="h-full bg-white animate-pulse"></div>
                          </div>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Custom Get Started Footer */}
      <div className="relative z-10">
        <GetStartedFooter />
      </div>

      {popup && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transform transition-all duration-700 ease-out animate-in slide-in-from-bottom-4 fade-in">
          <div className={`
            relative overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100 max-w-xs sm:max-w-sm w-[280px] sm:min-w-[320px]
            transform transition-all duration-300 hover:scale-105 hover:shadow-3xl
          `}>
            {/* Colored top border */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${
              popup.type === 'success' ? 'gradient-primary' : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}></div>
            
            {/* Main content */}
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon */}
                <div className={`
                  flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center
                  ${popup.type === 'success' 
                    ? 'gradient-primary' 
                    : 'bg-gradient-to-br from-red-500 to-red-600'
                  }
                `}>
                  {popup.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
                  ) : (
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                  <h4 className={`font-bold text-base sm:text-lg mb-1 ${
                    popup.type === 'success' ? 'text-gray-900' : 'text-gray-900'
                  }`}>
                    {popup.type === 'success' ? '✨ Message Sent!' : '❌ Oops! Something went wrong'}
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {popup.message}
                  </p>
                </div>
                
                {/* Close button */}
                <button
                  onClick={() => setPopup(null)}
                  className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Progress bar for auto-dismiss */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
              <div 
                className={`
                  h-full
                  ${popup.type === 'success' ? 'gradient-primary' : 'bg-gradient-to-r from-red-500 to-red-600'}
                `} 
                style={{ 
                  width: '100%',
                  animation: 'toast-progress 5s linear forwards'
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes toast-progress {
            from { width: 100%; }
            to { width: 0%; }
          }
          
          .shadow-3xl {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
          }
        `
      }} />
    </div>
  );
};

export default HumanResponse;
