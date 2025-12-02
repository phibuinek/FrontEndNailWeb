'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Environment, ContactShadows, SpotLight, MeshTransmissionMaterial, Sparkles, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function NailBrush(props) {
    const group = useRef();
    
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        group.current.rotation.z = -0.2 + Math.sin(t * 0.5) * 0.05;
        group.current.position.y = props.position[1] + Math.sin(t * 0.8) * 0.1;
    });

    // Ultra-smooth curves using SplineCurve
    const handlePoints = useMemo(() => {
        const curve = new THREE.SplineCurve([
            new THREE.Vector2(0.02, 0),    // Tip bottom
            new THREE.Vector2(0.05, 0.2),  // Widening
            new THREE.Vector2(0.07, 1.2),  // Belly
            new THREE.Vector2(0.06, 2.0),  // Tapering up
            new THREE.Vector2(0.045, 2.5)  // Connection point
        ]);
        return curve.getPoints(64); // High resolution profile
    }, []);

    const bristlePoints = useMemo(() => {
        const curve = new THREE.SplineCurve([
            new THREE.Vector2(0.09, 0),    // Base at ferrule
            new THREE.Vector2(0.085, 0.3), // Slight bulge
            new THREE.Vector2(0.06, 0.6),  // Tapering
            new THREE.Vector2(0, 0.75)     // Fine tip
        ]);
        return curve.getPoints(32);
    }, []);

    return (
        <group ref={group} {...props}>
            {/* Handle - Ebony Wood Texture with Organic Curves */}
            <mesh position={[0, 0, 0]} castShadow>
                <latheGeometry args={[handlePoints, 64]} /> 
                <meshStandardMaterial 
                    color="#2C1B18" 
                    roughness={0.2} 
                    metalness={0.1}
                />
            </mesh>
            
            {/* Ferrule - Smoother Cylinder */}
            <mesh position={[0, 2.5, 0]} castShadow>
                <cylinderGeometry args={[0.09, 0.045, 0.5, 64]} />
                <meshStandardMaterial 
                    color="#C5A059" 
                    roughness={0.15} 
                    metalness={0.9}
                    envMapIntensity={2}
                />
            </mesh>
            
            {/* Bristles - Organic Shape */}
            <mesh position={[0, 2.75, 0]}>
                <latheGeometry args={[bristlePoints, 32]} />
                <meshStandardMaterial 
                    color="#8C5E58" 
                    roughness={0.5} 
                    metalness={0.1}
                />
            </mesh>
        </group>
    );
}

function Pearl({ position }) {
    return (
        <mesh position={position} castShadow>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshPhysicalMaterial 
                color="#FFFDF5"
                roughness={0.1}
                metalness={0.1}
                transmission={0.1}
                iridescence={1}
                iridescenceIOR={1.3}
                clearcoat={1}
            />
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

    // Vintage Emery Board Shape (Thin wood)
    const gritShape = useMemo(() => {
        const shape = new THREE.Shape();
        const w = 0.38; 
        const h = 2.38; 
        const r = 0.19; 
        const straightHeight = h - 2 * r; 
        
        shape.moveTo(r, straightHeight / 2);
        shape.absarc(0, straightHeight / 2, r, 0, Math.PI, false);
        shape.lineTo(-r, -straightHeight / 2);
        shape.absarc(0, -straightHeight / 2, r, Math.PI, Math.PI * 2, false);
        shape.lineTo(r, straightHeight / 2);
        
        return shape;
    }, []);

    return (
        <group ref={ref} position={position} rotation={rotation}>
            {/* Core - Vintage Wood */}
            <RoundedBox args={[0.4, 2.4, 0.02]} radius={0.2} smoothness={8}>
                <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
            </RoundedBox>

            {/* Grit Texture Front - Garnet (Vintage Sandpaper) */}
            <mesh position={[0, 0, 0.011]}>
                <shapeGeometry args={[gritShape]} />
                <meshStandardMaterial 
                    color="#592828" // Dark Garnet Red
                    roughness={1} 
                    bumpScale={0.08}
                />
            </mesh>

             {/* Grit Texture Back - Black (Coarse) */}
             <mesh position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
                <shapeGeometry args={[gritShape]} />
                <meshStandardMaterial 
                    color="#222222" 
                    roughness={1} 
                    bumpScale={0.08}
                />
            </mesh>
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
            {/* Jar Body - Vintage Cut Glass Effect */}
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.45, 0.45, 0.5, 8]} /> {/* Octagonal cut glass */}
                <MeshTransmissionMaterial 
                    thickness={0.5} 
                    roughness={0} 
                    transmission={1} 
                    color="#ffffff"
                    clearcoat={1}
                    chromaticAberration={0.1}
                    distortion={0.2}
                />
            </mesh>
            
            {/* Powder Content */}
            <mesh position={[0, -0.1, 0]}>
                <cylinderGeometry args={[0.38, 0.38, 0.35, 8]} />
                <meshStandardMaterial 
                    color={color} 
                    roughness={0.5} 
                    metalness={0.6}
                />
            </mesh>
            
            {/* Internal Sparkles */}
            <Sparkles position={[0, -0.1, 0]} scale={[0.35, 0.35, 0.35]} count={30} color={color} size={3} speed={0.2} opacity={0.8} />

            {/* Lid - Antique Brass with ridges */}
            <group position={[0, 0.3, 0]}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.46, 0.46, 0.15, 32]} />
                    <meshStandardMaterial 
                        color="#B8860B" // Dark Goldenrod / Antique Brass
                        roughness={0.3} 
                        metalness={0.7}
                        envMapIntensity={1}
                    />
                </mesh>
                {/* Decorative knob/detail on top */}
                <mesh position={[0, 0.08, 0]}>
                     <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
                     <meshStandardMaterial color="#B8860B" roughness={0.3} metalness={0.7} />
                </mesh>
            </group>
        </group>
    );
}

function NailTip({ position, rotation, color, scale }) {
    const ref = useRef();
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        // Gentle floating
        ref.current.rotation.x = rotation[0] + Math.sin(t * 0.3) * 0.1;
        ref.current.rotation.z = rotation[2] + Math.cos(t * 0.2) * 0.05;
        ref.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.05;
    });

    return (
        <mesh ref={ref} position={position} rotation={rotation} scale={scale} castShadow>
            {/* Almond shape approximation: Flattened, elongated sphere */}
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshPhysicalMaterial 
                color={color}
                roughness={0.4}
                metalness={0.1}
                transmission={0.2} // Slightly translucent plastic look
                thickness={0.5}
                clearcoat={0.8}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

function FlowerPetal({ position, rotation, color }) {
    const ref = useRef();
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        // Falling leaf motion
        ref.current.rotation.x = Math.sin(t * 0.5 + position[0]) * 0.5;
        ref.current.rotation.y += 0.01;
        ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.1;
    });

    // Create a simple petal shape using curves
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        s.moveTo(0, 0);
        s.quadraticCurveTo(0.1, 0.1, 0.0, 0.3); // Right edge
        s.quadraticCurveTo(-0.1, 0.1, 0, 0);   // Left edge
        return s;
    }, []);

    return (
        <mesh ref={ref} position={position} rotation={rotation} scale={0.8}>
            <shapeGeometry args={[shape]} />
            <meshStandardMaterial 
                color={color} 
                side={THREE.DoubleSide} 
                transparent 
                opacity={0.9} 
                roughness={0.6} 
            />
        </mesh>
    );
}

function Bottle(props) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.1;
    }
  });

  // High-definition curve profile for the bottle using SplineCurve
  const points = useMemo(() => {
    // Define control points for a classic vintage perfume/polish bottle shape
    const curve = new THREE.SplineCurve([
        new THREE.Vector2(0, 0),      // Center bottom
        new THREE.Vector2(0.5, 0),    // Flat base radius
        new THREE.Vector2(0.8, 0.1),  // Rounded corner
        new THREE.Vector2(0.9, 0.5),  // Widest lower body
        new THREE.Vector2(0.85, 1.2), // Gentle taper up
        new THREE.Vector2(0.4, 1.7),  // Smooth shoulder curve
        new THREE.Vector2(0.3, 1.9),  // Neck connection
        new THREE.Vector2(0.3, 2.2)   // Neck top
    ]);
    return curve.getPoints(128); // High resolution for smoothness
  }, []);

  return (
    <group {...props} ref={meshRef}>
      {/* Bottle Body - Vintage Glass Shape */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[points, 64]} />
        <MeshTransmissionMaterial 
          backside
          backsideThickness={0.2}
          thickness={0.5}
          chromaticAberration={0.02}
          anisotropy={0.1}
          distortion={0.02}
          iridescence={0.5}
          roughness={0}
          clearcoat={1}
          color="#ffffff"
          resolution={1024}
        />
      </mesh>
      
      {/* Liquid inside - Following the same curve but scaled down */}
      <mesh position={[0, 0.05, 0]}>
        <latheGeometry args={[points.map(p => new THREE.Vector2(p.x * 0.92, p.y * 0.9)), 64]} />
        <meshStandardMaterial 
            color="#A65E5E" // Vintage Rose/Red
            roughness={0.1} 
            metalness={0}
            transparent
            opacity={0.9}
        />
      </mesh>

      {/* Cap - Smooth Cylinder */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.8, 64]} />
        <meshStandardMaterial 
            color="#C5A059" // Antique Gold
            roughness={0.15} 
            metalness={0.9} 
            envMapIntensity={2}
        />
      </mesh>
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        {/* Moved camera back to fit everything */}
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={30} />
        
        {/* Warm Vintage Lighting */}
        <ambientLight intensity={0.4} color="#FFF5E0" />
        <SpotLight 
            position={[5, 5, 5]} 
            angle={0.3} 
            penumbra={0.5} 
            intensity={600} 
            castShadow 
            color="#FFF0D0"
        />
        <pointLight position={[-3, 2, -2]} intensity={100} color="#FFD700" />

        {/* Environment */}
        <Environment preset="sunset" blur={0.8} />

        {/* Composition Group */}
        <Float 
            speed={1.5} 
            rotationIntensity={0.2} 
            floatIntensity={0.2} 
            floatingRange={[-0.1, 0.1]}
        >
            <group position={[0, -1.0, 0]} scale={0.9}>
                {/* Main Bottle */}
                <Bottle position={[-0.5, -0.5, 0]} scale={1.1} />
                
                {/* Nail Brush - Floating diagonally */}
                <NailBrush position={[1.2, 0.0, 0.5]} rotation={[0, 0, -0.5]} scale={1.1} />
                
                {/* Nail File (Dũa móng) - Moved further left to avoid collision */}
                <NailFile position={[-2.2, 0.5, -0.5]} rotation={[0, 0, -0.2]} />

                {/* Glitter Jars (Hũ kim tuyến/bột) */}
                <GlitterJar position={[-1.1, -1.2, 1.2]} rotation={[0.2, 0, 0]} color="#FFD700" />
                <GlitterJar position={[1.4, -0.9, 0.8]} rotation={[-0.1, 0, 0.1]} color="#A65E5E" />

                {/* Floating Nail Tips (Móng mẫu) */}
                <NailTip position={[-1.8, 1.5, 0.5]} rotation={[0.5, 0.5, 0]} color="#F5E6D3" scale={[1, 1.8, 0.3]} /> {/* Nude - Moved Away from Bottle */}
                <NailTip position={[-0.5, -0.8, 1.5]} rotation={[-0.2, 0, 0.5]} color="#E6B8B8" scale={[0.9, 1.6, 0.3]} /> {/* Soft Pink */}
                <NailTip position={[1.5, 1.3, -0.5]} rotation={[0, -0.5, -0.2]} color="#A65E5E" scale={[1, 1.7, 0.3]} /> {/* Vintage Red */}

                {/* Floating Flower Petals for Vintage Vibe */}
                <FlowerPetal position={[-1.5, -0.5, 1]} rotation={[0, 0, 0.5]} color="#C5A059" />
                <FlowerPetal position={[1.8, 0.5, -1]} rotation={[0.5, 0, 0]} color="#8C5E58" />
                <FlowerPetal position={[0, 1.5, 2]} rotation={[1, 1, 1]} color="#F5E6D3" />

                {/* Decorative Pearls */}
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Pearl position={[0.8, -1.3, 1.2]} />
                    <Pearl position={[-1.6, 1.6, -1]} />
                    <Pearl position={[0.4, 1.9, -0.5]} />
                </Float>
            </group>
        </Float>

        {/* Particles/Sparkles for atmosphere - Golden Dust */}
        <Sparkles count={50} scale={7} size={2} speed={0.4} opacity={0.6} color="#C5A059" />

        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#3A2F28" />
        
        <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={0.5}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
