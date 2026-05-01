// 1. Custom Cursor Functionality
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');

if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const { clientX: x, clientY: y } = e;
        
        // Main dot
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        
        // Trailing circle (smooth follow)
        trail.animate({
            left: `${x}px`,
            top: `${y}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effect for links
    const interactiveElements = document.querySelectorAll('a, button, .skill-category');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(4)';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.border = '1px solid var(--accent)';
            trail.style.opacity = '0';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'var(--accent)';
            cursor.style.border = 'none';
            trail.style.opacity = '0.5';
        });
    });
}

// 2. Parallax Floating Cards
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.float-card');
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;

    cards.forEach(card => {
        const speed = card.getAttribute('data-speed');
        card.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px)`;
    });
});

// 3. Hero Canvas Animation (Neural Network effect)
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 60;

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = 'rgba(0, 255, 135, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Connect lines
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.strokeStyle = `rgba(0, 255, 135, ${0.15 - distance/1000})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', initCanvas);
initCanvas();
createParticles();
animateParticles();

// 4. Scroll Reveal Logic (Simple implementation)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(50px)";
    section.style.transition = "all 1s cubic-bezier(0.16, 1, 0.3, 1)";
    observer.observe(section);
});
