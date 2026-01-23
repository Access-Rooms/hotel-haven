import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Phone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countryCodes = [
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
];

interface PhoneInputProps {
  value: string;
  countryCode: string;
  onChange: (value: string) => void;
  onCountryCodeChange: (code: string) => void;
  error?: string;
  disabled?: boolean;
}

const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 5) return numbers;
  if (numbers.length <= 10) return `${numbers.slice(0, 5)} ${numbers.slice(5)}`;
  return `${numbers.slice(0, 5)} ${numbers.slice(5, 10)}`;
};

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, countryCode, onChange, onCountryCodeChange, error, disabled }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, "").slice(0, 10);
      onChange(rawValue);
    };

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
          <Select value={countryCode} onValueChange={onCountryCodeChange} disabled={disabled}>
            <SelectTrigger className="w-[100px] border-0 bg-transparent focus:ring-0 focus:ring-offset-0 rounded-l-xl">
              <SelectValue>
                <span className="flex items-center gap-1.5">
                  <span className="text-lg">
                    {countryCodes.find((c) => c.code === countryCode)?.flag}
                  </span>
                  <span className="text-sm font-medium">{countryCode}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{country.flag}</span>
                    <span>{country.country}</span>
                    <span className="text-muted-foreground">{country.code}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="h-8 w-px bg-border" />

          <div className="flex-1 flex items-center px-3">
            <Phone className="h-4 w-4 text-muted-foreground mr-2" />
            <input
              ref={ref}
              type="tel"
              inputMode="numeric"
              value={formatPhoneNumber(value)}
              onChange={handleChange}
              placeholder="98765 43210"
              disabled={disabled}
              className="flex-1 h-12 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
