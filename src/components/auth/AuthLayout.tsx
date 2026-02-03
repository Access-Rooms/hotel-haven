import * as React from "react";
import { Link } from "react-router-dom";
import { hotelConfig } from "@/data/hotelData";
import { Shield, Lock } from "lucide-react";
import { useHotels } from "@/contexts/HotelContext";
import { useEffect } from "react";


interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const { selectedHotel } = useHotels();
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">
              {selectedHotel?.hotelName.charAt(0)}
            </span>
          </div>
          <span className="font-display font-semibold text-lg">
            {selectedHotel?.hotelName}
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-card rounded-2xl shadow-card border p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground">{subtitle}</p>
              )}
            </div>

            {/* Form Content */}
            {children}
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>256-bit SSL encrypted</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Secure login</span>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <span>By continuing, you agree to our </span>
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
            <span> and </span>
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
