import type { Capability } from "./types"

export const CAPABILITIES: Capability[] = [
  {
    id: "retopology",
    label: "Character Retopology",
    meshKind: "topology",
    prompt:
      "Retopologize this sculpted head into a clean, animation-ready quad mesh with edge loops around the eyes and mouth.",
    steps: [
      "Reading source mesh",
      "Detecting high-density regions",
      "Tracing edge flow around deformation zones",
      "Generating quad topology",
      "Relaxing and validating the cage",
    ],
  },
  {
    id: "uv-unwrap",
    label: "Production UV Unwrapping",
    meshKind: "uv",
    prompt:
      "Unwrap this hard-surface prop into production UVs with minimal stretching and a texel-density-matched layout.",
    steps: [
      "Reading source mesh",
      "Detecting seam candidates along sharp edges",
      "Cutting and flattening UV islands",
      "Packing islands to the 0–1 space",
      "Checking texel density and stretch",
    ],
  },
  {
    id: "auto-rig",
    label: "Non-Humanoid Auto-Rigging",
    meshKind: "rig",
    prompt:
      "Auto-rig this four-legged creature mesh with a control skeleton, IK on the legs, and skin weights.",
    steps: [
      "Reading source mesh",
      "Estimating body plan and limb count",
      "Placing joints along the medial axis",
      "Binding skin weights",
      "Building IK controls",
    ],
  },
  {
    id: "sketch-to-cad",
    label: "Sketch-to-CAD",
    meshKind: "hardsurface",
    prompt:
      "Convert this napkin sketch of a bracket into a parametric CAD solid with correct wall thickness.",
    steps: [
      "Reading input sketch",
      "Extracting primary contours",
      "Inferring extrusions and fillets",
      "Building parametric solid",
      "Running manufacturability check",
    ],
  },
  {
    id: "self-intersection",
    label: "Self-Intersection Repair",
    meshKind: "intersection",
    prompt:
      "Find and repair the self-intersecting geometry in this cloth simulation export.",
    steps: [
      "Reading source mesh",
      "Building spatial hash of triangles",
      "Locating self-intersecting faces",
      "Resolving overlaps and re-stitching shells",
      "Re-validating manifold geometry",
    ],
  },
  {
    id: "mesh-repair",
    label: "Semantic Mesh Repair",
    meshKind: "repair",
    prompt:
      "This scanned mesh has holes and floating shells — repair it while preserving the original surface detail.",
    steps: [
      "Reading source mesh",
      "Classifying defects by surface region",
      "Filling holes with curvature-aware patches",
      "Removing floating shells",
      "Preserving high-frequency detail",
    ],
  },
]

export const DEFAULT_STEPS = [
  "Parsing prompt",
  "Selecting pipeline",
  "Allocating compute",
  "Synthesizing geometry",
  "Packaging output",
]

export function capabilityFor(id: string | undefined) {
  return CAPABILITIES.find((c) => c.id === id)
}

export function detectCapability(prompt: string): Capability | undefined {
  const p = prompt.toLowerCase()
  if (/(retopo|topology|quad|edge loop)/.test(p))
    return capabilityFor("retopology")
  if (/(uv|unwrap|texel|seam)/.test(p)) return capabilityFor("uv-unwrap")
  if (/(rig|skeleton|skin weight|ik\b)/.test(p))
    return capabilityFor("auto-rig")
  if (/(sketch|cad|parametric|blueprint|cad)/.test(p))
    return capabilityFor("sketch-to-cad")
  if (/(self-intersect|intersecting|overlap)/.test(p))
    return capabilityFor("self-intersection")
  if (/(repair|hole|floating shell|scan)/.test(p))
    return capabilityFor("mesh-repair")
  return undefined
}
