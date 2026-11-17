# Kyle Jess F. Salazar: Personal Portfolio

Personal portfolio website of **Kyle Jess F. Salazar**, BS Information Technology student at Cavite State University – Bacoor City Campus.

**Sections:** Home · About (with skills) · Projects & Certificates · Contact
**Featured project:** a student portal concept for CvSU Bacoor with a working front-end demo (`/demo`) and a UML use case diagram.

## Tech stack
- HTML5 (semantic sections, ARIA labels, alt text on every image)
- CSS3: custom properties, Flexbox, Grid, keyframe and scroll-reveal animations, `prefers-reduced-motion` support
- Vanilla JavaScript: mobile nav, scroll spy, lightbox (`<dialog>`), contact-form validation
- Contact form sends messages straight to Gmail through [FormSubmit](https://formsubmit.co) (free, no back end needed)
- SEO: meta description, Open Graph tags, JSON-LD `Person` schema, `sitemap.xml`, `robots.txt`, custom `404.html`
- No build step and no frameworks, so the site loads fast and runs on any static host

Brand: royal green `#0E5A36`, beige `#F5EEDD`, tan `#D2B48C`; Libre Baskerville + Inter; the "KS" diamond monogram logo; tagline *"Building systems that serve people."*

## Folder structure
```
index.html          main page
404.html            custom not-found page
css/style.css       all styles
js/main.js          interactions
demo/               student portal demo (index.html, portal.css, portal.js)
assets/img/         logo, portal screenshots, use case diagram (SVG + JPG)
assets/certs/       certificate images
favicon.svg / favicon.ico, robots.txt, sitemap.xml
```

## Deploy on GitHub Pages (free)
1. Create a GitHub account, then create a **public** repository named `YOUR-USERNAME.github.io`.
2. Upload every file and folder from this project to the repository root (Add file → Upload files), then commit.
3. Go to **Settings → Pages**. Under *Build and deployment*, set Source to **Deploy from a branch**, branch **main**, folder **/ (root)**, then save.
4. After 1–2 minutes the site is live at `https://YOUR-USERNAME.github.io`.
5. Replace `YOUR-USERNAME` in `robots.txt` and `sitemap.xml` with your GitHub username and commit again.

**Alternative (Netlify):** go to app.netlify.com/drop and drag the whole project folder in. You get a URL such as `https://kyle-salazar.netlify.app`, which you can rename in Site settings.

**Custom domain (optional):** buy a domain, add it under Settings → Pages → Custom domain, and point the DNS records to GitHub Pages. Tick *Enforce HTTPS*.

## Activate the contact form (one time only)
1. After the site is live, open it and send yourself a test message through the contact form.
2. FormSubmit emails **nudasmakylesalazar@gmail.com** with the subject "Action Required: Activate FormSubmit". Open it (check Spam too) and click **Activate Form**.
3. From then on, every message goes straight to your Gmail inbox. Press Reply in Gmail and it goes to the visitor's address.
4. Optional: the activation email also gives you a random alias such as `a1b2c3...`. Put it in `CONTACT_EMAIL` in `js/main.js` so your real address isn't visible in the page code.

## Updating the site
- **Your photo:** replace `assets/img/kyle.jpg` (keep it around 1000 px wide).
- **Email:** change it in `index.html` (contact list and footer) and in `CONTACT_EMAIL` at the top of `js/main.js`.
- **New certificate:** compress the image (max ~1400 px wide), save it in `assets/certs/`, and copy one `<article class="cert">` block.
- **New project:** copy one `<article class="project">` block in the Capstone section.

## Maintenance plan
| When | Task |
|---|---|
| Monthly | Add new or finished projects (description, role, tools, screenshots). Post capstone milestones after each defense. |
| Within a week of earning one | Upload new certificates and update the skills cards. |
| Every quarter | Run Lighthouse (Chrome DevTools) for performance, accessibility and SEO. Test on Chrome, Firefox, Safari, Edge and a phone. Fix broken links and compress large images. |
| Every semester | Proofread all text, refresh the About section, and review the design. |
| Every change | Commit with a clear message (e.g. `Add KinderLink screenshots`) and update the changelog in the "What's next on this site?" section. |

### Changelog
- **v1.0 (Nov 2026):** Initial launch with Home, About (with photo), Skills, the Student Portal demo with its use case diagram, KinderLink, CavernTrack, two certificates, a maintenance plan and Contact.

---
The student portal demo is a portfolio concept using sample data. It is not affiliated with or endorsed by Cavite State University.
