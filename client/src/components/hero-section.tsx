import { useState } from "react";
import { Search, MapPin, Calendar, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Destination } from "@shared/schema";

export default function HeroSection() {
  const { t } = useLanguage();
  const [searchData, setSearchData] = useState({
    destination: "",
    duration: "",
    budget: "",
    travelStyle: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Destination[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchData.destination) {
      toast({
        title: t('pleaseEnterDestination'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const searchParams = {
        query: searchData.destination,
        duration: searchData.duration,
        budget: searchData.budget,
        travelStyle: searchData.travelStyle,
      };

      const response = await apiRequest("POST", "/api/search", searchParams);
      const destinations = await response.json();
      
      setSearchResults(destinations);
      setShowResults(true);
      
      toast({
        title: t('searchComplete'),
        description: t('foundResults', { count: destinations.length }),
        variant: destinations.length > 0 ? "default" : "destructive",
      });
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('search-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      // Invalidate destinations cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/destinations"] });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: t('searchFailed'),
        description: t('unableToSearch'),
        variant: "destructive",
      });
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const quickFilters = [
    { icon: "fas fa-mountain", label: t('hillStations'), category: "hill-station", query: "hill" },
    { icon: "fas fa-water", label: t('waterfalls'), category: "waterfall", query: "waterfall" },
    { icon: "fas fa-building", label: t('heritageSites'), category: "heritage", query: "heritage" },
    { icon: "fas fa-leaf", label: t('wildlife'), category: "wildlife", query: "wildlife" },
  ];

  const popularDestinations = [
    t('netarhat'), t('dassamFalls'), t('ranchi'), t('betlaNationalPark'), 
    t('hundruFalls'), t('deoghar'), t('parasnathHill'), t('jamshedpur')
  ];

  return (
    <section className="hero-bg relative py-20 md:py-32 overflow-hidden">
      {/* Floating 3D Elements */}
      <div className="floating-elements">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-float-3d blur-sm"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full animate-float-3d" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-400/20 animate-morphing blur-sm"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-float-3d" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Particle Background */}
      <div className="particle-bg absolute inset-0"></div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            <span className="holographic text-6xl md:text-8xl font-extrabold">
              {t('discoverDestinations')}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
            {t('planPerfectTrip')}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto animate-slide-in-left card-3d" style={{ animationDelay: '0.3s' }}>
          <Card className="p-8 md:p-10 glass-morphism shadow-2xl border-white/30 rounded-3xl relative overflow-hidden">
            {/* Card 3D Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <div className="relative z-10">
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t('whereToGo')}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('enterDestination')}
                    className="pl-10"
                    value={searchData.destination}
                    onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                    data-testid="input-destination"
                    list="destinations"
                  />
                  <datalist id="destinations">
                    {popularDestinations.map((dest, index) => (
                      <option key={index} value={dest} />
                    ))}
                  </datalist>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t('duration')}</label>
                <Select 
                  value={searchData.duration} 
                  onValueChange={(value) => setSearchData({ ...searchData, duration: value })}
                >
                  <SelectTrigger data-testid="select-duration">
                    <SelectValue placeholder={t('selectDuration')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2 days">{t('duration1to2')}</SelectItem>
                    <SelectItem value="3-5 days">{t('duration3to5')}</SelectItem>
                    <SelectItem value="1 week">{t('duration1week')}</SelectItem>
                    <SelectItem value="2+ weeks">{t('duration2weeks')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t('budget')}</label>
                <Select 
                  value={searchData.budget} 
                  onValueChange={(value) => setSearchData({ ...searchData, budget: value })}
                >
                  <SelectTrigger data-testid="select-budget">
                    <SelectValue placeholder={t('selectBudget')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="₹5,000-10,000">{t('budget5to10')}</SelectItem>
                    <SelectItem value="₹10,000-25,000">{t('budget10to25')}</SelectItem>
                    <SelectItem value="₹25,000-50,000">{t('budget25to50')}</SelectItem>
                    <SelectItem value="₹50,000+">{t('budget50plus')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t('travelStyle')}</label>
                <Select 
                  value={searchData.travelStyle} 
                  onValueChange={(value) => setSearchData({ ...searchData, travelStyle: value })}
                >
                  <SelectTrigger data-testid="select-travel-style">
                    <SelectValue placeholder={t('selectStyle')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Adventure">{t('adventure')}</SelectItem>
                    <SelectItem value="Cultural">{t('cultural')}</SelectItem>
                    <SelectItem value="Relaxation">{t('relaxation')}</SelectItem>
                    <SelectItem value="Nature">{t('nature')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-primary via-purple-600 to-accent text-white py-6 rounded-2xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden group animate-glow"
              onClick={handleSearch}
              disabled={isLoading}
              data-testid="button-search"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Search className="mr-3 h-6 w-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">
                {isLoading ? (
                  <div className="flex items-center">
                    <span>{t('searching')}</span>
                    <div className="loading-dots ml-3">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                ) : t('findMyTrip')}
              </span>
            </Button>
            </div>
          </Card>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4 animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
            {quickFilters.map((filter, index) => (
              <Button
                key={index}
                variant="outline"
                className="px-8 py-3 rounded-2xl text-sm font-semibold transition-all duration-500 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:scale-110 hover:shadow-xl backdrop-blur-md hover:border-white/50 group relative overflow-hidden card-3d"
                onClick={() => {
                  setSearchData({ 
                    ...searchData, 
                    destination: filter.query,
                    travelStyle: filter.category 
                  });
                  // Trigger search after a short delay to allow state update
                  setTimeout(() => handleSearch(), 100);
                }}
                data-testid={`filter-${filter.category}`}
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <i className={`${filter.icon} mr-3 text-lg group-hover:scale-125 transition-transform duration-300`}></i>
                <span className="relative z-10">{filter.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {showResults && (
        <div id="search-results" className="bg-white/10 backdrop-blur-sm py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {t('searchResults')}
              </h3>
              <p className="text-white/80">
                {searchResults.length > 0 
                  ? t('foundMatches', { count: searchResults.length })
                  : t('noResults')
                }
              </p>
            </div>
            
            {searchResults.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((destination, index) => (
                  <Card 
                    key={destination.id} 
                    className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={destination.imageUrl} 
                        alt={destination.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < Math.floor(destination.rating / 10) ? '★' : '☆'}`}>
                              {i < Math.floor(destination.rating / 10) ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs font-medium">
                          {(destination.rating / 10).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-semibold text-foreground">
                          {destination.name}
                        </h4>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-muted-foreground mb-4 text-sm">
                        {destination.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            ₹{destination.pricePerPerson.toLocaleString('en-IN')}
                          </span>
                          <span className="text-sm text-muted-foreground block">{t('perPerson')}</span>
                        </div>
                        <Button className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:scale-105 transition-all duration-300">
                          {t('bookNow')}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-primary" />
                          <span>
                            {destination.recommendedDays === 1 
                              ? `1 ${t('day')}` 
                              : `${destination.recommendedDays} ${t('days')}`
                            }
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-primary" />
                          <span>{destination.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {searchResults.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-white/60" />
                </div>
                <p className="text-white/80 mb-6">
                  {t('tryPopular')} "{t('netarhat')}", "{t('dassamFalls')}", {t('ranchi')}"
                </p>
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => {
                    setSearchData({ ...searchData, destination: t('netarhat') });
                    setTimeout(() => handleSearch(), 100);
                  }}
                >
                  {t('netarhat')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
