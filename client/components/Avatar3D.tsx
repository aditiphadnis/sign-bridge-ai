import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Sphere,
  Box,
  Cylinder,
  Environment,
} from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Play,
  Pause,
  RotateCcw,
  Download,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as THREE from "three";

interface Avatar3DProps {
  text?: string;
  isAnimating?: boolean;
  onAnimationComplete?: () => void;
}

// Realistic Female Avatar Component for Sign Language
function Avatar({ isAnimating }: { isAnimating: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  const [currentPose, setCurrentPose] = useState(0);

  // More realistic sign language poses
  const poses = [
    {
      leftArm: [0, 0, 0],
      rightArm: [0, 0, 0],
      leftHand: [0, 0, 0],
      rightHand: [0, 0, 0],
      description: "Rest position",
    },
    {
      leftArm: [0.2, 0, 0.3],
      rightArm: [0.2, 0, -0.3],
      leftHand: [0, 0, 0.2],
      rightHand: [0, 0, -0.2],
      description: "Hello gesture",
    },
    {
      leftArm: [1.2, 0, 0.8],
      rightArm: [1.2, 0, -0.8],
      leftHand: [0.3, 0, 0],
      rightHand: [0.3, 0, 0],
      description: "Thank you",
    },
    {
      leftArm: [0.8, 0, 0.6],
      rightArm: [0.6, 0, -0.4],
      leftHand: [0.1, 0, 0.1],
      rightHand: [0.1, 0, -0.1],
      description: "Help gesture",
    },
  ];

  useFrame((state) => {
    if (groupRef.current) {
      if (isAnimating) {
        // Animate through poses
        const time = state.clock.getElapsedTime();
        const poseIndex = Math.floor(time * 0.7) % poses.length;
        setCurrentPose(poseIndex);

        // Smooth transition between poses
        const pose = poses[poseIndex];

        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = pose.leftArm[0];
          leftArmRef.current.rotation.y = pose.leftArm[1];
          leftArmRef.current.rotation.z = pose.leftArm[2];
        }

        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = pose.rightArm[0];
          rightArmRef.current.rotation.y = pose.rightArm[1];
          rightArmRef.current.rotation.z = pose.rightArm[2];
        }

        if (leftHandRef.current) {
          leftHandRef.current.rotation.x = pose.leftHand[0];
          leftHandRef.current.rotation.y = pose.leftHand[1];
          leftHandRef.current.rotation.z = pose.leftHand[2];
        }

        if (rightHandRef.current) {
          rightHandRef.current.rotation.x = pose.rightHand[0];
          rightHandRef.current.rotation.y = pose.rightHand[1];
          rightHandRef.current.rotation.z = pose.rightHand[2];
        }

        // Subtle body movement
        groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.05;
        groupRef.current.position.y = Math.sin(time * 2) * 0.02 - 1;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Head - More realistic proportions */}
      <group position={[0, 1.6, 0]}>
        {/* Face */}
        <Sphere args={[0.25, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#F4C2A1" roughness={0.3} />
        </Sphere>

        {/* Hair - Dark brown */}
        <Sphere args={[0.28, 16, 16]} position={[0, 0.05, -0.05]}>
          <meshStandardMaterial color="#2C1810" roughness={0.8} />
        </Sphere>

        {/* Headband - White/Light */}
        <Cylinder
          args={[0.26, 0.26, 0.08]}
          position={[0, 0.15, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#F8F8F8" roughness={0.2} />
        </Cylinder>

        {/* Eyes */}
        <Sphere args={[0.04]} position={[-0.08, 0.05, 0.2]}>
          <meshStandardMaterial color="#FFF" />
        </Sphere>
        <Sphere args={[0.04]} position={[0.08, 0.05, 0.2]}>
          <meshStandardMaterial color="#FFF" />
        </Sphere>

        {/* Pupils */}
        <Sphere args={[0.02]} position={[-0.08, 0.05, 0.22]}>
          <meshStandardMaterial color="#2C1810" />
        </Sphere>
        <Sphere args={[0.02]} position={[0.08, 0.05, 0.22]}>
          <meshStandardMaterial color="#2C1810" />
        </Sphere>

        {/* Nose */}
        <Sphere args={[0.02]} position={[0, 0, 0.22]}>
          <meshStandardMaterial color="#E8A688" />
        </Sphere>

        {/* Smile */}
        <Cylinder args={[0.08, 0.08, 0.01]} position={[0, -0.08, 0.22]}>
          <meshStandardMaterial color="#D67B7B" />
        </Cylinder>
      </group>

      {/* Neck */}
      <Cylinder args={[0.08, 0.1, 0.15]} position={[0, 1.3, 0]}>
        <meshStandardMaterial color="#F4C2A1" />
      </Cylinder>

      {/* Body - Green top */}
      <group position={[0, 0.9, 0]}>
        <Cylinder args={[0.15, 0.2, 0.6]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#2D8B3F" roughness={0.7} />
        </Cylinder>

        {/* Shirt details */}
        <Sphere args={[0.025]} position={[0, 0.1, 0.18]}>
          <meshStandardMaterial color="#1F5F2F" />
        </Sphere>
        <Sphere args={[0.025]} position={[0, -0.1, 0.18]}>
          <meshStandardMaterial color="#1F5F2F" />
        </Sphere>
      </group>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.25, 1.15, 0]}>
        {/* Upper arm */}
        <Cylinder args={[0.06, 0.08, 0.4]} position={[0, -0.2, 0]}>
          <meshStandardMaterial color="#2D8B3F" />
        </Cylinder>

        {/* Forearm */}
        <group position={[0, -0.45, 0]}>
          <Cylinder args={[0.05, 0.06, 0.35]} position={[0, -0.175, 0]}>
            <meshStandardMaterial color="#F4C2A1" />
          </Cylinder>

          {/* Left Hand */}
          <group ref={leftHandRef} position={[0, -0.4, 0]}>
            <Sphere args={[0.08]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#F4C2A1" />
            </Sphere>
            {/* Fingers */}
            <Cylinder
              args={[0.015, 0.015, 0.1]}
              position={[0, -0.05, 0.06]}
              rotation={[0.3, 0, 0]}
            >
              <meshStandardMaterial color="#F4C2A1" />
            </Cylinder>
            <Cylinder
              args={[0.015, 0.015, 0.1]}
              position={[0.03, -0.05, 0.05]}
              rotation={[0.2, 0.3, 0]}
            >
              <meshStandardMaterial color="#F4C2A1" />
            </Cylinder>
            <Cylinder
              args={[0.015, 0.015, 0.1]}
              position={[-0.03, -0.05, 0.05]}
              rotation={[0.2, -0.3, 0]}
            >
              <meshStandardMaterial color="#F4C2A1" />
            </Cylinder>
          </group>
        </group>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.25, 1.15, 0]}>
        {/* Upper arm */}
        <Cylinder args={[0.06, 0.08, 0.4]} position={[0, -0.2, 0]}>
          <meshStandardMaterial color="#2D8B3F" />
        </Cylinder>

        {/* Forearm */}
        <group position={[0, -0.45, 0]}>
          <Cylinder args={[0.05, 0.06, 0.35]} position={[0, -0.175, 0]}>
            <meshStandardMaterial color="#F4C2A1" />
          </Cylinder>

          {/* Right Hand */}
          <group ref={rightHandRef} position={[0, -0.4, 0]}>
            <Sphere args={[0.08]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#F4C2A1" />
            </Sphere>
            {/* Fingers */}
            <Cylinder
              args={[0.015, 0.015, 0.1]}
              position={[0, -0.05, 0.06]}
              rotation={[0.3, 0, 0]}
            >
              <meshStandardMaterial color="#F4C2A1" />
            </Cylinder>
            <Cylinder
              args={[0.015, 0.015, 0.1]}
              position={[0.03, -0.05, 0.05]}
              rotation={[0.2, 0.3, 0]}
            >
              <meshStandardMaterial color="#F4C2A1" />
            </Cylinder>
            <Cylinder
              args={[0.015, 0.015, 0.1]}
              position={[-0.03, -0.05, 0.05]}
              rotation={[0.2, -0.3, 0]}
            >
              <meshStandardMaterial color="#F4C2A1" />
            </Cylinder>
          </group>
        </group>
      </group>

      {/* Legs - Hidden below torso, just for completeness */}
      <Cylinder args={[0.08, 0.1, 0.5]} position={[-0.1, 0.25, 0]}>
        <meshStandardMaterial color="#1A5A2A" />
      </Cylinder>
      <Cylinder args={[0.08, 0.1, 0.5]} position={[0.1, 0.25, 0]}>
        <meshStandardMaterial color="#1A5A2A" />
      </Cylinder>
    </group>
  );
}

// Floating sign language text
function FloatingText({ text }: { text: string }) {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y =
        Math.sin(state.clock.getElapsedTime()) * 0.1 + 2;
    }
  });

  return (
    <Text
      ref={textRef}
      fontSize={0.3}
      color="#4A90E2"
      anchorX="center"
      anchorY="middle"
      position={[0, 2, 0]}
    >
      {text}
    </Text>
  );
}

export default function Avatar3D({
  text = "",
  isAnimating = false,
  onAnimationComplete,
}: Avatar3DProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<"front" | "side" | "3d">("3d");

  useEffect(() => {
    if (isAnimating) {
      setIsPlaying(true);
      // Simulate animation completion after 5 seconds
      const timer = setTimeout(() => {
        setIsPlaying(false);
        onAnimationComplete?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, onAnimationComplete]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sign-700">
            <User className="h-6 w-6" />
            Sign Language Avatar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={isPlaying ? "default" : "secondary"}
              className={cn(
                "flex items-center gap-1",
                isPlaying && "bg-sign-500 text-white",
              )}
            >
              <Zap className="h-3 w-3" />
              {isPlaying ? "Signing" : "Ready"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 3D Canvas */}
        <div className="relative h-96 bg-gradient-to-b from-accessibility-50 to-white rounded-lg border-2 border-dashed border-accessibility-200 overflow-hidden">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={0.8} />
              <pointLight position={[-10, -10, -5]} intensity={0.3} />

              <Avatar isAnimating={isPlaying} />

              {text && <FloatingText text={text} />}

              <OrbitControls
                enablePan={false}
                enableZoom={true}
                enableRotate={viewMode === "3d"}
                minDistance={3}
                maxDistance={8}
              />

              <Environment preset="city" />
            </Suspense>
          </Canvas>

          {/* Loading overlay */}
          {!text && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="text-center space-y-2">
                <User className="h-12 w-12 text-muted-foreground mx-auto animate-float" />
                <p className="text-muted-foreground">
                  Waiting for text to translate...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePlayPause}
              disabled={!text}
              variant="outline"
              size="sm"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Animation info */}
        {text && (
          <div className="p-3 bg-sign-50 rounded-lg border border-sign-200">
            <p className="text-sm font-medium text-sign-800 mb-1">
              Translating:
            </p>
            <p className="text-sign-700">{text}</p>
          </div>
        )}

        {/* VEO3 Video Generation Section */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">V3</span>
              </div>
              <h4 className="font-semibold text-foreground">
                Google VEO3 Video
              </h4>
              <Badge
                variant="secondary"
                className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700"
              >
                AI Video Generation
              </Badge>
            </div>
            <Button
              onClick={() => {
                /* TODO: Integrate with VEO3 API */
              }}
              disabled={!text || isPlaying}
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700"
            >
              Generate Video
            </Button>
          </div>

          <VEO3VideoPlayer text={text} isGenerating={isPlaying} />
        </div>
      </CardContent>
    </Card>
  );
}

// VEO3 Video Player Component
function VEO3VideoPlayer({
  text,
  isGenerating,
}: {
  text: string;
  isGenerating: boolean;
}) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [videoQuality, setVideoQuality] = useState<"720p" | "1080p" | "4K">(
    "1080p",
  );
  const [videoDuration, setVideoDuration] = useState<"5s" | "10s" | "30s">(
    "10s",
  );

  useEffect(() => {
    if (text && text.length > 3) {
      generateVEO3Video();
    }
  }, [text]);

  const generateVEO3Video = async () => {
    setIsVideoGenerating(true);
    setGenerationProgress(0);
    setVideoUrl(null);

    // Simulate VEO3 generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Mock video URL (in real implementation, this would come from VEO3 API)
          setVideoUrl(`https://example.com/veo3-video-${Date.now()}.mp4`);
          setIsVideoGenerating(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 800);
  };

  if (!text) {
    return (
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold">V3</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Enter text to generate VEO3 video
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Display Area */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-200">
        {isVideoGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-black text-white">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="h-16 w-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-blue-400 text-xs font-bold">V3</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Generating VEO3 Video...</p>
                <div className="w-64 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">
                  {Math.round(generationProgress)}% complete
                </p>
              </div>
            </div>
          </div>
        ) : videoUrl ? (
          <div className="relative h-full">
            {/* Mock Video Player */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
              <div className="text-center text-white space-y-2">
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="font-medium">Sign Language Video Ready</p>
                <p className="text-sm opacity-80">"{text}"</p>
              </div>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4 text-white">
                <Button
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 border-0"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </Button>
                <div className="flex-1 bg-white/20 rounded-full h-1">
                  <div className="bg-white rounded-full h-1 w-1/3"></div>
                </div>
                <span className="text-xs">0:03 / 0:10</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <p className="text-muted-foreground">No video generated yet</p>
          </div>
        )}
      </div>

      {/* VEO3 Controls */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                Quality
              </label>
              <select
                value={videoQuality}
                onChange={(e) => setVideoQuality(e.target.value as any)}
                className="text-xs bg-white border border-slate-300 rounded px-2 py-1"
              >
                <option value="720p">720p HD</option>
                <option value="1080p">1080p FHD</option>
                <option value="4K">4K Ultra</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                Duration
              </label>
              <select
                value={videoDuration}
                onChange={(e) => setVideoDuration(e.target.value as any)}
                className="text-xs bg-white border border-slate-300 rounded px-2 py-1"
              >
                <option value="5s">5 seconds</option>
                <option value="10s">10 seconds</option>
                <option value="30s">30 seconds</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {videoUrl && (
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          )}
          <Button
            onClick={generateVEO3Video}
            disabled={isVideoGenerating || !text}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
          >
            {isVideoGenerating ? "Generating..." : "Regenerate"}
          </Button>
        </div>
      </div>

      {/* VEO3 Info */}
      <div className="text-xs text-muted-foreground bg-slate-50 p-3 rounded border border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">V3</span>
          </div>
          <span className="font-medium">Google VEO3 Enhanced</span>
        </div>
        <p>
          Advanced AI video generation with realistic sign language movements,
          facial expressions, and contextual backgrounds for enhanced
          communication.
        </p>
      </div>
    </div>
  );
}
