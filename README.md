# TECH ZENTRA

> Learn Technology. Build Reality.

A premium, futuristic EdTech / technology training website for **TECH ZENTRA**, an organization providing professional technology training and career-focused programs in AWS, DevOps, Full Stack Python, Full Stack Java, Data Science, Cyber Security, AI/ML, and Software Development.

## Tech Stack

- **HTML5** — semantic, accessible structure
- **CSS3** — custom dark futuristic theme, glassmorphism, neon glow, animations
- **Tailwind CSS** (CDN) — utility-first styling
- **JavaScript (ES6+)** — all interactions, animations, and dynamic content
- **GSAP + ScrollTrigger** — hero timeline, scroll-triggered reveals
- **Lenis** — smooth scrolling
- **Canvas API** — particle backgrounds and CTA network animation

No frameworks (React, Vue, Angular, Bootstrap) are used.

## Pages

This is a **multi-page application** with five pages:

| Page | File | Content |
|------|------|---------|
| Home | `index.html` | Hero, Tech Galaxy, Tech Marquee, Technology Paths, Programs Preview, Build It Terminal, Zentra Loop, Stats, CTA |
| Programs | `programs.html` | All 8 program cards, Project Showcase, CTA |
| Career | `career.html` | Career Roadmap Selector, AI Course Finder, CTA |
| About | `about.html` | Why Tech Zentra, Stats, Instructors, Student Stories, CTA |
| Contact | `contact.html` | Contact Form with validation, FAQ Terminal |

## Project Structure

```
/
├── index.html          # Home page
├── programs.html       # Programs page
├── career.html         # Career page
├── about.html          # About page
├── contact.html        # Contact page
├── css/
│   └── style.css       # Theme, animations, components
├── js/
│   └── script.js       # All interactions (page-aware)
├── assets/
│   ├── images/
│   ├── icons/
│   └── logo/
└── README.md
```

## Features

- Sticky glassmorphism navbar with scroll transition and active page highlighting
- Full-screen hero with animated "Tech Galaxy" (orbiting technology nodes + connection lines)
- Infinite technology marquee
- Interactive technology path selector with dynamic info panel
- Premium program cards with tilt, glow, and hover animations
- Auto-typing terminal animation (Build It section)
- Scroll-triggered Zentra Learning Loop
- Horizontal-scroll project showcase
- Interactive career roadmap selector with animated steps
- Animated statistics counters
- Feature blocks (Why Tech Zentra)
- Instructor cards
- Testimonial carousel (vanilla JS)
- AI Course Finder with dynamic path generation
- Terminal-style interactive FAQ
- Contact form with frontend validation (loading, success, error states)
- Particle backgrounds, cursor glow, magnetic buttons, card tilt
- Fully responsive (320px → 1440px+)
- Accessibility: semantic HTML, ARIA labels, keyboard navigation, focus states, reduced-motion support

## Notes

- Statistics numbers in the stats section are placeholders and must be replaced with verified Tech Zentra data before production.
- The contact form's `submitContactForm()` is a placeholder — integrate your backend/API there.
- All animations respect `prefers-reduced-motion`.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
