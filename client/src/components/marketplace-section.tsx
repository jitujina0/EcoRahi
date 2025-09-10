import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Store, Home, Gift, Users, Utensils, Camera, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service } from "@shared/schema";

export default function MarketplaceSection() {
  const [selectedCategory, setSelectedCategory] = useState("homestay");
  
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services", selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/services?category=${selectedCategory}`);
      return response.json();
    },
  });

  const categories = [
    { id: "homestay", label: "Homestays", icon: Home },
    { id: "handicraft", label: "Handicrafts", icon: Gift },
    { id: "guide", label: "Local Guides", icon: Users },
    { id: "food", label: "Food Experiences", icon: Utensils },
    { id: "photography", label: "Photography", icon: Camera },
  ];

  if (isLoading) {
    return (
      <section id="marketplace" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-40 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-12 w-full mb-3" />
                      <Skeleton className="h-6 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="marketplace" className="py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            <Store className="inline mr-3 text-accent animate-pulse" />
            Local Services & <span className="gradient-text">Marketplace</span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Support local communities with authentic handicrafts, homestays, and guided tours
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 animate-slide-in-left">
            <Card className="shadow-2xl sticky top-24 border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
                <CardTitle className="text-lg flex items-center">
                  <i className="fas fa-th-large mr-2 text-primary"></i>
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-6">
                {categories.map((category, index) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className={`w-full justify-start text-left transition-all duration-300 hover:scale-105 ${
                      selectedCategory === category.id 
                        ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg" 
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                    data-testid={`category-${category.id}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <category.icon className="mr-3 h-4 w-4" />
                    {category.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3 animate-slide-in-right">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.map((service, index) => (
                <Card 
                  key={service.id} 
                  className="overflow-hidden shadow-xl border-0 bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  data-testid={`card-service-${service.id}`}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={service.imageUrl} 
                      alt={service.name}
                      className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                      data-testid={`img-service-${service.id}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <Star className="h-3 w-3 text-amber-400 fill-current" />
                      <span className="text-xs font-medium" data-testid={`text-service-rating-${service.id}`}>
                        {(service.rating / 10).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="mb-3">
                      <h5 className="font-semibold text-foreground text-lg mb-1" data-testid={`text-service-name-${service.id}`}>
                        {service.name}
                      </h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed" data-testid={`text-service-description-${service.id}`}>
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-primary" data-testid={`text-service-price-${service.id}`}>
                          ₹{service.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm text-muted-foreground block">
                          {service.priceUnit}
                        </span>
                      </div>
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-accent to-orange-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-full px-4"
                        data-testid={`button-book-${service.id}`}
                      >
                        {service.category === 'homestay' ? 'Book Now' :
                         service.category === 'guide' ? 'Hire Guide' :
                         service.category === 'handicraft' ? 'View Shop' :
                         service.category === 'food' ? 'Book Class' :
                         'Join Tour'}
                      </Button>
                    </div>
                    {service.location && (
                      <div className="flex items-center text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
                        <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
                        <span data-testid={`text-service-location-${service.id}`}>
                          {service.location}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
