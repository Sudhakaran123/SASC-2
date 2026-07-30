# SASC Infra Solution — Website

A single-file static website (`index.html`) plus `sitemap.xml` and `robots.txt` for SEO.

## Hosting on GitHub Pages (free)

1. **Create a repository**
   - Go to github.com → New repository.
   - Name it anything, e.g. `sasc-website` (or `<yourusername>.github.io` if you want it at the root of your GitHub domain).
   - Make it Public. Don't add a README (you already have one).

2. **Upload the files**
   - Open the new repo → "Add file" → "Upload files".
   - Drag in `index.html`, `sitemap.xml`, and `robots.txt`.
   - Commit directly to the `main` branch.

3. **Enable GitHub Pages**
   - In the repo, go to **Settings → Pages**.
   - Under "Build and deployment", set **Source** to `Deploy from a branch`.
   - Branch: `main`, folder: `/ (root)`. Save.
   - GitHub will give you a URL like `https://<yourusername>.github.io/sasc-website/` within a minute or two.

4. **(Optional) Custom domain**
   - If you own a domain (e.g. `sascinfra.com`), go to **Settings → Pages → Custom domain**, enter it, and add the DNS records GitHub shows you (a `CNAME` record pointing to `<yourusername>.github.io`, or `A` records for an apex domain).
   - Update `sitemap.xml`, `robots.txt`, and the `<meta>`/schema tags in `index.html` to match your real domain once you have one.

## What works out of the box once hosted

- All pages, navigation, animations, dark mode, WhatsApp button — fully static, no setup needed.
- **Contact form** and **career application form**: since GitHub Pages can't run backend code, submitting either form opens the visitor's own email app with the message pre-filled to `info@sascinfra.com` or `careers@sascinfra.com`. They just hit send. This works with zero configuration.
- **Admin panel** (`/#admin`, code `sasc-admin`): lets you edit services, projects, testimonials, blog posts, careers, and see form submissions — but this data is saved in **that browser's local storage only**. It won't sync across visitors or devices, and clearing browser data erases it.

## If you want a real shared CMS or working contact-form inbox later

Two common low-effort upgrades:
- Swap the contact/career forms to a service like **Formspree** or **Getform** (free tiers exist) — you just point the form's action at their endpoint and submissions land in your inbox without opening the visitor's email app.
- Replace the local-storage admin panel with a small hosted backend (Node/Express + a database) if you want multiple staff to edit content from different devices.

Happy to wire either of these in if you'd like.
