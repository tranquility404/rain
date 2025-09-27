import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

// Lightweight bubble component with simplified physics
const LightweightBubble = ({
  position,
  size,
  color,
  speed = 1
}: {
  position: [number, number, number];
  size: number;
  color: string;
  speed?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Simple floating animation
      const time = state.clock.getElapsedTime() * speed;
      meshRef.current.position.y = position[1] + Math.sin(time) * 0.2;
      meshRef.current.position.x = position[0] + Math.cos(time * 0.7) * 0.1;
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    }
  });

  // Use lower resolution geometry for mobile performance
  return (
    <Sphere ref={meshRef} args={[size, 12, 12]} position={position}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.4}
      />
    </Sphere>
  );
};

// Lightweight bubble system with responsive positioning
const SimpleBubbleSystem = () => {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0, isMobile: false });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768 || 'ontouchstart' in window;

      setScreenSize({ width, height, isMobile });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const bubbles = useMemo(() => {
    const { width, height, isMobile } = screenSize;

    if (width === 0) return []; // Don't render until screen size is known

    // Reduce bubble count and adjust positioning based on screen size
    const bubbleCount = isMobile ? 4 : 6; // Fewer bubbles on mobile
    const positionRange = isMobile ? 2.5 : 3.5; // Smaller positioning range on mobile
    const maxBubbleSize = isMobile ? 0.15 : 0.2; // Smaller bubbles on mobile

    // Adjust bubble positioning relative to main sphere position
    const sphereYOffset = isMobile ? 1.0 : 0; // Move bubbles up on mobile to follow sphere

    return Array.from({ length: bubbleCount }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * positionRange,
        (Math.random() - 0.5) * positionRange + sphereYOffset, // Add Y offset for mobile
        (Math.random() - 0.5) * 1.5
      ] as [number, number, number],
      size: 0.08 + Math.random() * maxBubbleSize,
      color: ['#06b6d4', '#22d3ee', '#0ea5e9', '#38bdf8'][Math.floor(Math.random() * 4)],
      speed: 0.5 + Math.random() * 0.8
    }));
  }, [screenSize]);

  return (
    <>
      {bubbles.map(bubble => (
        <LightweightBubble
          key={bubble.id}
          position={bubble.position}
          size={bubble.size}
          color={bubble.color}
          speed={bubble.speed}
        />
      ))}
    </>
  );
};

// Optimized main sphere with responsive scaling and positioning
const OptimizedSphere = () => {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0, isMobile: false });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768 || 'ontouchstart' in window;

      setScreenSize({ width, height, isMobile });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Calculate responsive scale based on screen dimensions
  const getResponsiveScale = () => {
    const { width, height, isMobile } = screenSize;

    if (width === 0) return 1; // Default scale while loading

    // Base scale factors for different screen sizes
    if (isMobile) {
      // Mobile scaling - much smaller to prevent covering the screen
      if (width < 400) return 0.6;  // Very small phones
      if (width < 500) return 0.8;  // Small phones
      return 1.0;                   // Larger phones
    } else {
      // Desktop/tablet scaling
      if (width < 1024) return 1.2;  // Tablets
      if (width < 1440) return 1.5;  // Small desktops
      if (width < 1920) return 1.8;  // Medium desktops
      return 2.0;                     // Large desktops
    }
  };

  // Calculate responsive positioning - move sphere up on mobile to be behind hero title
  const getResponsivePosition = (): [number, number, number] => {
    const { width, height, isMobile } = screenSize;

    if (width === 0) return [0, 0, 0]; // Default position while loading

    if (isMobile) {
      // Mobile positioning - move sphere upward to appear behind hero title
      const aspectRatio = height / width;

      if (width < 400) return [0, 1.8, 0];   // Very small phones - higher up
      if (width < 500) return [0, 1.5, 0];   // Small phones
      if (aspectRatio > 2) return [0, 1.2, 0]; // Tall phones (like iPhone)
      return [0, 1.0, 0];                     // Standard mobile
    } else {
      // Desktop/tablet positioning - centered or slightly up
      if (width < 1024) return [0, 0.3, 0];  // Tablets - slightly up
      return [0, 0, 0];                       // Desktop - centered
    }
  };

  const scale = getResponsiveScale();
  const position = getResponsivePosition();

  if (screenSize.isMobile) {
    // Simplified sphere for mobile - no distortion material, lower resolution
    return (
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1, 24, 24]} scale={scale} position={position}>
          <meshBasicMaterial
            color="#0ea5e9"
            transparent
            opacity={0.7}
          />
        </Sphere>
      </Float>
    );
  }

  // Full version for desktop - moderate complexity
  return (
    <Float speed={1.2} rotationIntensity={0.8} floatIntensity={1.5}>
      <Sphere args={[1, 32, 32]} scale={scale} position={position}>
        <MeshDistortMaterial
          color="#0ea5e9"
          attach="material"
          distort={0.2}
          speed={1.5}
          roughness={0}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
};

// Responsive and mobile-optimized water scene
const WaterScene = () => {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0, isMobile: false });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768 || 'ontouchstart' in window;

      setScreenSize({ width, height, isMobile });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Calculate responsive camera settings
  const getCameraSettings = () => {
    const { width, isMobile } = screenSize;

    if (width === 0) return { position: [0, 0, 5], fov: 60 }; // Default while loading

    if (isMobile) {
      // Mobile camera settings - pull back further to show smaller sphere properly
      if (width < 400) return { position: [0, 0, 6], fov: 70 };  // Very small phones
      if (width < 500) return { position: [0, 0, 5.5], fov: 65 }; // Small phones
      return { position: [0, 0, 5], fov: 60 };                    // Larger phones
    } else {
      // Desktop camera settings
      if (width < 1024) return { position: [0, 0, 4.5], fov: 55 }; // Tablets
      return { position: [0, 0, 5], fov: 60 };                     // Desktops
    }
  };

  const cameraSettings = getCameraSettings();

  return (
    <motion.div
      className="absolute inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Canvas
        camera={{
          position: cameraSettings.position as [number, number, number],
          fov: cameraSettings.fov
        }}
        dpr={screenSize.isMobile ? 1 : Math.min(window.devicePixelRatio, 2)} // Limit pixel ratio on mobile
        performance={{ min: 0.5 }} // Allow frame rate to drop to maintain performance
        frameloop="demand" // Only render when needed
      >
        {/* Simplified lighting for better performance */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        {!screenSize.isMobile && <pointLight position={[-10, -10, -5]} color="#22d3ee" intensity={0.3} />}

        <OptimizedSphere />
        <SimpleBubbleSystem />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!screenSize.isMobile} // Disable auto-rotate on mobile to save battery
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          enableDamping={false} // Disable damping for better performance
        />
      </Canvas>
    </motion.div>
  );
};

export default WaterScene;