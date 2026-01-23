import * as React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { OTPInput } from "@/components/auth/OTPInput";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Mail,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FormState = "idle" | "loading" | "success" | "error";
type ResendState = "idle" | "cooldown" | "sending";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "user@example.com";

  const [otp, setOtp] = React.useState("");
  const [formState, setFormState] = React.useState<FormState>("idle");
  const [resendState, setResendState] = React.useState<ResendState>("idle");
  const [cooldownTime, setCooldownTime] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [attempts, setAttempts] = React.useState(0);

  // Cooldown timer
  React.useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => setCooldownTime((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (cooldownTime === 0 && resendState === "cooldown") {
      setResendState("idle");
    }
  }, [cooldownTime, resendState]);

  const maskEmail = (email: string) => {
    const [local, domain] = email.split("@");
    if (local.length <= 2) return email;
    return `${local.slice(0, 2)}${"*".repeat(local.length - 2)}@${domain}`;
  };

  const handleVerify = async (otpValue: string) => {
    setFormState("loading");
    setError(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate wrong OTP for demo
    if (otpValue === "000000") {
      setFormState("error");
      setAttempts((a) => a + 1);
      setError("Invalid verification code. Please try again.");
      return;
    }

    // Simulate expired OTP
    if (otpValue === "111111") {
      setFormState("error");
      setError("This code has expired. Please request a new one.");
      return;
    }

    setFormState("success");

    // Redirect after success
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleResend = async () => {
    setResendState("sending");
    setError(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setResendState("cooldown");
    setCooldownTime(60);
    setOtp("");
    setAttempts(0);
  };

  const handleOtpComplete = (value: string) => {
    handleVerify(value);
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`Enter the 6-digit code sent to ${maskEmail(email)}`}
    >
      <div className="space-y-6">
        {/* Email indicator */}
        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-muted/50">
          <Mail className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{email}</span>
        </div>

        {/* Error Banner */}
        {error && formState === "error" && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-destructive">{error}</p>
              {attempts >= 2 && (
                <p className="text-xs text-muted-foreground">
                  {3 - attempts} attempts remaining before lockout.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Success Banner */}
        {formState === "success" && (
          <div className="flex flex-col items-center gap-4 py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 animate-scale-in" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold text-green-600">Email verified!</p>
              <p className="text-sm text-muted-foreground">
                Redirecting you to the app...
              </p>
            </div>
          </div>
        )}

        {/* OTP Input */}
        {formState !== "success" && (
          <>
            <OTPInput
              value={otp}
              onChange={setOtp}
              error={formState === "error" ? undefined : undefined}
              disabled={formState === "loading"}
              onComplete={handleOtpComplete}
            />

            {/* Verify Button */}
            <Button
              type="button"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={otp.length < 6 || formState === "loading"}
              onClick={() => handleVerify(otp)}
            >
              {formState === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>

            {/* Resend Section */}
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>

              {resendState === "cooldown" ? (
                <p className="text-sm text-muted-foreground">
                  Resend available in{" "}
                  <span className="font-semibold text-foreground">
                    {cooldownTime}s
                  </span>
                </p>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResend}
                  disabled={resendState === "sending"}
                  className="gap-2"
                >
                  {resendState === "sending" ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3" />
                      Resend code
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Change Email */}
            <div className="pt-4 border-t">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full gap-2 text-muted-foreground"
                onClick={() => navigate("/signup")}
              >
                <ArrowLeft className="w-3 h-3" />
                Use a different email
              </Button>
            </div>
          </>
        )}

        {/* Security note */}
        <p className="text-xs text-center text-muted-foreground">
          For security, this code expires in 10 minutes.
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;
