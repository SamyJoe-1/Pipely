# Forma — 3D Agent (Prototype)

A single-page, front-end-only prototype of a conversational AI agent for 3D
production tasks: retopology, UV unwrapping, non-humanoid auto-rigging,
sketch-to-CAD, self-intersection repair, and semantic mesh repair.

**There is no backend.** Every "generation" is simulated entirely in the
browser: sending a prompt plays a fake step-by-step pipeline animation, then
produces a mock result (stats + a file list) that you can open in a live,
orbit-controlled 3D viewport built with `three.js` / `react-three-fiber`.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- react-three-fiber + drei (3D viewport)
- lucide-react (icons)

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To build for production:

```bash
npm run build
npm start
```

## Project structure

```
app/
  layout.tsx        Root layout, fonts, metadata
  page.tsx           The single page — composes everything below
  globals.css        Tailwind v4 theme tokens (ember/teal accents, fonts)

components/
  ui/my-first.tsx    ShaderBackground (your supplied component, unmodified logic)
  Sidebar.tsx        Left rail — list of chats / "context windows"
  ChatColumn.tsx      Center — message stream + composer
  Composer.tsx        Prompt textarea: drag/drop, file upload, capability chips
  MessageBubble.tsx   Renders a single user/assistant message
  ThinkingChecklist.tsx  Animated pipeline step list
  ResultCard.tsx      Stats + generated file list + "Preview" button
  PreviewPanel.tsx    Right slide-in panel hosting the 3D viewport
  MeshPreview.tsx     react-three-fiber scene, one procedural mesh per capability

lib/
  types.ts            Shared TypeScript types
  capabilities.ts      The 6 capabilities, their example prompts & pipeline steps
  mock-engine.ts        Fake result generator (stats + files, randomized)
  useChats.ts           All app state: chats, sending messages, the timed
                        step-by-step "thinking" simulation
  utils.ts              Small helpers (id, byte formatting, cn)
```

## Notes / what's simulated

- Capability detection is a simple keyword match on your prompt text (see
  `detectCapability` in `lib/capabilities.ts`) with a generic fallback
  pipeline if nothing matches.
- Thinking steps, timings, poly counts, file names and file sizes are all
  randomized mock data — swap `lib/mock-engine.ts` for a real API call when
  you're ready to wire up an actual backend.
- The 3D meshes in the viewport are procedural (built from primitive
  three.js geometries), not real outputs of the capabilities — they're
  there to sell the "explore your generated model" interaction: drag to
  orbit, scroll to zoom, toggle solid/wireframe.
- "Export" buttons in the viewport are inert by design (prototype only) and
  show a small inline note when clicked.

## Extending this

- Real generation: replace `buildResult()` in `lib/mock-engine.ts` with a
  call to your API, and load real `.glb` files into `MeshPreview.tsx` with
  drei's `useGLTF` instead of the procedural geometries.
- Persistence: `lib/useChats.ts` holds everything in React state — swap in
  localStorage, IndexedDB, or a real backend as needed.
