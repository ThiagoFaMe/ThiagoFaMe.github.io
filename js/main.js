/* ============================================
   MAIN.JS — Bento Portfolio
   Cursor glow, 3D tilt, typing, scroll reveal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const cards = document.querySelectorAll('.card');
  const cursorGlow = document.getElementById('cursorGlow');
  const isMobile = window.matchMedia('(max-width: 640px)').matches;

  // ==================== CURSOR GLOW ====================
  if (!isMobile && cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }

  // ==================== CARD MOUSE GLOW + 3D TILT ====================
  cards.forEach(card => {
    if (isMobile) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Internal glow position
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');

      // 3D tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -5;
      const tiltY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ==================== TYPING ANIMATION ====================
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const words = [
      'Software Engineer',
      'Full Stack Developer',
      'Analista de Software',
      'Automation Enthusiast'
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let speed = 100;

    function tick() {
      const word = words[wordIdx];

      if (deleting) {
        typingEl.textContent = word.substring(0, charIdx - 1);
        charIdx--;
        speed = 40;
      } else {
        typingEl.textContent = word.substring(0, charIdx + 1);
        charIdx++;
        speed = 90;
      }

      if (!deleting && charIdx === word.length) {
        speed = 2200;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        speed = 400;
      }

      setTimeout(tick, speed);
    }

    tick();
  }

  // ==================== SCROLL REVEAL ====================
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  cards.forEach(card => revealObserver.observe(card));

  // ==================== COUNTER ANIMATION ====================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 1500;
    const start = performance.now();
    const isYears = target < 100;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      let current = Math.round(eased * target);
      el.textContent = isYears ? current + '+' : current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isYears ? target + '+' : target;
      }
    }

    requestAnimationFrame(update);
  }

  // ==================== DOCK NAV — Active link ====================
  const navLinks = document.querySelectorAll('.dock-nav a');
  const sections = document.querySelectorAll('[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;

    let currentId = '';
    sections.forEach(section => {
      if (section.offsetTop <= scrollY) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ==================== SMOOTH SCROLL ====================
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        window.scrollTo({
          top: targetEl.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    });
  });

});
