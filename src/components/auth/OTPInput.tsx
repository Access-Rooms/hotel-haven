import * as React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

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
  const handleChange = (newValue: string) => {
    onChange(newValue);
    if (newValue.length === length) {
      onComplete?.(newValue);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-center">
        <InputOTP
          maxLength={length}
          value={value}
          onChange={handleChange}
          disabled={disabled}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-12 h-14 text-xl font-semibold border-2 border-border" />
            <InputOTPSlot index={1} className="w-12 h-14 text-xl font-semibold border-2 border-border" />
            <InputOTPSlot index={2} className="w-12 h-14 text-xl font-semibold border-2 border-border" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="w-12 h-14 text-xl font-semibold border-2 border-border" />
            <InputOTPSlot index={4} className="w-12 h-14 text-xl font-semibold border-2 border-border" />
            <InputOTPSlot index={5} className="w-12 h-14 text-xl font-semibold border-2 border-border" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};
