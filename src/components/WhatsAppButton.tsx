import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { hotelConfig } from '@/data/hotelData';
import { cn } from '@/lib/utils';

const quickMessages = [
  'Check room availability',
  'Book a room',
  'Modify booking',
  'Talk to support',
];

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleQuickMessage = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${hotelConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`,
      '_blank'
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Actions Panel */}
      <div className={cn(
        'absolute bottom-20 right-0 w-72 bg-card rounded-2xl shadow-elevated overflow-hidden transition-all duration-300 origin-bottom-right',
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      )}>
        <div className="bg-whatsapp p-4">
          <h4 className="text-white font-semibold">Chat with us</h4>
          <p className="text-white/80 text-sm mt-1">
            Hi! How can we help you today?
          </p>
        </div>
        <div className="p-4 space-y-2">
          {quickMessages.map((message) => (
            <button
              key={message}
              onClick={() => handleQuickMessage(message)}
              className="w-full text-left px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
            >
              {message}
            </button>
          ))}
        </div>
        <div className="px-4 pb-4">
          <button
            onClick={() => handleQuickMessage('Hello, I have a question about my stay.')}
            className="w-full py-3 bg-whatsapp text-white rounded-xl font-semibold hover:bg-whatsapp-dark transition-colors"
          >
            Start Chat
          </button>
        </div>
      </div>

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'whatsapp-float',
          isOpen && 'rotate-180'
        )}
        aria-label="Chat on WhatsApp"
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white fill-white" />
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-20 right-0 bg-card rounded-lg px-4 py-2 shadow-card whitespace-nowrap animate-fade-up">
          <p className="text-sm font-medium">Need help? Chat with us!</p>
          <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-card rotate-45" />
        </div>
      )}
    </div>
  );
}
