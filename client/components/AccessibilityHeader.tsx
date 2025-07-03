import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Heart,
  Settings,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Type,
  Info,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AccessibilityHeaderProps {
  onThemeToggle?: () => void;
  onVolumeToggle?: () => void;
  isDarkMode?: boolean;
  isMuted?: boolean;
}

export default function AccessibilityHeader({
  onThemeToggle,
  onVolumeToggle,
  isDarkMode = false,
  isMuted = false,
}: AccessibilityHeaderProps) {
  const [fontSize, setFontSize] = useState("normal");

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    // Apply font size to document root
    const root = document.documentElement;
    switch (size) {
      case "small":
        root.style.fontSize = "14px";
        break;
      case "large":
        root.style.fontSize = "18px";
        break;
      case "xl":
        root.style.fontSize = "20px";
        break;
      default:
        root.style.fontSize = "16px";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and brand */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-br from-accessibility-500 to-sign-500 rounded-lg flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-accessibility-600 to-sign-600 bg-clip-text text-transparent">
              SignBridge
            </h1>
            <p className="text-xs text-muted-foreground">
              Voice to Sign Language
            </p>
          </div>
        </div>

        {/* Status indicators */}
        <div className="hidden md:flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse" />
            Ready
          </Badge>
          <Badge variant="secondary" className="text-xs">
            AI Powered
          </Badge>
        </div>

        {/* Accessibility controls */}
        <div className="flex items-center gap-2">
          {/* Volume control */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onVolumeToggle}
            className="hidden sm:flex"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          {/* Font size control */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex"
                title="Text Size"
              >
                <Type className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFontSizeChange("small")}>
                <span className="text-sm">Small Text</span>
                {fontSize === "small" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFontSizeChange("normal")}>
                <span>Normal Text</span>
                {fontSize === "normal" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFontSizeChange("large")}>
                <span className="text-lg">Large Text</span>
                {fontSize === "large" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFontSizeChange("xl")}>
                <span className="text-xl">Extra Large</span>
                {fontSize === "xl" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onThemeToggle}
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Main menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" title="Menu">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Tutorials
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Info className="h-4 w-4 mr-2" />
                About SignBridge
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* Mobile accessibility controls */}
              <div className="sm:hidden">
                <DropdownMenuItem onClick={onVolumeToggle}>
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 mr-2" />
                  ) : (
                    <Volume2 className="h-4 w-4 mr-2" />
                  )}
                  {isMuted ? "Unmute" : "Mute"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>

              <DropdownMenuItem className="text-xs text-muted-foreground">
                Version 1.0.0
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Accessibility notice bar */}
      <div className="bg-accessibility-50 border-b px-4 py-2">
        <div className="container mx-auto">
          <p className="text-xs text-accessibility-700 text-center">
            🌟 Empowering communication through accessible technology • Built
            with ❤️ for the deaf and hard-of-hearing community
          </p>
        </div>
      </div>
    </header>
  );
}
