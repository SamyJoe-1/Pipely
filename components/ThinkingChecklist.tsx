"use client"

import { Check, Loader2 } from "lucide-react"
import type { ThinkingStep } from "@/lib/types"
import { cn } from "@/lib/utils"

export function ThinkingChecklist({ steps }: { steps: ThinkingStep[] }) {
  return (
    <ul className="space-y-2.5">
      {steps.map((step) => (
        <li key={step.id} className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border text-[10px]",
              step.status === "done" &&
                "border-teal/50 bg-teal/10 text-teal",
              step.status === "active" &&
                "border-ember/60 bg-ember/10 text-ember",
              step.status === "pending" &&
                "border-white/10 bg-transparent text-transparent"
            )}
          >
            {step.status === "done" && <Check size={11} strokeWidth={3} />}
            {step.status === "active" && (
              <Loader2 size={11} className="animate-spin" />
            )}
          </span>
          <span
            className={cn(
              "font-display text-[13px] transition-colors",
              step.status === "pending" && "text-stone-600",
              step.status === "active" && "text-stone-100",
              step.status === "done" && "text-stone-400"
            )}
          >
            {step.label}
          </span>
        </li>
      ))}
    </ul>
  )
}
