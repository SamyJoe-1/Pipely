import type { Capability, GeneratedResult, MeshKind } from "./types"
import { uid } from "./utils"

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

const SUMMARIES: Record<MeshKind, string> = {
  topology:
    "Retopology pass complete. The mesh now carries clean, animation-friendly quad flow with reinforced loops around the primary deformation zones.",
  uv: "UV pass complete. Islands are cut along low-curvature seams and packed with even texel density across the 0–1 space.",
  rig: "Rig complete. Joints follow the medial axis of each limb, weights are smoothed across two rings, and IK controls are exposed at the root.",
  hardsurface:
    "CAD conversion complete. The sketch resolved into a single parametric solid with inferred wall thickness and fillets on load-bearing edges.",
  intersection:
    "Repair complete. Self-intersecting shells were separated and re-stitched; the mesh now passes a manifold check with zero flagged faces.",
  repair:
    "Repair complete. Holes were closed with curvature-aware patches and floating shells were removed without smoothing over the original scan detail.",
  generic:
    "Generation complete. The pipeline produced a clean base mesh ready for the next step in your production chain.",
}

function statsFor(meshKind: MeshKind): { label: string; value: string }[] {
  const tris = Math.round(rand(8000, 64000))
  const verts = Math.round(tris * 0.52)
  switch (meshKind) {
    case "topology":
      return [
        { label: "Faces", value: `${(tris / 2 / 1000).toFixed(1)}k quads` },
        { label: "Verts", value: `${(verts / 1000).toFixed(1)}k` },
        { label: "N-gons", value: "0" },
      ]
    case "uv":
      return [
        { label: "Islands", value: `${Math.round(rand(6, 24))}` },
        { label: "Stretch", value: `${rand(1, 4).toFixed(1)}%` },
        { label: "Texel density", value: `${Math.round(rand(8, 16))} px/cm` },
      ]
    case "rig":
      return [
        { label: "Joints", value: `${Math.round(rand(18, 46))}` },
        { label: "IK chains", value: `${Math.round(rand(2, 6))}` },
        { label: "Max weights", value: "4 / vert" },
      ]
    case "hardsurface":
      return [
        { label: "Solids", value: "1" },
        { label: "Features", value: `${Math.round(rand(4, 12))}` },
        { label: "Wall check", value: "Pass" },
      ]
    case "intersection":
      return [
        { label: "Faces fixed", value: `${Math.round(rand(40, 900))}` },
        { label: "Shells", value: `${Math.round(rand(1, 5))}` },
        { label: "Manifold", value: "Pass" },
      ]
    case "repair":
      return [
        { label: "Holes filled", value: `${Math.round(rand(2, 20))}` },
        { label: "Shells removed", value: `${Math.round(rand(0, 6))}` },
        { label: "Detail kept", value: `${Math.round(rand(92, 99))}%` },
      ]
    default:
      return [
        { label: "Faces", value: `${(tris / 1000).toFixed(1)}k` },
        { label: "Verts", value: `${(verts / 1000).toFixed(1)}k` },
        { label: "Manifold", value: "Pass" },
      ]
  }
}

function filesFor(meshKind: MeshKind): GeneratedResult["files"] {
  const base: GeneratedResult["files"] = [
    {
      id: uid("file"),
      name: "output_mesh.glb",
      kind: "model",
      sizeKb: Math.round(rand(800, 6400)),
    },
  ]
  if (meshKind === "uv")
    base.push(
      {
        id: uid("file"),
        name: "uv_layout.png",
        kind: "uv" as const,
        sizeKb: Math.round(rand(120, 480)),
      },
      {
        id: uid("file"),
        name: "checker_diffuse.png",
        kind: "texture" as const,
        sizeKb: Math.round(rand(200, 900)),
      }
    )
  if (meshKind === "rig")
    base.push({
      id: uid("file"),
      name: "skeleton_rig.json",
      kind: "rig" as const,
      sizeKb: Math.round(rand(30, 140)),
    })
  if (meshKind === "topology" || meshKind === "repair")
    base.push({
      id: uid("file"),
      name: "topology_report.pdf",
      kind: "report" as const,
      sizeKb: Math.round(rand(60, 220)),
    })
  if (meshKind === "hardsurface")
    base.push({
      id: uid("file"),
      name: "model.step",
      kind: "model" as const,
      sizeKb: Math.round(rand(300, 1200)),
    })
  if (meshKind === "intersection")
    base.push({
      id: uid("file"),
      name: "intersection_report.pdf",
      kind: "report" as const,
      sizeKb: Math.round(rand(50, 180)),
    })
  return base
}

export function buildResult(capability: Capability | undefined): GeneratedResult {
  const meshKind = capability?.meshKind ?? "generic"
  return {
    meshKind,
    summary: SUMMARIES[meshKind],
    stats: statsFor(meshKind),
    files: filesFor(meshKind),
    genSeconds: Math.round(rand(6, 34)),
  }
}
