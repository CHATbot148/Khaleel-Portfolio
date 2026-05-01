// 1. Custom Cursor Logic
const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    
    // Smooth outline follow
    outline.animate({
        left: e.clientX + 'px',
        top: e.clientY + 'px'
    }, { duration: 500, fill: "forwards" });
});

// 2. Neon Particle Universe (3D Canvas)
const canvas = document.getElementById('three-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * canvas.width; // Depth
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.reset();
        if (this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        // Project 3D to 2D
        let scale = 400 / (400 + this.z);
        let x2d = (this.x - canvas.width/2) * scale + canvas.width/2;
        let y2d = (this.y - canvas.height/2) * scale + canvas.height/2;
        
        ctx.fillStyle = `rgba(0, 255, 163, ${scale})`;
        ctx.beginPath();
        ctx.arc(x2d, y2d, scale * 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

for(let i=0; i<150; i++) particles.push(new Particle());

function animate() {
    ctx.fillStyle = 'rgba(3, 3, 3, 0.2)'; // Tail effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', initCanvas);
initCanvas();
animate();

// 3. Magnetic Button Effect
const magneticBtns = document.querySelectorAll('.magnetic-btn, .p-card');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width/2;
        const y = e.clientY - rect.top - rect.height/2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0, 0)`;
    });
});
