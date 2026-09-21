"use client"

import { useState } from "react"
import { ShaderBackground } from "@/components/ui/my-first"
import { Sidebar } from "@/components/Sidebar"
import { ChatColumn } from "@/components/ChatColumn"
import { PreviewPanel } from "@/components/PreviewPanel"
import { useChats } from "@/lib/useChats"
import type { ChatMessage } from "@/lib/types"

export default function Home() {
  const { chats, activeId, setActiveId, sendMessage, newChat } = useChats()
  const [previewMsg, setPreviewMsg] = useState<ChatMessage | null>(null)

  const activeChat = chats.find((c) => c.id === activeId) ?? chats[0]

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#0b0a08]">
      <div className="pointer-events-none absolute inset-0">
        <ShaderBackground className="h-full w-full opacity-[0.55]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
      </div>

      <div className="relative z-10 flex h-full">
        <div className="w-[264px] shrink-0">
          <Sidebar
            chats={chats}
            activeId={activeChat.id}
            onSelect={(id) => {
              setActiveId(id)
              setPreviewMsg(null)
            }}
            onNew={() => {
              newChat()
              setPreviewMsg(null)
            }}
          />
        </div>

        <ChatColumn
          chat={activeChat}
          onSend={(text, attachments) =>
            sendMessage(activeChat.id, text, attachments)
          }
          onPreview={(msg) => setPreviewMsg(msg)}
        />

        {previewMsg?.result && (
          <div className="w-[380px] shrink-0">
            <PreviewPanel
              result={previewMsg.result}
              onClose={() => setPreviewMsg(null)}
            />
          </div>
        )}
      </div>
    </main>
  )
}
