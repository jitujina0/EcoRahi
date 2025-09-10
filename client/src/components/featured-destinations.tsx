import { useQuery } from "@tanstack/react-query";
import { Star, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Destination } from "@shared/schema";

export default function FeaturedDestinations() {
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-3" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="destinations" className="py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular <span className="gradient-text">Destinations</span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our most loved destinations with personalized recommendations
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations?.map((destination, index) => (
            <Card 
              key={destination.id} 
              className="destination-card bg-card rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 group animate-fade-in-up neo-morphism border-0 relative"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`card-destination-${destination.id}`}
            >
              {/* 3D Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              
              <div className="relative overflow-hidden rounded-t-3xl">
                <img 
                  src={destination.imageUrl} 
                  alt={destination.name}
                  className="w-full h-56 object-cover transition-all duration-500 group-hover:scale-115 group-hover:rotate-1"
                  data-testid={`img-destination-${destination.id}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Rating Badge */}
                <div className="absolute top-4 right-4 glass-morphism rounded-2xl px-4 py-2 flex items-center space-x-2 transform group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-4 w-4 text-amber-400 fill-current animate-pulse" />
                  <span className="text-sm font-bold text-white" data-testid={`text-rating-${destination.id}`}>
                    {(destination.rating / 10).toFixed(1)}
                  </span>
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {destination.category.replace('-', ' ')}
                </div>
                
                {/* Hover Overlay with Quick Actions */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex space-x-3">
                    <Button size="sm" className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 rounded-full">
                      <i className="fas fa-eye mr-2"></i>
                      View
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg rounded-full">
                      <i className="fas fa-heart mr-2"></i>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-8 relative">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="mb-4">
                    <h4 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300" data-testid={`text-name-${destination.id}`}>
                      {destination.name}
                    </h4>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed" data-testid={`text-description-${destination.id}`}>
                    {destination.description}
                  </p>
                  
                  {/* Features Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {destination.features.slice(0, 3).map((feature, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                      >
                        {feature.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid={`text-price-${destination.id}`}>
                        ₹{destination.pricePerPerson.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm text-muted-foreground block">per person</span>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-primary via-purple-600 to-accent text-white hover:shadow-2xl hover:scale-110 transition-all duration-500 rounded-2xl px-8 py-3 font-semibold relative overflow-hidden group"
                      data-testid={`button-explore-${destination.id}`}
                    >
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span className="relative z-10">Explore</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm bg-muted/30 rounded-xl px-4 py-3">
                      <Clock className="h-5 w-5 mr-3 text-primary" />
                      <span className="font-medium" data-testid={`text-duration-${destination.id}`}>
                        {destination.recommendedDays === 1 
                          ? "1 day recommended" 
                          : `${destination.recommendedDays} days recommended`
                        }
                      </span>
                    </div>
                    <div className="flex items-center text-sm bg-muted/30 rounded-xl px-4 py-3">
                      <MapPin className="h-5 w-5 mr-3 text-primary" />
                      <span className="font-medium" data-testid={`text-location-${destination.id}`}>
                        {destination.location}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
