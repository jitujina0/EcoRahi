import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Plus, Minus, Navigation, Bus, Train, Plane, Layers, Satellite, Map as MapIcon, Compass, Route, Camera, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

// Enhanced map locations data
const jharkhandLocations = [
  {
    id: 'netarhat',
    name: 'Netarhat Hill Station',
    lat: 23.4667,
    lng: 84.2500,
    type: 'attractions',
    category: 'Hill Station',
    description: 'Queen of Chotanagpur - Famous for mesmerizing sunrises and scenic beauty',
    rating: 4.8,
    price: '₹8,000',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    features: ['Sunrise Point', 'Nature Trails', 'Photography']
  },
  {
    id: 'dassam-falls',
    name: 'Dassam Falls',
    lat: 23.3833,
    lng: 85.4167,
    type: 'attractions',
    category: 'Waterfall',
    description: 'Spectacular 144-foot waterfall perfect for nature lovers',
    rating: 4.6,
    price: '₹5,500',
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400',
    features: ['Swimming', 'Photography', 'Picnic']
  },
  {
    id: 'ranchi-city',
    name: 'Ranchi Heritage',
    lat: 23.3441,
    lng: 85.3096,
    type: 'attractions',
    category: 'Heritage',
    description: 'Capital city with rich cultural heritage and modern attractions',
    rating: 4.5,
    price: '₹12,000',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400',
    features: ['Museums', 'Temples', 'Shopping']
  },
  {
    id: 'betla-park',
    name: 'Betla National Park',
    lat: 23.8833,
    lng: 84.1833,
    type: 'attractions',
    category: 'Wildlife',
    description: 'Wildlife sanctuary with tigers, elephants and diverse flora',
    rating: 4.7,
    price: '₹15,000',
    image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=400',
    features: ['Safari', 'Wildlife', 'Nature']
  },
  // Restaurants
  {
    id: 'tribal-cuisine',
    name: 'Tribal Cuisine Restaurant',
    lat: 23.3500,
    lng: 85.3200,
    type: 'restaurants',
    category: 'Traditional',
    description: 'Authentic tribal food experience with local delicacies',
    rating: 4.3,
    price: '₹800',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    features: ['Local Cuisine', 'Cultural Experience']
  },
  {
    id: 'hill-view-cafe',
    name: 'Hill View Cafe',
    lat: 23.4700,
    lng: 84.2600,
    type: 'restaurants',
    category: 'Cafe',
    description: 'Scenic dining with panoramic mountain views',
    rating: 4.5,
    price: '₹600',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
    features: ['Mountain View', 'Coffee', 'Breakfast']
  },
  // Hotels
  {
    id: 'forest-rest-house',
    name: 'Netarhat Forest Rest House',
    lat: 23.4650,
    lng: 84.2480,
    type: 'hotels',
    category: 'Government',
    description: 'Government rest house with pristine forest views',
    rating: 4.0,
    price: '₹2,500',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    features: ['Forest View', 'Budget Friendly', 'Nature']
  },
  {
    id: 'luxury-resort',
    name: 'Ranchi Luxury Resort',
    lat: 23.3400,
    lng: 85.3000,
    type: 'hotels',
    category: 'Luxury',
    description: 'Premium accommodation with world-class amenities',
    rating: 4.6,
    price: '₹8,500',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    features: ['Luxury', 'Spa', 'Pool', 'Restaurant']
  },
  // Transport
  {
    id: 'ranchi-station',
    name: 'Ranchi Railway Station',
    lat: 23.3619,
    lng: 85.3222,
    type: 'transport',
    category: 'Railway',
    description: 'Main railway station connecting to major cities',
    rating: 4.2,
    features: ['Express Trains', 'Connectivity']
  },
  {
    id: 'birsa-airport',
    name: 'Birsa Munda Airport',
    lat: 23.3143,
    lng: 85.3217,
    type: 'transport',
    category: 'Airport',
    description: 'Ranchi Airport with domestic and international flights',
    rating: 4.4,
    features: ['Domestic Flights', 'Car Rental']
  }
];

export default function InteractiveMap() {
  const [mapFilters, setMapFilters] = useState({
    attractions: true,
    restaurants: true,
    hotels: true,
    transport: true,
  });

  const [mapStyle, setMapStyle] = useState<'street' | 'satellite' | 'terrain'>('street');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 23.3441, lng: 85.3096 });
  const [mapZoom, setMapZoom] = useState(10);
  const mapRef = useRef<HTMLDivElement>(null);

  const { data: weather } = useQuery<WeatherData>({
    queryKey: ["/api/weather/netarhat"],
  });

  const handleFilterChange = (filter: keyof typeof mapFilters, checked: boolean) => {
    setMapFilters(prev => ({ ...prev, [filter]: checked }));
  };

  const handleLocationClick = (locationId: string) => {
    const location = jharkhandLocations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(locationId);
      setMapCenter({ lat: location.lat, lng: location.lng });
      setMapZoom(14);
    }
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 8));
  };

  const resetMapView = () => {
    setMapCenter({ lat: 23.3441, lng: 85.3096 });
    setMapZoom(10);
    setSelectedLocation(null);
  };

  const getFilteredLocations = () => {
    return jharkhandLocations.filter(location => 
      mapFilters[location.type as keyof typeof mapFilters]
    );
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'attractions': return '🏔️';
      case 'restaurants': return '🍽️';
      case 'hotels': return '🏨';
      case 'transport': return '🚌';
      default: return '📍';
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'attractions': return 'from-blue-500 to-blue-600';
      case 'restaurants': return 'from-red-500 to-red-600';
      case 'hotels': return 'from-green-500 to-green-600';
      case 'transport': return 'from-amber-500 to-amber-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const transportData = [
    { icon: Bus, service: "Bus Service", status: "Running on time", color: "text-green-500", count: 12 },
    { icon: Train, service: "Railway", status: "15 min delay", color: "text-yellow-500", count: 3 },
    { icon: Plane, service: "Airport", status: "Clear weather", color: "text-blue-500", count: 8 },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            <MapPin className="inline mr-3 text-accent animate-pulse" />
            Explore with <span className="gradient-text">Interactive Maps</span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover routes, nearby attractions, weather updates, and real-time information
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6 animate-slide-in-left">
            <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
                <CardTitle className="text-lg flex items-center">
                  <i className="fas fa-filter mr-2 text-primary"></i>
                  Quick Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries({
                  attractions: "Tourist Attractions",
                  restaurants: "Restaurants",
                  hotels: "Hotels",
                  transport: "Transport",
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <Checkbox
                      id={key}
                      checked={mapFilters[key as keyof typeof mapFilters]}
                      onCheckedChange={(checked) => handleFilterChange(key as keyof typeof mapFilters, checked as boolean)}
                      data-testid={`checkbox-filter-${key}`}
                    />
                    <label htmlFor={key} className="text-sm cursor-pointer">
                      {label}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-border/50">
                <CardTitle className="text-lg flex items-center">
                  <i className="fas fa-cloud-sun mr-2 text-blue-500"></i>
                  Current Weather
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {weather ? (
                  <div className="text-center">
                    <div className="text-4xl mb-3 animate-pulse" data-testid="weather-icon">
                      {weather.icon}
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1" data-testid="temperature">
                      {weather.temperature}°C
                    </div>
                    <div className="text-sm text-muted-foreground mb-4" data-testid="weather-condition">
                      {weather.condition}
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <i className="fas fa-tint mr-1 text-blue-500"></i>
                          Humidity:
                        </span>
                        <span className="font-medium" data-testid="humidity">{weather.humidity}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <i className="fas fa-wind mr-1 text-green-500"></i>
                          Wind:
                        </span>
                        <span className="font-medium" data-testid="wind-speed">{weather.windSpeed} km/h</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-3 animate-pulse">☀️</div>
                    <div className="text-3xl font-bold text-foreground mb-1">28°C</div>
                    <div className="text-sm text-muted-foreground mb-4">Clear Sky</div>
                    <div className="bg-muted/50 rounded-lg p-3 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span>Humidity:</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wind:</span>
                        <span className="font-medium">12 km/h</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-border/50">
                <CardTitle className="text-lg flex items-center">
                  <i className="fas fa-route mr-2 text-green-500"></i>
                  Live Transport Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm p-6">
                {transportData.map((transport, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-muted/20 to-muted/40 rounded-xl hover:from-muted/40 hover:to-muted/60 transition-all duration-300 border border-border/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-white/10 to-white/20 flex items-center justify-center backdrop-blur-sm">
                      <transport.icon className={`h-5 w-5 ${transport.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground flex items-center justify-between" data-testid={`transport-service-${index}`}>
                        {transport.service}
                        <Badge variant="secondary" className="text-xs">
                          {transport.count} active
                        </Badge>
                      </div>
                      <div className="text-muted-foreground text-xs mt-1" data-testid={`transport-status-${index}`}>
                        {transport.status}
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      transport.status.includes('delay') ? 'bg-yellow-500' : 
                      transport.status.includes('time') ? 'bg-green-500' : 'bg-blue-500'
                    } animate-pulse`}></div>
                  </div>
                ))}
                
                {/* Quick Actions */}
                <div className="pt-4 border-t border-border/30">
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      <Route className="h-3 w-3 mr-1" />
                      Plan Route
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Navigation className="h-3 w-3 mr-1" />
                      Live Traffic
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3 animate-slide-in-right">
            <Card className="shadow-2xl overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
              {/* Map Header with Controls */}
              <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Compass className="h-6 w-6 text-primary animate-spin" style={{ animationDuration: '8s' }} />
                    <div>
                      <h4 className="font-bold text-foreground">Interactive Map of Jharkhand</h4>
                      <p className="text-sm text-muted-foreground">
                        {getFilteredLocations().length} locations • Zoom: {mapZoom}x
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={resetMapView}>
                      <Navigation className="h-4 w-4 mr-1" />
                      Reset View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
                
                {/* Map Style Selector */}
                <Tabs value={mapStyle} onValueChange={(value) => setMapStyle(value as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                    <TabsTrigger value="street" className="text-xs">
                      <MapIcon className="h-3 w-3 mr-1" />
                      Street
                    </TabsTrigger>
                    <TabsTrigger value="satellite" className="text-xs">
                      <Satellite className="h-3 w-3 mr-1" />
                      Satellite
                    </TabsTrigger>
                    <TabsTrigger value="terrain" className="text-xs">
                      <Layers className="h-3 w-3 mr-1" />
                      Terrain
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Interactive Map Canvas */}
              <div className="h-96 lg:h-[600px] relative overflow-hidden">
                {/* Map Background */}
                <div 
                  ref={mapRef}
                  className={`w-full h-full transition-all duration-500 ${
                    mapStyle === 'satellite' 
                      ? 'bg-gradient-to-br from-green-800 via-green-700 to-green-900' 
                      : mapStyle === 'terrain'
                      ? 'bg-gradient-to-br from-amber-100 via-green-200 to-blue-200'
                      : 'bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50'
                  }`}
                >
                  {/* Jharkhand State Outline */}
                  <svg 
                    className="absolute inset-0 w-full h-full" 
                    viewBox="0 0 100 100"
                    style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
                  >
                    <defs>
                      <linearGradient id="stateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(34, 197, 94, 0.2)" />
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M20,20 L80,15 L85,25 L90,40 L85,60 L80,75 L70,85 L50,90 L30,85 L15,70 L10,50 L15,30 Z"
                      fill="url(#stateGradient)"
                      stroke={mapStyle === 'satellite' ? '#22c55e' : '#3b82f6'}
                      strokeWidth="0.8"
                      className="animate-pulse"
                    />
                    
                    {/* Rivers */}
                    <path
                      d="M25,30 Q40,35 50,45 Q60,55 75,65"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="1.5"
                      opacity="0.8"
                      className="animate-pulse"
                    />
                    <path
                      d="M30,50 Q45,60 65,70"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="1"
                      opacity="0.6"
                    />
                  </svg>

                  {/* Interactive Location Markers */}
                  {getFilteredLocations().map((location, index) => {
                    const x = ((location.lng - 83.5) / (86.5 - 83.5)) * 100;
                    const y = ((24.5 - location.lat) / (24.5 - 22.5)) * 100;
                    
                    return (
                      <div
                        key={location.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                        style={{ 
                          left: `${Math.max(5, Math.min(95, x))}%`, 
                          top: `${Math.max(5, Math.min(95, y))}%`,
                          animationDelay: `${index * 0.1}s`
                        }}
                        onClick={() => handleLocationClick(location.id)}
                      >
                        {/* Marker */}
                        <div className={`
                          w-8 h-8 rounded-full bg-gradient-to-r ${getLocationColor(location.type)}
                          border-3 border-white shadow-xl
                          group-hover:scale-125 transition-all duration-300
                          flex items-center justify-center text-white text-sm font-bold
                          animate-bounce cursor-pointer
                          ${selectedLocation === location.id ? 'scale-125 ring-4 ring-white/50' : ''}
                        `}>
                          {getLocationIcon(location.type)}
                        </div>
                        
                        {/* Pulse Effect */}
                        <div className={`
                          absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-r ${getLocationColor(location.type)}
                          animate-ping opacity-30
                        `}></div>

                        {/* Hover Tooltip */}
                        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-2xl border border-white/20 whitespace-nowrap max-w-xs">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {location.category}
                              </Badge>
                              {location.rating && (
                                <div className="flex items-center text-xs text-amber-500">
                                  ⭐ {location.rating}
                                </div>
                              )}
                            </div>
                            <div className="text-sm font-semibold text-gray-800">{location.name}</div>
                            <div className="text-xs text-gray-600 mb-2">{location.description}</div>
                            {location.price && (
                              <div className="text-xs font-semibold text-primary">{location.price}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="shadow-xl bg-white/90 backdrop-blur-sm hover:bg-white"
                      onClick={handleZoomIn}
                      data-testid="button-zoom-in"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="shadow-xl bg-white/90 backdrop-blur-sm hover:bg-white"
                      onClick={handleZoomOut}
                      data-testid="button-zoom-out"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="shadow-xl bg-white/90 backdrop-blur-sm hover:bg-white"
                      onClick={resetMapView}
                      data-testid="button-locate"
                    >
                      <Compass className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="shadow-xl bg-white/90 backdrop-blur-sm hover:bg-white"
                      data-testid="button-camera"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Selected Location Details */}
                  {selectedLocation && (
                    <Card className="absolute bottom-4 left-4 max-w-sm shadow-2xl border-0 bg-white/95 backdrop-blur-md animate-slide-in-left">
                      <CardContent className="p-4">
                        {(() => {
                          const location = jharkhandLocations.find(loc => loc.id === selectedLocation);
                          return location ? (
                            <div>
                              <div className="flex items-center space-x-3 mb-3">
                                <div className={`w-10 h-10 bg-gradient-to-r ${getLocationColor(location.type)} rounded-full flex items-center justify-center text-white text-lg`}>
                                  {getLocationIcon(location.type)}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-foreground">{location.name}</h4>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="text-xs">
                                      {location.category}
                                    </Badge>
                                    {location.rating && (
                                      <div className="flex items-center text-xs text-amber-500">
                                        ⭐ {location.rating}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {location.image && (
                                <img 
                                  src={location.image} 
                                  alt={location.name}
                                  className="w-full h-24 object-cover rounded-lg mb-3"
                                />
                              )}
                              
                              <p className="text-sm text-muted-foreground mb-3">{location.description}</p>
                              
                              {location.features && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {location.features.map((feature, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between">
                                {location.price && (
                                  <span className="font-bold text-primary">{location.price}</span>
                                )}
                                <div className="flex space-x-2">
                                  <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-white">
                                    <Route className="h-3 w-3 mr-1" />
                                    Directions
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </CardContent>
                    </Card>
                  )}

                  {/* Map Legend */}
                  <Card className="absolute top-4 left-4 shadow-xl border-0 bg-white/95 backdrop-blur-md">
                    <CardContent className="p-3">
                      <h4 className="text-sm font-bold mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-primary" />
                        Legend
                      </h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs">🏔️</div>
                          <span>Attractions ({jharkhandLocations.filter(l => l.type === 'attractions').length})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs">🍽️</div>
                          <span>Restaurants ({jharkhandLocations.filter(l => l.type === 'restaurants').length})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xs">🏨</div>
                          <span>Hotels ({jharkhandLocations.filter(l => l.type === 'hotels').length})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white text-xs">🚌</div>
                          <span>Transport ({jharkhandLocations.filter(l => l.type === 'transport').length})</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
