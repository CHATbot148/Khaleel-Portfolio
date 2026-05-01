// ===========================
// CUSTOM CURSOR
// ===========================
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
});

function animateTrail() {
    tx += (mx - tx) * 0.15;
    ty += (my - ty) * 0.15;
    trail.style.left = tx + 'px';
    trail.style.top = ty + 'px';
    requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button, .skill-card, .project-item, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '24px';
        cursor.style.height = '24px';
        trail.style.width = '56px';
        trail.style.height = '56px';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        trail.style.width = '36px';
        trail.style.height = '36px';
    });
});

// ===========================
// NAV SCROLL EFFECT
// ===========================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ===========================
// HERO CANVAS — PARTICLE NETWORK
// ===========================
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
const PARTICLE_COUNT = 60;
const CONNECTION_DIST = 140;

function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 135, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}
initParticles();

let mouseX = W / 2, mouseY = H / 2;
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < CONNECTION_DIST) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 255, 135, ${(1 - dist/CONNECTION_DIST)*0.15})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
        const dx = particles[i].x - mouseX;
        const dy = particles[i].y - mouseY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < CONNECTION_DIST * 1.5) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist/(CONNECTION_DIST*1.5))*0.3})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
        }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(drawParticles);
}
drawParticles();

// ===========================
// SCROLL REVEAL
// ===========================
const revealEls = document.querySelectorAll('.section-label, .section-title, .about-text, .about-stats, .skill-card, .project-item, .contact-title, .contact-sub, .contact-card');
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

document.querySelectorAll('.skills-grid, .projects-list, .contact-cards').forEach(container => {
    container.querySelectorAll(':scope > *').forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.08}s`;
    });
});

// ===========================
// COUNT-UP ANIMATION
// ===========================
const countEls = document.querySelectorAll('.stat-num[data-count]');
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'));
            let current = 0;
            const step = target / (1200 / 16);
            const update = () => {
                current = Math.min(current + step, target);
                el.textContent = Math.floor(current) + '+';
                if (current < target) requestAnimationFrame(update);
            };
            update();
            countObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
countEls.forEach(el => countObserver.observe(el));

// ===========================
// SKILL CARD MOUSE GLOW + 3D TILT
// ===========================
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `perspective(600px) rotateY(${dx*8}deg) rotateX(${-dy*8}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});
