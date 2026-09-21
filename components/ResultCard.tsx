"use client"

import { Box, FileText, Grid3x3, ImageIcon, Orbit, Bone } from "lucide-react"
import type { GeneratedResult } from "@/lib/types"
import { formatKb } from "@/lib/utils"

const FILE_ICON: Record<GeneratedResult["files"][number]["kind"], typeof Box> = {
  model: Box,
  texture: ImageIcon,
  rig: Bone,
  uv: Grid3x3,
  report: FileText,
}

export function ResultCard({
  result,
  onPreview,
}: {
  result: GeneratedResult
  onPreview: () => void
}) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-b border-white/10 px-4 py-2.5">
        {result.stats.map((s) => (
          <div key={s.label} className="flex items-baseline gap-1.5">
            <span className="text-[11px] uppercase tracking-wide text-stone-500">
              {s.label}
            </span>
            <span className="font-mono text-[12.5px] text-stone-200">
              {s.value}
            </span>
          </div>
        ))}
        <span className="ml-auto font-mono text-[11px] text-stone-600">
          {result.genSeconds}s
        </span>
      </div>

      <ul className="divide-y divide-white/5">
        {result.files.map((f) => {
          const Icon = FILE_ICON[f.kind]
          return (
            <li
              key={f.id}
              className="flex items-center gap-2.5 px-4 py-2.5 text-[13px]"
            >
              <Icon size={15} className="shrink-0 text-stone-500" />
              <span className="flex-1 truncate text-stone-200">{f.name}</span>
              <span className="font-mono text-[11px] text-stone-500">
                {formatKb(f.sizeKb)}
              </span>
            </li>
          )
        })}
      </ul>

      <button
        onClick={onPreview}
        className="flex w-full items-center justify-center gap-2 border-t border-white/10 bg-ember/[0.06] py-2.5 font-display text-[13px] text-ember transition hover:bg-ember/[0.12]"
      >
        <Orbit size={15} />
        Preview in viewport
      </button>
    </div>
  )
}
