import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";

interface ThreeSceneProps {
  className?: string;
}

const SENSOR_COUNT = 16;
const ORBIT_RADIUS = 2.42;
/** Medium-kecil: sedikit lebih kecil dari sebelumnya, tidak sekecil versi “mini” */
const SCENE_SCALE = 0.9;

/** Posisi sensor di orbit + wobble — dipakai modul, link ke paket, dan mesh jaring */
function sensorWorldPosition(base: THREE.Vector3, index: number, t: number, out: THREE.Vector3) {
  const phase = index * 1.21;
  out.copy(base);
  out.x += Math.sin(t * 0.4 + phase) * 0.052;
  out.y += Math.cos(t * 0.35 + phase * 1.1) * 0.044;
  out.z += Math.sin(t * 0.38 + phase * 0.9) * 0.052;
  return out;
}

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
        color: "#c4b59a",
        roughness: 0.9,
        metalness: 0.02,
      }),
    []
  );
  const tapeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8f8173",
        roughness: 0.78,
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
        color: "#6b5c4c",
        transparent: true,
        opacity: 0.22,
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
      groupRef.current.rotation.y += 0.0024;
      groupRef.current.position.y = Math.sin(t * 0.65) * 0.06;
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
            <boxGeometry args={[1.9, 0.038, 0.11]} />
          </mesh>
          <mesh position={[0, lidH / 2 + 0.002, 0]} material={tapeMat} castShadow>
            <boxGeometry args={[0.11, 0.038, 1.38]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** Modul sensor IoT: kotak industrial, LED status amber halus (bukan bola hijau) */
function SensorModule({ index, base }: { index: number; base: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null);
  const ledMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const posScratch = useMemo(() => new THREE.Vector3(), []);

  const housingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#5c6470",
        roughness: 0.72,
        metalness: 0.18,
      }),
    []
  );
  const faceMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#3d4450",
        roughness: 0.82,
        metalness: 0.12,
      }),
    []
  );
  const ventMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2a3038",
        roughness: 0.9,
        metalness: 0.05,
      }),
    []
  );

  useFrame((state) => {
    const g = groupRef.current;
    const ledM = ledMatRef.current;
    if (!g) return;

    const t = state.clock.elapsedTime;
    sensorWorldPosition(base, index, t, posScratch);
    g.position.copy(posScratch);
    g.lookAt(0, 0, 0);

    if (ledM) {
      const ph = index * 1.21;
      const slow = Math.sin(t * 1.8 + ph) * 0.5 + 0.5;
      const ping = Math.pow(Math.sin(t * 3.2 + ph * 0.8) * 0.5 + 0.5, 6);
      ledM.emissiveIntensity = 0.08 + slow * 0.22 + ping * 0.35;
    }
  });

  useEffect(() => {
    return () => {
      housingMat.dispose();
      faceMat.dispose();
      ventMat.dispose();
    };
  }, [housingMat, faceMat, ventMat]);

  const dz = 0.03;
  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow material={housingMat}>
        <boxGeometry args={[0.24, 0.12, 0.06]} />
      </mesh>
      <mesh position={[0, 0, dz + 0.001]} material={faceMat}>
        <boxGeometry args={[0.2, 0.1, 0.009]} />
      </mesh>
      {[-0.026, 0, 0.026].map((y) => (
        <mesh key={y} position={[0, y, dz + 0.007]} material={ventMat}>
          <boxGeometry args={[0.14, 0.014, 0.005]} />
        </mesh>
      ))}
      <mesh position={[-0.065, 0.034, dz + 0.007]}>
        <boxGeometry args={[0.026, 0.022, 0.006]} />
        <meshStandardMaterial
          ref={ledMatRef}
          color="#1a1510"
          emissive="#e8a54a"
          emissiveIntensity={0.2}
          roughness={0.45}
          metalness={0.15}
        />
      </mesh>
      <mesh position={[0.085, 0.048, 0]} material={housingMat} castShadow>
        <boxGeometry args={[0.02, 0.062, 0.02]} />
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
      color: "#a8b8c8",
      transparent: true,
      opacity: 0.42,
      dashSize: 0.11,
      gapSize: 0.06,
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
      sensorWorldPosition(base, i, t, dummy);
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
    dashed.dashOffset -= 0.016;
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <primitive object={lineSegments} />;
}

/** Tiga cincin tipis berbeda sumbu = kesan “medan sensor” mengelilingi paket */
function SensorFieldRings() {
  const aRef = useRef<THREE.Mesh>(null);
  const bRef = useRef<THREE.Mesh>(null);
  const cRef = useRef<THREE.Mesh>(null);
  const matA = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#7c8c9c",
        transparent: true,
        opacity: 0.14,
      }),
    []
  );
  const matB = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#8b9cb0",
        transparent: true,
        opacity: 0.1,
      }),
    []
  );
  const matC = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#6b7c8c",
        transparent: true,
        opacity: 0.09,
      }),
    []
  );
  const geoA = useMemo(() => new THREE.TorusGeometry(2.18, 0.007, 8, 72), []);
  const geoB = useMemo(() => new THREE.TorusGeometry(2.32, 0.006, 8, 72), []);
  const geoC = useMemo(() => new THREE.TorusGeometry(2.08, 0.006, 8, 64), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const breathe = 0.85 + Math.sin(t * 0.9) * 0.15;
    if (aRef.current) {
      aRef.current.rotation.x = Math.PI / 2.28;
      aRef.current.rotation.z = t * 0.11;
      matA.opacity = 0.11 * breathe;
    }
    if (bRef.current) {
      bRef.current.rotation.y = t * 0.09;
      bRef.current.rotation.x = Math.PI / 2.02;
      matB.opacity = 0.08 * (0.9 + Math.sin(t * 1.1 + 1) * 0.1);
    }
    if (cRef.current) {
      cRef.current.rotation.z = -t * 0.14;
      cRef.current.rotation.x = Math.PI / 2.55;
      cRef.current.rotation.y = Math.sin(t * 0.06) * 0.25;
      matC.opacity = 0.07 * breathe;
    }
  });

  useEffect(() => {
    return () => {
      geoA.dispose();
      geoB.dispose();
      geoC.dispose();
      matA.dispose();
      matB.dispose();
      matC.dispose();
    };
  }, [geoA, geoB, geoC, matA, matB, matC]);

  return (
    <>
      <mesh ref={aRef} geometry={geoA} material={matA} />
      <mesh ref={bRef} geometry={geoB} material={matB} />
      <mesh ref={cRef} geometry={geoC} material={matC} />
    </>
  );
}

/** Garis halus antar sensor (mesh jaring) — sama wobble dengan modul */
function SensorMeshNetwork({ basePositions }: { basePositions: THREE.Vector3[] }) {
  const vA = useMemo(() => new THREE.Vector3(), []);
  const vB = useMemo(() => new THREE.Vector3(), []);

  const { geometry, material, lineSegments } = useMemo(() => {
    const n = basePositions.length;
    const pairsPerNode = 3;
    const segCount = n * pairsPerNode;
    const arr = new Float32Array(segCount * 2 * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    const m = new THREE.LineBasicMaterial({
      color: "#9aaaba",
      transparent: true,
      opacity: 0.14,
    });
    const ls = new THREE.LineSegments(g, m);
    ls.frustumCulled = false;
    return { geometry: g, material: m, lineSegments: ls };
  }, [basePositions.length]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    if (!posAttr) return;
    const arr = posAttr.array as Float32Array;
    const n = basePositions.length;
    let o = 0;
    const offsets = [1, 5, 11];
    for (let i = 0; i < n; i++) {
      for (const off of offsets) {
        const j = (i + off) % n;
        sensorWorldPosition(basePositions[i], i, t, vA);
        sensorWorldPosition(basePositions[j], j, t, vB);
        arr[o++] = vA.x;
        arr[o++] = vA.y;
        arr[o++] = vA.z;
        arr[o++] = vB.x;
        arr[o++] = vB.y;
        arr[o++] = vB.z;
      }
    }
    posAttr.needsUpdate = true;
    (material as THREE.LineBasicMaterial).opacity = 0.1 + Math.sin(t * 1.4) * 0.045;
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <primitive object={lineSegments} />;
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
      <pointLight position={[0, 2.2, 2.2]} intensity={0.35} color="#f1f5f9" distance={12} />
      <SensorFieldRings />
      <SensorMeshNetwork basePositions={basePositions} />
      <DataLinksToPackage basePositions={basePositions} />
      <ParcelPackage isOpen={isOpen} onToggle={toggleOpen} onHoverChange={onPackageHover} />
      {basePositions.map((base, i) => (
        <SensorModule key={i} index={i} base={base} />
      ))}
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
      style={{
        cursor: packageHover ? "pointer" : undefined,
        overflow: "visible",
      }}
    >
      <Canvas
        className="block h-full w-full touch-none"
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 47, position: [0, 0.18, 6.55] }}
        style={{
          background: "transparent",
          display: "block",
          width: "100%",
          height: "100%",
        }}
        shadows
      >
        <SceneContent onPackageHover={setPackageHover} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.85} minPolarAngle={Math.PI / 4} />
      </Canvas>
    </div>
  );
}
