import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, MapPin, Sparkles, Users, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Landing() {
  const { t, language, setLanguage } = useLanguage();

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-emerald-500" />,
      title: t('aiPoweredPlanning'),
      description: t('aiPoweredPlanningDesc')
    },
    {
      icon: <MapPin className="h-8 w-8 text-emerald-500" />,
      title: t('interactiveMaps'),
      description: t('interactiveMapsDesc')
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-500" />,
      title: t('localServicesTitle'),
      description: t('localServicesDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold eco-gradient flex items-center">
                <Compass className="mr-2 text-emerald-500" />
                {t('brandName')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="flex space-x-2">
                <Button
                  variant={language === 'en' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                  data-testid="language-en"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  EN
                </Button>
                <Button
                  variant={language === 'hi' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLanguage('hi')}
                  data-testid="language-hi"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  हिं
                </Button>
              </div>
              
              <Button
                onClick={() => window.location.href = '/api/login'}
                data-testid="login-button"
              >
                {t('login')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-bg relative py-20 md:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            {t('welcome')}
          </h2>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            {t('loginToStart')}
          </p>
          
          <Button 
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4"
            onClick={() => window.location.href = '/api/login'}
            data-testid="hero-login-button"
          >
            {t('loginButton')}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('whyChoose')}
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('whyChooseDesc')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            {t('readyToStart')}
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            {t('readyToStartDesc')}
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            data-testid="cta-login-button"
          >
            {t('loginButton')}
          </Button>
        </div>
      </section>
    </div>
  );
}