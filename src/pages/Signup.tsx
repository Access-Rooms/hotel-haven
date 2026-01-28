import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, CheckCircle2, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";

type FormState = "idle" | "loading" | "success" | "error";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+91",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [formState, setFormState] = React.useState<FormState>("idle");
  const [errors, setErrors] = React.useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: string;
    general?: string;
  }>({});

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPasswordStrong = () => {
    const { password } = formData;
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isPasswordStrong()) {
      newErrors.password = "Password does not meet requirements";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    validateEmail(formData.email) &&
    formData.phone.length >= 10 &&
    isPasswordStrong() &&
    formData.password === formData.confirmPassword &&
    formData.acceptTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormState("loading");
    setErrors({});
    const payload = {
      phoneNumber: formData.phone,
      name: formData.firstName + " " + formData.lastName,
      email: formData.email,
      password: formData.password,
      whatsappCountryCode: formData.countryCode
    }

    const response = await authService.signup(payload);
    console.log(response);
    if (response.status == true) {
      setFormState("success");
      navigate("/verify-otp", { state: { email: formData.email } });
    } else {
      setFormState("error");
      setErrors({ general: response.msg });
    }
    
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join us and start booking your perfect stay"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error Banner */}
        {errors.general && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{errors.general}</p>
          </div>
        )}

        {/* Success Banner */}
        {formState === "success" && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-600">
              Account created! Verify your email...
            </p>
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </Label>
            <div
              className={cn(
                "flex items-center rounded-xl border bg-background transition-all duration-200",
                errors.firstName
                  ? "border-destructive ring-2 ring-destructive/20"
                  : "border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
              )}
            >
              <div className="flex items-center px-3">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="John"
                disabled={formState === "loading" || formState === "success"}
                className="flex-1 h-12 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed pr-3"
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-destructive animate-fade-in">
                {errors.firstName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </Label>
            <div
              className={cn(
                "flex items-center rounded-xl border bg-background transition-all duration-200",
                errors.lastName
                  ? "border-destructive ring-2 ring-destructive/20"
                  : "border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
              )}
            >
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Doe"
                disabled={formState === "loading" || formState === "success"}
                className="flex-1 h-12 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed px-3"
              />
            </div>
            {errors.lastName && (
              <p className="text-xs text-destructive animate-fade-in">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <div
            className={cn(
              "flex items-center rounded-xl border bg-background transition-all duration-200",
              errors.email
                ? "border-destructive ring-2 ring-destructive/20"
                : "border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
            )}
          >
            <div className="flex items-center px-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john@example.com"
              disabled={formState === "loading" || formState === "success"}
              className="flex-1 h-12 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed pr-3"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive animate-fade-in">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Input */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <PhoneInput
            value={formData.phone}
            countryCode={formData.countryCode}
            onChange={(value) => updateField("phone", value)}
            onCountryCodeChange={(code) => updateField("countryCode", code)}
            error={errors.phone}
            disabled={formState === "loading" || formState === "success"}
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <PasswordInput
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder="Create a strong password"
            error={errors.password}
            disabled={formState === "loading" || formState === "success"}
          />
          {formData.password && (
            <PasswordStrengthMeter password={formData.password} />
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </Label>
          <PasswordInput
            value={formData.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            placeholder="Re-enter your password"
            error={errors.confirmPassword}
            disabled={formState === "loading" || formState === "success"}
          />
        </div>

        {/* Terms Checkbox */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) =>
                updateField("acceptTerms", checked as boolean)
              }
              disabled={formState === "loading" || formState === "success"}
              className="mt-0.5"
            />
            <Label
              htmlFor="terms"
              className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
            >
              I agree to the{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-xs text-destructive animate-fade-in">
              {errors.acceptTerms}
            </p>
          )}
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
              Creating account...
            </>
          ) : formState === "success" ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Success!
            </>
          ) : (
            "Create account"
          )}
        </Button>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
