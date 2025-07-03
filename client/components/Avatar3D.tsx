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

// Simple 3D Avatar Component
function Avatar({ isAnimating }: { isAnimating: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [currentPose, setCurrentPose] = useState(0);

  // Animation poses for sign language (simplified)
  const poses = [
    { leftArm: 0, rightArm: 0, leftHand: 0, rightHand: 0 },
    {
      leftArm: Math.PI / 4,
      rightArm: -Math.PI / 4,
      leftHand: 0.2,
      rightHand: -0.2,
    },
    {
      leftArm: Math.PI / 2,
      rightArm: -Math.PI / 2,
      leftHand: 0.5,
      rightHand: -0.5,
    },
    {
      leftArm: Math.PI / 6,
      rightArm: -Math.PI / 6,
      leftHand: 0.1,
      rightHand: -0.1,
    },
  ];

  useFrame((state) => {
    if (groupRef.current && isAnimating) {
      // Animate through poses
      const time = state.clock.getElapsedTime();
      const poseIndex = Math.floor(time * 0.5) % poses.length;
      setCurrentPose(poseIndex);

      // Apply smooth transitions
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    }
  });

  const pose = poses[currentPose];

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Head */}
      <Sphere args={[0.3]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#FFB6A3" />
      </Sphere>

      {/* Eyes */}
      <Sphere args={[0.05]} position={[-0.1, 1.6, 0.25]}>
        <meshStandardMaterial color="#000" />
      </Sphere>
      <Sphere args={[0.05]} position={[0.1, 1.6, 0.25]}>
        <meshStandardMaterial color="#000" />
      </Sphere>

      {/* Body */}
      <Cylinder args={[0.2, 0.25, 0.8]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#4A90E2" />
      </Cylinder>

      {/* Left Arm */}
      <group position={[-0.3, 1.2, 0]} rotation={[0, 0, pose.leftArm]}>
        <Cylinder args={[0.08, 0.08, 0.6]} position={[0, -0.3, 0]}>
          <meshStandardMaterial color="#FFB6A3" />
        </Cylinder>
        {/* Left Hand */}
        <Sphere
          args={[0.12]}
          position={[0, -0.7, 0]}
          rotation={[0, 0, pose.leftHand]}
        >
          <meshStandardMaterial color="#FFB6A3" />
        </Sphere>
      </group>

      {/* Right Arm */}
      <group position={[0.3, 1.2, 0]} rotation={[0, 0, pose.rightArm]}>
        <Cylinder args={[0.08, 0.08, 0.6]} position={[0, -0.3, 0]}>
          <meshStandardMaterial color="#FFB6A3" />
        </Cylinder>
        {/* Right Hand */}
        <Sphere
          args={[0.12]}
          position={[0, -0.7, 0]}
          rotation={[0, 0, pose.rightHand]}
        >
          <meshStandardMaterial color="#FFB6A3" />
        </Sphere>
      </group>

      {/* Legs */}
      <Cylinder args={[0.1, 0.1, 0.7]} position={[-0.15, 0, 0]}>
        <meshStandardMaterial color="#2E4057" />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 0.7]} position={[0.15, 0, 0]}>
        <meshStandardMaterial color="#2E4057" />
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
      </CardContent>
    </Card>
  );
}
