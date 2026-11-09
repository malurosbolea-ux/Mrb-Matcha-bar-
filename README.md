# MRB Matcha Bar

**A scroll-driven website concept for a fictional matcha, coffee, tea and milkshake bar in Malasaña, Madrid.**

[Live demo](https://malurosbolea-ux.github.io/Mrb-Matcha-bar-/) · [Portfolio](https://malurosbolea-ux.github.io/digital-strategy-portfolio/) · [LinkedIn](https://www.linkedin.com/in/marialuisarosbolea/)

---

## Overview

MRB Matcha Bar is a portfolio project that explores how a small food and drink brand can turn a website into an experience rather than a brochure. Visitors scroll to watch a drink being built layer by layer, whisk their own matcha, design a custom drink, follow a delivery rider across a map, and then order or book a table in a few taps.

The site is fully static, works on desktop and mobile, and is bilingual: English by default, with Spanish available from the header.

> MRB is a concept brand created for this portfolio. No payments are taken, no orders are delivered and no tables are reserved.

## Highlights

**Brand and art direction**
- Retro Japanese kiosk identity: striped awning, hand-drawn signage, torn-paper section transitions and bold embossed headlines.
- Original circular stamp logo with the 抹茶 (matcha) kanji and rotating ring text.
- Pastel palette of matcha green, strawberry pink, butter yellow and sky blue.

**Scroll storytelling**
- **Ninety seconds, zero shortcuts.** A pinned sequence builds a Matcha Boba Float step by step (boba, milk, marbled matcha, gelato scoop, matcha dust and straw), with a live timer, then reveals the real product photo.
- **Real drinks, real slurps.** A fan of phone-style frames playing short product videos as they come into view.
- **Make a splash.** Four signature shakes drop in one by one with a splash burst, a colour change and an add-to-bag button.
- **Cold at your door in 30.** A delivery scooter rides the route on a stylised map while the ETA counts down and the delivery zones light up.

**Interaction**
- Opening curtain (noren) with the choice to enter with sound or quietly.
- Matcha whisking mini-game: drag over the bowl until the froth meter hits 100%.
- Drink lab: choose base, milk, topping, extras, sweetness and size, with a live preview and real-time pricing.
- Sound design generated in the browser with the Web Audio API (ice, pouring, whisking, bells, café ambience), with no audio files.

**Ordering and booking**
- **Menu (`menu.html`).** 15 products, every one shown with a real photo. Regular or large sizes (the glass grows when you pick large), cart, delivery or pick-up, tip, free-delivery threshold and an animated order tracker.
- **Reservations (`reserve.html`).** Choose the counter, tatami room or lantern terrace, then party size, date and time. The booking ends with a digital ticket and an `.ics` file for your calendar.

## Tech stack

| Area | Tools |
| --- | --- |
| Markup and styling | Semantic HTML5, modern CSS (custom properties, grid, sticky positioning, `clamp()`) |
| Logic | Vanilla JavaScript (no framework, no build step) |
| Motion | GSAP + ScrollTrigger, Lenis smooth scroll, Web Animations API |
| Graphics | Inline SVG illustration system generated in JavaScript, canvas for the whisk game |
| Audio | Web Audio API (synthesised sound effects) |
| State | `localStorage` for cart, language and sound preferences |
| Media | WebP images and H.264 video, compressed for fast loading (about 5 MB in total) |
| Hosting | GitHub Pages |

## Accessibility and performance

- Respects `prefers-reduced-motion`: scroll animations are simplified for users who ask for less motion.
- Keyboard-friendly controls, visible focus states, descriptive alt text and ARIA labels.
- Videos are muted, play only while visible and pause off-screen.
- Animation loops run only while their section is on screen.
- Self-hosted fonts and libraries: no external requests at runtime.

## Project structure

All files sit at the root of the repository so the site can be uploaded and published without folders.

```
index.html      Home: intro, scroll build, video reel, whisk game, drinks, shake bar, drink lab, delivery, visit
menu.html       Full menu, cart and checkout
reserve.html    Table reservations
mrb.css         Design system and all page styles
mrb.js          Shared core: language, sound, cart, navigation, illustrations
home.js         Home page scenes and interactions
pages.js        Menu and reservation logic
data.js         Menu data (names, descriptions, prices, photos)
*.webp *.mp4    Product photography and video
*.woff2         Self-hosted fonts (Dela Gothic One, DM Sans, DM Mono, Shrikhand)
```

## Run locally

No installation needed. Serve the folder with any static server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Credits

Concept, art direction, copywriting and development by **María Luisa Ros Bolea**.

Product photography and video were supplied by the author or generated with AI in Canva for this concept. The illustrations, logo and signage were designed specifically for this project.

© 2026 María Luisa Ros Bolea. All rights reserved.
