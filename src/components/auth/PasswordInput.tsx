import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ value, onChange, placeholder = "Enter password", error, disabled, name, id }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="space-y-2">
        <div
          className={cn(
            "flex items-center rounded-xl border bg-background transition-all duration-200",
            error
              ? "border-destructive ring-2 ring-destructive/20"
              : "border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex items-center px-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>

          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            name={name}
            id={id}
            className="flex-1 h-12 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="px-3 h-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:cursor-not-allowed"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {error && (
          <p className="text-sm text-destructive animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
