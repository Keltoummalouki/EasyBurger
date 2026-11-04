# Easy Burger

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People discovering Easy Burger in Casablanca, browsing the menu, planning a visit, viewing restaurant moments, and sharing their experience.

## Product Purpose

Present the restaurant through a responsive French-first website with an interactive 3D burger, a readable menu, reviews, directions, and social links.

## Operating Context

The existing project uses Next.js App Router and React. Three.js renders the burger, GSAP connects the poster strip to scrolling, Lenis smooths scrolling, and Anime.js animates the stamp when visitors open the burger.

The visit flow offers the menu, location, opening hours, telephone, Google Maps, Instagram, and Tripadvisor. Restaurant hours use Africa/Casablanca.

## Capabilities and Constraints

- Six menu filters expose 23 transcribed entries. Prices are marked indicative.
- The moments gallery shows restaurant photographs with an accessible image viewer.
- The Google review panel displays a dated, attributed snapshot. Visitors can also publish a name, rating, and comment to the website guestbook.
- The repository's Node review endpoint stores published records in a configurable filesystem directory. Hosting this version requires persistent storage.
- The address uses Rue Ennahas Annahoui, Casablanca. The exact street number remains unresolved between listings.
- Current prices, recipe details, combo contents, and photo publication rights remain subject to restaurant confirmation.

## Brand Commitments

Easy Burger is the restaurant identity. The user confirmed a bold, playful burger-poster direction and requested a prominent 3D burger with transitions on scroll. French is the primary interface language.

## Evidence on Hand

The supplied project brief and menu drafts provide the menu, hours, contact details, brand references, and six restaurant photographs. Optimized versions of those photographs live in public/images. They require owner clearance for a public launch.

The generated hero artwork in public/burger is an original visual interpretation. The Google rating and quotation are attributed to Restaurant Guru and dated in the interface.

## Accessibility & Inclusion

The implementation includes keyboard-operable navigation and dialogs, visible focus, semantic menu text, responsive layouts, and reduced-motion behavior. The burger has a static first paint and a canvas fallback for unavailable WebGL.
