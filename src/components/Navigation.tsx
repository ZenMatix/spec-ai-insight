
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useClerk, useUser } from "@clerk/clerk-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useClerk();
  const { user } = useUser();

  const isGetStartedPage = location.pathname === "/get-started";
  const isAiChatPage = location.pathname === "/Ai-chat";

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const displayNavItems =
    isGetStartedPage || isAiChatPage
      ? navItems.filter((item) => item.label === "Home")
      : navItems;

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if ((isGetStartedPage || isAiChatPage) && href === "#home") {
      window.location.href = "/";
      return;
    }
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMobileSignOut = async () => {
    setIsOpen(false);
    await signOut({ redirectUrl: "/" });
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="bg-white/90 backdrop-blur-lg border border-slate-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Now clickable */}
            <div className="flex items-center space-x-2">
              <img
                src="/favicon.png"
                alt="Vdospec Logo"
                className="h-8 w-8 object-contain"
              />
              <Link
                to="/"
                className="text-2xl font-bold text-gradient hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                Vdospec AI
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {displayNavItems.map((item) =>
                (isGetStartedPage || isAiChatPage) && item.label === "Home" ? (
                  <Link key={item.label} to="/">
                    <Button className="gradient-primary text-white px-6 rounded-full hover:scale-105 transition-transform duration-200 shadow-md">
                      {item.label}
                    </Button>
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                )
              )}

              {/* Desktop Authentication buttons */}
              <SignedOut>
                <Link to="/sign-in">
                  <Button className="gradient-primary text-white px-6 rounded-full hover:scale-105 transition-transform duration-200 shadow-md">
                    Get Started
                  </Button>
                </Link>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-8 h-8 rounded-full hover:scale-110 transition-transform duration-200",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 rounded-l-2xl">
                <div className="flex flex-col space-y-6 mt-8">
                  {displayNavItems.map((item) =>
                    (isGetStartedPage || isAiChatPage) &&
                    item.label === "Home" ? (
                      <Link
                        key={item.label}
                        to="/"
                        onClick={() => setIsOpen(false)}
                      >
                        <Button className="gradient-primary text-white w-full rounded-full hover:scale-105 transition-transform duration-200">
                          {item.label}
                        </Button>
                      </Link>
                    ) : (
                      <button
                        key={item.label}
                        onClick={() => handleNavClick(item.href)}
                        className="text-left text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200 p-3 rounded-xl hover:bg-blue-50"
                      >
                        {item.label}
                      </button>
                    )
                  )}

                  {/* Mobile Authentication */}
                  <SignedOut>
                    <Link to="/sign-in" onClick={() => setIsOpen(false)}>
                      <Button className="gradient-primary text-white w-full rounded-full">
                        Get Started
                      </Button>
                    </Link>
                  </SignedOut>

                  <SignedIn>
                    <div className="mt-6 space-y-4">
                      {/* User Info Display */}
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.fullName || user?.firstName || "User"}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user?.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>
                      </div>

                      {/* Enhanced Red Sign Out Button */}
                      <button
                        onClick={handleMobileSignOut}
                        className="flex items-center justify-center space-x-2 w-full p-4 bg-red-600 text-white hover:bg-red-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] font-medium"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </SignedIn>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
