/* ==========================================================================
   Portfolio — Havin Fahru
   Render card project + lazy load (IntersectionObserver) + GSAP animasi
   + modal detail project. Vanilla ES6+, tanpa dependency selain GSAP CDN.
   ========================================================================== */

/* ------------------------------------------------------------------
   Data project — satu-satunya tempat yang perlu diedit untuk
   menambah/mengubah project. `video` dan `thumb` path relatif
   terhadap index.html.
   ------------------------------------------------------------------ */
const projects = [
  {
    slug: 'sipur',
    title: 'Sistem Informasi Peminjaman Ruangan',
    desc: 'Sistem informasi yang digunakan untuk melakukan peminjaman ruangan yang sebelumnya dilakukan secara manual.',
    tags: ['PHP', 'MySQL', 'Bootstrap'],
    thumb: 'assets/img/portfolio/app1.png',
    video: 'assets/media/sipur.mp4',
    kategori: 'Sistem Informasi',
    klien: 'Bank BPD DIY',
    link: '#',
  },
  {
    slug: 'simak',
    title: 'Sistem Informasi Manajemen Kontrak',
    desc: 'Sistem informasi yang digunakan untuk memudahkan dalam melakukan manajemen kontrak dari aset yang dimiliki.',
    tags: ['PHP', 'MySQL', 'Bootstrap'],
    thumb: 'assets/img/portfolio/app2.png',
    video: 'assets/media/simak.mp4',
    kategori: 'Sistem Informasi',
    klien: 'Bank BPD DIY',
    link: '#',
  },
  {
    slug: 'alfabeta',
    title: 'Game Alfabeta',
    desc: 'Game belajar membaca sebagai media pembelajaran anak SD. Selain bermain, anak juga dapat belajar dari materi yang tersedia.',
    tags: ['JavaScript', 'HTML5', 'Game'],
    thumb: 'assets/img/portfolio/app3.png',
    video: 'assets/media/alfabeta.mp4',
    kategori: 'Game',
    klien: 'Dosen PGSD Universitas Ahmad Dahlan',
    link: '#',
  },
  {
    slug: 'tourguide',
    title: 'Aplikasi Tour Guide',
    desc: 'Aplikasi web berbasis Augmented Reality untuk memudahkan mencari lokasi di kampus 4 Universitas Ahmad Dahlan.',
    tags: ['AR', 'JavaScript', 'Web App'],
    thumb: 'assets/img/portfolio/app4.png',
    video: 'assets/media/tourguide.mp4',
    kategori: 'Aplikasi',
    klien: 'Mahasiswa Universitas Ahmad Dahlan',
    link: '#',
  },
];

/* ------------------------------------------------------------------
   Konstanta & preferensi
   ------------------------------------------------------------------ */
const INITIAL_BATCH = 6; // card yang dirender saat load
const BATCH_SIZE = 3;    // ukuran batch tambahan saat sentinel terlihat

const motionOK =
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  !!window.gsap;

if (motionOK && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

const canReveal = motionOK && !!window.ScrollTrigger;

/* ------------------------------------------------------------------
   Render card portfolio + lazy batch via IntersectionObserver
   ------------------------------------------------------------------ */
const grid = document.getElementById('portfolio-grid');
const sentinel = document.getElementById('portfolio-sentinel');
let rendered = 0;

function createCard(p) {
  const card = document.createElement('article');
  card.className = 'project-card';

  const img = document.createElement('img');
  img.src = p.thumb;
  img.alt = `Screenshot ${p.title}`;
  img.loading = 'lazy'; // WAJIB: lazy load native untuk semua gambar card
  card.appendChild(img);

  const body = document.createElement('div');
  body.className = 'card-body';

  const h3 = document.createElement('h3');
  h3.textContent = p.title;

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = p.desc;

  const tags = document.createElement('ul');
  tags.className = 'tags';
  p.tags.forEach((t) => {
    const li = document.createElement('li');
    li.className = 'tag';
    li.textContent = t;
    tags.appendChild(li);
  });

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const detailBtn = document.createElement('button');
  detailBtn.type = 'button';
  detailBtn.className = 'btn-detail';
  detailBtn.dataset.slug = p.slug;
  detailBtn.textContent = 'Detail';
  actions.appendChild(detailBtn);

  if (p.link && p.link !== '#') {
    const link = document.createElement('a');
    link.className = 'card-link';
    link.href = p.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Demo / Repo';
    actions.appendChild(link);
  }

  body.append(h3, desc, tags, actions);
  card.appendChild(body);
  return card;
}

/* Reveal per elemen: fade+slide up saat masuk viewport (bukan per section). */
function addReveal(el) {
  if (!canReveal) return;
  gsap.from(el, {
    y: 24,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%' },
  });
}

function renderNext(count) {
  const batch = projects.slice(rendered, rendered + count);
  if (!batch.length) return;
  const frag = document.createDocumentFragment();
  batch.forEach((p) => {
    const card = createCard(p);
    frag.appendChild(card);
    addReveal(card);
  });
  grid.appendChild(frag);
  rendered += batch.length;
  if (canReveal) ScrollTrigger.refresh();
}

// Render batch awal (maksimal INITIAL_BATCH card saat load).
renderNext(INITIAL_BATCH);

// Sisanya di-append per BATCH_SIZE saat sentinel mendekati viewport.
if (rendered < projects.length) {
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      renderNext(BATCH_SIZE);
      if (rendered >= projects.length) io.disconnect();
    },
    { rootMargin: '0px 0px 400px 0px' }
  );
  io.observe(sentinel);
}

/* ------------------------------------------------------------------
   Modal detail project (video + deskripsi), deep-link #project-{slug}
   ------------------------------------------------------------------ */
const modal = document.getElementById('project-modal');
const modalVideo = document.getElementById('modal-video');
const modalTitle = document.getElementById('modal-title');
const modalKategori = document.getElementById('modal-kategori');
const modalKlien = document.getElementById('modal-klien');
const modalDesc = document.getElementById('modal-desc');
let lastFocused = null;

function findProject(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

function openModal(slug) {
  const p = findProject(slug);
  if (!p) return;
  lastFocused = document.activeElement;

  modalTitle.textContent = p.title;
  modalKategori.textContent = p.kategori;
  modalKlien.textContent = p.klien;
  modalDesc.textContent = p.desc;
  // Video baru dipasang saat modal dibuka (preload none) — mp4 tidak
  // ter-download sampai user benar-benar membuka detail.
  modalVideo.src = p.video;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  history.pushState(null, '', `#project-${p.slug}`);
  modal.querySelector('.modal-close').focus();
}

function closeModal() {
  modalVideo.pause();
  modalVideo.removeAttribute('src');
  modalVideo.load();
  modal.hidden = true;
  document.body.style.overflow = '';
  history.replaceState(null, '', window.location.pathname + window.location.search);
  if (lastFocused) lastFocused.focus();
}

grid.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-detail');
  if (btn) openModal(btn.dataset.slug);
});

modal.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

window.addEventListener('popstate', () => {
  if (!modal.hidden) {
    closeModal();
  } else {
    const slug = slugFromHash();
    if (slug) openModal(slug);
  }
});

function slugFromHash() {
  const m = window.location.hash.match(/^#project-(.+)$/);
  return m ? m[1] : null;
}

// Deep-link saat load: index.html#project-sipur langsung buka modal.
if (slugFromHash()) openModal(slugFromHash());

/* ------------------------------------------------------------------
   Animasi Hero — GSAP timeline, sekali saat page load
   ------------------------------------------------------------------ */
if (motionOK) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('#hero-eyebrow', { y: 24, opacity: 0, duration: 0.5 })
    .from('#hero-name', { y: 36, opacity: 0, duration: 0.7 }, '-=0.2')
    .from('#hero-role', { y: 24, opacity: 0, duration: 0.5 }, '-=0.35')
    .from('#hero-desc', { y: 24, opacity: 0, duration: 0.5 }, '-=0.3')
    .from('#hero-photo', { scale: 0.92, opacity: 0, duration: 0.7 }, '-=0.4');
}

/* ------------------------------------------------------------------
   Reveal item About (pendidikan & pengalaman) — ScrollTrigger per item
   ------------------------------------------------------------------ */
document.querySelectorAll('#about .reveal').forEach(addReveal);

/* ------------------------------------------------------------------
   Nav: background blur saat scroll + tombol kembali ke atas (fixed)
   ------------------------------------------------------------------ */
const nav = document.getElementById('nav');
const backToTop = document.getElementById('back-to-top');
function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 24);
  backToTop.classList.toggle('visible', window.scrollY > 400);
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

backToTop.addEventListener('click', () => {
  document.getElementById('home').scrollIntoView({
    behavior: motionOK ? 'smooth' : 'auto',
  });
});
