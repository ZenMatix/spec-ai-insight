import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
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
import { Eye, EyeOff, ArrowLeft, Mail } from "lucide-react";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setErrors({});

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      toast.success("Verification code sent to your email!");
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
      toast.error("Sign up failed. Please check your information.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsVerifying(true);
    setErrors({});

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        toast.success("Account created successfully! Welcome aboard!");
        navigate("/");
      } else {
        console.log(completeSignUp);
      }
    } catch (err: any) {
      console.error("Error:", err);
      if (err.errors) {
        const newErrors: { [key: string]: string } = {};
        err.errors.forEach((error: any) => {
          newErrors.verification = error.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({
          verification: "Invalid verification code. Please try again.",
        });
      }
      toast.error("Verification failed. Please check your code.");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendCode = async () => {
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toast.success("Verification code resent!");
    } catch (err) {
      toast.error("Failed to resend code. Please try again.");
    }
  };

  if (pendingVerification) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: `url('https://qicraxjvaycdzyntnxtz.supabase.co/storage/v1/object/public/vdospec//Header.webp')`,
        }}
      >
        {/* Overlay for better contrast */}
        {/* <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div> */}

        <div className="w-full max-w-md relative z-10">
          <div className="mb-8 text-center">
            <button
              onClick={() => setPendingVerification(false)}
              className="appearance-none border-none inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all mb-6 shadow-md"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign Up
            </button>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
              <Mail className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2 drop-shadow-lg">
              Verify Your Email
            </h1>
            <p className="text-black/90 drop-shadow-md">
              We sent a verification code to <strong>{email}</strong>
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center text-slate-900">
                Enter Verification Code
              </CardTitle>
              <CardDescription className="text-center text-slate-600">
                Check your email and enter the 6-digit code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerification} className="space-y-6">
                {errors.verification && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {errors.verification}
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium text-center block">
                    Verification Code
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={verificationCode}
                      onChange={setVerificationCode}
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
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  disabled={isVerifying || verificationCode.length !== 6}
                >
                  {isVerifying ? "Verifying..." : "Verify Email"}
                </Button>

                <div className="text-center">
                  <p className="text-slate-600 text-sm">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      onClick={resendCode}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Resend
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url('https://qicraxjvaycdzyntnxtz.supabase.co/storage/v1/object/public/vdospec//Header.webp')`,
      }}
    >
      {/* Overlay for better contrast */}
      {/* <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div> */}

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
            Create Account
          </h1>
          <p className="text-black/90 drop-shadow-md">
            Join us to start analyzing specs with AI
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`transition-all duration-200 ${
                    errors.emailAddress
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  required
                />
                {errors.emailAddress && (
                  <p className="text-red-500 text-sm">{errors.emailAddress}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
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

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
