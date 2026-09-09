# Ceramica Oristano — Museo della Ceramica

Museo digitale delle ceramiche del Comune di Oristano: 25 schede d'inventario
(CO001–CO025) con 39 fotografie, 6 sale espositive, percorsi tematici,
storia dei figoli, glossario, mappa del quartiere e caccia al tesoro.

- **Live:** https://ceramica-oristano.vercel.app/
- **Repo:** https://github.com/Alftakeaway/ceramica-oristano (branch `main`)
- **Stack:** HTML + CSS + JS vanilla, Leaflet 1.9.4 (mappa, CDN),
  Google Fonts (Cormorant Garamond + EB Garamond). Nessuna build, nessun framework.

## Struttura

| File | Ruolo |
|------|-------|
| `index.html` | Tutta la pagina: testata, hero, percorsi, sale, oggetti, storia, glossario, progetto, biblio, gioco, mappa, footer, modali |
| `catalog.js` | Dati: `window.CATALOGO` con 6 categorie + 25 oggetti (titolo, codice COxxx, foto, trascrizione d'inventario, descrizione, dettagli) |
| `app.js` | Logica: ricerca, filtri (sala/raccolta/tipo), carousel sale, schede modali, lightbox foto, mappa Leaflet, tooltip glossario, conteggi |
| `styles.css` | Tema chiaro "pergamena calda" + gradiente arancione-terracotta/grigio; responsive + CSS di stampa |
| `assets/` | 39 foto oggetti (`*.jpg`), `logo_museo.jpg`, `logo-museo-icon.png` (brand + favicon) |
| `robots.txt` / `sitemap.xml` | SEO |
| `CONTENUTI.md` | Tutti i testi del sito in un unico file |

## Aggiornare il catalogo

1. **Nuova scheda:** aggiungi un oggetto all'array `oggetti` in `catalog.js`
   (`id`, `titolo`, `categoria`, `codice` COxxx, `foto`, `info` con
   `inventario/oggetto/soggetto/materia/data_ingresso/autore/descrizione/dettagli`).
2. **Nuove foto:** mettile in `assets/` (max 1600px lato lungo),
   elencale nell'array `foto` della scheda.
3. **Nuova sala:** aggiungi una voce a `categorie` in `catalog.js`.
4. JSON-LD, sitemap e conteggi footer si aggiornano a mano.

Hook JS da non rompere: `#q #filtroCat #filtroRac #filtroTipo #gridCat
#gridObj #scheda #modal #lightbox #mappa #stats #conteggio #chips
.car .obj .chip .btn .badge .cod`.

## Deploy

Push su `main` → Vercel ridistribuisce in automatico:

```powershell
git add -A && git commit -m "msg" && git push origin main
```

Verifica live su https://ceramica-oristano.vercel.app/ (niente anteprime locali).

## Crediti

- Fotografie e collezioni — Comune di Oristano
- Ricerca, testi e webmaster — Alfredo Forte
- Registro: coll. etnografica Gavino Clemente (ingresso 1911),
  Loria / Musei di Milano (1908), inv. 5206–5343
