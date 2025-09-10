import { useState, useEffect, useRef } from "react";
import { Menu, Globe, X, Compass, Search, Bell, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NavigationHeader() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Safely get navigation items with fallback
  const navItems = [
    { href: "#destinations", label: t('destinations') || 'Destinations', testId: "nav-destinations", icon: "🏖️" },
    { href: "#itinerary", label: t('planTrip') || 'Plan Trip', testId: "nav-plan-trip", icon: "📋" },
    { href: "#experiences", label: t('experiences') || 'Experiences', testId: "nav-experiences", icon: "🎯" },
    { href: "#marketplace", label: t('localServices') || 'Local Services', testId: "nav-local-services", icon: "🛍️" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside for user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'glass-morphism-intense border-b border-white/20 shadow-2xl backdrop-blur-xl' 
        : 'glass-morphism border-b border-white/10 shadow-lg'
    } animate-slide-in-left`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold flex items-center cursor-pointer group" data-testid="logo">
                <div className="relative mr-3">
                  <Compass className="h-8 w-8 text-emerald-500 animate-float-3d group-hover:rotate-180 transition-transform duration-700" />
                  <div className="absolute inset-0 h-8 w-8 bg-emerald-500/20 rounded-full animate-pulse"></div>
                </div>
                <span className="relative eco-gradient">
                  EcoRahi
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 group-hover:w-full transition-all duration-500"></div>
                </span>
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-2">
                {navItems.map((item, index) => (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className="text-foreground/80 hover:text-primary transition-all duration-300 px-4 py-3 text-sm font-semibold relative group card-3d rounded-xl"
                    data-testid={item.testId}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      {item.label}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                    <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2 rounded-full"></span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              {showSearch ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search destinations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSearch(false)}
                    className="ml-2 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearch(true)}
                  className="h-10 w-10 p-0 hover:bg-white/10 rounded-xl transition-all duration-300"
                  data-testid="search-toggle"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex h-10 w-10 p-0 hover:bg-white/10 rounded-xl transition-all duration-300 relative"
              data-testid="notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse"></span>
            </Button>

            {/* Language Selector */}
            <div className="hidden sm:flex space-x-1 glass-morphism rounded-2xl p-1">
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('en')}
                data-testid="language-en"
                className={`h-9 px-3 text-xs font-semibold transition-all duration-300 rounded-xl ${language === 'en'
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105'
                  : 'hover:bg-white/10 hover:scale-105'
                  }`}
              >
                <Globe className="h-3 w-3 mr-1" />
                EN
              </Button>
              <Button
                variant={language === 'hi' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('hi')}
                data-testid="language-hi"
                className={`h-9 px-3 text-xs font-semibold transition-all duration-300 rounded-xl ${language === 'hi'
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105'
                  : 'hover:bg-white/10 hover:scale-105'
                  }`}
              >
                <Globe className="h-3 w-3 mr-1" />
                हिं
              </Button>
            </div>

            {/* User Menu */}
            <div className="hidden md:block relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="h-10 px-3 hover:bg-white/10 rounded-xl transition-all duration-300 flex items-center gap-2"
                data-testid="user-menu"
              >
                <div className="h-6 w-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </Button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-48 glass-morphism rounded-xl border border-white/20 shadow-xl py-2 animate-in slide-in-from-top-2 duration-200 z-50">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors rounded-lg mx-1">
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors rounded-lg mx-1">
                    My Trips
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors rounded-lg mx-1">
                    Settings
                  </button>
                  <hr className="my-2 border-white/10" />
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors text-red-400 rounded-lg mx-1">
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:bg-white/10 transition-all duration-300 rounded-xl"
                  data-testid="mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 glass-morphism border-l border-white/20">
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Mobile Header */}
                  <div className="flex items-center space-x-3 pb-4 border-b border-white/20">
                    <div className="relative">
                      <Compass className="h-6 w-6 text-emerald-500 animate-float-3d" />
                      <div className="absolute inset-0 h-6 w-6 bg-emerald-500/20 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-lg font-semibold eco-gradient">EcoRahi</span>
                  </div>

                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search destinations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                    />
                  </div>

                  {/* Mobile Navigation */}
                  <div className="space-y-2">
                    {navItems.map((item, index) => (
                      <button
                        key={item.href}
                        onClick={() => scrollToSection(item.href)}
                        className="flex items-center w-full text-left px-4 py-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-white/10 rounded-xl transition-all duration-300 group"
                        data-testid={`mobile-${item.testId}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                        <div className="w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-6 transition-all duration-300 rounded-full"></div>
                      </button>
                    ))}
                  </div>

                  {/* Mobile User Section */}
                  <div className="pt-4 border-t border-white/20 space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-xl">
                      <div className="h-8 w-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Guest User</p>
                        <p className="text-xs text-muted-foreground">Sign in for personalized experience</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Notifications</span>
                      </div>
                      <div className="h-2 w-2 bg-accent rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Mobile Language Selector */}
                  <div className="pt-4 border-t border-white/20">
                    <p className="text-sm font-medium text-muted-foreground mb-3 px-1">Language</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={language === 'en' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLanguage('en')}
                        className={`h-12 transition-all duration-300 ${language === 'en'
                          ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105'
                          : 'border-white/20 hover:bg-white/10 hover:scale-105'
                          }`}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        English
                      </Button>
                      <Button
                        variant={language === 'hi' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLanguage('hi')}
                        className={`h-12 transition-all duration-300 ${language === 'hi'
                          ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105'
                          : 'border-white/20 hover:bg-white/10 hover:scale-105'
                          }`}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        हिंदी
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
