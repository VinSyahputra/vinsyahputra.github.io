# PRD 01 — Redesign Portofolio & Animation on Scroll

> **Status:** Done<br>
> **Diselesaikan:** 21 September 2026 — sesi `steady-oak-43` (`./tmp/steady-oak-43`), task 7/7, review 0/0, runner `opencode`, git user havin fahru <havindi.fahru@tonjoo.com><br>
> **Tanggal:** 21 September 2026<br>
> **Cakupan:** Redesign tampilan `index.html` dan `portfolio-details.html` dengan identitas visual baru, plus sistem animation on scroll memakai GSAP + ScrollTrigger, memakai aset yang sudah ada.<br>
> **Prasyarat:** Situs berjalan hari ini sebagai GitHub Pages statis (repo `VinSyahputra/vinsyahputra.github.io`) berbasis template BootstrapMade **Folio v4.10.0**, **tanpa build step** — tidak ada `package.json`, tidak ada bundler, semua library disimpan lokal di `assets/vendor/`. Dokumen ini bebas mengubah apa pun yang sudah ada di kode kalau desain di bawah menuntutnya.

---

## 1. Ringkasan

Portofolio saat ini memakai tampilan template Folio apa adanya: latar putih dengan teks abu (`assets/css/style.css:11`), aksen beige `#c6b398`, tipografi Playfair Display + Poppins, dan hero berupa foto penuh tanpa overlay sehingga teks putih di atasnya berisiko sulit dibaca (`assets/css/style.css:450`, `:465`).

Dokumen ini menetapkan arah redesign **identitas visual baru** (dark, modern, berorientasi developer) dan **sistem animasi scroll** berbasis **GSAP + ScrollTrigger**, dengan tetap mempertahankan arsitektur statis tanpa build dan seluruh aset yang sudah dimiliki. Satu sisa atribut `data-aos="fade-up"` di `index.html:102` (librarynya tidak pernah dipasang) ditetapkan digantikan oleh pendekatan GSAP ini.

Hasil yang dituju: portofolio yang tampak lebih profesional dan hidup, teks selalu terbaca, animasi yang halus dan tidak mengganggu, tanpa menambah biaya atau dependency build baru.

---

## 2. Kondisi Saat Ini (fakta di kode)

| Aspek | Keadaan hari ini | Bukti |
|---|---|---|
| Halaman | 2 file HTML statis | `index.html`, `portfolio-details.html` |
| Styling | 1 file CSS, diedit langsung (tidak ada Sass) | `assets/css/style.css` (1561 baris); `assets/scss/Readme.txt` — SCSS hanya di versi pro |
| Logika | 1 file JS pola IIFE | `assets/js/main.js` (261 baris) |
| Animasi yang ada | Typed.js (efek ketik hero) + Swiper autoplay | `main.js:164`, `main.js:180` |
| Atribut animasi mati | `data-aos="fade-up"` tanpa library AOS | `index.html:102` |
| Vendor lokal | bootstrap, bootstrap-icons, boxicons, glightbox, isotope-layout, php-email-form, swiper, typed.js | `assets/vendor/` |
| GSAP | belum ada | `assets/vendor/` tidak memuat gsap |
| Hero | background image 100vh, tanpa overlay gelap | `style.css:450`; teks putih `style.css:465` |
| Filter portfolio | Isotope `layoutMode: fitRows` | `main.js:212`–`main.js:236` |
| Lightbox | GLightbox | `main.js:241` |
| Referensi rusak | `assets/img/apple-touch-icon.png` direferensikan tapi tidak ada di disk | `index.html:14`, `portfolio-details.html:14` |
| Halaman hilang | link breadcrumb ke `portfolio.html` yang tidak ada | `portfolio-details.html:68` |

Aset yang tersedia (semuanya sudah di repo, total `assets/` ± 34 MB):

| Aset | Ukuran / dimensi | Dipakai hari ini |
|---|---|---|
| `assets/img/home-bg.webp` | WebP | ya — hero (`style.css:451`) |
| `assets/img/home-bg2 (2).jpg` | 5184×3456, **3.6 MB** | tidak |
| `assets/img/me.jpg` | JPEG | ya — About (`index.html:80`) |
| `assets/img/me22.jpg` | 320×400 | tidak |
| `assets/img/avatar.jpg` | 300×300 | tidak |
| `assets/img/logo.png` | 292×193 PNG | tidak (header pakai teks "Vin.Site", `index.html:38`) |
| `assets/img/portfolio/app1–4.png` | PNG | ya — grid portfolio |
| `assets/media/{sipur,simak,alfabeta,tourguide}.mp4` | ± 3.4–5.3 MB masing-masing | ya — `portfolio-details.html:206` |
| `assets/img/blog-post-*.jpg` | JPEG | tidak — **di luar scope** (lihat §6) |

---

## 3. Keputusan Desain

### 3.1 Arah identitas visual — proposal agent, menunggu review

> Arah di bawah ini adalah **proposal agent** karena developer memilih "ganti total" tanpa menentukan tone-nya. Dokumen ini adalah tempat review-nya; kalau arahnya disetujui, bagian ini menjadi keputusan yang berlaku.

Identitas lama (terang, serif italic, beige) diganti menjadi **dark, modern, berorientasi developer**, dengan satu jembatan ke brand lama: aksennya tetap **hangat** (emas) sebagai turunan dari beige `#c6b398`, sehingga ada kesinambungan rasa meski eksekusinya berubah total.

Alasan memilih dark: portofolio ini menyasar klien/rekruter teknis, kontennya didominasi screenshot aplikasi dan video yang justru lebih "menyala" di kanvas gelap, dan konteksnya developer. Fungsional utama yang diselesaikan sekaligus: kontras teks di hero yang sekarang bermasalah.

### 3.2 Palet warna

| Token | Hex | Pemakaian |
|---|---|---|
| `--bg` | `#0C1015` | kanvas utama |
| `--bg-elev` | `#141A21` | kartu / permukaan terangkat |
| `--border` | `#232B36` | garis pemisah, border kartu |
| `--text` | `#E7ECF1` | teks utama |
| `--text-muted` | `#94A1AE` | teks sekunder, deskripsi |
| `--accent` | `#F0B23E` | aksen utama: CTA, ikon, highlight, underline nav |
| `--accent-strong` | `#FFC65C` | state hover aksen |

Palet ditokenkan sebagai CSS variables di `:root` (`assets/css/style.css`) supaya penggantian warna global tidak perlu menyunting ratusan baris satu per satu.

### 3.3 Tipografi

| Peran | Sebelum | Sesudah | Sumber |
|---|---|---|---|
| Display / heading | Playfair Display (serif italic, `style.css:207`) | **Space Grotesk** (600/700) | Google Fonts |
| Body | Poppins (`style.css:14`) | **Inter** (400/500) | Google Fonts |
| Label / tag / meta | — | **JetBrains Mono** (400/500) | Google Fonts |

JetBrains Mono dipakai untuk elemen kecil bernuansa teknis — eyebrow section, tag kategori portfolio, label skill — sebagai penanda identitas "developer" tanpa mengganggu keterbacaan body. Pemuatan font tetap lewat Google Fonts seperti sekarang (`index.html:17`).

### 3.4 Layout per section

| Section | Perubahan |
|---|---|
| Header | Tetap `fixed-top`; transparan saat di atas, lalu blur + border bawah saat `.header-scrolled` (class sudah dikelola `main.js:84`–`main.js:95`). Logo teks diganti `logo.png`. Underline aksen pada nav aktif. |
| Hero | Full-viewport. `home-bg2` (setelah dikompres) sebagai background dengan **overlay gradient gelap** ke arah `--bg`; nama sebagai display besar; role Typed.js tetap (`index.html:58`); baris sosial tetap; **scroll-down cue** beranimasi. |
| About | Foto `me.jpg` sebagai utama dengan frame/aksen; `me22.jpg` dan/atau `avatar.jpg` sebagai elemen sekunder dekoratif. Teks Inter, heading Space Grotesk. |
| Services / Skills | Swiper tetap (`main.js:180`). Kartu skill jadi permukaan gelap, ikon boxicons berwarna aksen, hover lift. |
| Portfolio | Isotope filter + GLightbox tetap (`main.js:212`, `main.js:241`). Kartu gelap, gambar zoom saat hover, tag kategori mono. Reveal bertahap saat masuk viewport. |
| Contact / "Why Hire Me" | 4 kartu di-restyle ke permukaan gelap dengan aksen. |
| Footer | Gelap; sosial asli (GitHub / Instagram / LinkedIn, sumber `index.html:62`–`index.html:64`) menggantikan placeholder; CTA email; footer kedua halaman diseragamkan. |
| Back to top | Restyle mengikuti palet baru. |

### 3.5 Sistem animasi — GSAP + ScrollTrigger

**Library.** GSAP core + ScrollTrigger disimpan lokal di `assets/vendor/gsap/` mengikuti pola vendor repo ini. **Biaya nol:** sejak 30 April 2025 GSAP 100% gratis termasuk seluruh plugin (dulu club-only), untuk penggunaan komersial — lihat §10 Referensi.

**Peran tiap lapisan:**

1. **Hero intro timeline** — elemen hero muncul berurutan saat load.
2. **Section reveal** — pola utama animation on scroll, dijalankan `ScrollTrigger.batch` dengan stagger per kelompok elemen (About, Services, Portfolio, Contact, Footer).
3. **Parallax halus** — background hero bergerak lebih lambat dari konten saat scroll.
4. **Integrasi Isotope (wajib).** Karena grid portfolio di-relayout Isotope (`main.js:229`), setelah `isotope.arrange()` selesai harus dipanggil `ScrollTrigger.refresh()`; animasi reveal hanya diterapkan pada item yang belum pernah dianimasikan, agar item hasil filter tidak tertahan tak terlihat.
5. **`gsap.matchMedia()`** menangani dua hal: `prefers-reduced-motion: reduce` → semua animasi dimatikan dan konten langsung tampil; breakpoint mobile → varian animasi lebih ringan.

**Batasan teknis:**

- Hanya menganimasikan `transform` dan `opacity` — tidak pernah properti layout (`top`, `width`, `height`) agar tidak memicu reflow.
- Typed.js dan Swiper tetap dipertahankan; GSAP tidak menggantinya.
- Tidak menambah build step: GSAP dimuat sebagai file `min.js` biasa sebelum `main.js`.

---

## 4. Aset

| Aset | Tindakan |
|---|---|
| `home-bg2 (2).jpg` (5184×3456, 3.6 MB) | Dikompres ke WebP lebar ±1920px, target **< 300 KB**, disimpan sebagai nama baru yang rapi (mis. `assets/img/hero-bg.webp`). **Tidak menimpa** file lama. Nama lama yang mengandung spasi dan `(2)` tidak dipertahankan untuk aset baru. |
| `logo.png` (292×193) | Dipasang di header. **Risiko:** warna/transparansi logo perlu diverifikasi di kanvas gelap — kalau tidak kontras, perlu varian versi terang (lihat §9). |
| `me22.jpg` (320×400), `avatar.jpg` (300×300) | Elemen sekunder/dekoratif di section About. |
| `home-bg.webp` | Boleh tetap ada sebagai cadangan; tidak wajib dihapus. |
| `blog-post-*.jpg` | **Tidak dipakai** (di luar scope, §6). |
| Aset lain | **Tidak ada yang dihapus.** Redesign ini tidak menuntut penghapusan aset apa pun. |

---

## 5. Perbaikan Bug & Kebersihan Markup

Dikerjakan sekalian karena kedua halaman masuk scope redesign.

**`index.html`**

1. `index.html:88` — penutup tag tidak valid: `<span class="h3">Professional</span class="h3">`. Class tidak boleh ada di tag penutup. Perbaiki.
2. `index.html:14` — mereferensikan `assets/img/apple-touch-icon.png` yang **tidak ada di disk**. Sediakan filenya atau hapus barisnya.
3. `index.html:229`–`index.html:252` — `id="contact"` berisi konten "WHY HIRE ME ?" tanpa form kontak, sehingga penamaan section menyesatkan (nav "Contact" di `index.html:45` mengarah ke sini). Rapikan penamaan agar sesuai isi.

**`portfolio-details.html`**

4. `portfolio-details.html:211` — `keterangan.innerHTML = data.keterangan` menimpa **seluruh** isi `.portfolio-description`, termasuk `<h2>` di `portfolio-details.html:109` yang jadi hilang. Ganti agar hanya mengisi elemen teksnya.
5. `portfolio-details.html:207` — kalau parameter `portfolio` kosong atau tidak dikenal, `data` bernilai `undefined` dan baris ini melempar error. Tambahkan guard + fallback (mis. tampilkan pesan atau arahkan ke `index.html#portfolio`).
6. `portfolio-details.html:68` — link breadcrumb ke `portfolio.html` yang **tidak ada**. Arahkan ke `index.html#portfolio`.
7. `portfolio-details.html:8` — title masih "Portfolio Details - Folio Bootstrap Template". Jadikan judul nyata (idealnya mengikuti nama project).
8. `portfolio-details.html:129`–`portfolio-details.html:132` — footer berisi sosial placeholder `href="#"` (facebook, twitter, dll.) dan `portfolio-details.html:137` masih "© Copyrights Folio". Samakan dengan footer asli seperti di `index.html`.
9. `portfolio-details.html:201` — `console.log(data)` sisa debug. Hapus.

---

## 6. Scope

**In scope**

- Redesign `index.html` dan `portfolio-details.html`.
- Identitas visual baru sesuai §3.2 dan §3.3.
- Sistem animasi GSAP + ScrollTrigger (§3.5), vendor baru di `assets/vendor/gsap/`.
- Tokenisasi warna via CSS variables di `assets/css/style.css`.
- Kompresi aset `home-bg2 (2).jpg` → WebP (§4).
- Penambahan/penghapusan referensi `apple-touch-icon` (§5 poin 2).
- Seluruh perbaikan bug di §5.
- Pass responsif (mobile 360px ke atas) dan `prefers-reduced-motion`.

**Out of scope**

- Section blog/artikel baru — `blog-post-*.jpg` tidak dipakai.
- Membuat halaman `portfolio.html` (halaman listing terpisah). Link breadcrumb yang menunjuk ke sana dialihkan ke `index.html#portfolio` (§5 poin 6).
- Backend, CMS, atau sumber data dinamis apa pun.
- Menambah project portfolio baru di luar 4 yang sudah ada.
- Deployment/pipeline GitHub Actions — situs tetap GitHub Pages statis seperti sekarang.
- Migrasi ke Sass (SCSS hanya tersedia di versi pro template, `assets/scss/Readme.txt`); CSS tetap diedit langsung.
- Menghapus aset yang tidak terpakai.

---

## 7. Non-Functional

| Area | Target |
|---|---|
| Performa | Lighthouse mobile ≥ 90; hero image terkompres < 300 KB; animasi hanya transform/opacity; tanpa layout thrash. |
| Aksesibilitas | Kontras teks utama ≥ 4.5:1 di kanvas gelap; `prefers-reduced-motion` benar-benar mematikan animasi; navigasi tetap bisa dipakai keyboard. |
| Responsif | Semua section rapi di 360px; menu hamburger berfungsi (`main.js:116`). |
| Kompatibilitas | Browser modern (Chrome, Firefox, Safari, Edge versi terkini). |

---

## 8. Rencana Task (usulan untuk sesi plan)

Urutan ini punya ketergantungan yang jelas: token & vendor dulu, baru penampilan, lalu integrasi yang punya race condition (Isotope), terakhir pass lintas halaman.

| # | Task | Ringkas |
|---|---|---|
| 1 | Fondasi identitas & vendor | Token warna CSS variables, impor Space Grotesk/Inter/JetBrains Mono, pasang GSAP + ScrollTrigger lokal, init di `main.js`. |
| 2 | Header, Hero & animasi intro | Header dark + logo.png + nav aksen; hero overlay + scroll cue; GSAP intro timeline + parallax. |
| 3 | About, Services & Contact | Restyle tiga section + kartu; reveal stagger. |
| 4 | Portfolio grid & integrasi Isotope | Kartu gelap, hover zoom, tag mono; `ScrollTrigger.refresh()` setelah `isotope.arrange()`; reveal batch aman-filter. |
| 5 | Footer, back-to-top & kompresi aset | Footer gelap dengan sosial asli di kedua halaman; restyle back-to-top; kompres `home-bg2` → WebP; pasang di hero. |
| 6 | `portfolio-details.html` | Terapkan tema baru + seluruh perbaikan bug §5. |
| 7 | Pass responsif & reduced-motion | `gsap.matchMedia()` untuk mobile + `prefers-reduced-motion`; rapikan 360px; konsistensi lintas halaman. |

---

## 9. Risiko & Catatan

1. **Kontras `logo.png` di kanvas gelap** — logo 292×193 PNG belum tentu kontras di latar `#0C1015`. Mitigasi: verifikasi visual saat task 2; kalau perlu, buat varian mono/terang.
2. **Race Isotope ↔ ScrollTrigger** — kalau refresh tidak dipanggil setelah `isotope.arrange()`, item hasil filter bisa tertahan `opacity:0`. Ditangani eksplisit di task 4.
3. **Kualitas kompresi `home-bg2`** — turun dari 5184px ke ±1920px harus tetap tajam di hero 100vh; cek visual sebelum dipakai.
4. **CSS besar & berdampak global** — mengganti palet pada `style.css` (1561 baris) berisiko regresi luas. Mitigasi: tokenisasi CSS variables lebih dulu (task 1), baru ganti per section.
5. **Tidak ada Sass** — semua edit langsung di CSS; tidak ada kompilasi otomatis.
6. **Perubahan warna hero** — hero lama memakai `home-bg.webp`; penggantian ke aset terkompres baru harus memastikan tidak ada flash/gap saat load.

---

## 10. Referensi

Dibaca dan dipakai untuk dokumen ini:

- `index.html`, `portfolio-details.html`, `assets/css/style.css`, `assets/js/main.js` (sitasinya tersebar di §2 dan §5).
- Inventaris `assets/img/`, `assets/media/`, `assets/vendor/`, `assets/scss/Readme.txt`.
- GSAP lisensi & harga — https://gsap.com/pricing/ dan https://gsap.com/community/standard-license/ (GSAP 3.13.0, 30 April 2025: 100% gratis termasuk plugin yang dulu club-only).
- GSAP ScrollTrigger — https://gsap.com/docs/v3/Plugins/ScrollTrigger/.

---

## Pertanyaan Terbuka

Tidak ada keputusan yang tertunda. Arah visual di §3.1 adalah proposal agent yang menunggu review saat dokumen ini dibaca — bukan pertanyaan terbuka, karena tidak ada pilihan lain yang sedang ditimbang.

## Keputusan Data

Tidak berlaku. Dokumen ini tidak menyentuh data apa pun: tidak ada database, migrasi, seeder, volume, atau operasi destruktif. Modifikasi hanya pada file sumber di dalam workspace, dan §4 menetapkan bahwa **tidak ada aset yang dihapus**.
file plan ada di : ./tmp/steady-oak-43 (nama plan)
