import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

interface BubbleData {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  size: number;
  color: string;
}

const PhysicsBubble = ({ bubble, onUpdate }: { bubble: BubbleData; onUpdate: (id: number, position: THREE.Vector3, velocity: THREE.Vector3) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Repulsion force from the large central bubble (positioned at origin)
      const largeBubblePosition = new THREE.Vector3(0, 0, 0);
      const distanceToLargeBubble = bubble.position.distanceTo(largeBubblePosition);
      const largeBubbleRadius = 2; // The large bubble's scale
      const repulsionDistance = largeBubbleRadius + 1; // Start repulsion 1 unit away from surface

      if (distanceToLargeBubble < repulsionDistance) {
        // Calculate repulsion force
        const repulsionDirection = bubble.position.clone().sub(largeBubblePosition).normalize();
        const repulsionStrength = (repulsionDistance - distanceToLargeBubble) / repulsionDistance;
        const repulsionForce = repulsionDirection.multiplyScalar(repulsionStrength * 2 * delta);

        // Apply repulsion force to velocity
        bubble.velocity.add(repulsionForce);
      }

      // Update position based on velocity
      bubble.position.add(bubble.velocity.clone().multiplyScalar(delta));

      // Boundary collision (screen edges)
      const bounds = 4;
      if (bubble.position.x > bounds || bubble.position.x < -bounds) {
        bubble.velocity.x *= -0.8; // Damping on collision
        bubble.position.x = THREE.MathUtils.clamp(bubble.position.x, -bounds, bounds);
      }
      if (bubble.position.y > bounds || bubble.position.y < -bounds) {
        bubble.velocity.y *= -0.8;
        bubble.position.y = THREE.MathUtils.clamp(bubble.position.y, -bounds, bounds);
      }
      if (bubble.position.z > 2 || bubble.position.z < -2) {
        bubble.velocity.z *= -0.8;
        bubble.position.z = THREE.MathUtils.clamp(bubble.position.z, -2, 2);
      }

      // Update mesh position
      meshRef.current.position.copy(bubble.position);

      // Call update callback
      onUpdate(bubble.id, bubble.position, bubble.velocity);
    }
  });

  return (
    <Sphere ref={meshRef} args={[bubble.size, 16, 16]} position={bubble.position.toArray()}>
      <MeshDistortMaterial
        color={bubble.color}
        attach="material"
        distort={0.1}
        speed={1.5}
        roughness={0}
        transparent
        opacity={0.6}
      />
    </Sphere>
  );
};

const BubbleSystem = () => {
  const [bubbles, setBubbles] = useState<BubbleData[]>(() => {
    // Create 12 small bubbles with random positions and velocities
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.3
      ),
      size: 0.1 + Math.random() * 0.3, // Size between 0.1 and 0.4
      color: ['#06b6d4', '#22d3ee', '#0ea5e9', '#38bdf8'][Math.floor(Math.random() * 4)]
    }));
  });

  const updateBubble = (id: number, position: THREE.Vector3, velocity: THREE.Vector3) => {
    setBubbles(prevBubbles => {
      const newBubbles = [...prevBubbles];
      const bubbleIndex = newBubbles.findIndex(b => b.id === id);
      if (bubbleIndex !== -1) {
        newBubbles[bubbleIndex] = {
          ...newBubbles[bubbleIndex],
          position: position.clone(),
          velocity: velocity.clone()
        };
      }
      return newBubbles;
    });
  };

  // Collision detection and response
  useFrame(() => {
    setBubbles(prevBubbles => {
      const newBubbles = [...prevBubbles];

      // Check collisions between all pairs of bubbles
      for (let i = 0; i < newBubbles.length; i++) {
        for (let j = i + 1; j < newBubbles.length; j++) {
          const bubble1 = newBubbles[i];
          const bubble2 = newBubbles[j];

          const distance = bubble1.position.distanceTo(bubble2.position);
          const minDistance = bubble1.size + bubble2.size;

          if (distance < minDistance) {
            // Collision detected - calculate collision response
            const normal = bubble2.position.clone().sub(bubble1.position).normalize();
            const relativeVelocity = bubble1.velocity.clone().sub(bubble2.velocity);
            const velocityAlongNormal = relativeVelocity.dot(normal);

            // Don't resolve if velocities are separating
            if (velocityAlongNormal > 0) continue;

            // Restitution (bounciness) - lower value for slower bouncing
            const restitution = 0.3;
            const impulseScalar = -(1 + restitution) * velocityAlongNormal;
            const impulse = normal.clone().multiplyScalar(impulseScalar * 0.5);

            // Apply impulse to velocities
            bubble1.velocity.add(impulse);
            bubble2.velocity.sub(impulse);

            // Separate bubbles to prevent overlap
            const separation = normal.clone().multiplyScalar((minDistance - distance) * 0.5);
            bubble1.position.sub(separation);
            bubble2.position.add(separation);
          }
        }
      }

      return newBubbles;
    });
  });

  return (
    <>
      {bubbles.map(bubble => (
        <PhysicsBubble
          key={bubble.id}
          bubble={bubble}
          onUpdate={updateBubble}
        />
      ))}
    </>
  );
};

const AnimatedSphere = () => {
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 64, 64]} scale={2}>
        <MeshDistortMaterial
          color="#0ea5e9"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
};

const WaterScene = () => {
  return (
    <motion.div
      className="absolute inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} color="#22d3ee" intensity={0.5} />

        <AnimatedSphere />
        <BubbleSystem />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </motion.div>
  );
};

export default WaterScene;