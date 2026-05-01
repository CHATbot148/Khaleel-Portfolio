// ===========================
// CURSOR (desktop only)
// ===========================
const isMouse = window.matchMedia('(pointer: fine)').matches;
if (isMouse) {
    const cursor = document.getElementById('cursor');
    const trail  = document.getElementById('cursorTrail');
    let mx=0,my=0,tx=0,ty=0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursor.style.left = mx+'px';
        cursor.style.top  = my+'px';
    });

    (function animTrail(){
        tx += (mx-tx)*0.13; ty += (my-ty)*0.13;
        trail.style.left = tx+'px'; trail.style.top = ty+'px';
        requestAnimationFrame(animTrail);
    })();

    document.querySelectorAll('a,button,.skill-card,.contact-card').forEach(el=>{
        el.addEventListener('mouseenter',()=>{
            cursor.style.width='22px'; cursor.style.height='22px';
            trail.style.width='50px'; trail.style.height='50px';
        });
        el.addEventListener('mouseleave',()=>{
            cursor.style.width='10px'; cursor.style.height='10px';
            trail.style.width='32px'; trail.style.height='32px';
        });
    });
}

// ===========================
// HAMBURGER NAV
// ===========================
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

// ===========================
// NAV SCROLL
// ===========================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
}, {passive:true});

// ===========================
// HERO CANVAS — PARTICLE NET
// ===========================
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');
let W, H, ptcls = [];
const N = 55, DIST = 130;

function resize(){
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', ()=>{ resize(); buildParticles(); }, {passive:true});

class P {
    constructor(){ this.init(); }
    init(){
        this.x  = Math.random()*W;
        this.y  = Math.random()*H;
        this.vx = (Math.random()-.5)*.38;
        this.vy = (Math.random()-.5)*.38;
        this.r  = Math.random()*1.4+.4;
        this.a  = Math.random()*.45+.1;
    }
    step(){
        this.x+=this.vx; this.y+=this.vy;
        if(this.x<0||this.x>W) this.vx*=-1;
        if(this.y<0||this.y>H) this.vy*=-1;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(0,255,135,${this.a})`;
        ctx.fill();
    }
}

function buildParticles(){ ptcls=Array.from({length:N},()=>new P()); }
buildParticles();

let mx2=W/2, my2=H/2;
canvas.addEventListener('mousemove',e=>{
    const r=canvas.getBoundingClientRect();
    mx2=e.clientX-r.left; my2=e.clientY-r.top;
},{passive:true});

function frame(){
    ctx.clearRect(0,0,W,H);
    // Draw connections
    for(let i=0;i<ptcls.length;i++){
        for(let j=i+1;j<ptcls.length;j++){
            const dx=ptcls[i].x-ptcls[j].x, dy=ptcls[i].y-ptcls[j].y;
            const d=Math.sqrt(dx*dx+dy*dy);
            if(d<DIST){
                ctx.beginPath();
                ctx.moveTo(ptcls[i].x,ptcls[i].y);
                ctx.lineTo(ptcls[j].x,ptcls[j].y);
                ctx.strokeStyle=`rgba(0,255,135,${(1-d/DIST)*.12})`;
                ctx.lineWidth=.5; ctx.stroke();
            }
        }
        // Mouse attraction lines
        const dx=ptcls[i].x-mx2, dy=ptcls[i].y-my2;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<DIST*1.6){
            ctx.beginPath();
            ctx.moveTo(ptcls[i].x,ptcls[i].y);
            ctx.lineTo(mx2,my2);
            ctx.strokeStyle=`rgba(0,212,255,${(1-d/(DIST*1.6))*.28})`;
            ctx.lineWidth=.7; ctx.stroke();
        }
        ptcls[i].step(); ptcls[i].draw();
    }
    requestAnimationFrame(frame);
}
frame();

// ===========================
// SCROLL REVEAL
// ===========================
const revealEls = document.querySelectorAll('.reveal-on-scroll');

const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

// ===========================
// COUNT-UP
// ===========================
const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.count);
        let cur = 0;
        const inc = target / (1000/16);
        const run = () => {
            cur = Math.min(cur+inc, target);
            el.textContent = Math.floor(cur) + '+';
            if(cur < target) requestAnimationFrame(run);
        };
        run();
        countObs.unobserve(el);
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-count]').forEach(el => countObs.observe(el));

// ===========================
// 3D TILT ON SKILL CARDS (desktop)
// ===========================
if (isMouse) {
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const px = ((e.clientX-r.left)/r.width*100).toFixed(1)+'%';
            const py = ((e.clientY-r.top)/r.height*100).toFixed(1)+'%';
            card.style.setProperty('--px', px);
            card.style.setProperty('--py', py);

            const cx = r.left+r.width/2, cy = r.top+r.height/2;
            const rx = (e.clientY-cy)/(r.height/2)*-8;
            const ry = (e.clientX-cx)/(r.width/2)*8;
            card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ===========================
// FLOATING CARDS 3D TILT on scroll
// (parallax-lite)
// ===========================
window.addEventListener('scroll', () => {
    const cards = document.querySelectorAll('.float-card');
    const scrollY = window.scrollY;
    cards.forEach((c,i) => {
        const offset = (i % 2 === 0 ? 1 : -1) * scrollY * 0.04;
        c.style.transform += ` translateX(${offset}px)`;
    });
}, {passive:true});
