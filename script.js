const { available, learning, testimonials, roles, stats, skills, experience, projects, github, email } = DATA;
const $ = id => document.getElementById(id);
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const tagList = a => a.map(t => `<span class="tag">${esc(t)}</span>`).join("");

// ----- Theme (remembers choice, follows system by default) -----
const root = document.documentElement;
const saved = localStorage.getItem("theme");
const setTheme = t => { root.dataset.theme = t; $("theme").innerHTML = `<i class="bi bi-${t === "dark" ? "sun" : "moon"}"></i>`; };
setTheme(saved || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
$("theme").onclick = () => { const t = root.dataset.theme === "dark" ? "light" : "dark"; localStorage.setItem("theme", t); setTheme(t); };

// ----- Build content from data.js -----
$("facts-grid").innerHTML = stats.map(s => `<div><strong data-to="${s.value}" data-dec="${s.decimals || 0}" data-suf="${s.suffix || ""}">0</strong><span>${esc(s.label)}</span></div>`).join("");
$("skills-grid").innerHTML = skills.map(s => `<div class="col-6 col-lg-4"><div class="skill"><div class="skill-top"><span>${esc(s.name)}</span><b>${s.level}%</b></div><div class="bar"><i data-level="${s.level}" style="--w:${s.level}%"></i></div></div></div>`).join("");
$("exp-list").innerHTML = experience.map(e => `<li><span class="years">${esc(e.when)}</span><h3>${esc(e.title)}</h3><p>${esc(e.where)}</p><p>${esc(e.text)}</p>${e.link ? `<a class="more" href="${esc(e.link)}" target="_blank" rel="noopener">View certificate <i class="bi bi-box-arrow-up-right"></i></a>` : ""}</li>`).join("");
$("projects-grid").innerHTML = projects.map((p, i) => `<div class="col-md-6 col-lg-4 pj" data-cat="${esc(p.category)}"><div class="project-card" data-i="${i}" tabindex="0" role="button">${p.image ? `<img class="pimg" src="${esc(p.image)}" alt="Screenshot of ${esc(p.title)}" loading="lazy">` : ""}<h3>${esc(p.title)} <i class="bi bi-arrow-up-right"></i></h3><div>${tagList(p.tools)}</div><p>${esc(p.text)}</p></div></div>`).join("");

// ----- Availability, learning strip, testimonials -----
$("avail").innerHTML = available ? `<span class="dot"></span>${esc(available)}` : "";
$("learning").innerHTML = learning.length ? `Currently learning: ${tagList(learning)}` : "";
$("quotes").innerHTML = testimonials.map(q => `<div class="col-md-6"><figure class="quote"><blockquote>${esc(q.text)}</blockquote><figcaption><b>${esc(q.name)}</b><span>${esc(q.role)}</span></figcaption></figure></div>`).join("");
$("testimonials").hidden = !testimonials.length;

// ----- Project filter -----
const cats = ["All", ...new Set(projects.map(p => p.category))];
$("filters").innerHTML = cats.map((c, i) => `<button class="${i ? "" : "on"}">${esc(c)}</button>`).join("");
$("filters").onclick = e => {
  if (e.target.tagName !== "BUTTON") return;
  [...$("filters").children].forEach(b => b.classList.toggle("on", b === e.target));
  document.querySelectorAll(".pj").forEach(el => el.hidden = e.target.textContent !== "All" && el.dataset.cat !== e.target.textContent);
};

// ----- Project popup -----
const modal = new bootstrap.Modal($("projModal"));
function openProject(i) {
  const p = projects[i];
  $("pm-title").textContent = p.title; $("pm-tags").innerHTML = tagList(p.tools); $("pm-text").textContent = p.details;
  $("pm-live").href = p.link || "#"; $("pm-live").hidden = !p.link; $("pm-code").href = p.code || "#"; $("pm-code").hidden = !p.code; modal.show();
}
$("projects-grid").addEventListener("click", e => { const c = e.target.closest(".project-card"); if (c) openProject(c.dataset.i); });
$("projects-grid").addEventListener("keydown", e => { if (e.key === "Enter") e.target.click(); });

// ----- Live GitHub repos -----
if (github) fetch(`https://api.github.com/users/${github}/repos?sort=updated&per_page=6`)
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(repos => {
    const list = repos.filter(r => !r.fork);
    if (!list.length) return;
    $("gh-grid").innerHTML = list.map(r => `<div class="col-md-6 col-lg-4"><a class="gh-card" href="${r.html_url}" target="_blank" rel="noopener"><b>${esc(r.name)}</b><p>${esc(r.description || "No description")}</p><small>${esc(r.language || "")} &nbsp; <i class="bi bi-star"></i> ${r.stargazers_count}</small></a></div>`).join("");
    $("gh-wrap").hidden = false;
  }).catch(() => {});

// ----- Typing effect -----
let r = 0, c = 0, del = false;
(function type() {
  const w = roles[r]; $("typed").textContent = w.slice(0, c);
  if (!del && c === w.length) { del = true; return setTimeout(type, 1400); }
  if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
  c += del ? -1 : 1; setTimeout(type, del ? 40 : 90);
})();

// ----- Scroll triggers: skill bars + number count-up -----
function count(el) {
  const to = +el.dataset.to, dec = +el.dataset.dec, t0 = performance.now();
  (function step(t) {
    const k = Math.min((t - t0) / 1200, 1);
    el.textContent = (to * k).toFixed(dec) + (k === 1 ? el.dataset.suf : ""); if (k < 1) requestAnimationFrame(step);
  })(t0);
}
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  if (e.target.dataset.level) e.target.style.width = e.target.dataset.level + "%"; else count(e.target);
  io.unobserve(e.target);
}), { threshold: 0.4 });
document.querySelectorAll(".bar i, [data-to]").forEach(el => io.observe(el));

// ----- Nav highlight, mobile menu close, back to top -----
const links = [...document.querySelectorAll(".site-nav .nav-link")];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("header[id], section[id]").forEach(s => spy.observe(s));
const menu = $("nav");
links.forEach(l => l.addEventListener("click", () => menu.classList.contains("show") && bootstrap.Collapse.getOrCreateInstance(menu).hide()));
addEventListener("scroll", () => $("toTop").classList.toggle("show", scrollY > 400));
$("toTop").onclick = () => scrollTo({ top: 0, behavior: "smooth" });
$("year").textContent = new Date().getFullYear();

// ----- Contact form (validates, then opens the visitor's email app) -----
$("contact-form").addEventListener("submit", e => {
  e.preventDefault();
  const f = [$("cname"), $("cmail"), $("cmsg")];
  f.forEach(x => x.classList.toggle("bad", !x.checkValidity()));
  if (f.some(x => !x.checkValidity())) { $("form-msg").textContent = "Please fill in every field with a valid email."; return; }
  location.href = `mailto:${email}?subject=${encodeURIComponent("Portfolio message from " + f[0].value)}&body=${encodeURIComponent(f[2].value + "\n\n" + f[1].value)}`;
  $("form-msg").textContent = "Opening your email app to send the message."; e.target.reset();
});
