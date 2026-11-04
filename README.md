# Easy Burger Casablanca

A French-first restaurant site built with Next.js. Three.js renders the five textured layers of the Double Easy, GSAP connects the poster strip to scrolling, Lenis smooths wheel input, and Anime.js animates the stamp when the burger opens. The scene includes a photographic first paint, a canvas fallback and reduced-motion support.

## Run locally

```sh
npm ci
npm run dev
```

Open the local address printed by Next.js. Use `npm run build` and `npm start` for a production Node server.

## Reviews

The Google panel presents an attributed review and a dated rating snapshot. Guest reviews go through `/api/reviews`. The Node server stores each review in `.easyburger-data/reviews/`. Set `EASYBURGER_REVIEWS_DIR` to a persistent volume when hosting the Node version. The private Sites build uses Cloudflare D1.

## Restaurant content

Menu categories, prices, opening hours and venue links are in `app/Details.tsx`. Prices come from the supplied draft and are marked indicative. The gallery photographs come from the restaurant brief and require owner clearance for a public launch. The interactive hero is an original visual interpretation.
