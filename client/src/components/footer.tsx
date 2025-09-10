import { useState } from "react";
import { Compass, Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleNewsletterSignup = () => {
    if (!email) {
      toast({
        title: t('enterEmail'),
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement newsletter subscription API
    toast({
      title: t('thankYouSubscribe'),
      description: t('receiveUpdates'),
    });
    setEmail("");
  };

  const footerSections = [
    {
      title: t('destinations'),
      links: [
        { label: t('netarhat'), href: "#" },
        { label: t('dassamFalls'), href: "#" },
        { label: t('ranchi'), href: "#" },
        { label: t('jamshedpur'), href: "#" },
        { label: t('allDestinations'), href: "#" },
      ],
    },
    {
      title: t('localServices'),
      links: [
        { label: t('tripPlanning'), href: "#" },
        { label: t('aiChatbot'), href: "#" },
        { label: t('localGuides'), href: "#" },
        { label: t('homestays'), href: "#" },
        { label: t('marketplace'), href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: "fab fa-facebook", href: "#", label: "Facebook" },
    { icon: "fab fa-twitter", href: "#", label: "Twitter" },
    { icon: "fab fa-instagram", href: "#", label: "Instagram" },
    { icon: "fab fa-youtube", href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1 animate-fade-in-up">
            <h4 className="text-2xl font-bold mb-4 flex items-center eco-gradient">
              <Compass className="mr-2 text-emerald-500 animate-pulse" />
              {t('brandName')}
            </h4>
            <p className="text-white/80 mb-6 leading-relaxed">
              {t('planPerfectTrip')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-primary/20 transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <i className={`${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
              <h5 className="font-semibold mb-4 text-white">{section.title}</h5>
              <ul className="space-y-3 text-white/70">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                      data-testid={`link-${section.title.toLowerCase()}-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Contact & Newsletter */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h5 className="font-semibold mb-4 text-white">{t('stayConnected')}</h5>
            <div className="space-y-3 text-white/70 mb-6">
              <div className="flex items-center space-x-3 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span data-testid="contact-email">{t('contactEmail')}</span>
              </div>
              <div className="flex items-center space-x-3 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span data-testid="contact-phone">{t('contactPhone')}</span>
              </div>
              <div className="flex items-center space-x-3 hover:text-white transition-colors">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span data-testid="contact-address">{t('contactAddress')}</span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-white/80 mb-3">{t('subscribeNewsletter')}</p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder={t('yourEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-r-none bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  data-testid="input-newsletter-email"
                />
                <Button 
                  onClick={handleNewsletterSignup}
                  className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-l-none hover:shadow-lg transition-all duration-300"
                  data-testid="button-newsletter-signup"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-white/60 text-sm" data-testid="copyright">
            © 2024 {t('brandName')}. {t('allRightsReserved')}
          </p>
          <div className="flex space-x-6 text-sm text-white/60 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors" data-testid="link-privacy">
              {t('privacyPolicy')}
            </a>
            <a href="#" className="hover:text-white transition-colors" data-testid="link-terms">
              {t('termsOfService')}
            </a>
            <a href="#" className="hover:text-white transition-colors" data-testid="link-support">
              {t('support')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
