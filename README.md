# CV Generator (Step-to-Work)

An AI-powered, premium CV builder designed to create professional, ATS-friendly resumes with ease. Featuring real-time PDF preview, advanced customization, and Google Gemini AI integration.

## ✨ Features

- **🤖 AI-Powered Assistant** — Integrated with Google Gemini 3.5 Flash for:
  - **Bullet Optimization** — Rewrite work experience bullets for maximum impact.
  - **Summary Generation** — Create compelling professional summaries.
  - **Skill Gap Analysis** — Analyze your profile against job descriptions.
- **🎨 Advanced Customization** — Real-time control over typography, spacing, and layout margins.
- **👁️ Live Preview** — True WYSIWYG experience using `@react-pdf/renderer` with instant updates.
- **📄 Precise PDF Export** — High-quality A4 PDF generation with accurate pagination and automatic page breaks.
- **🚀 Premium UI/UX** — Modern design with smooth transitions and a multi-step form flow.
- **💾 Persistent State** — All your data and style preferences are saved locally using Nanostores persistent storage.
- **🛠️ Multi-entry Forms** — Robust management for Education, Work, Projects, Skills, and more.

## 🛠️ Tech Stack

- **Framework:** [Astro v6](https://astro.build/) (Server-side rendering + Static site generation)
- **UI Logic:** [React 19](https://react.dev/) (via `@astrojs/react`)
- **AI Engine:** [Google Gemini 3.5 Flash](https://aistudio.google.com/)
- **PDF Engine:** [`@react-pdf/renderer`](https://react-pdf.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Nanostores](https://github.com/nanostores/nanostores) (Persistent & React integrations)

## 🚀 Quick Start

1. **Clone & Install:**
   ```bash
   git clone https://github.com/ajraaa/step-to-work.git
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   *Get your API key at [Google AI Studio](https://aistudio.google.com/apikey).*

3. **Development:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) to see the app.

## 📁 Project Structure

```text
src/
├── components/
│   ├── containers/    # High-level layout components (FormContainer)
│   ├── editor/        # CV customization UI (CVCustomization.tsx)
│   ├── forms/         # Section-specific form components (10 sections)
│   ├── preview/       # React-PDF rendering and preview logic
│   └── ui/            # Shared UI components (Stepper, TabSwitcher)
├── lib/               # Shared utilities (Gemini AI client)
├── pages/
│   ├── api/ai/        # Server-side AI endpoints (Bullet/Summary/Skill Gap)
│   └── index.astro    # Main application entry point
├── stores/            # Nanostores for CV data, style, and UI state
└── styles/            # Global CSS and Tailwind configuration
```

## 🎯 Current Status

### ✅ Completed
- [x] Full CV form suite (10 sections) with multi-entry support
- [x] Live PDF preview with `@react-pdf/renderer`
- [x] Google Gemini AI integration for content optimization
- [x] Advanced style customization system (fonts, margins, spacing)
- [x] Modern UI redesign
- [x] Persistent state management using Nanostores
- [x] Responsive layout with split-screen editor/preview
- [x] Multi-language support for PDF output (ID/EN)

### ⏳ Planned / Roadmap
- [ ] Multiple template presets (Modern, Classic, Creative)
- [ ] Supabase integration for cloud saving and user accounts
- [ ] Drag & drop section reordering
- [ ] Pre-designed content templates for various industries
- [ ] Ability to add custom section

## 🤝 Contributing

This is a personal project by Azzra. Contributions and feedback are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with passion by [Azzra](https://github.com/ajraaa)