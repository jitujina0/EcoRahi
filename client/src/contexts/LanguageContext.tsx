import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Brand
    brandName: "EcoRahi",
    
    // Navigation
    destinations: "Destinations",
    planTrip: "Plan Trip",
    experiences: "Experiences",
    localServices: "Local Services",
    login: "Login",
    logout: "Logout",
    profile: "Profile",
    myTrips: "My Trips",
    settings: "Settings",
    signOut: "Sign Out",
    notifications: "Notifications",
    
    // Search
    searchDestinations: "Search destinations...",
    searching: "Searching",
    searchComplete: "Search Complete!",
    searchFailed: "Search Failed",
    noResults: "No destinations found matching your criteria. Try adjusting your search parameters.",
    foundResults: "Found {count} destinations matching your criteria",
    tryPopular: "Try searching for popular destinations like",
    
    // Hero Section
    discoverDestinations: "Discover Amazing Destinations",
    planPerfectTrip: "Plan your perfect trip with AI-powered recommendations and local insights",
    whereToGo: "Where to?",
    enterDestination: "Try: Netarhat, Dassam Falls, Ranchi...",
    duration: "Duration",
    selectDuration: "Select duration",
    budget: "Budget",
    selectBudget: "Select budget",
    travelStyle: "Travel Style", 
    selectStyle: "Select style",
    findMyTrip: "Find My Perfect Trip",
    
    // Duration Options
    duration1to2: "1-2 days",
    duration3to5: "3-5 days",
    duration1week: "1 week",
    duration2weeks: "2+ weeks",
    
    // Budget Options
    budget5to10: "₹5,000-10,000",
    budget10to25: "₹10,000-25,000",
    budget25to50: "₹25,000-50,000",
    budget50plus: "₹50,000+",
    
    // Travel Style Options
    adventure: "Adventure",
    cultural: "Cultural",
    relaxation: "Relaxation",
    nature: "Nature",
    
    // Quick Filters
    hillStations: "Hill Stations",
    waterfalls: "Waterfalls",
    heritageSites: "Heritage Sites",
    wildlife: "Wildlife",
    
    // Results
    searchResults: "Search Results",
    foundMatches: "Found {count} perfect matches for your trip",
    perPerson: "per person",
    bookNow: "Book Now",
    day: "day",
    days: "days",
    
    // Common Actions
    loading: "Loading...",
    search: "Search",
    book: "Book",
    explore: "Explore",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    
    // Landing Page
    welcome: "Welcome to EcoRahi",
    loginToStart: "Login to start planning your journey",
    loginButton: "Login with Replit",
    whyChoose: "Why Choose EcoRahi?",
    whyChooseDesc: "Discover the power of AI-driven travel planning with local insights",
    readyToStart: "Ready to Start Your Journey?",
    readyToStartDesc: "Join thousands of travelers who trust EcoRahi for their perfect trips",
    
    // Features
    aiPoweredPlanning: "AI-Powered Planning",
    aiPoweredPlanningDesc: "Get personalized travel recommendations based on your preferences and budget",
    interactiveMaps: "Interactive Maps",
    interactiveMapsDesc: "Explore destinations with real-time weather and transport updates",
    localServicesTitle: "Local Services",
    localServicesDesc: "Connect with local guides, homestays, and authentic experiences",
    
    // Footer
    stayConnected: "Stay Connected",
    subscribeNewsletter: "Subscribe for travel tips and deals",
    yourEmail: "Your email",
    thankYouSubscribe: "Thank you for subscribing!",
    receiveUpdates: "You'll receive our latest travel tips and deals.",
    enterEmail: "Please enter your email",
    allRightsReserved: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    support: "Support",
    
    // Contact
    contactEmail: "hello@ecorahi.com",
    contactPhone: "+91 9876543210",
    contactAddress: "Ranchi, Jharkhand",
    
    // Destinations
    tripPlanning: "Trip Planning",
    aiChatbot: "AI Chatbot",
    localGuides: "Local Guides",
    homestays: "Homestays",
    marketplace: "Marketplace",
    allDestinations: "All Destinations",
    
    // User
    guestUser: "Guest User",
    signInPersonalized: "Sign in for personalized experience",
    
    // Language
    language: "Language",
    english: "English",
    hindi: "हिंदी",
    
    // Errors & Messages
    pleaseEnterDestination: "Please enter a destination",
    unableToSearch: "Unable to search destinations. Please try again.",
    
    // Popular Destinations
    netarhat: "Netarhat",
    dassamFalls: "Dassam Falls",
    ranchi: "Ranchi",
    betlaNationalPark: "Betla National Park",
    hundruFalls: "Hundru Falls",
    deoghar: "Deoghar",
    parasnathHill: "Parasnath Hill",
    jamshedpur: "Jamshedpur",
  },
  hi: {
    // Brand
    brandName: "इकोराही",
    
    // Navigation
    destinations: "गंतव्य",
    planTrip: "यात्रा की योजना",
    experiences: "अनुभव",
    localServices: "स्थानीय सेवाएं", 
    login: "लॉगिन",
    logout: "लॉगआउट",
    profile: "प्रोफ़ाइल",
    myTrips: "मेरी यात्राएं",
    settings: "सेटिंग्स",
    signOut: "साइन आउट",
    notifications: "सूचनाएं",
    
    // Search
    searchDestinations: "गंतव्य खोजें...",
    searching: "खोज रहे हैं",
    searchComplete: "खोज पूर्ण!",
    searchFailed: "खोज असफल",
    noResults: "आपके मानदंडों से मेल खाने वाले कोई गंतव्य नहीं मिले। अपने खोज पैरामीटर समायोजित करने का प्रयास करें।",
    foundResults: "आपके मानदंडों से मेल खाने वाले {count} गंतव्य मिले",
    tryPopular: "लोकप्रिय गंतव्यों की खोज करने का प्रयास करें जैसे",
    
    // Hero Section
    discoverDestinations: "अद्भुत गंतव्यों की खोज करें",
    planPerfectTrip: "AI-संचालित सुझावों और स्थानीय जानकारी के साथ अपनी सही यात्रा की योजना बनाएं",
    whereToGo: "कहाँ जाना है?",
    enterDestination: "कोशिश करें: नेतरहाट, दशम फॉल्स, रांची...",
    duration: "अवधि",
    selectDuration: "अवधि चुनें",
    budget: "बजट",
    selectBudget: "बजट चुनें",
    travelStyle: "यात्रा शैली",
    selectStyle: "शैली चुनें", 
    findMyTrip: "मेरी सही यात्रा खोजें",
    
    // Duration Options
    duration1to2: "1-2 दिन",
    duration3to5: "3-5 दिन",
    duration1week: "1 सप्ताह",
    duration2weeks: "2+ सप्ताह",
    
    // Budget Options
    budget5to10: "₹5,000-10,000",
    budget10to25: "₹10,000-25,000",
    budget25to50: "₹25,000-50,000",
    budget50plus: "₹50,000+",
    
    // Travel Style Options
    adventure: "साहसिक",
    cultural: "सांस्कृतिक",
    relaxation: "आराम",
    nature: "प्रकृति",
    
    // Quick Filters
    hillStations: "पहाड़ी स्टेशन",
    waterfalls: "झरने",
    heritageSites: "विरासत स्थल",
    wildlife: "वन्यजीव",
    
    // Results
    searchResults: "खोज परिणाम",
    foundMatches: "आपकी यात्रा के लिए {count} सही मैच मिले",
    perPerson: "प्रति व्यक्ति",
    bookNow: "अभी बुक करें",
    day: "दिन",
    days: "दिन",
    
    // Common Actions
    loading: "लोड हो रहा है...",
    search: "खोजें",
    book: "बुक करें",
    explore: "एक्सप्लोर करें",
    cancel: "रद्द करें",
    save: "सेव करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    
    // Landing Page
    welcome: "इकोराही में आपका स्वागत है",
    loginToStart: "अपनी यात्रा की योजना शुरू करने के लिए लॉगिन करें",
    loginButton: "Replit के साथ लॉगिन करें",
    whyChoose: "इकोराही क्यों चुनें?",
    whyChooseDesc: "स्थानीय जानकारी के साथ AI-संचालित यात्रा योजना की शक्ति खोजें",
    readyToStart: "अपनी यात्रा शुरू करने के लिए तैयार हैं?",
    readyToStartDesc: "हजारों यात्रियों के साथ जुड़ें जो अपनी सही यात्राओं के लिए इकोराही पर भरोसा करते हैं",
    
    // Features
    aiPoweredPlanning: "AI-संचालित योजना",
    aiPoweredPlanningDesc: "अपनी प्राथमिकताओं और बजट के आधार पर व्यक्तिगत यात्रा सुझाव प्राप्त करें",
    interactiveMaps: "इंटरैक्टिव मानचित्र",
    interactiveMapsDesc: "वास्तविक समय मौसम और परिवहन अपडेट के साथ गंतव्यों का अन्वेषण करें",
    localServicesTitle: "स्थानीय सेवाएं",
    localServicesDesc: "स्थानीय गाइड, होमस्टे और प्रामाणिक अनुभवों से जुड़ें",
    
    // Footer
    stayConnected: "जुड़े रहें",
    subscribeNewsletter: "यात्रा टिप्स और डील्स के लिए सब्सक्राइब करें",
    yourEmail: "आपका ईमेल",
    thankYouSubscribe: "सब्सक्राइब करने के लिए धन्यवाद!",
    receiveUpdates: "आपको हमारी नवीनतम यात्रा टिप्स और डील्स प्राप्त होंगी।",
    enterEmail: "कृपया अपना ईमेल दर्ज करें",
    allRightsReserved: "सभी अधिकार सुरक्षित।",
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा की शर्तें",
    support: "सहायता",
    
    // Contact
    contactEmail: "hello@ecorahi.com",
    contactPhone: "+91 9876543210",
    contactAddress: "रांची, झारखंड",
    
    // Destinations
    tripPlanning: "यात्रा योजना",
    aiChatbot: "AI चैटबॉट",
    localGuides: "स्थानीय गाइड",
    homestays: "होमस्टे",
    marketplace: "मार्केटप्लेस",
    allDestinations: "सभी गंतव्य",
    
    // User
    guestUser: "अतिथि उपयोगकर्ता",
    signInPersonalized: "व्यक्तिगत अनुभव के लिए साइन इन करें",
    
    // Language
    language: "भाषा",
    english: "English",
    hindi: "हिंदी",
    
    // Errors & Messages
    pleaseEnterDestination: "कृपया एक गंतव्य दर्ज करें",
    unableToSearch: "गंतव्य खोजने में असमर्थ। कृपया पुनः प्रयास करें।",
    
    // Popular Destinations
    netarhat: "नेतरहाट",
    dassamFalls: "दशम फॉल्स",
    ranchi: "रांची",
    betlaNationalPark: "बेतला राष्ट्रीय उद्यान",
    hundruFalls: "हुंद्रू फॉल्स",
    deoghar: "देवघर",
    parasnathHill: "पारसनाथ हिल",
    jamshedpur: "जमशेदपुर",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('ecorahi-language');
        return (saved === 'en' || saved === 'hi') ? saved : 'en';
      }
    } catch (error) {
      console.warn('localStorage access failed:', error);
    }
    return 'en';
  });

  // Enhanced setLanguage function that persists to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('ecorahi-language', newLanguage);
        // Dispatch custom event for other components to listen to language changes
        window.dispatchEvent(new CustomEvent('languageChanged', { 
          detail: { language: newLanguage } 
        }));
      }
    } catch (error) {
      console.warn('localStorage write failed:', error);
    }
  };

  // Enhanced translation function with interpolation support
  const t = (key: string, params?: Record<string, string | number>): string => {
    try {
      let translation = translations[language]?.[key as keyof typeof translations[typeof language]] || key;
      
      // Handle string interpolation
      if (params && typeof translation === 'string') {
        Object.keys(params).forEach(param => {
          translation = translation.replace(`{${param}}`, String(params[param]));
        });
      }
      
      return translation;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}