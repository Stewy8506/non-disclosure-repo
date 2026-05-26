"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

function ImageDistortion({ url }: { url: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useTexture(url);
  const [hovered, setHovered] = useState(false);

  // A very simple shader for distortion
  const uniforms = useRef({
    uTime: { value: 0 },
    uTexture: { value: texture },
    uHover: { value: 0 },
  });

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.current.uTime.value = state.clock.elapsedTime;
      // Smoothly interpolate hover state
      uniforms.current.uHover.value = THREE.MathUtils.lerp(
        uniforms.current.uHover.value,
        hovered ? 1 : 0,
        0.1
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[5, 3, 32, 32]} />
      <shaderMaterial
        // eslint-disable-next-line react-hooks/refs
        uniforms={uniforms.current}
        vertexShader={`
          uniform float uTime;
          uniform float uHover;
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Add a subtle wave distortion on hover
            float wave = sin(pos.x * 5.0 + uTime * 2.0) * 0.1 * uHover;
            pos.z += wave;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTexture;
          uniform float uHover;
          varying vec2 vUv;
          
          void main() {
            // Apply slight chromatic aberration on hover
            vec2 uvR = vUv + vec2(0.01 * uHover, 0.0);
            vec2 uvB = vUv - vec2(0.01 * uHover, 0.0);
            
            float r = texture2D(uTexture, uvR).r;
            float g = texture2D(uTexture, vUv).g;
            float b = texture2D(uTexture, uvB).b;
            
            gl_FragColor = vec4(r, g, b, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function WebGLDistortion({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="w-full h-full relative cursor-crosshair overflow-hidden rounded-xl">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <React.Suspense fallback={null}>
          <ImageDistortion url={imageUrl} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
