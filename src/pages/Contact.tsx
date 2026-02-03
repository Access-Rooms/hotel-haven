import { useState, useMemo } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { hotelConfig } from '@/data/hotelData';
import { useToast } from '@/hooks/use-toast';
import { useHotels } from '@/contexts/HotelContext';

export default function Contact() {
  const { selectedHotel } = useHotels();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Extract contact details from hotel
  const contactInfo = useMemo(() => {
    if (!selectedHotel) {
      return {
        address: hotelConfig.address,
        phone: hotelConfig.phone,
        email: hotelConfig.email,
        whatsapp: hotelConfig.whatsappNumber,
        receptionHours: '24/7 — Always at your service',
        location: hotelConfig.address,
        hotelName: selectedHotel?.hotelName,
      };
    }

    // Get phone number - try contactDetails first, then fallback
    const phoneNumbers = selectedHotel.contactDetails?.phoneNumber || [];
    const primaryPhone = Array.isArray(phoneNumbers) && phoneNumbers.length > 0
      ? (typeof phoneNumbers[0] === 'string' ? phoneNumbers[0] : phoneNumbers[0]?.number || phoneNumbers[0]?.phone || hotelConfig.phone)
      : hotelConfig.phone;

    // Get email - try contactDetails first, then hotel.email
    const emails = selectedHotel.contactDetails?.emailId || [];
    const primaryEmail = Array.isArray(emails) && emails.length > 0
      ? (typeof emails[0] === 'string' ? emails[0] : emails[0]?.email || emails[0]?.emailId || selectedHotel.email)
      : (selectedHotel.email || hotelConfig.email);

    // Build address
    const addressParts = [
      selectedHotel.address,
      selectedHotel.locationName,
      selectedHotel.townName,
      selectedHotel.state,
      selectedHotel.country,
    ].filter(Boolean);
    const fullAddress = addressParts.length > 0 
      ? addressParts.join(', ')
      : hotelConfig.address;

    // Reception hours
    const receptionHours = selectedHotel.is24HrsCheckin
      ? '24/7 — Always at your service'
      : selectedHotel.checkInTime && selectedHotel.checkOutTime
      ? `${selectedHotel.checkInTime} - ${selectedHotel.checkOutTime}`
      : '24/7 — Always at your service';

    // Location for map
    const mapLocation = selectedHotel.googleLocation || selectedHotel.address || fullAddress;

    return {
      address: fullAddress,
      phone: primaryPhone,
      email: primaryEmail,
      whatsapp: selectedHotel.whatsappNumber || hotelConfig.whatsappNumber,
      receptionHours,
      location: mapLocation,
      hotelName: selectedHotel.hotelName,
    };
  }, [selectedHotel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Message Sent!',
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleWhatsApp = () => {
    const whatsappNumber = contactInfo.whatsapp.replace(/\D/g, '');
    window.open(
      `https://wa.me/${whatsappNumber}?text=Hi, I have a question about ${contactInfo.hotelName}.`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header hotel={selectedHotel} />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-hero">
        <div className="container-hotel text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Reach out for reservations, inquiries, or just to say hello.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container-hotel">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our dedicated team is here to assist you 24/7. Whether you're planning your dream vacation or need assistance with an existing reservation, we're just a message away.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft">
                  <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center shrink-0">
                    <MapPin size={22} className="text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Address</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft">
                  <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center shrink-0">
                    <Phone size={22} className="text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    {contactInfo.phone && (
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="text-muted-foreground text-sm hover:text-primary transition-colors mt-1 block"
                      >
                        {contactInfo.phone}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft">
                  <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center shrink-0">
                    <Mail size={22} className="text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    {contactInfo.email && (
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-muted-foreground text-sm hover:text-primary transition-colors mt-1 block"
                      >
                        {contactInfo.email}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft">
                  <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center shrink-0">
                    <Clock size={22} className="text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Reception Hours</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {contactInfo.receptionHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-whatsapp to-whatsapp-dark text-white">
                <h3 className="font-display font-semibold text-lg mb-2">
                  Prefer WhatsApp?
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Get instant responses via WhatsApp. Our team typically replies within minutes.
                </p>
                <Button
                  variant="secondary"
                  onClick={handleWhatsApp}
                  className="bg-white text-whatsapp hover:bg-white/90"
                >
                  <MessageCircle size={18} />
                  Chat on WhatsApp
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-2xl shadow-card p-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary text-foreground"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary text-foreground"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary text-foreground"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary text-foreground"
                    >
                      <option value="">Select a subject</option>
                      <option value="reservation">Reservation Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="events">Events & Weddings</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary text-foreground resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button type="submit" variant="booking" size="lg" className="w-full">
                  <Send size={18} />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-muted/50">
        <div className="container-hotel">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Find Us Here
            </h2>
            <p className="text-muted-foreground mt-2">
              {selectedHotel?.locationName 
                ? `Located in ${selectedHotel.locationName}${selectedHotel.townName ? `, ${selectedHotel.townName}` : ''}${selectedHotel.state ? `, ${selectedHotel.state}` : ''}`
                : 'Find us on the map below'}
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card h-96 bg-muted flex items-center justify-center">
            <div className="text-center px-4">
              <MapPin size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Interactive map would be integrated here
              </p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(contactInfo.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline mt-2 inline-block"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer hotel={selectedHotel} />
      <WhatsAppButton />
    </div>
  );
}
