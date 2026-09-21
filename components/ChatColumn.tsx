"use client"

import { useEffect, useRef } from "react"
import type { Attachment, Chat, ChatMessage } from "@/lib/types"
import { MessageBubble } from "./MessageBubble"
import { Composer } from "./Composer"
import { Sparkles } from "lucide-react"

export function ChatColumn({
  chat,
  onSend,
  onPreview,
}: {
  chat: Chat
  onSend: (text: string, attachments: Attachment[]) => void
  onPreview: (msg: ChatMessage) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [chat.messages, chat.id])

  const busy = chat.messages.some(
    (m) => m.role === "assistant" && m.steps?.some((s) => s.status !== "done")
  )

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-end px-6 py-8">
          {chat.messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center pb-16 text-center">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-ember/30 bg-ember/10 text-ember">
                <Sparkles size={20} />
              </div>
              <h1 className="font-display text-[26px] tracking-tight text-stone-100">
                What are we building?
              </h1>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-stone-500">
                Describe a 3D task, or drop in a mesh, sketch, or scan. This
                context window can retopologize, unwrap, rig, and repair
                geometry end to end.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {chat.messages.map((m) => (
                <MessageBubble key={m.id} message={m} onPreview={onPreview} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 bg-gradient-to-t from-[#0b0a08] to-transparent px-6 pb-6 pt-4">
        <div className="mx-auto w-full max-w-2xl">
          <Composer onSend={onSend} disabled={busy} />
        </div>
      </div>
    </div>
  )
}
