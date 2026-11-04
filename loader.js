/**
 * LUKA CINEMATIC INTRO / LOADING ANIMATION CONTROLLER
 * Independent, self-contained module replicating the reference MP4 video.
 *
 * Kinetic Letter Assembly Choreography:
 * - Full-screen organic blue blurred gradient background.
 * - Scattered letters L, U, K, A animate on perimeter clockwork trajectories.
 * - L sits at bottom-left as the anchor.
 * - U slides horizontally from bottom-right into Slot 2.
 * - K slides down right edge, then slides left into Slot 3.
 * - A slides across top, slides down right edge, then slides left into Slot 4.
 * - Letters converge to assemble the word "LUKA".
 * - Seamless diagonal wipe and fade reveal of the underlying website.
 */

(function initLukaLoader() {
  'use strict';

  // 1. Session & Navigation Check
  // Show loader on initial visit and browser reload; avoid replaying on internal anchor jumps
  const isReload = (function() {
    try {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        return navEntries[0].type === 'reload';
      }
      return performance.navigation && performance.navigation.type === 1;
    } catch (e) {
      return false;
    }
  })();

  const hasViewed = sessionStorage.getItem('luka_intro_viewed');

  // If already viewed in this session and NOT a hard refresh, remove loader immediately
  if (hasViewed && !isReload) {
    const existingLoader = document.getElementById('luka-loader');
    if (existingLoader) {
      existingLoader.remove();
    }
    return;
  }

  // Lock scroll immediately on HTML & BODY
  document.documentElement.classList.add('luka-loading');
  document.body.classList.add('luka-loading');

  // Ensure window is at top for initial presentation
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // 2. Launch immediately with ZERO delay
  function startLoader() {
    const loader = document.getElementById('luka-loader');
    if (!loader) return;

    if (window.gsap) {
      runAnimation(window.gsap, loader);
    } else {
      // High-speed RAF check in case GSAP script tag is parsing
      let attempts = 0;
      const poll = () => {
        if (window.gsap) {
          runAnimation(window.gsap, loader);
        } else if (++attempts < 60) {
          requestAnimationFrame(poll);
        } else {
          fallbackExit(loader);
        }
      };
      requestAnimationFrame(poll);
    }
  }

  // Execute immediately (the loader DOM elements are already present in body)
  if (document.getElementById('luka-loader')) {
    startLoader();
  } else {
    document.addEventListener('DOMContentLoaded', startLoader, { once: true });
  }

  function fallbackExit(loader) {
    document.documentElement.classList.remove('luka-loading');
    document.body.classList.remove('luka-loading');
    loader.style.transition = 'opacity 0.6s ease';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.remove();
    }, 600);
  }

  function runAnimation(gsap, loader) {
    const stage = loader.querySelector('.luka-loader-stage');
    const bg = loader.querySelector('.luka-loader-bg');
    const orbs = loader.querySelectorAll('.luka-glow-orb');

    const slotL = loader.querySelector('.luka-target-slot[data-slot="0"]');
    const slotU = loader.querySelector('.luka-target-slot[data-slot="1"]');
    const slotK = loader.querySelector('.luka-target-slot[data-slot="2"]');
    const slotA = loader.querySelector('.luka-target-slot[data-slot="3"]');

    const flyingL = loader.querySelector('.luka-flying-letter[data-letter="L"]');
    const flyingU = loader.querySelector('.luka-flying-letter[data-letter="U"]');
    const flyingK = loader.querySelector('.luka-flying-letter[data-letter="K"]');
    const flyingA = loader.querySelector('.luka-flying-letter[data-letter="A"]');

    if (!slotL || !slotU || !slotK || !slotA || !flyingL || !flyingU || !flyingK || !flyingA) {
      fallbackExit(loader);
      return;
    }

    // Measure target coordinates from the ghost layout container
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    const rectL = slotL.getBoundingClientRect();
    const rectU = slotU.getBoundingClientRect();
    const rectK = slotK.getBoundingClientRect();
    const rectA = slotA.getBoundingClientRect();

    // Baseline Y for all assembled letters
    const baselineY = rectL.top;

    // Margin padding derived proportionally
    const paddingX = Math.max(rectL.left, winW * 0.035);
    const topPaddingY = Math.max(winH * 0.06, 24);

    // Right-edge staging coordinates
    const rightEdgeU = winW - rectU.width - paddingX;
    const rightEdgeK = winW - rectK.width - paddingX;
    const rightEdgeA = winW - rectA.width - paddingX;

    // Set initial positions:
    // L: at final slot (anchor foundation)
    gsap.set(flyingL, {
      x: rectL.left,
      y: baselineY,
      opacity: 1,
      visibility: 'visible'
    });

    // U: starts at bottom-right along baseline
    gsap.set(flyingU, {
      x: rightEdgeU,
      y: baselineY,
      opacity: 1,
      visibility: 'visible'
    });

    // K: starts at top-right corner
    gsap.set(flyingK, {
      x: rightEdgeK,
      y: topPaddingY,
      opacity: 1,
      visibility: 'visible'
    });

    // A: starts at top-left corner
    gsap.set(flyingA, {
      x: paddingX,
      y: topPaddingY,
      opacity: 1,
      visibility: 'visible'
    });

    // Subtle fluid ambient float for orbs during sequence
    if (orbs.length > 0) {
      gsap.to(orbs[0], {
        x: '+=25',
        y: '+=18',
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      if (orbs[1]) {
        gsap.to(orbs[1], {
          x: '-=30',
          y: '-=20',
          duration: 4.0,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
    }

    // ------------------------------------------------------------------------
    // MASTER CHOREOGRAPHY TIMELINE
    // Matches the reference timing and clockwork perimeter convergence
    // ------------------------------------------------------------------------
    const tl = gsap.timeline({
      onComplete: function() {
        // Unlock body scroll
        document.documentElement.classList.remove('luka-loading');
        document.body.classList.remove('luka-loading');

        // Mark session as viewed
        sessionStorage.setItem('luka_intro_viewed', 'true');

        // Clean up loader element from DOM
        loader.style.display = 'none';
        loader.remove();

        // Refresh ScrollTrigger and Lenis if initialized
        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      }
    });

    // PHASE 1: t = 0.0s -> 0.85s
    // - U slides horizontally left into Slot 2
    // - K slides vertically down right edge to baseline
    // - A slides horizontally right across top edge
    tl.to(flyingU, {
      x: rectU.left,
      y: baselineY,
      duration: 0.85,
      ease: 'power2.inOut'
    }, 0.0);

    tl.to(flyingK, {
      x: rightEdgeK,
      y: baselineY,
      duration: 0.85,
      ease: 'power2.inOut'
    }, 0.0);

    tl.to(flyingA, {
      x: rightEdgeA,
      y: topPaddingY,
      duration: 0.85,
      ease: 'power2.inOut'
    }, 0.0);

    // Pause / rhythmic beat: 0.85s -> 1.05s
    // PHASE 2: t = 1.05s -> 1.85s
    // - K slides horizontally left into Slot 3
    // - A slides vertically down right edge to baseline
    tl.to(flyingK, {
      x: rectK.left,
      y: baselineY,
      duration: 0.80,
      ease: 'power2.inOut'
    }, 1.05);

    tl.to(flyingA, {
      x: rightEdgeA,
      y: baselineY,
      duration: 0.80,
      ease: 'power2.inOut'
    }, 1.05);

    // Pause / rhythmic beat: 1.85s -> 2.05s
    // PHASE 3: t = 2.05s -> 2.75s
    // - A slides horizontally left into Slot 4
    tl.to(flyingA, {
      x: rectA.left,
      y: baselineY,
      duration: 0.75,
      ease: 'power2.inOut'
    }, 2.05);

    // ASSEMBLED HOLD: t = 2.75s -> 3.15s
    // All 4 letters come together at the left bottom spelling "LUKA" in crisp baseline harmony
    // Brief cinematic hold so the visitor registers the assembled name

    // EXIT TRANSITION: t = 3.15s -> 4.25s
    // The entire screen with the blue background and LUKA smoothly lifts straight UP,
    // revealing the hero section of the website underneath
    tl.to(loader, {
      yPercent: -100,
      duration: 1.1,
      ease: 'power3.inOut'
    }, 3.15);
  }

})();
