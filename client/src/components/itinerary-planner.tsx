import { useState } from "react";
import { Calendar, DollarSign, Clock, Users, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ItineraryResponse } from "@/lib/openai";

export default function ItineraryPlanner() {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: [25000],
    travelStyle: [] as string[],
  });
  const [generatedItinerary, setGeneratedItinerary] = useState<ItineraryResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const travelStyles = [
    { id: "adventure", label: "Adventure" },
    { id: "cultural", label: "Cultural" },
    { id: "nature", label: "Nature" },
    { id: "food", label: "Food & Dining" },
  ];

  const handleTravelStyleChange = (styleId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        travelStyle: [...prev.travelStyle, styleId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        travelStyle: prev.travelStyle.filter(s => s !== styleId)
      }));
    }
  };

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 1;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const generateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.destination || !formData.startDate || !formData.endDate || formData.travelStyle.length === 0) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const duration = calculateDuration();
    
    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/itinerary/generate", {
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget[0],
        travelStyle: formData.travelStyle,
        duration,
      });
      
      const itinerary = await response.json();
      setGeneratedItinerary(itinerary);
      
      toast({
        title: "Itinerary Generated!",
        description: "Your personalized travel plan is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="itinerary" className="py-16 bg-gradient-to-br from-muted/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            <Sparkles className="inline mr-3 text-accent animate-pulse" />
            AI-Powered <span className="gradient-text">Trip Planning</span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let our AI create the perfect itinerary based on your preferences, budget, and time
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm animate-slide-in-left">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
              <CardTitle className="text-2xl flex items-center">
                <MapPin className="mr-3 text-primary" />
                Tell us about your trip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={generateItinerary} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Destination *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Where do you want to go?"
                      className="pl-10"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      data-testid="input-itinerary-destination"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Start Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      data-testid="input-start-date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      End Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      data-testid="input-end-date"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Budget Range
                  </label>
                  <Slider
                    min={5000}
                    max={100000}
                    step={5000}
                    value={formData.budget}
                    onValueChange={(value) => setFormData({ ...formData, budget: value })}
                    className="w-full"
                    data-testid="slider-budget"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>₹5,000</span>
                    <span className="font-medium" data-testid="text-budget-display">
                      ₹{formData.budget[0].toLocaleString('en-IN')}
                    </span>
                    <span>₹1,00,000+</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Travel Style *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {travelStyles.map((style) => (
                      <div 
                        key={style.id} 
                        className="flex items-center space-x-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-muted"
                      >
                        <Checkbox
                          id={style.id}
                          checked={formData.travelStyle.includes(style.id)}
                          onCheckedChange={(checked) => handleTravelStyleChange(style.id, checked as boolean)}
                          data-testid={`checkbox-${style.id}`}
                        />
                        <label htmlFor={style.id} className="text-sm cursor-pointer">
                          {style.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                  disabled={isGenerating}
                  data-testid="button-generate-itinerary"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <Sparkles className="mr-2 h-5 w-5 relative z-10" />
                  <span className="relative z-10">
                    {isGenerating ? (
                      <div className="flex items-center">
                        <span>Generating</span>
                        <div className="loading-dots ml-2">
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    ) : "Generate My Itinerary"}
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm animate-slide-in-right">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10 border-b border-border/50">
              <CardTitle className="text-2xl flex items-center">
                <Calendar className="mr-3 text-accent" />
                Your Personalized Itinerary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedItinerary ? (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold" data-testid="text-itinerary-title">
                    {generatedItinerary.title}
                  </h4>
                  
                  {generatedItinerary.activities.map((day) => (
                    <div key={day.day} className="border-l-4 border-primary pl-4">
                      <h5 className="font-semibold text-foreground mb-2" data-testid={`text-day-${day.day}-title`}>
                        Day {day.day} - {day.title}
                      </h5>
                      <div className="space-y-2">
                        {day.items.map((item, index) => (
                          <div key={index} className="flex items-center text-sm text-muted-foreground">
                            <i className={`${item.icon} mr-2 w-4`}></i>
                            <span data-testid={`text-day-${day.day}-item-${index}`}>
                              {item.time} - {item.activity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <h6 className="font-medium text-foreground mb-3">Budget Breakdown</h6>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Accommodation:</span>
                          <span className="font-medium" data-testid="text-accommodation-cost">
                            ₹{generatedItinerary.budgetBreakdown.accommodation.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Activities:</span>
                          <span className="font-medium" data-testid="text-activities-cost">
                            ₹{generatedItinerary.budgetBreakdown.activities.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Meals:</span>
                          <span className="font-medium" data-testid="text-meals-cost">
                            ₹{generatedItinerary.budgetBreakdown.meals.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transport:</span>
                          <span className="font-medium" data-testid="text-transport-cost">
                            ₹{generatedItinerary.budgetBreakdown.transport.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <hr className="border-border" />
                        <div className="flex justify-between font-semibold text-foreground">
                          <span>Total:</span>
                          <span data-testid="text-total-cost">
                            ₹{generatedItinerary.budgetBreakdown.total.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Fill out the form to generate your personalized itinerary</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
