import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Image,
  Eye,
  Lightbulb,
  RefreshCw,
  Download,
  ExternalLink,
  Video,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextualVisualsProps {
  text?: string;
  isProcessing?: boolean;
  onVisualsGenerated?: (visuals: Visual[], videos: VideoContent[]) => void;
}

interface Visual {
  id: string;
  type: "image" | "icon" | "diagram";
  url: string;
  description: string;
  relevance: number;
  category: string;
}

interface VideoContent {
  id: string;
  type: "veo3" | "dalle" | "contextual";
  url: string;
  thumbnail: string;
  description: string;
  duration: string;
  relevance: number;
  category: string;
  isGenerating?: boolean;
  progress?: number;
}

export default function ContextualVisuals({
  text = "",
  isProcessing = false,
  onVisualsGenerated,
}: ContextualVisualsProps) {
  const [visuals, setVisuals] = useState<Visual[]>([]);
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVisual, setSelectedVisual] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("images");

  // Generate both visuals and videos based on text analysis
  const generateContent = async (inputText: string) => {
    setIsGenerating(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Analyze text for common concepts
    const words = inputText.toLowerCase().split(" ");
    const mockVisuals: Visual[] = [];
    const mockVideos: VideoContent[] = [];

    // Add contextual visuals based on detected concepts
    if (words.some((w) => ["hello", "hi", "greet"].includes(w))) {
      mockVisuals.push({
        id: "greeting-img",
        type: "icon",
        url: "/api/placeholder/200/200",
        description: "Greeting gesture visualization",
        relevance: 0.9,
        category: "Social",
      });

      mockVideos.push({
        id: "greeting-video",
        type: "veo3",
        url: "https://example.com/greeting-sign.mp4",
        thumbnail: "/api/placeholder/300/200",
        description: "Sign language greeting demonstration",
        duration: "0:08",
        relevance: 0.95,
        category: "Social",
      });
    }

    if (words.some((w) => ["eat", "food", "hungry"].includes(w))) {
      mockVisuals.push({
        id: "food-img",
        type: "image",
        url: "/api/placeholder/200/200",
        description: "Food and eating context",
        relevance: 0.85,
        category: "Daily Life",
      });

      mockVideos.push({
        id: "food-video",
        type: "contextual",
        url: "https://example.com/food-context.mp4",
        thumbnail: "/api/placeholder/300/200",
        description: "Food-related sign language gestures",
        duration: "0:12",
        relevance: 0.88,
        category: "Daily Life",
      });
    }

    if (words.some((w) => ["help", "assist", "support"].includes(w))) {
      mockVisuals.push({
        id: "help-img",
        type: "diagram",
        url: "/api/placeholder/200/200",
        description: "Help and assistance concept",
        relevance: 0.8,
        category: "Support",
      });

      mockVideos.push({
        id: "help-video",
        type: "veo3",
        url: "https://example.com/help-sign.mp4",
        thumbnail: "/api/placeholder/300/200",
        description: "Help request in sign language",
        duration: "0:10",
        relevance: 0.92,
        category: "Support",
      });
    }

    // Always include general concept content
    mockVisuals.push(
      {
        id: "general1",
        type: "icon",
        url: "/api/placeholder/200/200",
        description: "Main concept visualization",
        relevance: 0.75,
        category: "General",
      },
      {
        id: "general2",
        type: "image",
        url: "/api/placeholder/200/200",
        description: "Supporting context image",
        relevance: 0.7,
        category: "Context",
      },
    );

    // Always include general videos
    mockVideos.push(
      {
        id: "general-video1",
        type: "veo3",
        url: "https://example.com/general-sign.mp4",
        thumbnail: "/api/placeholder/300/200",
        description: "General sign language interpretation",
        duration: "0:15",
        relevance: 0.8,
        category: "General",
      },
      {
        id: "context-video1",
        type: "dalle",
        url: "https://example.com/context-visual.mp4",
        thumbnail: "/api/placeholder/300/200",
        description: "Contextual visual explanation",
        duration: "0:08",
        relevance: 0.75,
        category: "Context",
      },
    );

    setVisuals(mockVisuals);
    setVideos(mockVideos);
    setIsGenerating(false);
    onVisualsGenerated?.(mockVisuals, mockVideos);
  };

  useEffect(() => {
    if (text && text.length > 3) {
      generateContent(text);
    } else {
      setVisuals([]);
      setVideos([]);
    }
  }, [text]);

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.8) return "bg-green-500";
    if (relevance >= 0.6) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Social: "bg-blue-100 text-blue-800",
      "Daily Life": "bg-green-100 text-green-800",
      Support: "bg-purple-100 text-purple-800",
      General: "bg-gray-100 text-gray-800",
      Context: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-accessibility-700">
            <Eye className="h-6 w-6" />
            Contextual Media
          </CardTitle>
          <div className="flex items-center gap-2">
            {text && (
              <Button
                onClick={() => generateContent(text)}
                disabled={isGenerating}
                variant="outline"
                size="sm"
              >
                <RefreshCw
                  className={cn("h-4 w-4 mr-1", isGenerating && "animate-spin")}
                />
                Regenerate All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!text ? (
          <div className="text-center py-12 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Image className="h-16 w-16 text-muted-foreground" />
              <Video className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-muted-foreground">
                No input to visualize
              </p>
              <p className="text-sm text-muted-foreground">
                Enter text or use voice input to generate contextual images and
                videos
              </p>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="text-center py-12 space-y-4">
            <div className="relative">
              <Lightbulb className="h-16 w-16 text-accessibility-500 mx-auto animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-accessibility-300 animate-ping" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">Generating media content...</p>
              <p className="text-sm text-muted-foreground">
                Creating contextual images and videos to enhance understanding
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Analysis summary */}
            <div className="p-4 bg-accessibility-50 rounded-lg border border-accessibility-200">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-accessibility-600" />
                <span className="font-medium text-accessibility-800">
                  Analysis Summary
                </span>
              </div>
              <p className="text-sm text-accessibility-700">
                Generated {visuals.length} images and {videos.length} videos to
                help understand: <span className="font-medium">"{text}"</span>
              </p>
            </div>

            {/* Tabs for Images and Videos */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="images" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Images ({visuals.length})
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Videos ({videos.length})
                </TabsTrigger>
              </TabsList>

              {/* Images Tab */}
              <TabsContent value="images" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {visuals.map((visual) => (
                    <div
                      key={visual.id}
                      className={cn(
                        "relative group cursor-pointer transition-all duration-200 rounded-lg border-2 overflow-hidden",
                        selectedVisual === visual.id
                          ? "border-accessibility-500 shadow-glow"
                          : "border-gray-200 hover:border-accessibility-300",
                      )}
                      onClick={() =>
                        setSelectedVisual(
                          selectedVisual === visual.id ? null : visual.id,
                        )
                      }
                    >
                      {/* Visual placeholder */}
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        {visual.type === "image" && (
                          <Image className="h-12 w-12 text-gray-400" />
                        )}
                        {visual.type === "icon" && (
                          <div className="h-12 w-12 bg-accessibility-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">🤝</span>
                          </div>
                        )}
                        {visual.type === "diagram" && (
                          <div className="space-y-2">
                            <div className="h-3 w-16 bg-accessibility-300 rounded"></div>
                            <div className="h-3 w-12 bg-accessibility-400 rounded"></div>
                            <div className="h-3 w-20 bg-accessibility-500 rounded"></div>
                          </div>
                        )}
                      </div>

                      {/* Overlay info */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <ExternalLink className="h-6 w-6 text-white" />
                      </div>

                      {/* Relevance indicator */}
                      <div className="absolute top-2 right-2">
                        <div
                          className={cn(
                            "h-3 w-3 rounded-full",
                            getRelevanceColor(visual.relevance),
                          )}
                          title={`Relevance: ${Math.round(visual.relevance * 100)}%`}
                        />
                      </div>

                      {/* Category badge */}
                      <div className="absolute bottom-2 left-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            getCategoryColor(visual.category),
                          )}
                        >
                          {visual.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected visual details */}
                {selectedVisual && (
                  <div className="p-4 bg-card border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Image Details</h4>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    {(() => {
                      const visual = visuals.find(
                        (v) => v.id === selectedVisual,
                      );
                      return visual ? (
                        <div className="space-y-2">
                          <p className="text-sm">{visual.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Type: {visual.type}</span>
                            <span>
                              Relevance: {Math.round(visual.relevance * 100)}%
                            </span>
                            <span>Category: {visual.category}</span>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </TabsContent>

              {/* Videos Tab */}
              <TabsContent value="videos" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      isSelected={selectedVideo === video.id}
                      onSelect={() =>
                        setSelectedVideo(
                          selectedVideo === video.id ? null : video.id,
                        )
                      }
                    />
                  ))}
                </div>

                {/* Selected video details */}
                {selectedVideo && (
                  <div className="p-4 bg-card border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Video Details</h4>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Play
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    {(() => {
                      const video = videos.find((v) => v.id === selectedVideo);
                      return video ? (
                        <div className="space-y-2">
                          <p className="text-sm">{video.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Type: {video.type.toUpperCase()}</span>
                            <span>Duration: {video.duration}</span>
                            <span>
                              Relevance: {Math.round(video.relevance * 100)}%
                            </span>
                            <span>Category: {video.category}</span>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Video Card Component
function VideoCard({
  video,
  isSelected,
  onSelect,
}: {
  video: VideoContent;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const getVideoTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      veo3: "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
      dalle: "bg-gradient-to-r from-green-500 to-teal-600 text-white",
      contextual: "bg-gradient-to-r from-orange-500 to-red-600 text-white",
    };
    return colors[type] || "bg-gray-500 text-white";
  };

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-200 rounded-lg border-2 overflow-hidden",
        isSelected
          ? "border-accessibility-500 shadow-glow"
          : "border-gray-200 hover:border-accessibility-300",
      )}
      onClick={onSelect}
    >
      {/* Video thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-slate-900 to-black relative">
        {video.isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="relative mb-4">
              <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-blue-400 text-xs font-bold">
                  {video.type === "veo3"
                    ? "V3"
                    : video.type.slice(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Generating...</p>
              {video.progress && (
                <div className="w-32 bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${video.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Thumbnail placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
              <div className="text-center text-white space-y-2">
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </div>
                <p className="text-xs font-medium">Sign Language Video</p>
              </div>
            </div>

            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="h-16 w-16 bg-white/90 rounded-full flex items-center justify-center">
                <Play className="h-8 w-8 text-black ml-1" />
              </div>
            </div>
          </>
        )}

        {/* Video type badge */}
        <div className="absolute top-2 left-2">
          <Badge
            className={cn("text-xs font-bold", getVideoTypeColor(video.type))}
          >
            {video.type === "veo3" ? "VEO3" : video.type.toUpperCase()}
          </Badge>
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2">
          <Badge
            variant="secondary"
            className="text-xs bg-black/70 text-white border-0"
          >
            {video.duration}
          </Badge>
        </div>

        {/* Relevance indicator */}
        <div className="absolute top-2 right-2">
          <div
            className={cn(
              "h-3 w-3 rounded-full",
              video.relevance >= 0.8
                ? "bg-green-500"
                : video.relevance >= 0.6
                  ? "bg-yellow-500"
                  : "bg-orange-500",
            )}
            title={`Relevance: ${Math.round(video.relevance * 100)}%`}
          />
        </div>
      </div>

      {/* Video info */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={cn("text-xs", getCategoryColor(video.category))}
          >
            {video.category}
          </Badge>
        </div>
        <p className="text-sm font-medium text-foreground line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );

  function getCategoryColor(category: string) {
    const colors: Record<string, string> = {
      Social: "bg-blue-100 text-blue-800",
      "Daily Life": "bg-green-100 text-green-800",
      Support: "bg-purple-100 text-purple-800",
      General: "bg-gray-100 text-gray-800",
      Context: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  }
}
