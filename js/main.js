/**
 * ҚАЛДЫБАЙ ҚОСАЯҚҰЛЫ (1775–1837) — РЕСМИ ТАРИХИ ПОРТАЛЫ
 * Pure Vanilla JavaScript: Interactive UI, Smooth Scroll, Video Modals,
 * 3D Parallax Tilt, Tabs & Accordions, Ambient Steppe Sound Synthesizer.
 */

(function () {
  'use strict';

  // Wait for DOM ready
  document.addEventListener('DOMContentLoaded', initApp);

  function initApp() {
    initHeaderScroll();
    initMobileNav();
    initSmoothScrollAndSpy();
    initHeroTilt();
    initVideoModal();
    initPlacesTabsAndAccordion();
    initBook3DInteraction();
    initBackToTop();
    initAmbientParticles();
    initAmbientAudioSynthesizer();
  }

  /* ------------------------------------------------------------------------
     1. Header Scroll Shadow & Transparency
     ------------------------------------------------------------------------ */
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ------------------------------------------------------------------------
     2. Mobile Navigation Drawer & Backdrop
     ------------------------------------------------------------------------ */
  function initMobileNav() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');
    const navBackdrop = document.getElementById('navBackdrop');

    if (!mobileToggle || !mainNav || !navBackdrop) return;

    function toggleMenu(open) {
      const isOpen = open !== undefined ? open : !mainNav.classList.contains('drawer-open');
      mainNav.classList.toggle('drawer-open', isOpen);
      navBackdrop.classList.toggle('active', isOpen);
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    mobileToggle.addEventListener('click', () => toggleMenu());
    navBackdrop.addEventListener('click', () => toggleMenu(false));

    // Close when clicking nav links on mobile
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          toggleMenu(false);
        }
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('drawer-open')) {
        toggleMenu(false);
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Smooth Scroll & Active Menu Spy
     ------------------------------------------------------------------------ */
  function initSmoothScrollAndSpy() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], div.bio-facts-section[id]');

    // IntersectionObserver for scroll spy
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            if (href === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Smooth scroll for anchor clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. Interactive Hero Portrait: 3D Perspective Tilt & Light Glare
     ------------------------------------------------------------------------ */
  function initHeroTilt() {
    const portraitCard = document.getElementById('heroPortraitCard');
    const portraitGlare = document.getElementById('portraitGlare');
    if (!portraitCard) return;

    portraitCard.addEventListener('mousemove', (e) => {
      const rect = portraitCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (degrees)
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      portraitCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      if (portraitGlare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        portraitGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45) 0%, transparent 60%)`;
      }
    });

    portraitCard.addEventListener('mouseleave', () => {
      portraitCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (portraitGlare) {
        portraitGlare.style.background = 'linear-gradient(125deg, rgba(255, 255, 255, 0.35) 0%, transparent 45%)';
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. Video Gallery & Full-Screen Modal Player
     ------------------------------------------------------------------------ */
  function initVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalVideoPlayer = document.getElementById('modalVideoPlayer');
    const modalVideoTitle = document.getElementById('modalVideoTitle');
    const modalVideoCaption = document.getElementById('modalVideoCaption');
    const modalCanvas = document.getElementById('modalVideoCanvas');

    if (!videoModal || !modalVideoPlayer) return;

    let canvasAnimId = null;

    // Open Modal
    function openVideoModal(videoSrc, title, desc) {
      if (modalVideoTitle) modalVideoTitle.textContent = title || 'Бейнематериал';
      if (modalVideoCaption) modalVideoCaption.textContent = desc || 'Қалдыбай батыр туралы тарихи бейнедерек.';

      modalVideoPlayer.src = videoSrc;
      videoModal.classList.add('modal-open');
      videoModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Play attempt
      const playPromise = modalVideoPlayer.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser cannot play stub or user has autoplay restrictions, start canvas visualization fallback
          startCanvasVideoSimulation(title);
        });
      }

      // Also listen to video errors
      modalVideoPlayer.onerror = () => {
        startCanvasVideoSimulation(title);
      };

      if (modalCloseBtn) modalCloseBtn.focus();
    }

    // Close Modal
    function closeVideoModal() {
      videoModal.classList.remove('modal-open');
      videoModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      modalVideoPlayer.pause();
      modalVideoPlayer.removeAttribute('src');
      modalVideoPlayer.load();

      if (canvasAnimId) {
        cancelAnimationFrame(canvasAnimId);
        canvasAnimId = null;
      }
      if (modalCanvas) {
        modalCanvas.classList.add('hidden');
      }
    }

    // Dynamic Canvas Epic Presentation Simulation Fallback
    function startCanvasVideoSimulation(title) {
      if (!modalCanvas) return;
      modalCanvas.classList.remove('hidden');
      const ctx = modalCanvas.getContext('2d');
      modalCanvas.width = 920;
      modalCanvas.height = 518;

      let tick = 0;
      const particles = [];
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * modalCanvas.width,
          y: Math.random() * modalCanvas.height,
          radius: 1 + Math.random() * 3,
          speedY: -(0.5 + Math.random() * 1.5),
          alpha: Math.random() * 0.8
        });
      }

      function draw() {
        tick++;
        ctx.fillStyle = '#17110E';
        ctx.fillRect(0, 0, modalCanvas.width, modalCanvas.height);

        // Sun & Steppe Horizon Glow
        const grad = ctx.createRadialGradient(
          modalCanvas.width / 2,
          modalCanvas.height * 0.45,
          20,
          modalCanvas.width / 2,
          modalCanvas.height * 0.45,
          320
        );
        grad.addColorStop(0, 'rgba(230, 165, 80, 0.45)');
        grad.addColorStop(0.5, 'rgba(160, 80, 35, 0.25)');
        grad.addColorStop(1, 'rgba(23, 17, 14, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, modalCanvas.width, modalCanvas.height);

        // Rotating Kazakh Sun Ornament in center
        ctx.save();
        ctx.translate(modalCanvas.width / 2, modalCanvas.height * 0.42);
        ctx.rotate(tick * 0.008);
        ctx.strokeStyle = '#C5A059';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 75, 0, Math.PI * 2);
        ctx.stroke();

        for (let a = 0; a < 8; a++) {
          ctx.rotate((Math.PI * 2) / 8);
          ctx.beginPath();
          ctx.moveTo(0, -75);
          ctx.lineTo(0, -95);
          ctx.stroke();
        }
        ctx.restore();

        // Flying glowing steppe sparks
        particles.forEach(p => {
          p.y += p.speedY;
          if (p.y < 0) {
            p.y = modalCanvas.height;
            p.x = Math.random() * modalCanvas.width;
          }
          ctx.fillStyle = `rgba(255, 220, 130, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Banner Texts
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFEBB3';
        ctx.font = 'bold 24px "Cormorant Garamond", serif';
        ctx.fillText(title || 'ҚАЛДЫБАЙ БАТЫР БЕЙНЕДЕРЕГІ', modalCanvas.width / 2, modalCanvas.height * 0.72);

        ctx.fillStyle = '#C5A059';
        ctx.font = '14px "Montserrat", sans-serif';
        ctx.fillText('1836–1838 жж. Исатай-Махамбет көтерілісінің қаһарманы', modalCanvas.width / 2, modalCanvas.height * 0.78);

        ctx.fillStyle = '#E57373';
        ctx.font = '12px "Montserrat", sans-serif';
        ctx.fillText('Тарихи деректі материал бейнебаян түрінде көрсетілуде', modalCanvas.width / 2, modalCanvas.height * 0.85);

        canvasAnimId = requestAnimationFrame(draw);
      }

      draw();
    }

    // Attach click triggers to video cards
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
      const videoSrc = card.getAttribute('data-video-src');
      const title = card.getAttribute('data-video-title');
      const descEl = card.querySelector('.video-card-desc');
      const desc = descEl ? descEl.textContent.trim() : '';

      // Trigger by clicking card or play button
      card.addEventListener('click', () => {
        openVideoModal(videoSrc, title, desc);
      });

      const playBtn = card.querySelector('.btn-play-trigger');
      if (playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openVideoModal(videoSrc, title, desc);
        });
      }

      const nativeVideo = card.querySelector('video');
      if (nativeVideo) {
        nativeVideo.addEventListener('play', () => {
          nativeVideo.pause();
          openVideoModal(videoSrc, title, desc);
        });
      }
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeVideoModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeVideoModal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('modal-open')) {
        closeVideoModal();
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. Section 3: Historical Places Tabs & Accordion Interactivity
     ------------------------------------------------------------------------ */
  function initPlacesTabsAndAccordion() {
    const tabs = document.querySelectorAll('.place-tab-btn');
    const cards = document.querySelectorAll('.place-card');

    // 1. Tab Filtering Logic
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-tab');

        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        cards.forEach(card => {
          const cardPlace = card.getAttribute('data-place');
          if (filter === 'all' || cardPlace === filter) {
            card.style.display = 'flex';
            // Smooth reveal animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.transition = 'all 0.35s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 30);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // 2. Accordion expansion toggle
    cards.forEach(card => {
      const toggleBtn = card.querySelector('.place-toggle-btn');
      if (!toggleBtn) return;

      const toggleAction = () => {
        const isOpen = card.classList.contains('accordion-open');
        card.classList.toggle('accordion-open', !isOpen);
        toggleBtn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');

        const toggleText = toggleBtn.querySelector('.toggle-text');
        if (toggleText) {
          toggleText.textContent = !isOpen ? 'Жию' : 'Толығырақ білу';
        }
      };

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAction();
      });

      // Card keypress accessibility
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target === card) {
          toggleAction();
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. Section 4: 3D Storybook Interactive Mouse Tilt
     ------------------------------------------------------------------------ */
  function initBook3DInteraction() {
    const stage = document.getElementById('bookStage');
    const book = document.getElementById('bookObject');
    const foilGlint = document.getElementById('bookFoilGlint');

    if (!stage || !book) return;

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Dynamic tilt angles
      const rotY = -26 + ((x - centerX) / centerX) * 28;
      const rotX = 10 - ((y - centerY) / centerY) * 20;

      book.style.transform = `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translateY(-8px)`;

      if (foilGlint) {
        const percentX = (x / rect.width) * 100;
        foilGlint.style.background = `linear-gradient(${115 + (percentX - 50) * 0.5}deg, transparent 20%, rgba(255, 235, 179, 0.5) ${percentX}%, transparent 70%)`;
      }
    });

    stage.addEventListener('mouseleave', () => {
      book.style.transform = 'rotateY(-26deg) rotateX(10deg)';
      if (foilGlint) {
        foilGlint.style.background = 'linear-gradient(115deg, transparent 20%, rgba(255, 235, 179, 0.4) 45%, transparent 60%)';
      }
    });
  }

  /* ------------------------------------------------------------------------
     8. Back To Top Smooth Button
     ------------------------------------------------------------------------ */
  function initBackToTop() {
    const backBtn = document.getElementById('backToTopBtn');
    if (!backBtn) return;

    backBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------------
     9. Subtle Steppe Ambient Dust Canvas Particles
     ------------------------------------------------------------------------ */
  function initAmbientParticles() {
    const canvas = document.getElementById('ambientCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(35, Math.floor(window.innerWidth / 35));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.4 + 0.15),
        alpha: Math.random() * 0.4 + 0.15,
        fading: Math.random() > 0.5 ? 1 : -1
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Oscillate alpha
        p.alpha += p.fading * 0.003;
        if (p.alpha > 0.5) p.fading = -1;
        if (p.alpha < 0.1) p.fading = 1;

        if (p.y < 0) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = `rgba(197, 160, 89, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(render);
    }

    render();
  }

  /* ------------------------------------------------------------------------
     10. Ambient Steppe Audio Synthesizer (Web Audio API)
     Generates authentic, soft steppe wind tone & meditative dombyra resonance
     without requiring external media assets.
     ------------------------------------------------------------------------ */
  function initAmbientAudioSynthesizer() {
    const audioBtn = document.getElementById('ambientSoundBtn');
    if (!audioBtn) return;

    const iconOff = audioBtn.querySelector('.sound-icon-off');
    const iconOn = audioBtn.querySelector('.sound-icon-on');

    let audioCtx = null;
    let isPlaying = false;
    let masterGain = null;
    let droneOsc1 = null;
    let droneOsc2 = null;
    let noiseNode = null;
    let dombyraInterval = null;

    function startSteppeSound() {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 2.5);
      masterGain.connect(audioCtx.destination);

      // 1. Soft Steppe Wind Filtered Noise
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const windFilter = audioCtx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(320, audioCtx.currentTime);
      windFilter.Q.setValueAtTime(1.8, audioCtx.currentTime);

      const windGain = audioCtx.createGain();
      windGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

      noiseNode.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);
      noiseNode.start();

      // 2. Meditative Deep Drone (Steppe harmonic root: Re / D2 ~ 73.4 Hz and A2 ~ 110 Hz)
      droneOsc1 = audioCtx.createOscillator();
      droneOsc1.type = 'triangle';
      droneOsc1.frequency.setValueAtTime(73.42, audioCtx.currentTime);

      droneOsc2 = audioCtx.createOscillator();
      droneOsc2.type = 'sine';
      droneOsc2.frequency.setValueAtTime(110.0, audioCtx.currentTime);

      const droneGain = audioCtx.createGain();
      droneGain.gain.setValueAtTime(0.09, audioCtx.currentTime);

      droneOsc1.connect(droneGain);
      droneOsc2.connect(droneGain);
      droneGain.connect(masterGain);

      droneOsc1.start();
      droneOsc2.start();

      // 3. Gentle periodic traditional pentatonic Dombyra plucks
      // Pentatonic scale notes in D minor: D3, F3, G3, A3, C4
      const notes = [146.83, 174.61, 196.0, 220.0, 261.63];
      dombyraInterval = setInterval(() => {
        if (!isPlaying || !audioCtx) return;
        const note = notes[Math.floor(Math.random() * notes.length)];
        pluckDombyraString(note);
      }, 4500);

      isPlaying = true;
      updateBtnUI(true);
    }

    function pluckDombyraString(freq) {
      if (!audioCtx || !masterGain) return;
      const osc = audioCtx.createOscillator();
      const pluckGain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      const pluckFilter = audioCtx.createBiquadFilter();
      pluckFilter.type = 'lowpass';
      pluckFilter.frequency.setValueAtTime(1200, audioCtx.currentTime);
      pluckFilter.frequency.exponentialRampToValueAtTime(350, audioCtx.currentTime + 1.2);

      pluckGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      pluckGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.2);

      osc.connect(pluckFilter);
      pluckFilter.connect(pluckGain);
      pluckGain.connect(masterGain);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 2.4);
    }

    function stopSteppeSound() {
      if (!audioCtx || !masterGain) return;
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      setTimeout(() => {
        try {
          if (noiseNode) noiseNode.stop();
          if (droneOsc1) droneOsc1.stop();
          if (droneOsc2) droneOsc2.stop();
        } catch (_) {}
        if (dombyraInterval) clearInterval(dombyraInterval);
        isPlaying = false;
        updateBtnUI(false);
      }, 1300);
    }

    function updateBtnUI(active) {
      audioBtn.classList.toggle('playing', active);
      if (iconOff) iconOff.classList.toggle('hidden', active);
      if (iconOn) iconOn.classList.toggle('hidden', !active);
      const label = audioBtn.querySelector('.btn-label-text');
      if (label) {
        label.textContent = active ? 'Үнді өшіру' : 'Дала үні';
      }
    }

    audioBtn.addEventListener('click', () => {
      if (!isPlaying) {
        startSteppeSound();
      } else {
        stopSteppeSound();
      }
    });
  }

})();
