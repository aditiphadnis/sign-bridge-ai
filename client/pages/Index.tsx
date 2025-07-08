import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AccessibilityHeader from "@/components/AccessibilityHeader";
import VoiceInput from "@/components/VoiceInput";
import Avatar3D from "@/components/Avatar3D";
import ContextualVisuals from "@/components/ContextualVisuals";
import {
  Zap,
  Brain,
  Users,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Index() {
  const [currentText, setCurrentText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAvatarAnimating, setIsAvatarAnimating] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    translations: 0,
    accuracy: 98,
    savedTime: "2.5 hrs",
  });

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleTextSubmit = async (text: string) => {
    setCurrentText(text);
    setIsProcessing(true);
    setIsAvatarAnimating(true);

    // Simulate translation processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsProcessing(false);
    setSessionStats((prev) => ({
      ...prev,
      translations: prev.translations + 1,
    }));
  };

  const handleVoiceInput = (text: string) => {
    setCurrentText(text);
    if (text.trim()) {
      handleTextSubmit(text);
    }
  };

  const handleVideoInput = (videoData: any) => {
    console.log("Video input received:", videoData);
    // Video processing will trigger handleVoiceInput when complete
  };

  const handleAvatarAnimationComplete = () => {
    setIsAvatarAnimating(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-background">
      <AccessibilityHeader
        onThemeToggle={toggleTheme}
        onVolumeToggle={toggleMute}
        isDarkMode={isDarkMode}
        isMuted={isMuted}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-accessibility-600 via-primary to-sign-600 bg-clip-text text-transparent">
              Bridge Every Voice
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Transform speech and text into expressive sign language with
              AI-powered 3D avatars and contextual visuals
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-accessibility-50 rounded-full">
              <CheckCircle className="h-4 w-4 text-accessibility-600" />
              <span className="text-sm font-medium text-accessibility-700">
                Real-time Translation
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-sign-50 rounded-full">
              <Star className="h-4 w-4 text-sign-600" />
              <span className="text-sm font-medium text-sign-700">
                AI-Powered Accuracy
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Accessible Design
              </span>
            </div>
          </div>
        </section>

        {/* Session Stats */}
        {sessionStats.translations > 0 && (
          <section>
            <Card className="bg-gradient-to-r from-accessibility-50 to-sign-50 border-accessibility-200">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-accessibility-700">
                      {sessionStats.translations}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Translations Today
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-sign-700">
                      {sessionStats.accuracy}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Translation Accuracy
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {sessionStats.savedTime}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Time Saved Communicating
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Main Application Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <VoiceInput
              onTextSubmit={handleTextSubmit}
              onVoiceInput={handleVoiceInput}
              onVideoInput={handleVideoInput}
              isProcessing={isProcessing}
            />

            {/* Quick actions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Quick Actions</h3>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTextSubmit("Hello, how are you?")}
                    disabled={isProcessing}
                  >
                    Greeting
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTextSubmit("Thank you very much")}
                    disabled={isProcessing}
                  >
                    Thank You
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTextSubmit("I need help")}
                    disabled={isProcessing}
                  >
                    Need Help
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTextSubmit("Have a great day")}
                    disabled={isProcessing}
                  >
                    Goodbye
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Avatar */}
          <div>
            <Avatar3D
              text={currentText}
              isAnimating={isAvatarAnimating}
              onAnimationComplete={handleAvatarAnimationComplete}
            />
          </div>
        </section>

        {/* Contextual Visuals */}
        <section>
          <ContextualVisuals text={currentText} isProcessing={isProcessing} />
        </section>

        {/* Feature Showcase */}
        <section className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Powered by Advanced AI</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leveraging cutting-edge machine learning to provide accurate and
              expressive sign language translation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <div className="h-12 w-12 bg-accessibility-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-accessibility-600" />
              </div>
              <h3 className="font-semibold mb-2">TensorFlow AI</h3>
              <p className="text-sm text-muted-foreground">
                Advanced neural networks for accurate gesture recognition and
                translation
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="h-12 w-12 bg-sign-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-sign-600" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Processing</h3>
              <p className="text-sm text-muted-foreground">
                Instant translation with optimized algorithms for seamless
                communication
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Community Driven</h3>
              <p className="text-sm text-muted-foreground">
                Built with input from the deaf and hard-of-hearing community for
                authentic results
              </p>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        {!currentText && (
          <section className="text-center py-8">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-accessibility-500 to-sign-500 text-white border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Start Your First Translation
                </h3>
                <p className="mb-6 opacity-90">
                  Try speaking or typing a message to see the magic of
                  AI-powered sign language translation in action.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => handleTextSubmit("Hello world!")}
                  className="group"
                >
                  Try Demo Message
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 SignBridge. Empowering accessible communication for
            everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}
