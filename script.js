/* ============================================================
   SARAVAN V — PORTFOLIO JAVASCRIPT
   Handles: Typing animation, Scroll reveal, Skill bars,
            Counters, Navbar, Particles, Form validation,
            Back-to-top, Popup, Mobile menu, Tilt effects
   ============================================================ */

// ── DOM Ready ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  initTypingAnimation();
  initParticles();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initSkillBars();
  initCounters();
  // initContactForm();
  initBackToTop();
  initPopup();
  setFooterYear();

});

/* ============================================================
   1. TYPING ANIMATION
   ============================================================ */
function initTypingAnimation() {
  const roles = [
  'AI & Full-Stack Developer',
  'LLM Integration Engineer',
  'FastAPI / Flask Developer',
  'Problem Solver'
];

  const el = document.getElementById('typedText');
  if (!el) return;

  let roleIndex = 0;
  let charIndex  = 0;
  let isDeleting = false;
  const TYPING_SPEED   = 80;
  const DELETING_SPEED = 45;
  const PAUSE_AFTER    = 2000;
  const PAUSE_BEFORE   = 400;

  function type() {
    const current = roles[roleIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIndex === current.length) {
      delay = PAUSE_AFTER;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = PAUSE_BEFORE;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ============================================================
   2. PARTICLE CANVAS
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const COUNT   = 60;
  const CYAN    = '0, 229, 255';
  const BLUE    = '0, 102, 255';

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.r  = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? CYAN : BLUE;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CYAN}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();

  window.addEventListener('resize', () => { resize(); });
}

/* ============================================================
   3. NAVBAR — scroll + active section highlight
   ============================================================ */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const links   = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scroll background
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Active section highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.id;
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu if open
      closeMobileMenu();
    });
  });
}

/* ============================================================
   4. MOBILE HAMBURGER MENU
   ============================================================ */
let mobileMenuOpen = false;

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    mobileMenuOpen = !mobileMenuOpen;
    hamburger.classList.toggle('open', mobileMenuOpen);
    navLinks.classList.toggle('open', mobileMenuOpen);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (mobileMenuOpen && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

function closeMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  mobileMenuOpen = false;
  if (hamburger) hamburger.classList.remove('open');
  if (navLinks)  navLinks.classList.remove('open');
}

/* ============================================================
   5. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling reveals
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ============================================================
   6. ANIMATED SKILL BARS
   ============================================================ */
function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.getAttribute('data-width');
        // Slight stagger based on position
        const delay = Array.from(bars).indexOf(bar) * 80;
        setTimeout(() => {
          bar.style.width = width + '%';
        }, delay);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ============================================================
   7. ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1600; // ms
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + (target > 10 ? '+' : '');
  }

  requestAnimationFrame(step);
}

/* ============================================================
   8. CONTACT FORM VALIDATION + FORMSPREE SUBMISSION
   ============================================================ */
function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  // Real-time validation helpers
  const validators = {
    name   : val => val.trim().length >= 2 || 'Please enter your full name.',
    email  : val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) || 'Enter a valid email address.',
    subject: val => val.trim().length >= 3 || 'Subject is required.',
    message: val => val.trim().length >= 10 || 'Message must be at least 10 characters.'
  };

  function setError(id, msg) {
    const errEl = document.getElementById(id + 'Error');
    if (errEl) errEl.textContent = msg;
    const input = document.getElementById(id);
    if (input) input.style.borderColor = msg ? '#ff4d6d' : '';
  }

  function clearErrors() {
    ['name','email','subject','message'].forEach(f => setError(f, ''));
  }

  // Live validation on blur
  ['name','email','subject','message'].forEach(field => {
    const input = document.getElementById(field);
    if (!input) return;
    input.addEventListener('blur', () => {
      if (validators[field]) {
        const result = validators[field](input.value);
        setError(field, result === true ? '' : result);
      }
    });
    input.addEventListener('input', () => {
      // Clear error as user types
      const errEl = document.getElementById(field + 'Error');
      if (errEl && errEl.textContent) {
        const result = validators[field](input.value);
        setError(field, result === true ? '' : result);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    // Validate all fields
    let valid = true;
    ['name','email','subject','message'].forEach(field => {
      const input = document.getElementById(field);
      if (!input || !validators[field]) return;
      const result = validators[field](input.value);
      if (result !== true) {
        setError(field, result);
        valid = false;
      }
    });

    if (!valid) return;

    // Send to Formspree
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method : 'POST',
        body   : formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Show success popup
        form.reset();
        showPopup();
      } else {
        const data = await response.json();
        // Formspree returns errors array
        if (data.errors) {
          alert('Error: ' + data.errors.map(err => err.message).join(', '));
        } else {
          alert('Something went wrong. Please try again.');
        }
      }
    } catch (err) {
      alert('Network error. Please check your connection and try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
  });
}

/* ============================================================
   9. SUCCESS POPUP
   ============================================================ */
function initPopup() {
  const overlay  = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  if (!overlay) return;

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('show');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('show');
  });
}

function showPopup() {
  const overlay = document.getElementById('popupOverlay');
  if (overlay) overlay.classList.add('show');
}

/* ============================================================
   10. BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   11. FOOTER YEAR
   ============================================================ */
function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   12. PROJECT CARD TILT EFFECT (subtle 3D on hover)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const cx    = rect.width  / 2;
      const cy    = rect.height / 2;
      const rotX  = ((y - cy) / cy) * -6;
      const rotY  = ((x - cx) / cx) *  6;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
});

/* ============================================================
   13. FLOATING LABEL ANIMATION (input focus glow)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
  inputs.forEach(inp => {
    inp.addEventListener('focus', () => {
      inp.parentElement.style.filter = 'drop-shadow(0 0 8px rgba(0,229,255,0.25))';
    });
    inp.addEventListener('blur', () => {
      inp.parentElement.style.filter = '';
    });
  });
});
