import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Type,
  Send,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
  Upload,
  Play,
  Pause,
  RotateCcw,
  FileVideo,
  Camera,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  onTextSubmit: (text: string) => void;
  onVoiceInput: (text: string) => void;
  onVideoInput: (videoData: VideoInputData) => void;
  isProcessing?: boolean;
}

interface VideoInputData {
  file?: File;
  blob?: Blob;
  url: string;
  duration: number;
  type: "upload" | "record";
}

export default function VoiceInput({
  onTextSubmit,
  onVoiceInput,
  isProcessing = false,
}: VoiceInputProps) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setVoiceText(finalTranscript + interimTranscript);
        if (finalTranscript) {
          onVoiceInput(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [onVoiceInput]);

  const startListening = async () => {
    if (!isSupported) return;

    try {
      // Start audio context for volume visualization
      audioContextRef.current = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      source.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateVolume = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setVolume(average / 255);
          animationRef.current = requestAnimationFrame(updateVolume);
        }
      };

      setIsListening(true);
      setVoiceText("");
      recognitionRef.current.start();
      updateVolume();
    } catch (error) {
      console.error("Error starting voice recognition:", error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setVolume(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleTextSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text.trim());
      setText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accessibility-700">
          <Volume2 className="h-6 w-6" />
          Voice & Text Input
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice Input
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Text Input
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="space-y-4">
            <div className="text-center space-y-4">
              {!isSupported && (
                <p className="text-destructive text-sm">
                  Voice recognition is not supported in this browser.
                </p>
              )}

              <div className="relative">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={!isSupported || isProcessing}
                  size="lg"
                  className={cn(
                    "h-24 w-24 rounded-full transition-all duration-300",
                    isListening
                      ? "bg-destructive hover:bg-destructive/90 animate-pulse-glow shadow-glow"
                      : "bg-accessibility-500 hover:bg-accessibility-600",
                  )}
                >
                  {isListening ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>

                {isListening && (
                  <div className="absolute inset-0 rounded-full border-4 border-accessibility-300 animate-ping" />
                )}
              </div>

              {isListening && (
                <div className="space-y-2">
                  <div className="flex justify-center items-center gap-1">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1 bg-accessibility-400 rounded-full transition-all duration-150",
                          volume > i / 20 ? "h-8" : "h-2",
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Listening...</p>
                </div>
              )}

              {voiceText && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Transcribed Text:</p>
                  <p className="text-foreground">{voiceText}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-4">
              <Textarea
                placeholder="Type your message here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-32 text-lg"
                disabled={isProcessing}
              />

              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {text.length} characters
                </p>
                <Button
                  onClick={handleTextSubmit}
                  disabled={!text.trim() || isProcessing}
                  className="bg-sign-500 hover:bg-sign-600"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Convert to Sign Language
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
