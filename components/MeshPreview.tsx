"use client"

import { Suspense, useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Grid } from "@react-three/drei"
import * as THREE from "three"
import type { MeshKind } from "@/lib/types"

const EMBER = "#ff6a2a"
const TEAL = "#5eead4"
const BONE = "#d8cfc4"

function useCheckerTexture(uvMode: boolean) {
  return useMemo(() => {
    if (typeof document === "undefined") return null
    const size = 256
    const cvs = document.createElement("canvas")
    cvs.width = size
    cvs.height = size
    const ctx = cvs.getContext("2d")!
    const cells = 8
    const cell = size / cells
    for (let y = 0; y < cells; y++) {
      for (let x = 0; x < cells; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#e8dfd2" : uvMode ? "#ff6a2a" : "#2a2622"
        ctx.fillRect(x * cell, y * cell, cell, cell)
      }
    }
    const tex = new THREE.CanvasTexture(cvs)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    return tex
  }, [uvMode])
}

function SpinGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08
  })
  return <group ref={ref}>{children}</group>
}

function TopologyMesh({ wireframe }: { wireframe: boolean }) {
  return (
    <group>
      <mesh castShadow>
        <icosahedronGeometry args={[1.15, 2]} />
        <meshStandardMaterial
          color={BONE}
          roughness={0.55}
          metalness={0.05}
          wireframe={wireframe}
        />
      </mesh>
      {!wireframe && (
        <mesh scale={1.003}>
          <icosahedronGeometry args={[1.15, 2]} />
          <meshBasicMaterial color={TEAL} wireframe transparent opacity={0.35} />
        </mesh>
      )}
    </group>
  )
}

function UvMesh({ wireframe }: { wireframe: boolean }) {
  const tex = useCheckerTexture(true)
  return (
    <mesh castShadow>
      <sphereGeometry args={[1.2, 48, 32]} />
      <meshStandardMaterial
        map={wireframe ? null : tex}
        color={wireframe ? BONE : "white"}
        wireframe={wireframe}
        roughness={0.6}
      />
    </mesh>
  )
}

function RigMesh({ wireframe }: { wireframe: boolean }) {
  const mat = (color: string) => (
    <meshStandardMaterial color={color} roughness={0.5} wireframe={wireframe} />
  )
  const joint = (x: number, y: number, z: number, key: string) => (
    <mesh key={key} position={[x, y, z]}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshStandardMaterial color={EMBER} />
    </mesh>
  )
  const legs = [-0.5, 0.5].flatMap((x) =>
    [-0.55, 0.55].map((z) => (
      <group key={`${x}-${z}`}>
        <mesh position={[x, -0.55, z]}>
          <cylinderGeometry args={[0.09, 0.07, 0.9, 10]} />
          {mat(BONE)}
        </mesh>
        {joint(x, -0.1, z, `hip-${x}-${z}`)}
        {joint(x, -1.0, z, `ankle-${x}-${z}`)}
      </group>
    ))
  )
  return (
    <group>
      <mesh>
        <capsuleGeometry args={[0.55, 1.1, 8, 16]} />
        {mat(BONE)}
      </mesh>
      <mesh position={[0, 0.85, 0.55]}>
        <sphereGeometry args={[0.34, 20, 20]} />
        {mat(BONE)}
      </mesh>
      {joint(0, 0.5, 0, "spine")}
      {legs}
    </group>
  )
}

function HardsurfaceMesh({ wireframe }: { wireframe: boolean }) {
  const mat = (
    <meshStandardMaterial color="#cfd4d6" metalness={0.75} roughness={0.3} wireframe={wireframe} />
  )
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.6, 0.35, 1]} />
        {mat}
      </mesh>
      <mesh position={[-0.55, 0.4, 0]}>
        <boxGeometry args={[0.5, 0.75, 1]} />
        {mat}
      </mesh>
      <mesh position={[0.55, 0.4, 0]}>
        <boxGeometry args={[0.5, 0.75, 1]} />
        {mat}
      </mesh>
      <mesh position={[-0.55, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1.02, 24]} />
        <meshStandardMaterial color={EMBER} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0.55, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1.02, 24]} />
        <meshStandardMaterial color={EMBER} metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  )
}

function IntersectionMesh({ wireframe }: { wireframe: boolean }) {
  return (
    <group>
      <mesh position={[-0.35, 0, 0]}>
        <torusKnotGeometry args={[0.55, 0.16, 120, 16]} />
        <meshStandardMaterial color={BONE} roughness={0.5} wireframe={wireframe} />
      </mesh>
      <mesh position={[0.55, 0.1, 0.1]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial
          color={TEAL}
          roughness={0.4}
          transparent
          opacity={wireframe ? 1 : 0.55}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  )
}

function RepairMesh({ wireframe }: { wireframe: boolean }) {
  return (
    <group>
      <mesh>
        <dodecahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial color={BONE} roughness={0.6} wireframe={wireframe} />
      </mesh>
      {[
        [0.7, 0.5, 0.4],
        [-0.6, -0.4, 0.6],
        [0.2, -0.7, -0.6],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <circleGeometry args={[0.22, 20]} />
          <meshStandardMaterial color={TEAL} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

function GenericMesh({ wireframe }: { wireframe: boolean }) {
  return (
    <mesh>
      <torusKnotGeometry args={[0.85, 0.26, 140, 20]} />
      <meshStandardMaterial color={EMBER} roughness={0.35} metalness={0.2} wireframe={wireframe} />
    </mesh>
  )
}

function MeshByKind({ kind, wireframe }: { kind: MeshKind; wireframe: boolean }) {
  switch (kind) {
    case "topology":
      return <TopologyMesh wireframe={wireframe} />
    case "uv":
      return <UvMesh wireframe={wireframe} />
    case "rig":
      return <RigMesh wireframe={wireframe} />
    case "hardsurface":
      return <HardsurfaceMesh wireframe={wireframe} />
    case "intersection":
      return <IntersectionMesh wireframe={wireframe} />
    case "repair":
      return <RepairMesh wireframe={wireframe} />
    default:
      return <GenericMesh wireframe={wireframe} />
  }
}

export function MeshPreview({ kind, wireframe }: { kind: MeshKind; wireframe: boolean }) {
  return (
    <Canvas shadows camera={{ position: [2.4, 1.6, 2.6], fov: 40 }}>
      <color attach="background" args={["#0c0a08"]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.4}
        castShadow
        color="#ffedd8"
      />
      <pointLight position={[-3, -1, -2]} intensity={0.5} color={TEAL} />
      <pointLight position={[2, 2, -3]} intensity={0.3} color={EMBER} />
      <Suspense fallback={null}>
        <SpinGroup>
          <MeshByKind kind={kind} wireframe={wireframe} />
        </SpinGroup>
      </Suspense>
      <Grid
        infiniteGrid
        cellColor="#3a332c"
        sectionColor="#59493c"
        fadeDistance={12}
        position={[0, -1.4, 0]}
      />
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={1.5}
        maxDistance={8}
      />
    </Canvas>
  )
}
