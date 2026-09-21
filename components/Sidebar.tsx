"use client"

import { Boxes, Plus, MessageSquare } from "lucide-react"
import type { Chat } from "@/lib/types"
import { cn } from "@/lib/utils"

export function Sidebar({
  chats,
  activeId,
  onSelect,
  onNew,
}: {
  chats: Chat[]
  activeId: string
  onSelect: (id: string) => void
  onNew: () => void
}) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-white/10 bg-[#0e0c0a]/85 backdrop-blur-xl">
      <div className="flex items-center gap-2 px-4 pb-3 pt-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/15 text-ember">
          <Boxes size={16} />
        </div>
        <span className="font-display text-[14.5px] tracking-tight text-stone-100">
          Forma
        </span>
      </div>

      <div className="px-3 pb-2">
        <button
          onClick={onNew}
          className="flex w-full items-center gap-2 rounded-xl border border-white/10 px-3 py-2 font-display text-[13px] text-stone-300 transition hover:border-ember/40 hover:text-ember"
        >
          <Plus size={15} />
          New context window
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-1">
        {chats.map((chat) => {
          const active = chat.id === activeId
          const last = chat.messages[chat.messages.length - 1]
          return (
            <button
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className={cn(
                "group mb-0.5 flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition",
                active ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
              )}
            >
              <MessageSquare
                size={14}
                className={cn(
                  "mt-0.5 shrink-0",
                  active ? "text-ember" : "text-stone-600"
                )}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-[13px]",
                    active ? "text-stone-100" : "text-stone-400"
                  )}
                >
                  {chat.title}
                </p>
                <p className="truncate font-mono text-[10.5px] text-stone-600">
                  {chat.messages.length} msg
                  {last ? ` · ${chat.messages.length > 1 ? "active" : "new"}` : ""}
                </p>
              </div>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-3">
        <p className="font-mono text-[10.5px] leading-relaxed text-stone-600">
          Retopology · UV · Rigging
          <br />
          Sketch-to-CAD · Repair
        </p>
      </div>
    </aside>
  )
}
