# ISO 42001 Document Browser

The original HTML application converted to Next.js App Router, React, and plain JavaScript. All 153 documents, 152 guidance entries, 10 categories, clause groups, and 13 embedded previews are preserved. The original HTML remains available as a reference.

## Run locally

Use Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Production

```sh
npm run build
npm start
```

## Verify migrated content

```sh
npm test
```

## Project files

- `app/page.js`: home route.
- `app/layout.js`: document metadata and root layout.
- `app/globals.css`: original styling plus responsive adjustments.
- `components/DocumentBrowser.js`: React state, navigation, filtering, cards, and keyboard navigation.
- `components/DocumentDetail.js`: descriptions, guidance, filename copying, and related documents.
- `components/DocumentPreview.js`: accessible modal for document and slide previews.
- `lib/data.js`: original document catalog and embedded content.
- `lib/documents.js`: clause matching and related document ranking.

Search by ID, title, clause, or description. Filter by category, clause, Word, Excel, or PowerPoint. Use arrow keys to navigate cards, Enter to open details, and Escape to close previews or details.

The source supplies document filenames and HTML recreations of selected previews; it does not include actual Word, Excel, or PowerPoint files. Preview markup is trusted bundled content, not user input. No download backend or document editing service is included.

## Browser checks

After building, run `npm run test:e2e`. The browser tests cover search, category and clause filters, filename copying, document and slide previews, Escape behavior, and mobile details. They use Chrome at `/usr/bin/google-chrome`; set `CHROME_PATH` to your local Chrome executable if needed.
