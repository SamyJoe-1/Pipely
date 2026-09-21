export type CapabilityId =
  | "retopology"
  | "uv-unwrap"
  | "auto-rig"
  | "sketch-to-cad"
  | "self-intersection"
  | "mesh-repair"
  | "general"

export type MeshKind =
  | "topology"
  | "uv"
  | "rig"
  | "hardsurface"
  | "intersection"
  | "repair"
  | "generic"

export interface Capability {
  id: CapabilityId
  label: string
  meshKind: MeshKind
  prompt: string
  steps: string[]
}

export interface Attachment {
  id: string
  name: string
  size: number
  kind: "image" | "file"
  previewUrl?: string
}

export type StepStatus = "pending" | "active" | "done"

export interface ThinkingStep {
  id: string
  label: string
  status: StepStatus
  detail?: string
}

export interface GeneratedFile {
  id: string
  name: string
  kind: "model" | "texture" | "rig" | "uv" | "report"
  sizeKb: number
}

export interface GeneratedResult {
  meshKind: MeshKind
  summary: string
  stats: { label: string; value: string }[]
  files: GeneratedFile[]
  genSeconds: number
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  attachments?: Attachment[]
  steps?: ThinkingStep[]
  result?: GeneratedResult
  createdAt: number
}

export interface Chat {
  id: string
  title: string
  capability: CapabilityId
  messages: ChatMessage[]
  createdAt: number
}
