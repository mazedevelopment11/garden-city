// Garden City Properties — site.js
// Shared behaviour loaded on every page (home + project detail pages):
// sticky header, mobile nav, active nav link, reveal-on-scroll, footer hover preview.

// ---------- Sticky header ----------
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Mobile nav ----------
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  })
);

// ---------- Active nav link on scroll (only meaningful on pages with section[id]s) ----------
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link')];

if (sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) =>
          l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => sectionObserver.observe(s));
}

// ---------- Reveal on scroll ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ---------- Footer project hover preview ----------
const previewEl = document.getElementById('projectPreview');
if (previewEl) {
  const previewImg = document.getElementById('projectPreviewImg');
  const previewName = document.getElementById('projectPreviewName');
  const previewLinks = document.querySelectorAll('.project-preview-link');

  const PREVIEW_OFFSET = 18;
  const positionPreview = (e) => {
    const w = previewEl.offsetWidth;
    const h = previewEl.offsetHeight;
    let x = e.clientX + PREVIEW_OFFSET;
    let y = e.clientY + PREVIEW_OFFSET;
    if (x + w > window.innerWidth - 12) x = e.clientX - w - PREVIEW_OFFSET;
    if (y + h > window.innerHeight - 12) y = e.clientY - h - PREVIEW_OFFSET;
    previewEl.style.transform = `translate(${x}px, ${y}px)`;
  };

  previewLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      previewImg.src = link.dataset.previewImg;
      previewImg.alt = link.textContent;
      previewName.textContent = link.textContent;
      previewEl.classList.add('is-visible');
    });
    link.addEventListener('mousemove', positionPreview);
    link.addEventListener('mouseleave', () => {
      previewEl.classList.remove('is-visible');
    });
  });
}
