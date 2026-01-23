import * as React from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  disabled?: boolean;
  onComplete?: (otp: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  error,
  disabled,
  onComplete,
}) => {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.padEnd(length, "").slice(0, length).split("");

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return;

    // Handle paste
    if (inputValue.length > 1) {
      const pastedValue = inputValue.replace(/\D/g, "").slice(0, length);
      onChange(pastedValue);
      if (pastedValue.length === length) {
        onComplete?.(pastedValue);
      } else {
        focusInput(pastedValue.length);
      }
      return;
    }

    // Handle single digit
    const digit = inputValue.replace(/\D/g, "");
    if (digit) {
      const newValue = digits.map((d, i) => (i === index ? digit : d)).join("");
      onChange(newValue.replace(/ /g, ""));

      if (index < length - 1) {
        focusInput(index + 1);
      }

      if (index === length - 1) {
        const finalValue = newValue.replace(/ /g, "");
        if (finalValue.length === length) {
          onComplete?.(finalValue);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index] && digits[index] !== " ") {
        const newValue = digits.map((d, i) => (i === index ? "" : d)).join("");
        onChange(newValue.replace(/ /g, ""));
      } else if (index > 0) {
        const newValue = digits.map((d, i) => (i === index - 1 ? "" : d)).join("");
        onChange(newValue.replace(/ /g, ""));
        focusInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pastedData);
    if (pastedData.length === length) {
      onComplete?.(pastedData);
    } else {
      focusInput(pastedData.length);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <React.Fragment key={index}>
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={length}
              value={digit === " " ? "" : digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              disabled={disabled}
              className={cn(
                "w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-semibold rounded-xl border bg-background transition-all duration-200 outline-none",
                error
                  ? "border-destructive ring-2 ring-destructive/20"
                  : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20",
                disabled && "opacity-50 cursor-not-allowed",
                digit && digit !== " " && "border-primary bg-primary/5"
              )}
              aria-label={`Digit ${index + 1}`}
            />
            {index === 2 && (
              <div className="flex items-center">
                <span className="text-muted-foreground text-2xl">-</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive text-center animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};
