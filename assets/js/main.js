/**
* Template Name: Folio - v4.10.0
* Template URL: https://bootstrapmade.com/folio-bootstrap-portfolio-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * GSAP + ScrollTrigger registration
   * (PRD 01 §3.5 — vendored locally at assets/vendor/gsap/)
   */
  const hasGsap = typeof window.gsap !== "undefined";
  if (hasGsap && typeof window.ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Testimonials slider
   */
  new Swiper('.services-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 20
      }
    }
  });

  /**
   * Portfolio reveal + Isotope integration (PRD 01 §3.4, §3.5)
   * Isotope v3 manages item display/opacity itself on filtering, so the
   * GSAP reveal runs once per item and then hands the inline style back
   * (clearProps) — that is what keeps filtered-in items from sticking at
   * opacity:0. ScrollTrigger is refreshed after every arrange.
   */
  const portfolioItems = select('.portfolio-item', true);
  let portfolioFilterActive = false;

  const revealFilteredPortfolio = () => {
    if (!hasGsap) return;
    const visible = portfolioItems.filter(el => el.style.display !== 'none');
    gsap.set(visible, { clearProps: 'opacity,transform' });
  };

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      portfolioIsotope.on('arrangeComplete', function() {
        if (!portfolioFilterActive) return;
        portfolioFilterActive = false;
        revealFilteredPortfolio();
        if (typeof window.ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      });

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioFilterActive = true;
        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });

      }, true);

      if (typeof window.ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * GSAP animation setup — responsive & reduced-motion aware (PRD 01 §3.5 poin 5)
   * gsap.matchMedia() is the single place that decides what runs:
   *   - reduce  : animations are switched off entirely, content stays visible
   *   - desktop : full stagger + hero background parallax
   *   - mobile  : lighter travel distance, no parallax
   * Only transform/opacity are animated, never layout properties.
   */
  if (hasGsap && typeof window.ScrollTrigger !== 'undefined') {
    const heroItems = select('[data-hero]', true);
    const revealEls = select('[data-reveal]', true);
    const heroBg = select('#hero .hero-bg');
    const mm = gsap.matchMedia();

    mm.add({
      reduce: '(prefers-reduced-motion: reduce)',
      desktop: '(prefers-reduced-motion: no-preference) and (min-width: 768px)',
      mobile: '(prefers-reduced-motion: no-preference) and (max-width: 767px)'
    }, (context) => {
      const conditions = context.conditions || {};

      if (conditions.reduce) {
        // No animation at all — make sure nothing is left hidden.
        gsap.set([].concat(heroItems, revealEls, portfolioItems), { clearProps: 'opacity,transform' });
        return;
      }

      const distance = conditions.mobile ? 18 : 30;

      if (heroItems.length) {
        gsap.set(heroItems, { opacity: 0, y: distance });
        gsap.timeline({ defaults: { ease: 'power3.out', duration: conditions.mobile ? 0.7 : 0.9 } })
          .to(heroItems, { opacity: 1, y: 0, stagger: conditions.mobile ? 0.08 : 0.12 })
          .fromTo('.hero-scroll-cue', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3');
      }

      if (conditions.desktop && heroBg) {
        gsap.fromTo(heroBg,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: '#hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }

      if (revealEls.length) {
        gsap.set(revealEls, { opacity: 0, y: distance });
        ScrollTrigger.batch(revealEls, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) => gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: conditions.mobile ? 0.6 : 0.8,
            ease: 'power3.out',
            stagger: 0.12,
            overwrite: true
          })
        });
      }

      if (portfolioItems.length) {
        // fromTo (not a pre-hide) so a filtered-in item can never stay invisible.
        ScrollTrigger.batch(portfolioItems, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) => gsap.fromTo(batch,
            { opacity: 0, y: distance },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.1,
              overwrite: true,
              onComplete: () => gsap.set(batch, { clearProps: 'opacity,transform' })
            })
        });
      }
    });
  }

})()