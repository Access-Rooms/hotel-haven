import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { companyConfig } from '@/data/companyData';
import { cn } from '@/lib/utils';

const quickMessages = [
  'Check room availability',
  'Book a room',
  'Modify booking',
  'Talk to support',
];

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedLocation, selectedHotel, selectedRoom } = useBooking();

  const getContextMessage = (baseMessage: string) => {
    const parts = [baseMessage];
    if (selectedRoom && selectedHotel) {
      parts.push(`for ${selectedRoom.name} at ${selectedHotel.name}`);
    } else if (selectedHotel) {
      parts.push(`at ${selectedHotel.name}`);
    }
    if (selectedLocation) {
      parts.push(`in ${selectedLocation.name}`);
    }
    return parts.join(' ');
  };

  const whatsappNumber = selectedHotel?.whatsappNumber || companyConfig.whatsappNumber;

  const handleQuickMessage = (message: string) => {
    const contextualMessage = getContextMessage(message);
    const encodedMessage = encodeURIComponent(contextualMessage);
    window.open(
      `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`,
      '_blank'
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={cn(
        'absolute bottom-20 right-0 w-72 bg-card rounded-2xl shadow-elevated overflow-hidden transition-all duration-300 origin-bottom-right',
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      )}>
        <div className="bg-whatsapp p-4">
          <h4 className="text-white font-semibold">Chat with us</h4>
          <p className="text-white/80 text-sm mt-1">
            {selectedHotel ? `${selectedHotel.name}` : companyConfig.name}
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
            onClick={() => handleQuickMessage('Hello, I have a question')}
            className="w-full py-3 bg-whatsapp text-white rounded-xl font-semibold hover:bg-whatsapp-dark transition-colors"
          >
            Start Chat
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn('whatsapp-float', isOpen && 'rotate-180')}
        aria-label="Chat on WhatsApp"
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white fill-white" />
        )}
      </button>

      {!isOpen && (
        <div className="absolute bottom-20 right-0 bg-card rounded-lg px-4 py-2 shadow-card whitespace-nowrap animate-fade-up">
          <p className="text-sm font-medium">Need help? Chat with us!</p>
          <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-card rotate-45" />
        </div>
      )}
    </div>
  );
}
