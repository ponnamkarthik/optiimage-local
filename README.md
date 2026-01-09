# OptiImage Local

**Free, privacy-first image compressor, resizer, and format converter — 100% in your browser.**

If you’re looking for a TinyPNG/TinyJPG alternative that **doesn’t upload your files**, OptiImage Local processes everything locally (client-side) and works great as a static site.

## What it does

- Compress and optimize images (client-side)
- Resize images (per-image)
- Convert formats in bulk
- Create `.ico` icons

## Supported formats

- Input: whatever your browser can decode + additional decoding via WASM (e.g. JXL/QOI)
- Output: **JPG, PNG (optimized), WebP, AVIF, JXL, QOI, ICO**

## Why users like it

- **No uploads**: your images never leave your device
- **Fast**: WebAssembly codecs via `@jsquash/*`
- **Unlimited**: drag & drop, process many files
- **Static deploy**: ships as an `out/` folder (Next.js static export)

## Tech stack

- Next.js + TypeScript
- Tailwind CSS v4
- WASM image codecs: `@jsquash/avif`, `jpeg`, `jxl`, `png`, `webp`, `qoi`, `oxipng`, `resize`

## Run locally

**Prerequisites:** Node.js (18+ recommended)

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build & deploy (static)

```bash
npm run build
```

- Output folder: `out/`
- Preview the static output locally:

```bash
npm run preview
```

Deploy `out/` to any static host (Netlify, Vercel static export, GitHub Pages, Cloudflare Pages, S3, etc.).
