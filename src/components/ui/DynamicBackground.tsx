"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Suppress THREE.Clock deprecation warning from @react-three/fiber
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
    originalWarn(...args);
  };
}

function ParticleField({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<THREE.Points>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  // Generate fewer particles on mobile to save performance
  const particles = useMemo(() => {
    const count = isMobile ? 2000 : 7000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, [isMobile]);

  React.useEffect(() => {
    if (isMobile) return; // Don't track mouse on mobile
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  useFrame((state, delta) => {
    if (!ref.current) return;

    // Cap delta to prevent massive jumps on lag spikes
    const safeDelta = Math.min(delta, 0.1);

    ref.current.rotation.x -= safeDelta * 0.015;
    ref.current.rotation.y -= safeDelta * 0.025;

    if (!isMobile) {
      const targetX = mouse.current.x * 2.5;
      const targetY = mouse.current.y * 2.5;
      state.camera.position.x += (targetX - state.camera.position.x) * 0.02;
      state.camera.position.y += (targetY - state.camera.position.y) * 0.02;
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 8]}>
      <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={isMobile ? 0.6 : 0.4} // Make them slightly brighter to compensate for lower count
        />
      </Points>
    </group>
  );
}

export default function DynamicBackground() {
  const [isMobile, setIsMobile] = useState(true); // Default to true for SSR safety

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-black pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ preserveDrawingBuffer: true, alpha: true, antialias: false }} // Disable antialias for speed
        dpr={isMobile ? 1 : [1, 1.5]} // Strictly cap DPR on mobile to prevent fill-rate death
        onCreated={({ gl }) => {
          gl.autoClearColor = false;
        }}
      >
        <fog attach="fog" args={["#000000", 8, 25]} />

        {/* Motion blur / trail fade layer */}
        <mesh position={[0, 0, -10]} renderOrder={1}>
          <planeGeometry args={[1000, 1000]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={0.25}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>

        <group renderOrder={2}>
          <ParticleField isMobile={isMobile} />
        </group>
      </Canvas>
    </div>
  );
}
