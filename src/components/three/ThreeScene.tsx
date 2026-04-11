import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";

interface ThreeSceneProps {
  className?: string;
}

function PackageBox() {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(() => new THREE.BoxGeometry(2, 2, 2), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#FF6B00",
        metalness: 0,
        roughness: 1,
      }),
    []
  );
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);
  const edgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#000000",
        linewidth: 4,
      }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
    if (lineRef.current && meshRef.current) {
      lineRef.current.rotation.y = meshRef.current.rotation.y;
      lineRef.current.position.y = meshRef.current.position.y;
    }
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      edges.dispose();
      edgeMaterial.dispose();
    };
  }, [edgeMaterial, edges, geometry, material]);

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={material} />
      <lineSegments ref={lineRef} geometry={edges} material={edgeMaterial} />
    </group>
  );
}

function SensorNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const baseNodes = useMemo<[number, number, number][]>(
    () => [
      [1.2, 1.2, 1.2],
      [-1.2, 1.2, -1.2],
      [1.2, -1.2, -1.2],
      [-1.2, -1.2, 1.2],
    ],
    []
  );
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(0.15, 16, 16), []);
  const sphereMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#00F0FF",
        emissive: "#00F0FF",
        emissiveIntensity: 0.5,
        metalness: 0,
        roughness: 1,
      }),
    []
  );

  const edgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#000000",
        linewidth: 3,
      }),
    []
  );

  const sphereEdges = useMemo(() => new THREE.EdgesGeometry(sphereGeometry), [sphereGeometry]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    groupRef.current.children.forEach((child, index) => {
      const mesh = child as THREE.Mesh;
      const [x, y, z] = baseNodes[index];
      const angle = t * 0.4 + index * (Math.PI / 2);
      const pulse = 1 + Math.sin(t * 2 + index) * 0.2;
      mesh.position.set(x + Math.cos(angle) * 0.15, y + Math.sin(angle * 0.9) * 0.1, z + Math.sin(angle) * 0.15);
      mesh.scale.setScalar(Math.min(1.2, Math.max(0.8, pulse)));
    });
  });

  useEffect(() => {
    return () => {
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      sphereEdges.dispose();
      edgeMaterial.dispose();
    };
  }, [edgeMaterial, sphereEdges, sphereGeometry, sphereMaterial]);

  return (
    <group ref={groupRef}>
      {baseNodes.map((node, idx) => (
        <group key={`sensor-${idx}`} position={node}>
          <mesh geometry={sphereGeometry} material={sphereMaterial} />
          <lineSegments geometry={sphereEdges} material={edgeMaterial} />
        </group>
      ))}
    </group>
  );
}

function DataLine({ index }: { index: number }) {
  const center = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const geometry = useMemo(() => new THREE.BufferGeometry(), []);
  const material = useMemo(
    () =>
      new THREE.LineDashedMaterial({
        color: "#FF6B00",
        transparent: false,
        opacity: 1,
        dashSize: 0.15,
        gapSize: 0.08,
        linewidth: 3,
      }),
    []
  );
  const line = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);

  useEffect(() => {
    const base = [
      [1.2, 1.2, 1.2],
      [-1.2, 1.2, -1.2],
      [1.2, -1.2, -1.2],
      [-1.2, -1.2, 1.2],
    ][index];
    const points = [new THREE.Vector3(base[0], base[1], base[2]), center];
    geometry.setFromPoints(points);
    line.computeLineDistances();
  }, [center, geometry, index, line]);

  useFrame(() => {
    (material as THREE.LineDashedMaterial & { dashOffset: number }).dashOffset -= 0.01;
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <primitive object={line} />;
}

function DataLines() {
  return (
    <group>
      {[0, 1, 2, 3].map((index) => (
        <DataLine key={`line-${index}`} index={index} />
      ))}
    </group>
  );
}

export default function ThreeScene({ className }: ThreeSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapperRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }
      );
    }, wrapperRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={className}>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 60, position: [0, 0, 6] }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="white" />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <PackageBox />
        <SensorNodes />
        <DataLines />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
