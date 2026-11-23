# SR's Consultancy website

## Files
- `index.html` — updated homepage
- `style.css` — responsive styling and reduced vertical spacing
- `script.js` — mobile navigation, reveal effects, scroll progress, clock, copy-email and enquiry form

## Add your existing assets
Copy your existing `images/` folder beside these files. The page expects:
- `images/portrait.webp`
- `images/hostel-management.webp`
- `images/hr-management.webp`
- `images/college-management.webp`
- `share.jpg` at the site root (for social previews)

No CV file is included or required.

## Publish
Upload `index.html`, `style.css`, `script.js`, your `images/` folder and `share.jpg` (if available) to the same hosting directory.


## SEO, local GEO and answer-engine readiness
- `llms.txt` provides a concise, factual overview for AI assistants and other systems that choose to read it.
- `robots.txt` allows standard crawlers to access public pages.
- `index.html` includes page metadata, social preview metadata, Person/ProfessionalService/WebSite/FAQ structured data, and clear Bhubaneswar, Odisha location context.
- Canonical URL, `og:url`, absolute social images, JSON-LD ids and `sitemap.xml` are set for https://smruti030.github.io/ — the repo must be named `smruti030.github.io`.
- After publishing, verify with Google Search Console and the Rich Results Test. Structured data does not guarantee rich results or AI citations.


## Anthropic / Claude crawler settings
- `Claude-SearchBot` is explicitly allowed to crawl public pages for Claude search discovery.
- `Claude-User` is explicitly allowed to retrieve public pages when a Claude user asks about them.
- `ClaudeBot` is explicitly disallowed. This separates Claude search/retrieval access from Anthropic's model-training crawler.
- These rules are in the root `robots.txt`. They express crawler preferences; they do not guarantee indexing, citations, rankings or traffic.


## Selected Work update
- College Management System now occupies the third Selected Work position.
- Digital Exam Registration has moved into the More Systems horizontal carousel.

The College Management System Selected Work card now uses the dashboard screenshot supplied for this update.
