import { useQuery } from "@tanstack/react-query";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Review } from "@shared/schema";

export default function ReviewsSection() {
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const stats = [
    { value: "4.8", label: "Average Rating" },
    { value: "15,000+", label: "Happy Travelers" },
    { value: "500+", label: "Destinations" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  if (isLoading) {
    return (
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-muted/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What <span className="gradient-text">Travelers Say</span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from fellow travelers who used our platform
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews?.map((review, index) => (
            <Card 
              key={review.id} 
              className="shadow-xl border-0 bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up" 
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`card-review-${review.id}`}
            >
              <CardContent className="p-6 relative">
                <div className="absolute top-4 right-4 text-6xl text-primary/10">
                  <i className="fas fa-quote-right"></i>
                </div>
                <div className="flex items-center space-x-4 mb-4 relative z-10">
                  <div className="relative">
                    <img 
                      src={review.userAvatar} 
                      alt={review.userName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                      data-testid={`img-user-${review.id}`}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground" data-testid={`text-user-name-${review.id}`}>
                      {review.userName}
                    </h5>
                    <div className="flex items-center">
                      <div className="flex text-amber-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-muted'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-foreground" data-testid={`text-rating-${review.id}`}>
                        {review.rating}.0
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed italic relative z-10" data-testid={`text-comment-${review.id}`}>
                  "{review.comment}"
                </p>
                <div className="text-sm text-muted-foreground flex items-center bg-muted/30 rounded-lg px-3 py-2">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span data-testid={`text-location-${review.id}`}>{review.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mt-12 text-center shadow-2xl border-0 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <div className={`text-4xl font-bold mb-2 transition-all duration-300 group-hover:scale-110 ${index % 2 === 0 ? 'gradient-text' : 'text-accent'}`} data-testid={`stat-value-${index}`}>
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium" data-testid={`stat-label-${index}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
