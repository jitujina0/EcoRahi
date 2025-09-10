import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      message: "Hello! I'm your AI travel assistant. How can I help you plan your perfect trip today? 🌟",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(Math.random().toString(36).substring(7));
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: currentMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/chat", {
        message: currentMessage,
        sessionId: sessionId.current,
      });
      
      const data = await response.json();
      
      const botMessage: ChatMessage = {
        id: data.id || Date.now().toString(),
        message: data.message,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: "Chat Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        message: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickResponses = [
    "I want to visit Netarhat for 2 days",
    "Show me budget-friendly destinations",
    "What's the weather like in Ranchi?",
    "Help me plan a family trip",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-primary via-purple-600 to-accent text-white rounded-full w-20 h-20 shadow-2xl hover:scale-125 transition-all duration-500 relative overflow-hidden group animate-float-3d border-4 border-white/20"
        data-testid="button-chat-toggle"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        
        {/* Ripple Effect */}
        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        
        {/* Icon Container */}
        <div className="relative z-10 transform group-hover:rotate-12 transition-transform duration-300">
          {isOpen ? (
            <X className="h-8 w-8 animate-spin" />
          ) : (
            <MessageCircle className="h-8 w-8 animate-bounce" />
          )}
        </div>
        
        {/* Notification Dot */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
            <span className="text-white">!</span>
          </div>
        )}
      </Button>
      
      {/* Chat Window */}
      {isOpen && (
        <Card className="absolute bottom-20 right-0 w-80 h-96 shadow-2xl border-0 overflow-hidden bg-card/95 backdrop-blur-md animate-slide-in-right">
          {/* Chat Header */}
          <CardHeader className="bg-gradient-to-r from-primary to-accent text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <h6 className="font-semibold" data-testid="chat-assistant-name">Travel Assistant</h6>
                  <p className="text-xs text-primary-foreground/80">Online now</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/20"
                data-testid="button-chat-close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          {/* Chat Messages */}
          <ScrollArea className="flex-1 h-64 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex items-start space-x-2 ${message.isBot ? '' : 'justify-end'}`}
                  data-testid={`message-${message.id}`}
                >
                  {message.isBot && (
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 text-accent-foreground" />
                    </div>
                  )}
                  <div 
                    className={`rounded-lg p-3 max-w-xs ${
                      message.isBot 
                        ? 'bg-muted text-muted-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="text-sm" data-testid={`message-text-${message.id}`}>
                      {message.message}
                    </p>
                  </div>
                  {!message.isBot && (
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-3 w-3 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3 w-3 text-accent-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg p-3 max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Quick Responses */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-1">
                {quickResponses.map((response, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => {
                      setCurrentMessage(response);
                      setTimeout(() => sendMessage(), 100);
                    }}
                    data-testid={`quick-response-${index}`}
                  >
                    {response}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Chat Input */}
          <CardContent className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask me anything about travel..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 text-sm"
                disabled={isLoading}
                data-testid="input-chat-message"
              />
              <Button 
                onClick={sendMessage}
                disabled={isLoading || !currentMessage.trim()}
                size="icon"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex space-x-2 text-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 px-2 text-xs ${language === 'en' ? 'text-primary' : 'text-muted-foreground'}`}
                  onClick={() => setLanguage('en')}
                  data-testid="button-language-en"
                >
                  English
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 px-2 text-xs ${language === 'hi' ? 'text-primary' : 'text-muted-foreground'}`}
                  onClick={() => setLanguage('hi')}
                  data-testid="button-language-hi"
                >
                  हिंदी
                </Button>
              </div>
              <span className="text-xs text-muted-foreground flex items-center">
                <Bot className="h-3 w-3 mr-1" />
                Powered by AI
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
