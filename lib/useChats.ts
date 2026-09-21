"use client"

import { useCallback, useRef, useState } from "react"
import type { Attachment, Chat, ChatMessage, ThinkingStep } from "./types"
import { CAPABILITIES, DEFAULT_STEPS, detectCapability } from "./capabilities"
import { buildResult } from "./mock-engine"
import { uid } from "./utils"

function welcomeChat(): Chat {
  return {
    id: uid("chat"),
    title: "New context window",
    capability: "general",
    createdAt: Date.now(),
    messages: [],
  }
}

function titleFrom(text: string): string {
  const clean = text.trim().replace(/\s+/g, " ")
  if (!clean) return "New context window"
  return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>(() => [welcomeChat()])
  const [activeId, setActiveId] = useState<string>(() => chats[0].id)
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  const schedule = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timers.current.delete(t)
      fn()
    }, ms)
    timers.current.add(t)
  }, [])

  const patchMessage = useCallback(
    (chatId: string, messageId: string, patch: Partial<ChatMessage>) => {
      setChats((prev) =>
        prev.map((c) =>
          c.id !== chatId
            ? c
            : {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId ? { ...m, ...patch } : m
                ),
              }
        )
      )
    },
    []
  )

  const runPipeline = useCallback(
    (chatId: string, assistantId: string, stepLabels: string[], onDone: () => void) => {
      let delay = 500
      stepLabels.forEach((label, i) => {
        schedule(() => {
          setChats((prev) =>
            prev.map((c) => {
              if (c.id !== chatId) return c
              return {
                ...c,
                messages: c.messages.map((m) => {
                  if (m.id !== assistantId || !m.steps) return m
                  const steps: ThinkingStep[] = m.steps.map((s, si) => {
                    if (si < i) return { ...s, status: "done" }
                    if (si === i) return { ...s, status: "active" }
                    return s
                  })
                  return { ...m, steps }
                }),
              }
            })
          )
        }, delay)
        delay += 650 + Math.random() * 500
      })
      schedule(() => {
        patchMessage(chatId, assistantId, {
          steps: stepLabels.map((label) => ({
            id: uid("step"),
            label,
            status: "done",
          })),
        })
        onDone()
      }, delay)
    },
    [schedule, patchMessage]
  )

  const sendMessage = useCallback(
    (chatId: string, text: string, attachments: Attachment[]) => {
      const capability = detectCapability(text)
      const userMsg: ChatMessage = {
        id: uid("msg"),
        role: "user",
        content: text,
        attachments,
        createdAt: Date.now(),
      }
      const stepLabels = capability ? capability.steps : DEFAULT_STEPS
      const assistantId = uid("msg")
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: Date.now(),
        steps: stepLabels.map((label, i) => ({
          id: uid("step"),
          label,
          status: i === 0 ? "active" : "pending",
        })),
      }

      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== chatId) return c
          const isFirst = c.messages.length === 0
          return {
            ...c,
            title: isFirst ? titleFrom(text || "3D task") : c.title,
            capability: capability?.id ?? c.capability,
            messages: [...c.messages, userMsg, assistantMsg],
          }
        })
      )

      runPipeline(chatId, assistantId, stepLabels, () => {
        const result = buildResult(capability)
        patchMessage(chatId, assistantId, {
          content: result.summary,
          result,
        })
      })
    },
    [runPipeline, patchMessage]
  )

  const newChat = useCallback(() => {
    const chat = welcomeChat()
    setChats((prev) => [chat, ...prev])
    setActiveId(chat.id)
  }, [])

  return {
    chats,
    activeId,
    setActiveId,
    sendMessage,
    newChat,
    capabilities: CAPABILITIES,
  }
}
