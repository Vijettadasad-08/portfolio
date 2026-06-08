// ============================================================
// PRELOADER
// ============================================================
const preloader = document.getElementById('preloader');
const preFill   = document.getElementById('preFill');
const preCount  = document.getElementById('preCount');

let pct = 0;
const interval = setInterval(() => {
  pct += Math.random() * 15 + 3;
  if (pct >= 100) {
    pct = 100;
    clearInterval(interval);
    preFill.style.width = '100%';
    preCount.textContent = '100%';
    setTimeout(() => preloader.classList.add('hide'), 400);
  }
  preFill.style.width = pct + '%';
  preCount.textContent = Math.floor(pct) + '%';
}, 80);

// ============================================================
// TYPEWRITER TAG LINE
// ============================================================
const tags = ['MCA Student', 'Web Developer', 'Problem Solver', 'Open to Work'];
let tagIdx = 0, charIdx = 0, deleting = false;
const tagEl = document.getElementById('tagText');

function typeTag() {
  const current = tags[tagIdx];
  if (!deleting) {
    tagEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeTag, 1800);
      return;
    }
  } else {
    tagEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      tagIdx = (tagIdx + 1) % tags.length;
    }
  }
  setTimeout(typeTag, deleting ? 60 : 100);
}

setTimeout(typeTag, 2000);

// ============================================================
// GRID CANVAS
// ============================================================
const canvas = document.getElementById('gridCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const size = 60;
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.06)';
  ctx.lineWidth = 1;

  for (let x = 0; x < canvas.width; x += size) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += size) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // Glow near cursor
  const grd = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 200);
  grd.addColorStop(0, 'rgba(0, 255, 136, 0.06)');
  grd.addColorStop(1, 'rgba(0, 255, 136, 0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(drawGrid);
}

drawGrid();

// ============================================================
// NAVBAR SCROLL
// ============================================================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
});

// ============================================================
// ACTIVE NAV
// ============================================================
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollY = window.pageYOffset;
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    const id  = sec.getAttribute('id');
    const lnk = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (lnk) lnk.classList.toggle('active', scrollY >= top && scrollY < top + sec.offsetHeight);
  });
}

// ============================================================
// HAMBURGER
// ============================================================
const burger  = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobMenu.classList.toggle('open');
});

document.querySelectorAll('.mob-lnk').forEach(lnk => {
  lnk.addEventListener('click', () => {
    burger.classList.remove('open');
    mobMenu.classList.remove('open');
  });
});

// ============================================================
// SCROLL REVEAL
// ============================================================
const reveals = document.querySelectorAll('.reveal');

const ro = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

reveals.forEach((el, i) => {
  if (!el.style.getPropertyValue('--d')) {
    const sibs = [...el.parentElement.querySelectorAll('.reveal')];
    el.style.setProperty('--d', (sibs.indexOf(el) * 90) + 'ms');
  }
  ro.observe(el);
});

// ============================================================
// CONTACT FORM
// ============================================================
const contactForm = document.getElementById('contactForm');
const cfMsg       = document.getElementById('cfMsg');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.cf-btn span');
    btn.textContent = 'Sending...';
    cfMsg.textContent = '';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      });

      if (res.ok) {
        cfMsg.textContent = '> Message sent successfully!';
        cfMsg.style.color = 'var(--green)';
        contactForm.reset();
        btn.textContent = 'Send Message';
        setTimeout(() => { cfMsg.textContent = ''; }, 6000);
      } else {
        cfMsg.textContent = '> Error sending. Please try again.';
        cfMsg.style.color = '#ff5f57';
        btn.textContent = 'Send Message';
      }
    } catch {
      cfMsg.textContent = '> Network error. Check connection.';
      cfMsg.style.color = '#ff5f57';
      btn.textContent = 'Send Message';
    }
  });
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 68, behavior: 'smooth' });
    }
  });
});
