import * as React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";

type FormState = "idle" | "loading" | "success" | "error";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [phone, setPhone] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("+91");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [formState, setFormState] = React.useState<FormState>("idle");
  const [errors, setErrors] = React.useState<{
    phone?: string;
    password?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (phone.length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = phone.length >= 10 && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormState("loading");
    setErrors({});

    const response = await authService.login({ phoneNumber: phone, password });
    if (response.status) {
      setFormState("success");
      localStorage.setItem("user", JSON.stringify(response.data));
      
      // Check for redirect parameter and navigate to it, otherwise go to home
      const redirectUrl = searchParams.get("redirect");
      navigate(redirectUrl || "/");
    } else {
      setFormState("error");
      setErrors({ general: response.msg });
    }

  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage your bookings"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* General Error Banner */}
        {errors.general && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-destructive">
                {errors.general}
              </p>
              <p className="text-xs text-muted-foreground">
                Too many failed attempts may temporarily lock your account.
              </p>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {formState === "success" && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-600">
              Login successful! Redirecting...
            </p>
          </div>
        )}

        {/* Phone Input */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <PhoneInput
            value={phone}
            countryCode={countryCode}
            onChange={setPhone}
            onCountryCodeChange={setCountryCode}
            error={errors.phone}
            disabled={formState === "loading" || formState === "success"}
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            error={errors.password}
            disabled={formState === "loading" || formState === "success"}
          />
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            disabled={formState === "loading" || formState === "success"}
          />
          <Label
            htmlFor="remember"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Remember me for 30 days
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="w-full"
          disabled={!isFormValid || formState === "loading" || formState === "success"}
        >
          {formState === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging in...
            </>
          ) : formState === "success" ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Success!
            </>
          ) : (
            "Log in"
          )}
        </Button>

        {/* Signup Link */}
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
