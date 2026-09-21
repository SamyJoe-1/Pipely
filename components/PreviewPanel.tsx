"use client"

import { useState } from "react"
import { X, Grid2x2, Box as BoxIcon, Download } from "lucide-react"
import { MeshPreview } from "./MeshPreview"
import type { GeneratedResult } from "@/lib/types"
import { cn, formatKb } from "@/lib/utils"

export function PreviewPanel({
  result,
  onClose,
}: {
  result: GeneratedResult
  onClose: () => void
}) {
  const [wireframe, setWireframe] = useState(false)
  const [toast, setToast] = useState(false)

  return (
    <aside className="relative flex h-full w-full flex-col border-l border-white/10 bg-[#100e0c]/90 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5">
        <div>
          <p className="font-display text-[13px] text-stone-200">Viewport</p>
          <p className="font-mono text-[11px] text-stone-500">
            {result.files[0]?.name}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-500 hover:bg-white/5 hover:text-stone-200"
          aria-label="Close viewport"
        >
          <X size={16} />
        </button>
      </div>

      <div className="relative aspect-square w-full shrink-0 border-b border-white/10">
        <MeshPreview kind={result.meshKind} wireframe={wireframe} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-2.5">
          <div className="pointer-events-auto flex gap-1 rounded-lg border border-white/10 bg-black/50 p-1 backdrop-blur">
            <button
              onClick={() => setWireframe(false)}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded",
                !wireframe ? "bg-white/10 text-stone-100" : "text-stone-500"
              )}
              aria-label="Solid view"
            >
              <BoxIcon size={13} />
            </button>
            <button
              onClick={() => setWireframe(true)}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded",
                wireframe ? "bg-white/10 text-stone-100" : "text-stone-500"
              )}
              aria-label="Wireframe view"
            >
              <Grid2x2 size={13} />
            </button>
          </div>
          <p className="pointer-events-none rounded bg-black/50 px-2 py-1 font-mono text-[10px] text-stone-400">
            drag to orbit · scroll to zoom
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-[13px] leading-relaxed text-stone-300">
          {result.summary}
        </p>

        <p className="mt-5 mb-2 text-[11px] uppercase tracking-wide text-stone-500">
          Output files
        </p>
        <ul className="space-y-1.5">
          {result.files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2"
            >
              <span className="flex-1 truncate text-[12.5px] text-stone-200">
                {f.name}
              </span>
              <span className="font-mono text-[10.5px] text-stone-500">
                {formatKb(f.sizeKb)}
              </span>
              <button
                onClick={() => {
                  setToast(true)
                  setTimeout(() => setToast(false), 1800)
                }}
                className="text-stone-500 hover:text-ember"
                aria-label={`Export ${f.name}`}
              >
                <Download size={13} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {toast && (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-lg border border-white/10 bg-[#1a1613] px-3 py-2 text-center font-mono text-[11px] text-stone-400 shadow-lg">
          Prototype build — export is simulated
        </div>
      )}
    </aside>
  )
}
