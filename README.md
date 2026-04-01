# CV Generator

AI-powered web app to create professional CVs with live preview and PDF export.

## ✨ Features

- Live preview as you type
- Multi-entry forms for all sections
- PDF export with accurate styling
- Font selector
- Responsive two-column layout

## 🛠️ Tech

- **Astro** + **Tailwind CSS**
- **Nanostores** for state
- **html2pdf.js** for PDF export

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:4321 and start building your CV.

## 📁 Structure

```
src/
  components/
    forms/     # All CV section forms
    preview/   # Live CV preview
  stores/
    cvStores.ts   # Global state
  pages/
    index.astro   # Main page
```

## 🎯 Status

Core done: forms, preview, PDF export.  
Next: templates, Supabase, AI features.

---
Made by Azzra