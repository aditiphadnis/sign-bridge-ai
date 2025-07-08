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
  onVideoInput,
  isProcessing = false,
}: VoiceInputProps) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Video input states
  const [isRecording, setIsRecording] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProcessing, setVideoProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<number>();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Video recording functions
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setVideoStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);

        // Send video data
        onVideoInput({
          blob,
          url,
          duration: recordingDuration,
          type: "record",
        });

        // Stop camera stream
        stream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      // Start recording timer
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting video recording:", error);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setUploadedVideo(url);

      // Get video duration
      const video = document.createElement("video");
      video.src = url;
      video.onloadedmetadata = () => {
        onVideoInput({
          file,
          url,
          duration: video.duration,
          type: "upload",
        });
      };
    }
  };

  const resetVideo = () => {
    setRecordedVideo(null);
    setUploadedVideo(null);
    setIsVideoPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processVideo = async () => {
    const videoUrl = recordedVideo || uploadedVideo;
    if (!videoUrl) return;

    setVideoProcessing(true);

    // Simulate video processing for sign language recognition
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock extracted text from video
    const mockTranscriptions = [
      "Hello, nice to meet you",
      "Thank you for your help",
      "How are you today?",
      "I need assistance please",
      "Have a wonderful day",
    ];

    const extractedText =
      mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
    onVoiceInput(extractedText);

    setVideoProcessing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Video
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

          <TabsContent value="video" className="space-y-4">
            <div className="space-y-6">
              {/* Video Display Area */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                {videoStream || recordedVideo || uploadedVideo ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    src={recordedVideo || uploadedVideo || undefined}
                    controls={!isRecording && (recordedVideo || uploadedVideo)}
                    muted={isRecording}
                    autoPlay={isRecording}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Video className="h-16 w-16 text-gray-400 mx-auto" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-600">
                          No video input
                        </p>
                        <p className="text-sm text-gray-500">
                          Record a video or upload a file to get started
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
                    <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm font-medium">
                      REC {formatTime(recordingDuration)}
                    </span>
                  </div>
                )}

                {/* Video processing overlay */}
                {videoProcessing && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center text-white space-y-4">
                      <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
                      <div className="space-y-2">
                        <p className="font-medium">Processing Video...</p>
                        <p className="text-sm opacity-80">
                          Analyzing sign language gestures
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recording Controls */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="h-4 w-4" />
                    <span className="font-medium">Record Video</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={
                        isRecording ? stopVideoRecording : startVideoRecording
                      }
                      disabled={isProcessing || videoProcessing}
                      variant={isRecording ? "destructive" : "default"}
                      className={cn("flex-1", isRecording && "animate-pulse")}
                    >
                      {isRecording ? (
                        <>
                          <Square className="h-4 w-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Video className="h-4 w-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>

                    {(recordedVideo || uploadedVideo) && (
                      <Button
                        onClick={resetVideo}
                        variant="outline"
                        size="icon"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Upload Controls */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FileVideo className="h-4 w-4" />
                    <span className="font-medium">Upload Video</span>
                  </div>

                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing || isRecording || videoProcessing}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Video File
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Supports MP4, WebM, MOV files
                    </p>
                  </div>
                </div>
              </div>

              {/* Process Video Button */}
              {(recordedVideo || uploadedVideo) && (
                <div className="flex justify-center">
                  <Button
                    onClick={processVideo}
                    disabled={videoProcessing || isProcessing}
                    size="lg"
                    className="bg-accessibility-500 hover:bg-accessibility-600"
                  >
                    {videoProcessing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Analyze Sign Language
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Video Info */}
              {(recordedVideo || uploadedVideo) && !videoProcessing && (
                <div className="p-3 bg-accessibility-50 rounded-lg border border-accessibility-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {recordedVideo ? "Recorded" : "Uploaded"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Ready to Process
                    </Badge>
                  </div>
                  <p className="text-sm text-accessibility-700">
                    Video is ready for sign language analysis. Click "Analyze
                    Sign Language" to extract text and convert to sign language
                    demonstration.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
