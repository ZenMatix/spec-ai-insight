import { useState, useEffect } from "react";
import { useSignIn, useAuth, useClerk } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, CheckCircle, LogOut } from "lucide-react";

const SignIn = () => {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  
  // Redirect immediately if already signed in
  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      // Small delay to prevent flash of content
      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthLoaded, isSignedIn, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [isCodeVerification, setIsCodeVerification] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Show loading while checking auth state
  if (!isAuthLoaded || !isLoaded) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: `url('https://qicraxjvaycdzyntnxtz.supabase.co/storage/v1/object/public/vdospec//Header.webp')`,
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-black/70 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is signed in, show redirect message (brief flash before redirect)
  if (isSignedIn) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: `url('https://qicraxjvaycdzyntnxtz.supabase.co/storage/v1/object/public/vdospec//Header.webp')`,
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-black/70 mt-4">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Clerk is loaded and auth state is available
    if (!isLoaded || !isAuthLoaded) {
      toast.error("Please wait while we initialize...");
      return;
    }

    // Prevent sign-in if user is already signed in
    if (isSignedIn) {
      toast.info("You're already signed in. Redirecting...");
      navigate("/", { replace: true });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Welcome back!");
        navigate("/", { replace: true });
      } else {
        console.log(result);
      }
    } catch (err: any) {
      console.error("Error:", err);
      if (err.errors) {
        const newErrors: { [key: string]: string } = {};
        err.errors.forEach((error: any) => {
          if (error.meta?.paramName) {
            newErrors[error.meta.paramName] = error.message;
          } else {
            newErrors.general = error.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: "An error occurred. Please try again." });
      }
      toast.error("Sign in failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !email) {
      toast.error("Please enter your email address first.");
      return;
    }

    setIsResetLoading(true);
    setErrors({});

    try {
      await signIn.create({
        identifier: email,
      });

      const firstFactor = signIn.supportedFirstFactors.find(
        (factor) => factor.strategy === "reset_password_email_code"
      );

      if (firstFactor) {
        await signIn.prepareFirstFactor({
          strategy: "reset_password_email_code",
          emailAddressId: firstFactor.emailAddressId,
        });

        toast.success("Password reset email sent! Check your inbox.");
        setIsCodeVerification(true);
        setIsForgotPassword(false);
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      if (err.errors) {
        const newErrors: { [key: string]: string } = {};
        err.errors.forEach((error: any) => {
          newErrors.general = error.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: "Failed to send reset email. Please try again." });
      }
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setIsResetLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    if (verificationCode.length !== 6) {
      setErrors({ verificationCode: "Please enter the complete 6-digit code" });
      return;
    }

    setIsPasswordResetLoading(true);
    setErrors({});

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: verificationCode,
        password: newPassword,
      });

      if (result.status === "complete") {
        // Set the session to complete the sign-in process
        await setActive({ session: result.createdSessionId });
        toast.success("Password reset successful! You are now signed in.");
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      console.error("Password reset error:", err);
      if (err.errors) {
        const newErrors: { [key: string]: string } = {};
        err.errors.forEach((error: any) => {
          if (error.meta?.paramName === "code") {
            newErrors.verificationCode = error.message;
          } else if (error.meta?.paramName === "password") {
            newErrors.newPassword = error.message;
          } else {
            newErrors.general = error.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: "Password reset failed. Please try again." });
      }
      toast.error("Password reset failed. Please try again.");
    } finally {
      setIsPasswordResetLoading(false);
    }
  };

  const resetToSignIn = () => {
    setIsForgotPassword(false);
    setIsCodeVerification(false);
    setIsResetSuccess(false);
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url('https://qicraxjvaycdzyntnxtz.supabase.co/storage/v1/object/public/vdospec//Header.webp')`,
      }}
    >
      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="appearance-none border-none inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all mb-6 shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-black mb-2 drop-shadow-lg">
            {isResetSuccess ? "Password Reset Complete" : isCodeVerification ? "Reset Your Password" : isForgotPassword ? "Reset Password" : "Welcome Back"}
          </h1>
          <p className="text-black/90 drop-shadow-md">
            {isResetSuccess 
              ? "Your password has been successfully reset"
              : isCodeVerification 
              ? "Enter the code from your email and set a new password"
              : isForgotPassword 
              ? "Enter your email to receive a password reset link"
              : "Sign in to your account to continue"
            }
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">
              {isResetSuccess ? "Success!" : isCodeVerification ? "Reset Password" : isForgotPassword ? "Reset Password" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              {isResetSuccess 
                ? "You can now sign in with your new password"
                : isCodeVerification 
                ? "Enter the verification code and your new password"
                : isForgotPassword 
                ? "We'll send you a password reset email"
                : "Enter your credentials to access your account"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isResetSuccess ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900">Password Reset Complete!</h3>
                  <p className="text-slate-600">
                    Your password has been successfully updated. You can now sign in with your new password.
                  </p>
                </div>
                <Button
                  onClick={resetToSignIn}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Continue to Sign In
                </Button>
              </div>
            ) : isCodeVerification ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                {errors.general && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {errors.general}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="verificationCode" className="text-slate-700 font-medium">
                    Verification Code
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={verificationCode}
                      onChange={(value) => {
                        setVerificationCode(value);
                        if (errors.verificationCode) {
                          setErrors(prev => ({ ...prev, verificationCode: "" }));
                        }
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {errors.verificationCode && (
                    <p className="text-red-500 text-sm text-center">{errors.verificationCode}</p>
                  )}
                  <p className="text-xs text-slate-500 text-center">
                    Enter the 6-digit code from your email
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-700 font-medium">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`transition-all duration-200 ${
                      errors.newPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                    required
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`transition-all duration-200 ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  disabled={isPasswordResetLoading}
                >
                  {isPasswordResetLoading ? (
                    <>
                      <Lock className="w-4 h-4 mr-2 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Reset Password
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit} className="space-y-4">
                {errors.general && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {errors.general}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`transition-all duration-200 ${
                      errors.identifier
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                    required
                  />
                  {errors.identifier && (
                    <p className="text-red-500 text-sm">{errors.identifier}</p>
                  )}
                </div>

                {!isForgotPassword && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pr-10 transition-all duration-200 ${
                          errors.password
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  disabled={isForgotPassword ? isResetLoading : isLoading}
                >
                  {isForgotPassword ? (
                    isResetLoading ? (
                      <>
                        <Mail className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Reset Email
                      </>
                    )
                  ) : (
                    isLoading ? "Signing In..." : "Sign In"
                  )}
                </Button>
              </form>
            )}

            {!isForgotPassword && !isCodeVerification && !isResetSuccess && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsForgotPassword(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {(isForgotPassword || isCodeVerification) && !isResetSuccess && (
              <div className="mt-4 text-center">
                <button
                  onClick={resetToSignIn}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            )}

            {!isResetSuccess && (
              <div className="mt-6 text-center">
                <p className="text-slate-600">
                  Don't have an account?{" "}
                  <Link
                    to="/sign-up"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
