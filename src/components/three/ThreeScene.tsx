import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";

interface ThreeSceneProps {
  className?: string;
}

const SENSOR_COUNT = 14;
const ORBIT_RADIUS = 2.35;
/** Memperbesar seluruh isi scene untuk preview */
const SCENE_SCALE = 1.38;

function fibonacciSpherePoints(radius: number, count: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  if (count < 2) {
    pts.push(new THREE.Vector3(0, radius, 0));
    return pts;
  }
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y)) * radius;
    const theta = golden * i;
    pts.push(new THREE.Vector3(Math.cos(theta) * r, y * radius, Math.sin(theta) * r));
  }
  return pts;
}

interface ParcelPackageProps {
  isOpen: boolean;
  onToggle: () => void;
  onHoverChange: (hovered: boolean) => void;
}

/** Kardus: badan bawah + tutup berengsel; klik untuk buka/tutup */
function ParcelPackage({ isOpen, onToggle, onHoverChange }: ParcelPackageProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lidPivotRef = useRef<THREE.Group>(null);

  const baseH = 0.62;
  const lidH = 0.43;
  const totalH = 1.05;
  const halfZ = 1.35 / 2;
  const bottomY = -totalH / 2;
  const seamY = bottomY + baseH;
  const hingeY = seamY;
  const hingeZ = -halfZ;

  const baseGeo = useMemo(() => new THREE.BoxGeometry(1.85, baseH, 1.35), []);
  const lidGeo = useMemo(() => new THREE.BoxGeometry(1.85, lidH, 1.35), []);
  const cardboard = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c9a882",
        roughness: 0.88,
        metalness: 0.04,
      }),
    []
  );
  const tapeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#9a8570",
        roughness: 0.75,
        metalness: 0.02,
      }),
    []
  );
  const innerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#3d3530",
        roughness: 0.92,
        metalness: 0.02,
      }),
    []
  );
  const labelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e8dcc8",
        roughness: 0.65,
        metalness: 0,
        emissive: "#6b7280",
        emissiveIntensity: 0.06,
      }),
    []
  );

  const edgesBaseGeo = useMemo(() => new THREE.EdgesGeometry(baseGeo), [baseGeo]);
  const edgesLidGeo = useMemo(() => new THREE.EdgesGeometry(lidGeo), [lidGeo]);
  const edgeMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#5c4a3a",
        transparent: true,
        opacity: 0.35,
      }),
    []
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onToggle();
    },
    [onToggle]
  );

  useEffect(() => {
    const pivot = lidPivotRef.current;
    if (!pivot) return;
    gsap.to(pivot.rotation, {
      x: isOpen ? -1.42 : 0,
      duration: 0.72,
      ease: "power2.inOut",
    });
  }, [isOpen]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0035;
      groupRef.current.position.y = Math.sin(t * 0.75) * 0.12;
    }
  });

  useEffect(() => {
    return () => {
      baseGeo.dispose();
      lidGeo.dispose();
      cardboard.dispose();
      tapeMat.dispose();
      innerMat.dispose();
      labelMat.dispose();
      edgesBaseGeo.dispose();
      edgesLidGeo.dispose();
      edgeMat.dispose();
    };
  }, [
    baseGeo,
    lidGeo,
    cardboard,
    tapeMat,
    innerMat,
    labelMat,
    edgesBaseGeo,
    edgesLidGeo,
    edgeMat,
  ]);

  const baseCenterY = bottomY + baseH / 2;
  const lidMeshOffsetY = lidH / 2;
  const lidMeshOffsetZ = halfZ;

  const pointerHandlers = {
    onClick: handleClick,
    onPointerOver: () => onHoverChange(true),
    onPointerOut: () => onHoverChange(false),
  };

  return (
    <group ref={groupRef}>
      <group {...pointerHandlers}>
        <mesh
          position={[0, baseCenterY, 0]}
          geometry={baseGeo}
          material={cardboard}
          castShadow
          receiveShadow
        />
        <lineSegments position={[0, baseCenterY, 0]} geometry={edgesBaseGeo} material={edgeMat} />
        <mesh position={[0, 0.06, halfZ + 0.004]} material={labelMat}>
          <planeGeometry args={[0.85, 0.45]} />
        </mesh>
        {isOpen && (
          <mesh position={[0, seamY + 0.08, 0]} material={innerMat} receiveShadow>
            <boxGeometry args={[1.65, 0.06, 1.15]} />
          </mesh>
        )}
      </group>

      <group ref={lidPivotRef} position={[0, hingeY, hingeZ]}>
        <group {...pointerHandlers} position={[0, lidMeshOffsetY, lidMeshOffsetZ]}>
          <mesh geometry={lidGeo} material={cardboard} castShadow receiveShadow />
          <lineSegments geometry={edgesLidGeo} material={edgeMat} />
          <mesh position={[0, lidH / 2 + 0.001, 0]} material={tapeMat} castShadow>
            <boxGeometry args={[1.92, 0.045, 0.14]} />
          </mesh>
          <mesh position={[0, lidH / 2 + 0.002, 0]} material={tapeMat} castShadow>
            <boxGeometry args={[0.14, 0.045, 1.42]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** Satu modul sensor: bodi gelap + LED + cincin status (berkedip tak serempak) */
function SensorPuck({ index, base }: { index: number; base: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null);
  const ledMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const ringMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const bodyGeo = useMemo(() => new THREE.CylinderGeometry(0.13, 0.15, 0.07, 24), []);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(0.07, 0.014, 8, 28), []);
  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#24302f",
        roughness: 0.55,
        metalness: 0.35,
      }),
    []
  );
  useFrame((state) => {
    const g = groupRef.current;
    const ledM = ledMatRef.current;
    const ringM = ringMatRef.current;
    if (!g) return;

    const t = state.clock.elapsedTime;
    const phase = index * 1.37;
    const wobbleX = Math.sin(t * 0.55 + phase) * 0.1;
    const wobbleY = Math.cos(t * 0.45 + phase * 1.1) * 0.08;
    const wobbleZ = Math.sin(t * 0.5 + phase * 0.8) * 0.1;

    const p = base.clone().add(new THREE.Vector3(wobbleX, wobbleY, wobbleZ));
    g.position.copy(p);
    g.lookAt(0, 0, 0);
    g.rotateX(Math.PI / 2);

    const scalePulse = 0.92 + Math.sin(t * 2.4 + phase) * 0.08;
    g.scale.setScalar(scalePulse);

    const duty = Math.sin(t * 6.5 + phase) * 0.5 + 0.5;
    const burst = Math.pow(Math.sin(t * 11 + phase * 0.6) * 0.5 + 0.5, 4);
    const active = 0.28 + duty * 0.55 + burst * 0.65;

    if (ledM) ledM.emissiveIntensity = active;
    if (ringM) ringM.emissiveIntensity = 0.15 + duty * 0.85 + burst * 0.4;
  });

  useEffect(() => {
    return () => {
      bodyGeo.dispose();
      ringGeo.dispose();
      bodyMat.dispose();
    };
  }, [bodyGeo, ringGeo, bodyMat]);

  return (
    <group ref={groupRef}>
      <mesh geometry={bodyGeo} material={bodyMat} castShadow />
      <mesh position={[0, 0.036, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.09, 24]} />
        <meshStandardMaterial
          ref={ledMatRef}
          color="#0d1514"
          emissive="#22e8b0"
          emissiveIntensity={0.35}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.038, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={ringGeo}>
        <meshStandardMaterial
          ref={ringMatRef}
          color="#1a2221"
          emissive="#4af0c8"
          emissiveIntensity={0.25}
          roughness={0.35}
          metalness={0.25}
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}

/** Garis putus-putus dari tiap sensor menuju pusat paket */
function DataLinksToPackage({ basePositions }: { basePositions: THREE.Vector3[] }) {
  const dummy = useMemo(() => new THREE.Vector3(), []);
  const center = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  const { geometry, material, lineSegments } = useMemo(() => {
    const count = basePositions.length;
    const arr = new Float32Array(count * 2 * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    const m = new THREE.LineDashedMaterial({
      color: "#5ec4b0",
      transparent: true,
      opacity: 0.5,
      dashSize: 0.14,
      gapSize: 0.08,
    });
    const ls = new THREE.LineSegments(g, m);
    ls.frustumCulled = false;
    return { geometry: g, material: m, lineSegments: ls };
  }, [basePositions.length]);

  useFrame((state) => {
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    if (!posAttr) return;
    const t = state.clock.elapsedTime;
    const arr = posAttr.array as Float32Array;
    basePositions.forEach((base, i) => {
      dummy.copy(base);
      const phase = i * 0.7;
      dummy.x += Math.sin(t * 0.55 + phase) * 0.1;
      dummy.y += Math.cos(t * 0.45 + phase * 1.1) * 0.08;
      dummy.z += Math.sin(t * 0.5 + phase * 0.8) * 0.1;
      const o = i * 6;
      arr[o] = dummy.x;
      arr[o + 1] = dummy.y;
      arr[o + 2] = dummy.z;
      arr[o + 3] = center.x;
      arr[o + 4] = center.y;
      arr[o + 5] = center.z;
    });
    posAttr.needsUpdate = true;
    lineSegments.computeLineDistances();
    const dashed = material as THREE.LineDashedMaterial & { dashOffset: number };
    dashed.dashOffset -= 0.012;
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <primitive object={lineSegments} />;
}

function NetworkRing() {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.TorusGeometry(2.15, 0.012, 8, 64), []);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#6366f1",
        transparent: true,
        opacity: 0.22,
      }),
    []
  );

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.12;
      ref.current.rotation.x = Math.PI / 2.35;
    }
  });

  useEffect(() => {
    return () => {
      geo.dispose();
      mat.dispose();
    };
  }, [geo, mat]);

  return <mesh ref={ref} geometry={geo} material={mat} />;
}

interface SceneContentProps {
  onPackageHover: (hovered: boolean) => void;
}

function SceneContent({ onPackageHover }: SceneContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const basePositions = useMemo(() => fibonacciSpherePoints(ORBIT_RADIUS, SENSOR_COUNT), []);

  const toggleOpen = useCallback(() => {
    setIsOpen((o) => !o);
  }, []);

  return (
    <group scale={SCENE_SCALE}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 8, 5]} intensity={1.1} color="#fff5eb" castShadow />
      <directionalLight position={[-4, 2, -6]} intensity={0.35} color="#b8c5ff" />
      <pointLight position={[0, 2.5, 2]} intensity={0.55} color="#34d399" distance={10} />
      <ParcelPackage isOpen={isOpen} onToggle={toggleOpen} onHoverChange={onPackageHover} />
      <NetworkRing />
      {basePositions.map((base, i) => (
        <SensorPuck key={i} index={i} base={base} />
      ))}
      <DataLinksToPackage basePositions={basePositions} />
    </group>
  );
}

export default function ThreeScene({ className }: ThreeSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [packageHover, setPackageHover] = useState(false);

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
    <div
      ref={wrapperRef}
      className={className}
      style={{ cursor: packageHover ? "pointer" : undefined }}
    >
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 48, position: [0, 0.35, 5.45] }}
        style={{ background: "transparent" }}
        shadows
      >
        <SceneContent onPackageHover={setPackageHover} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.85} minPolarAngle={Math.PI / 4} />
      </Canvas>
    </div>
  );
}
