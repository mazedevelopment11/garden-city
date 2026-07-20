// Garden City Properties — main.js

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

// ---------- Active nav link on scroll ----------
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link')];

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

// ---------- Hero slider ----------
const slides = [...document.querySelectorAll('.hero-slide')];
let slideIndex = 0;
setInterval(() => {
  slides[slideIndex].classList.remove('is-active');
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add('is-active');
}, 6000);

// ---------- Projects carousel (continuous marquee) ----------
const carousel = document.getElementById('projectsCarousel');
const track = document.getElementById('carouselTrack');
const originals = [...track.children];

// clone the full set once so the loop wraps seamlessly
originals.forEach((card) => {
  const clone = card.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);
});

const MARQUEE_SPEED = 35; // px per second
const NUDGE_SPEED = 1400; // px per second when arrows are used

let offset = 0;
let nudgeRemaining = 0; // signed distance still to travel from arrow clicks
let hovered = false;
let dragging = false;

const gapPx = () => parseFloat(getComputedStyle(track).gap) || 0;
const stepPx = () => originals[0].getBoundingClientRect().width + gapPx();
const setWidth = () => stepPx() * originals.length;

const wrap = (x) => {
  const w = setWidth();
  return ((x % w) + w) % w;
};

const applyOffset = () => {
  track.style.transform = `translateX(${-offset}px)`;
};

let lastFrame = performance.now();
const frame = (now) => {
  const dt = Math.min(now - lastFrame, 50) / 1000; // clamp tab-switch jumps
  lastFrame = now;
  if (!dragging) {
    let dx = hovered ? 0 : MARQUEE_SPEED * dt;
    if (nudgeRemaining !== 0) {
      const move = Math.sign(nudgeRemaining) * Math.min(Math.abs(nudgeRemaining), NUDGE_SPEED * dt);
      dx += move;
      nudgeRemaining -= move;
    }
    if (dx !== 0) {
      offset = wrap(offset + dx);
      applyOffset();
    }
  }
  requestAnimationFrame(frame);
};
requestAnimationFrame(frame);

document.getElementById('carouselPrev').addEventListener('click', () => { nudgeRemaining -= stepPx(); });
document.getElementById('carouselNext').addEventListener('click', () => { nudgeRemaining += stepPx(); });

carousel.addEventListener('mouseenter', () => { hovered = true; });
carousel.addEventListener('mouseleave', () => { hovered = false; });

// drag / swipe
let dragStartX = 0;
let dragStartOffset = 0;

track.addEventListener('pointerdown', (e) => {
  dragging = true;
  dragStartX = e.clientX;
  dragStartOffset = offset;
  nudgeRemaining = 0;
});
window.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  offset = wrap(dragStartOffset - (e.clientX - dragStartX));
  applyOffset();
});
window.addEventListener('pointerup', () => { dragging = false; });
track.addEventListener('dragstart', (e) => e.preventDefault());

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

// ---------- Animated counters ----------
const animateCount = (el) => {
  const target = Number(el.dataset.count);
  const duration = 1600;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

// ---------- Contact form ----------
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  if (!name || !phone) {
    formNote.textContent = 'Please enter your name and phone number.';
    formNote.style.color = '#b0563c';
    return;
  }
  formNote.textContent = `Thank you, ${name}! Our advisors will contact you shortly.`;
  formNote.style.color = 'rgb(9, 94, 83)';
  form.reset();
});
