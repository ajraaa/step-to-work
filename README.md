# CV Generator

AI-powered web app to create professional CVs with live preview and PDF export.

## ✨ Features

- **Live Preview** — Real-time CV rendering using `@react-pdf/renderer` (WYSIWYG)
- **Multi-page Support** — Automatic page breaks and accurate pagination
- **PDF Export** — High-quality PDF with precise styling and layout control
- **Font Customization** — Choose your preferred CV font (persisted)
- **Multi-entry Forms** — Add multiple entries for education, work, projects, etc.
- **Multi-step Navigation** — Stepper UI for smooth form flow
- **Responsive Layout** — Two-column design (form + preview)
- **Central State Management** — All data stored in Nanostores

## 🛠️ Tech Stack

- **Framework:** Astro 6.1.1
- **UI Components:** React (via `@astrojs/react`)
- **PDF Generation:** `@react-pdf/renderer`
- **Styling:** Tailwind CSS
- **State Management:** Nanostores
- **Future Backend:** Supabase (persistence), OpenRouter/Gemini (AI features)
- **Hosting:** Cloudflare Pages (planned)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open http://localhost:4321 (dev) or http://localhost:4322 (preview)

## 📁 Project Structure

```
src/
  components/
    forms/           # CV section form components
    preview/         # React PDF preview component
  stores/
    cvStores.ts      # Nanostores state (CV data + styling)
  pages/
    index.astro      # Main app (form + preview layout)
public/              # Static assets
```

## 🔧 Development Notes

- **State:** CV data is stored in a central nanostores store for reactive updates.
- **Preview:** Uses `@react-pdf/renderer` components (`Document`, `Page`, `View`, `Text`) for accurate PDF layout.
- **Styling:** Tailwind CSS for UI; react-pdf styles for PDF output.
- **PDF Export:** Calls `pdf(<CVPreview />).toBlob()` and triggers browser download.
- **Fonts:** Font selector updates store; preview applies via inline style.

## 🎯 Current Status

✅ **Done:**
- All form sections with multi-entry support
- Live preview with react-pdf
- Multi-page detection & handling
- PDF export with proper page breaks
- Font customization
- Astro v6.1.1 upgrade
- State management refactored

⏳ **In Progress / TODO:**
- Template selector UI (Modern/Classic/Minimal)
- Supabase integration (save/load CVs)
- AI bullet improver (OpenRouter)
- Drag & drop section reordering
- Tests for store and preview
- Landing page
- Dark mode

## 🤝 Contributing

This is a personal project by Azzra. Fork & PRs welcome for learning purposes.

---
Built with passion by Azzra