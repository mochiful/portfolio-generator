# Luminary

A static Vite + React app that turns a local resume PDF and optional headshot into a downloadable, self-contained portfolio website.

The app runs fully in the browser. There is no backend, no account system, and no AI/API dependency. PDF text extraction happens locally with `pdfjs-dist`, the user can edit parsed resume data, choose a layout, and download a standalone `portfolio.html` file.

## Features

- Upload a text-based resume PDF.
- Optionally upload a profile photo.
- Parse common resume sections:
  - Contact info
  - Education
  - Professional experience
  - Leadership and activities
  - Skills
- Recognize bullet points, including resumes where `●` appears on its own line.
- Review and edit all parsed data before export.
- Choose from three portfolio layouts:
  - Classic scrolling layout
  - Professional fixed-nav layout
  - Modern card/timeline layout
- Download a single offline-friendly HTML file with inline CSS and embedded photo data.

## Tech Stack

- Vite
- React JSX
- `pdfjs-dist@4.10.38`
- `react-dom/server` for static HTML rendering
- Static deployment target such as Cloudflare Pages

## Project Structure

```text
portfolio-generator/
  index.html
  package.json
  vite.config.js
  public/
    pdf.worker.min.mjs
  src/
    main.jsx
    App.jsx
    App.css
    components/
      Uploader.jsx
      DataEditor.jsx
      LayoutPicker.jsx
    lib/
      pdfParser.js
      exportPortfolio.jsx
    templates/
      ScrollingTemplate.jsx
      NavTemplate.jsx
      CardTemplate.jsx
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

The package scripts copy the PDF.js worker into `public/pdf.worker.min.mjs` before dev/build and after install.

## Usage

1. Upload a resume PDF.
2. Upload an optional photo.
3. Click `Parse Resume`.
4. Review and correct the extracted fields.
5. Choose a portfolio layout.
6. Download the generated HTML file.

The downloaded file is self-contained and can be opened directly in a browser.

## Resume Parsing Notes

The parser is heuristic-based, so the edit step is part of the intended workflow. It is designed for common text-based resumes with section headers such as:

- `EDUCATION`
- `EXPERIENCE`
- `PROFESSIONAL EXPERIENCE`
- `PROFESSIONAL EXPERIENCES`
- `LEADERSHIP & ACTIVITIES`
- `SKILLS`

Scanned image PDFs are not supported. If PDF.js extracts too little text, the app shows an error and asks for a text-based PDF.

## Deployment

This app can be deployed as static files.

For Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`

Make sure `dist/` includes `pdf.worker.min.mjs` after building.

## Privacy

Resume PDFs and photos never leave the browser. The app does not upload files to a server.
