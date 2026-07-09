/* ============================================
   MAIN.JS — Bento Portfolio
   Cursor glow, 3D tilt, typing, scroll reveal, counter
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const cards = document.querySelectorAll('.card');
  const cursorGlow = document.getElementById('cursorGlow');
  const isMobile = window.matchMedia('(max-width: 600px)').matches;

  // ==================== CURSOR GLOW ====================
  if (!isMobile && cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }

  // ==================== CARD MOUSE GLOW + 3D TILT ====================
  if (!isMobile) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');

        const tiltX = ((y - rect.height / 2) / rect.height) * -4;
        const tiltY = ((x - rect.width / 2) / rect.width) * 4;
        card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.015)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ==================== TYPING ANIMATION ====================
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const words = [
      'Software Engineer',
      'Full Stack Developer',
      'Automation Enthusiast',
      'Analista de Software'
    ];
    let wordIdx = 0, charIdx = 0, deleting = false, speed = 100;

    function tick() {
      const word = words[wordIdx];
      typingEl.textContent = deleting
        ? word.substring(0, charIdx - 1)
        : word.substring(0, charIdx + 1);

      deleting ? charIdx-- : charIdx++;
      speed = deleting ? 40 : 90;

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
    { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
  );

  cards.forEach(card => revealObserver.observe(card));

  // ==================== COUNTER ANIMATION ====================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target, parseInt(entry.target.dataset.target));
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 1400;
    const start = performance.now();
    const isSmall = target < 100;

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = isSmall ? current + '+' : current;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isSmall ? target + '+' : target;
    }

    requestAnimationFrame(update);
  }

});
