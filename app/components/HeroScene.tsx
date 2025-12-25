"use client";

import dynamic from "next/dynamic";
import { useFrame, useThree } from "@react-three/fiber";
import {
  TorusKnot,
  MeshTransmissionMaterial,
  Environment,
  Float,
  CameraShake,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { useRef, useState, Suspense } from "react";
import * as THREE from "three";

// Dynamically import Canvas with SSR disabled
const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);

// A rig to make the camera slightly follow the mouse
function CameraRig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();
  useFrame(() => camera.position.lerp(vec.set(mouse.x * 0.7, mouse.y * 0.3, camera.position.z), 0.02));
  return null;
}

// The main liquid-glass object
function LiquidKnot() {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (ref.current) {
      // Complex, fluid-like rotation
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() / 2) * 0.3;
      ref.current.rotation.y = Math.cos(state.clock.getElapsedTime() / 1.5) * 0.5;
      ref.current.rotation.z += 0.001;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
      <TorusKnot
        ref={ref}
        args={[0.7, 0.25, 256, 32]} // Smaller size to fit container
        position={[-0.5, 0, 0]} // Move left to center in view
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? 0.85 : 0.75}
      >
        {/* Advanced PBR Material for Liquid Glass */}
        <MeshTransmissionMaterial
          backside
          samples={100} // Quality of transmission
          thickness={0.5} // Thickness of the "glass"
          chromaticAberration={0.05} // Slight color splitting within the glass
          anisotropy={0.1} // Distorts reflections like brushed metal
          distortion={0.8} // The key "liquid" distortion effect
          distortionScale={0.5}
          temporalDistortion={0.1} // Makes the distortion move over time
          iridescence={1} // Adds a soap-bubble-like rainbow effect
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[0, 500]}
          roughness={0.1} // Smooth, glossy surface
          color={"#ffffff"} // Base color, reflections will do the rest
        />
      </TorusKnot>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <Canvas 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 8], fov: 25 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          {/* 1. Realistic Environment Lighting */}
          <Environment preset="city" blur={1} />
          
          {/* Adds subtle, atmospheric light sources */}
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#8a2be2" />

          {/* 2. The Main Scene */}
          <LiquidKnot />
          
          {/* 3. Camera Effects */}
          <CameraRig />
          <CameraShake yawFrequency={0.05} pitchFrequency={0.05} rollFrequency={0.05} intensity={0.2} />

          {/* 4. Cinematic Post-Processing */}
          <EffectComposer enableNormalPass={false}>
            <Bloom
              luminanceThreshold={1}
              intensity={0.8}
              levels={9}
              mipmapBlur
            />
            <ChromaticAberration
              offset={[0.0005, 0.0005]}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}