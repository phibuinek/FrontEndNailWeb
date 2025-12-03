'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Environment, ContactShadows, SpotLight, MeshTransmissionMaterial, Sparkles, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// --- Components giữ nguyên từ bản Vintage ---

function NailBrush(props) {
    const group = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        group.current.rotation.z = -0.2 + Math.sin(t * 0.5) * 0.05;
        group.current.position.y = props.position[1] + Math.sin(t * 0.8) * 0.1;
    });
    const handlePoints = useMemo(() => {
        const curve = new THREE.SplineCurve([
            new THREE.Vector2(0.02, 0), new THREE.Vector2(0.05, 0.2), new THREE.Vector2(0.07, 1.2), new THREE.Vector2(0.06, 2.0), new THREE.Vector2(0.045, 2.5)
        ]);
        return curve.getPoints(64);
    }, []);
    const bristlePoints = useMemo(() => {
        const curve = new THREE.SplineCurve([
            new THREE.Vector2(0.09, 0), new THREE.Vector2(0.085, 0.3), new THREE.Vector2(0.06, 0.6), new THREE.Vector2(0, 0.75)
        ]);
        return curve.getPoints(32);
    }, []);
    return (
        <group ref={group} {...props}>
            <mesh position={[0, 0, 0]} castShadow><latheGeometry args={[handlePoints, 64]} /> <meshStandardMaterial color="#2C1B18" roughness={0.2} metalness={0.1} /></mesh>
            <mesh position={[0, 2.5, 0]} castShadow><cylinderGeometry args={[0.09, 0.045, 0.5, 64]} /> <meshStandardMaterial color="#C5A059" roughness={0.15} metalness={0.9} envMapIntensity={2} /></mesh>
            <mesh position={[0, 2.75, 0]}><latheGeometry args={[bristlePoints, 32]} /> <meshStandardMaterial color="#8C5E58" roughness={0.5} metalness={0.1} /></mesh>
        </group>
    );
}

function Pearl({ position }) {
    return (
        <mesh position={position} castShadow>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshPhysicalMaterial color="#FFFDF5" roughness={0.1} metalness={0.1} transmission={0.1} iridescence={1} iridescenceIOR={1.3} clearcoat={1} />
        </mesh>
    );
}

function NailFile({ position, rotation }) {
    const ref = useRef();
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        ref.current.rotation.z = rotation[2] + Math.sin(t * 0.4) * 0.05;
        ref.current.position.y = position[1] + Math.cos(t * 0.6) * 0.05;
    });
    return (
        <group ref={ref} position={position} rotation={rotation}>
            <RoundedBox args={[0.4, 2.4, 0.02]} radius={0.2} smoothness={8}>
                <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
            </RoundedBox>
            <RoundedBox args={[0.38, 2.36, 0.005]} radius={0.19} smoothness={6} position={[0, 0, 0.011]}>
                <meshStandardMaterial color="#592828" roughness={0.95} metalness={0.05} />
            </RoundedBox>
            <RoundedBox args={[0.38, 2.36, 0.005]} radius={0.19} smoothness={6} position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
                <meshStandardMaterial color="#222222" roughness={0.95} metalness={0.05} />
            </RoundedBox>
        </group>
    );
}

function GlitterJar({ position, rotation, color }) {
    const ref = useRef();
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        ref.current.rotation.y += 0.005;
        ref.current.position.y = position[1] + Math.sin(t * 0.7) * 0.05;
    });
    return (
        <group ref={ref} position={position} rotation={rotation}>
            <mesh castShadow receiveShadow><cylinderGeometry args={[0.45, 0.45, 0.5, 8]} /> <MeshTransmissionMaterial thickness={0.5} roughness={0} transmission={1} color="#ffffff" clearcoat={1} chromaticAberration={0.1} distortion={0.2} /></mesh>
            <mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.38, 0.38, 0.35, 8]} /> <meshStandardMaterial color={color} roughness={0.5} metalness={0.6} /></mesh>
            <Sparkles position={[0, -0.1, 0]} scale={[0.35, 0.35, 0.35]} count={30} color={color} size={3} speed={0.2} opacity={0.8} />
            <group position={[0, 0.3, 0]}><mesh castShadow><cylinderGeometry args={[0.46, 0.46, 0.15, 32]} /> <meshStandardMaterial color="#B8860B" roughness={0.3} metalness={0.7} envMapIntensity={1} /></mesh></group>
        </group>
    );
}

function NailTip({ position, rotation, color, scale }) {
    const ref = useRef();
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        ref.current.rotation.x = rotation[0] + Math.sin(t * 0.3) * 0.1;
        ref.current.rotation.z = rotation[2] + Math.cos(t * 0.2) * 0.05;
        ref.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.05;
    });
    return (
        <mesh ref={ref} position={position} rotation={rotation} scale={scale} castShadow>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshPhysicalMaterial color={color} roughness={0.4} metalness={0.1} transmission={0.2} thickness={0.5} clearcoat={0.8} side={THREE.DoubleSide} />
        </mesh>
    );
}

function FlowerPetal({ position, rotation, color }) {
    const ref = useRef();
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        ref.current.rotation.x = Math.sin(t * 0.5 + position[0]) * 0.5;
        ref.current.rotation.y += 0.01;
        ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.1;
    });
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        s.moveTo(0, 0); s.quadraticCurveTo(0.1, 0.1, 0.0, 0.3); s.quadraticCurveTo(-0.1, 0.1, 0, 0); return s;
    }, []);
    return (
        <mesh ref={ref} position={position} rotation={rotation} scale={0.8}><shapeGeometry args={[shape]} /> <meshStandardMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.9} roughness={0.6} /></mesh>
    );
}

// --- UPDATE: Square Bottle Component (Open Cap) ---

function SquareBottle(props) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.1; // Slow rotation
    }
  });

  // Define smooth brush shape (wet with polish)
  const brushPoints = useMemo(() => {
      const curve = new THREE.SplineCurve([
          new THREE.Vector2(0.05, 0),    // Base (connected to stem)
          new THREE.Vector2(0.06, 0.1),  // Slight belly (liquid)
          new THREE.Vector2(0.055, 0.25), // Tapering down
          new THREE.Vector2(0.02, 0.38),  // Rounded tip
          new THREE.Vector2(0.0, 0.4)     // Closed soft tip
      ]);
      return curve.getPoints(32);
  }, []);

  return (
    <group {...props} ref={meshRef}>
      {/* Square Glass Body */}
      <RoundedBox args={[1, 1, 1]} radius={0.2} smoothness={4} castShadow receiveShadow>
        <MeshTransmissionMaterial 
          backside
          backsideThickness={0.2}
          thickness={0.5}
          chromaticAberration={0.02}
          anisotropy={0.1}
          distortion={0.1}
          iridescence={0.5}
          roughness={0}
          clearcoat={1}
          color="#ffffff"
          resolution={1024}
        />
      </RoundedBox>
      
      {/* Liquid Inside - Square */}
      <RoundedBox args={[0.85, 0.8, 0.85]} radius={0.15} smoothness={4} position={[0, -0.05, 0]}>
        <meshStandardMaterial 
            color="#A65E5E" // Vintage Rose/Red
            roughness={0.1} 
            metalness={0}
            transparent
            opacity={0.9}
        />
      </RoundedBox>

      {/* Bottle Neck */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.3, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} transparent opacity={0.5} />
      </mesh>

      {/* Cap - Floating Above (Open) */}
      <group position={[0, 1.8, 0.2]} rotation={[0.2, 0, 0.1]}>
         {/* Cap Body */}
         <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.8, 64]} />
            <meshStandardMaterial 
                color="#C5A059" // Antique Gold
                roughness={0.15} 
                metalness={0.9} 
                envMapIntensity={2}
            />
         </mesh>
         {/* Brush Stem */}
         <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
            <meshStandardMaterial color="#111" roughness={0.5} />
         </mesh>
         {/* Brush Bristles with Liquid - Soft & Organic */}
         <mesh position={[0, -0.8, 0]} rotation={[Math.PI, 0, 0]}> {/* Flip to point down */}
            <latheGeometry args={[brushPoints, 32]} />
            <meshStandardMaterial 
                color="#A65E5E" 
                roughness={0.2} 
                metalness={0.1} 
            />
         </mesh>
      </group>
    </group>
  );
}

// --- Main Scene ---

export default function Scene3D() {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={30} />
        
        {/* Warm Vintage Lighting */}
        <ambientLight intensity={0.4} color="#FFF5E0" />
        <SpotLight position={[5, 5, 5]} angle={0.3} penumbra={0.5} intensity={600} castShadow color="#FFF0D0" />
        <pointLight position={[-3, 2, -2]} intensity={100} color="#FFD700" />
        <Environment preset="sunset" blur={0.8} />

        {/* Composition Group - Balanced Layout (Not too tight, not too loose) */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
            <group position={[0, -1.0, 0]} scale={0.95}>
                {/* Main Bottle - Centered Anchor */}
                <SquareBottle position={[0, -0.5, 0]} scale={1.2} />
                
                {/* Nail Brush - Balanced to the right */}
                <NailBrush position={[1.6, -0.6, 0.2]} rotation={[0, 0, -0.5]} scale={1.1} />
                
                {/* Nail File - Balanced to the left */}
                <NailFile position={[-1.8, 0.3, -0.5]} rotation={[0, 0, -0.1]} />
                
                {/* Jars - Framing the composition at the bottom */}
                <GlitterJar position={[-1.2, -1.2, 1.0]} rotation={[0.1, 0, 0]} color="#FFD700" />
                <GlitterJar position={[1.3, -1.0, 0.8]} rotation={[-0.1, 0, 0.1]} color="#A65E5E" />

                {/* Floating Elements - Adding atmosphere without clutter */}
                <NailTip position={[-1.5, 1.5, 0.0]} rotation={[0.5, 0.5, 0]} color="#F5E6D3" scale={[1, 1.8, 0.3]} />
                <NailTip position={[-0.2, -1.2, 1.5]} rotation={[-0.2, 0, 0.5]} color="#E6B8B8" scale={[0.9, 1.6, 0.3]} />
                <NailTip position={[1.6, 1.2, -0.5]} rotation={[0, -0.5, -0.2]} color="#A65E5E" scale={[1, 1.7, 0.3]} />

                <FlowerPetal position={[-1.2, -0.4, 1.2]} rotation={[0, 0, 0.5]} color="#C5A059" />
                <FlowerPetal position={[1.5, 0.6, -1.0]} rotation={[0.5, 0, 0]} color="#8C5E58" />
                {/* Moved petal away from bottle cap */}
                <FlowerPetal position={[-0.6, 1.9, 0.5]} rotation={[1, 1, 1]} color="#F5E6D3" />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Pearl position={[0.7, -1.3, 1.2]} />
                    <Pearl position={[-1.3, 1.4, -0.8]} />
                    {/* Moved pearl further up and right */}
                    <Pearl position={[0.8, 2.2, -0.5]} />
                </Float>
            </group>
        </Float>

        {/* Golden Dust */}
        <Sparkles count={50} scale={7} size={2} speed={0.4} opacity={0.6} color="#C5A059" />
        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#3A2F28" />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}
