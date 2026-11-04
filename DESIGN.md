---
name: Easy Burger
description: A bold, playful burger poster for Easy Burger in Casablanca.
colors:
  orange: "#fe4c1e"
  paper: "#f6f2e7"
  ink: "#191715"
  burnt-orange: "#b8330e"
  stamp-yellow: "#ffde55"
  muted: "#62594f"
  rule: "#c8c1b4"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(6.2rem, 9.9vw, 11.2rem)"
    fontWeight: 900
    lineHeight: 0.805
    letterSpacing: "-0.044em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(4.6rem, 8.5vw, 9rem)"
    fontWeight: 800
    lineHeight: 0.87
    letterSpacing: "-0.035em"
  body:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  handwritten:
    fontFamily: "Permanent Marker, cursive"
    fontSize: "clamp(1.2rem, 1.8vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.2
rounded:
  pill: "100px"
  field: "6px"
  dialog: "12px"
spacing:
  section: "clamp(64px, 8vw, 120px)"
  mobile-gutter: "20px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  button-social:
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "12px 18px"
  filter-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "8px clamp(12px, 1.65vw, 26px)"
  input:
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0.65rem 0.8rem"
---

# Easy Burger Design System

## Overview

The chosen direction is a bold, playful burger poster. Large condensed lettering, vivid orange, a floating burger, a yellow stamp, and a handwritten annotation establish its character. Warm paper and aligned menu rows carry the practical information.

This records the implemented system. The hero uses generated artwork, while the restaurant gallery uses photographs supplied in the brief.

## Colors

Orange anchors the header, hero, footer, and headline punctuation. Paper supports the menu, reviews, and visit sections. Ink provides text, buttons, the poster strip, and the gallery background.

Burnt orange supports smaller accents and review controls. Stamp yellow appears in the hero seal and text selection. Muted text and fine rules organize supporting details.

## Typography

Barlow Condensed supplies uppercase display and section headings. DM Sans carries navigation, body copy, forms, and supporting information. Permanent Marker is reserved for the hero's handwritten burger annotation. Fonts are self-hosted through installed Fontsource packages.

Menu names and prices use condensed type with aligned tabular numbers. The largest lettering belongs to the hero and footer. Mobile styles reduce headline sizes and allow the surrounding content to stack.

## Layout

The main desktop content width is 88%, capped at 1440px. The hero pairs copy with the burger in a 44%/56% split. The menu pairs photography with text. The gallery uses three differently sized columns with staggered starting positions.

At 900px, the header and hero container widen and visit information becomes two columns. The menu stacks below 720px, mobile navigation appears below 660px, and reviews stack below 620px. At 480px, visit details become one column. Most mobile content keeps a 20px side gutter.

## Elevation & Depth

Flat color surfaces, thin rules, and contrasting sections define the page. The burger supplies the main depth through textured geometry, subtle pointer movement, and separating ingredients. Dialog backdrops dim the page. The yellow stamp carries a small downward drop shadow.

## Shapes

Buttons and menu filters are rounded pills. Photographs have straight edges. Review fields have gently rounded corners, and the review dialog has a larger corner radius. Circular controls close or expand imagery. The starburst seal is the hero's distinctive graphic shape.

## Components

- Primary actions use ink and paper, bold labels, and compact inline arrow icons. Navigation links underline on hover.
- Menu filters wrap on small screens. The selected category becomes an ink pill. Item rows preserve clear price alignment.
- Gallery images open a native dialog with previous, next, and close controls. Fine-pointer hover scales an image slightly.
- Google and website reviews use separate source controls. The review form presents a name field, star radios, a comment field, and explicit loading or error feedback.
- Mobile navigation opens beneath the header and dismisses through a link, outside click, or Escape.
- The burger opens with scrolling or its dedicated control. Lenis and GSAP coordinate scrolling, while Anime.js gives the stamp a short response to the control. Reduced motion removes scroll-driven and pointer movement and makes the layer change immediate.

## Do's and Don'ts

- Do preserve the confirmed poster character and the distinction between display lettering and readable details.
- Do retain visible keyboard focus, responsive reflow, and reduced-motion behavior.
- Do keep restaurant photographs and generated hero artwork identifiable in project records.
- Don't present indicative prices, a dated review snapshot, or generated imagery as newly verified restaurant facts.
