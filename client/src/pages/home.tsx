import NavigationHeader from "@/components/navigation-header";
import HeroSection from "@/components/hero-section";
import FeaturedDestinations from "@/components/featured-destinations";
import ItineraryPlanner from "@/components/itinerary-planner";
import InteractiveMap from "@/components/interactive-map";
import ReviewsSection from "@/components/reviews-section";
import MarketplaceSection from "@/components/marketplace-section";
import Footer from "@/components/footer";
import ChatWidget from "@/components/chat-widget";
import ScrollToTop from "@/components/scroll-to-top";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <NavigationHeader />
      <HeroSection />
      <FeaturedDestinations />
      <ItineraryPlanner />
      <InteractiveMap />
      <ReviewsSection />
      <MarketplaceSection />
      <Footer />
      <ChatWidget />
      <ScrollToTop />
    </div>
  );
}
