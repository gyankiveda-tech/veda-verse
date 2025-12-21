/**
 * VEDA VERSE LUXURY INTERFACE ENGINE
 * Version: 2.4.0
 * Dependencies: GSAP, ScrollTrigger, Lenis
 */

// 1. INITIALIZE LENIS (SMOOTH SCROLL PHYSICS)
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Physics-based easing
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// 2. CUSTOM CURSOR LOGIC (MAGNETIC FEEL)
const cursor = document.getElementById('cursor');
const cursorSVG = document.querySelector('.cursor-svg circle');

document.addEventListener('mousemove', (e) => {
    // Follow mouse with GSAP for smoothness
    gsap.to(cursor, {
        x: e.clientX - 20,
        y: e.clientY - 20,
        duration: 0.5,
        ease: "power3.out"
    });
});

// Cursor dashoffset animation on scroll
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 283;
    gsap.to(cursorSVG, {
        strokeDashoffset: 283 - scrollPercent,
        duration: 0.3
    });
});

// 3. MASTER PRELOADER (DECODING ANIMATION)
let progress = 0;
const progressFill = document.querySelector('.progress-bar');
const percentageText = document.querySelector('.percentage');
const loadingMsg = document.getElementById('loading-msg');

const messages = [
    "SYNCHRONIZING MULTIVERSE DATA...",
    "STABILIZING REALITY FRACTURE...",
    "EXTRACTING VEDIC LOGIC...",
    "INITIALIZING INTERFACE..."
];

const loadTimer = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 1;
    
    if (progress >= 100) {
        progress = 100;
        clearInterval(loadTimer);
        revealWebsite();
    }
    
    progressFill.style.width = progress + "%";
    percentageText.innerText = progress.toString().padStart(2, '0') + "%";
    
    // Change messages based on progress
    if (progress > 25) loadingMsg.innerText = messages[1];
    if (progress > 50) loadingMsg.innerText = messages[2];
    if (progress > 75) loadingMsg.innerText = messages[3];
    
}, 100);

function revealWebsite() {
    const tl = gsap.timeline();
    
    tl.to("#master-loader", {
        y: "-100%",
        duration: 1.5,
        ease: "expo.inOut"
    })
    .from(".hero-main-title span", {
        y: 200,
        skewY: 10,
        stagger: 0.2,
        duration: 1.5,
        ease: "expo.out"
    }, "-=0.5")
    .from(".v-nav", {
        y: -100,
        opacity: 0,
        duration: 1
    }, "-=1");
}

// 4. GSAP SCROLLTRIGGER REVEALS (BUGATTI STYLE)
gsap.registerPlugin(ScrollTrigger);

// Hero Parallax effect
gsap.to(".hero-bg-media", {
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        scrub: true
    },
    y: 200,
    scale: 1.2
});

// Manifesto (Lore) Text Reveal
gsap.from(".m-title", {
    scrollTrigger: {
        trigger: ".lore-v3",
        start: "top 70%",
    },
    opacity: 0,
    x: -100,
    duration: 1.5,
    ease: "expo.out"
});

gsap.from(".m-para", {
    scrollTrigger: {
        trigger: ".m-right",
        start: "top 80%",
    },
    opacity: 0,
    y: 50,
    duration: 1.5,
    stagger: 0.3,
    ease: "power4.out"
});

// Archive Items Hover & Reveal
document.querySelectorAll('.a-item').forEach((item) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 90%",
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
    });
});

// Team Member Magnetic Effect
document.querySelectorAll('.t-member').forEach((member) => {
    member.addEventListener('mouseenter', () => {
        gsap.to(member.querySelector('.t-name'), {
            x: 50,
            color: "#00FFFF",
            duration: 0.5,
            ease: "power2.out"
        });
    });
    
    member.addEventListener('mouseleave', () => {
        gsap.to(member.querySelector('.t-name'), {
            x: 0,
            color: "#FFFFFF",
            duration: 0.5,
            ease: "power2.out"
        });
    });
});

// 5. GLITCH EFFECT ON INTERACTION
function triggerGlitch() {
    const glitchOverlay = document.querySelector('.glitch-overlay');
    gsap.to(glitchOverlay, {
        opacity: 0.3,
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        onComplete: () => {
            gsap.to(glitchOverlay, { opacity: 0 });
        }
    });
}

// Trigger glitch randomly every 15-30 seconds for immersion
setInterval(() => {
    triggerGlitch();
}, Math.random() * 15000 + 15000);

console.log("VEDA VERSE ENGINE: ONLINE");

// --- ARTIST INTERACTION LOGIC ---

// 1. Audio Setup
const clickSound = new Audio('click-sound.mp3'); // Sound file ka naam yahan likhein
clickSound.volume = 0.2; // Volume control

// 2. Click Animation & Redirect
document.querySelectorAll('.t-member').forEach((member) => {
    member.addEventListener('click', function() {
        // Sound Play karein
        clickSound.play();
        
        // Glitch Effect trigger karein (Humein pehle banaya tha)
        triggerGlitch();
        
        // Ek chhota sa delay taaki transition feel ho
        const targetPage = this.getAttribute('data-link'); // Hum HTML mein data-link add karenge
        
        gsap.to("main", {
            opacity: 0,
            y: -50,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
                window.location.href = targetPage;
            }
        });
    });
});
