"use client"

import { FileIcon } from "lucide-react"
import type { ChatMessage } from "@/lib/types"
import { ThinkingChecklist } from "./ThinkingChecklist"
import { ResultCard } from "./ResultCard"
import { formatBytes } from "@/lib/utils"

export function MessageBubble({
  message,
  onPreview,
}: {
  message: ChatMessage
  onPreview: (msg: ChatMessage) => void
}) {
  const isUser = message.role === "user"

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-ember/[0.14] px-4 py-3 text-[14.5px] leading-relaxed text-stone-100">
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {message.attachments.map((a) =>
                a.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={a.id}
                    src={a.previewUrl}
                    alt={a.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div
                    key={a.id}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/20 px-2 py-1.5"
                  >
                    <FileIcon size={13} />
                    <div>
                      <p className="max-w-[120px] truncate text-[11px]">{a.name}</p>
                      <p className="font-mono text-[10px] text-stone-400">
                        {formatBytes(a.size)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {message.content && <p>{message.content}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/8 bg-white/[0.025] px-4 py-3.5">
        {message.steps && (
          <div className={message.content ? "mb-3.5" : ""}>
            <ThinkingChecklist steps={message.steps} />
          </div>
        )}
        {message.content && (
          <p className="text-[14.5px] leading-relaxed text-stone-200">
            {message.content}
          </p>
        )}
        {message.result && (
          <ResultCard result={message.result} onPreview={() => onPreview(message)} />
        )}
      </div>
    </div>
  )
}
