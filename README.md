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

- **Framework:** Astro
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
    containers/      # Layout/composed components (FormContainer)
    forms/           # CV section form components
      PersonalInfoForm.astro
      WorkExperienceForm.astro
      EducationForm.astro
      SkillsForm.astro
      ProjectsForm.astro
      CertificationsForm.astro
      LanguagesForm.astro
      ReferencesForm.astro
      OrganizationExperienceForm.astro
      VolunteerExperienceForm.astro
    preview/         # React PDF preview components
      CVLivePreview.tsx
      CVPDFDocument.tsx
    ui/              # Reusable UI primitives
      Stepper.astro
  stores/
    cvStores.ts      # Central nanostores (CV data + style state)
  pages/
    index.astro      # Main app (two-column layout)
public/              # Static assets
```

## 🔧 Development Notes

- **State Management:** CV data and styling state are centralized in `src/stores/cvStores.ts` using Nanostores for reactivity.
- **Component Architecture:**
  - `containers/`: Composed components that orchestrate multiple parts (e.g., `FormContainer` manages stepper + form panels).
  - `forms/`: Individual CV section forms (10 sections) with multi-entry support.
  - `preview/`: React components using `@react-pdf/renderer` for live preview and PDF generation.
  - `ui/`: Reusable UI primitives like `Stepper`.
- **Styling:** Tailwind CSS for the UI; `@react-pdf/renderer` style objects for PDF output.
- **PDF Export:** Uses `pdf(<CVLivePreview />).toBlob()` to generate PDF with proper page breaks.
- **Fonts:** Font selection stored in nanostores and applied inline to react-pdf components.

## 🎯 Current Status

✅ **Done:**
- All form sections (10) with dynamic multi-entry and real-time store sync
- Live preview using react-pdf (WYSIWYG)
- Multi-page A4 support with accurate pagination
- PDF export with proper scaling and layout
- Font customization (persisted)
- Multi-step navigation (Stepper)
- Style state separated into `cvStyleStores` module
- Components restructured: `containers/`, `forms/`, `preview/`, `ui/`
- Astro v6.1.1 + React integration
- Skills form: dynamic category management with presets

⏳ **In Progress / TODO:**
- Template selector UI (Modern/Classic/Minimal)
- Supabase integration (save/load CVs)
- AI bullet improver (OpenRouter)
- Drag & drop section reordering
- Tests for store and preview
- Landing page
- Dark mode
- Full CV customization (padding, margin, etc)

## 🤝 Contributing

This is a personal project by Azzra. Fork & PRs welcome for learning purposes.

---
Built with passion by Azzra