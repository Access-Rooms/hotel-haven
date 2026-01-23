import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const requirements: PasswordRequirement[] = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "One special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const strength = requirements.filter((r) => r.met).length;

  const getStrengthLabel = () => {
    if (strength === 0) return { label: "Enter password", color: "bg-muted" };
    if (strength <= 2) return { label: "Weak", color: "bg-destructive" };
    if (strength <= 3) return { label: "Fair", color: "bg-yellow-500" };
    if (strength <= 4) return { label: "Good", color: "bg-blue-500" };
    return { label: "Strong", color: "bg-green-500" };
  };

  const strengthInfo = getStrengthLabel();

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Password strength</span>
          <span
            className={cn(
              "text-xs font-medium",
              strength === 0 && "text-muted-foreground",
              strength <= 2 && strength > 0 && "text-destructive",
              strength === 3 && "text-yellow-600",
              strength === 4 && "text-blue-600",
              strength === 5 && "text-green-600"
            )}
          >
            {strengthInfo.label}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              strengthInfo.color
            )}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="grid grid-cols-1 gap-1.5">
        {requirements.map((req, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors duration-200",
              req.met ? "text-green-600" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200",
                req.met
                  ? "bg-green-100 text-green-600"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {req.met ? (
                <Check className="w-3 h-3" />
              ) : (
                <X className="w-3 h-3" />
              )}
            </div>
            {req.label}
          </div>
        ))}
      </div>
    </div>
  );
};
