"use client"

import { useRef, useState } from "react"
import { ArrowUp, Paperclip, X } from "lucide-react"
import type { Attachment } from "@/lib/types"
import { CAPABILITIES } from "@/lib/capabilities"
import { cn, formatBytes, uid } from "@/lib/utils"

interface ComposerProps {
  onSend: (text: string, attachments: Attachment[]) => void
  disabled?: boolean
}

export function Composer({ onSend, disabled }: ComposerProps) {
  const [value, setValue] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  function addFiles(files: FileList | File[]) {
    const next: Attachment[] = Array.from(files).map((f) => ({
      id: uid("att"),
      name: f.name,
      size: f.size,
      kind: f.type.startsWith("image/") ? "image" : "file",
      previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }))
    setAttachments((prev) => [...prev, ...next])
  }

  function handleSubmit() {
    const text = value.trim()
    if (!text && attachments.length === 0) return
    onSend(text, attachments)
    setValue("")
    setAttachments([])
    if (taRef.current) taRef.current.style.height = "auto"
  }

  function autosize() {
    const el = taRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {CAPABILITIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setValue(c.prompt)
              taRef.current?.focus()
              requestAnimationFrame(autosize)
            }}
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-display text-[12.5px] text-stone-300 transition hover:border-ember/40 hover:text-ember"
          >
            {c.label}
          </button>
        ))}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
        }}
        className={cn(
          "rounded-2xl border bg-[#141210]/80 backdrop-blur-xl transition-colors",
          dragging ? "border-ember/60 bg-ember/[0.06]" : "border-white/10"
        )}
      >
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-white/10 p-3">
            {attachments.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] py-1 pl-1 pr-2"
              >
                {a.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.previewUrl}
                    alt=""
                    className="h-7 w-7 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-white/[0.06]">
                    <Paperclip size={13} className="text-stone-400" />
                  </div>
                )}
                <div className="leading-tight">
                  <p className="max-w-[140px] truncate text-[12px] text-stone-200">
                    {a.name}
                  </p>
                  <p className="font-mono text-[10px] text-stone-500">
                    {formatBytes(a.size)}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setAttachments((prev) => prev.filter((x) => x.id !== a.id))
                  }
                  className="text-stone-500 hover:text-stone-200"
                  aria-label="Remove attachment"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 p-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-stone-400 transition hover:border-white/20 hover:text-stone-100"
            aria-label="Attach files"
          >
            <Paperclip size={17} />
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files)
              e.target.value = ""
            }}
          />

          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              autosize()
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            rows={1}
            placeholder="Describe the 3D task — drop a mesh, sketch, or scan to get started"
            className="max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-relaxed text-stone-100 placeholder:text-stone-500 focus:outline-none"
          />

          <button
            type="button"
            disabled={disabled || (!value.trim() && attachments.length === 0)}
            onClick={handleSubmit}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ember text-black transition hover:bg-ember-light disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-stone-500"
            aria-label="Send"
          >
            <ArrowUp size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
