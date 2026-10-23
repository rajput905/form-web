# Contact Form with JavaScript Validation

A polished contact form with real-time client-side validation, animated feedback states, a loading spinner, and a live character counter. Built with vanilla HTML, CSS and JavaScript.

## Features

- Four fields: Full name, Email, Phone (optional), and Message
- Field-level validation rules (min length, regex patterns, character limits)
- Validates on blur; re-validates live once a field is flagged invalid
- Live character counter (0 / 500) with colour warnings near the limit
- Shake animation on invalid fields during submission
- Submit button shows a CSS spinner during simulated send, turns green on success
- Inline error messages with `aria-live="polite"` for screen readers
- Centred card layout with decorative blurred gradient background shapes
- Entrance animation on page load
- `prefers-reduced-motion` support

## Tech Stack

- HTML5 (semantic elements, ARIA attributes)
- CSS3 (Grid, custom properties, keyframe animations, transitions)
- JavaScript (IIFE, FormData, RegExp, DOM manipulation)
- Google Fonts: Fraunces, Inter

## Files

| File | Purpose |
| :--- | :--- |
| `index.html` | Form structure and accessible markup |
| `style.css` | Card layout, field states, animations |
| `script.js` | Validation rules, live feedback, submit flow |

## Run Locally

Open `index.html` in any browser.
