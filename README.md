# CV Generator

An AI-powered web application to generate professional CVs/resumes with intelligent suggestions.

## Features

- **Dynamic Forms** — Multi-entry support for all CV sections (education, work, skills, projects, etc.)
- **Live Preview** — Real-time CV rendering as you type
- **PDF Export** — Download high-quality PDF with accurate colors
- **Font Customization** — Choose your preferred CV font
- **Multi-step Navigation** — Stepper UI for smooth form flow
- **Central State Management** — All data stored in nanostores for instant updates

## Tech Stack

- **Framework:** Astro
- **Styling:** Tailwind CSS
- **State:** Nanostores
- **PDF:** html2pdf.js
- **Future:** Supabase (persistence), OpenRouter (AI features)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
  components/
    forms/       # CV section forms
    preview/     # CV preview component
  lib/
    store.ts     # Nanostores state management
  pages/
    index.astro  # Main app (form + preview)
```

## Status

Core functionality complete. Next: template selector, Supabase integration, AI bullet improver.

---
Built with ❤️ by Azzra