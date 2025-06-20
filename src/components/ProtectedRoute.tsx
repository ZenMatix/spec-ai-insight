
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-transparent flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-lg border border-slate-200/50 rounded-2xl shadow-lg p-8 text-center max-w-md mx-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Sign In Required</h2>
            <p className="text-slate-600 mb-6">You need to sign in to access this page.</p>
            <RedirectToSignIn signInFallbackRedirectUrl="/Ai-chat" />
          </div>
        </div>
      </SignedOut>
    </>
  );
};

export default ProtectedRoute;
