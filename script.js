// --- Three.js Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color(0x0a001a); // Deep Space Background

// --- GYAANVARDHAN AI DATA CORE ---

// 1. Outer Ring (Holographic Shell - Neon Cyan)
const torusGeometry1 = new THREE.TorusGeometry(1.5, 0.1, 10, 80); // Higher segments for smoother look
const torusMaterial1 = new THREE.MeshBasicMaterial({ 
    color: 0x00FFFF, // Neon Cyan
    wireframe: true,
    opacity: 0.8,
    transparent: true
});
const torus1 = new THREE.Mesh(torusGeometry1, torusMaterial1);
scene.add(torus1);

// 2. Inner Ring (Energy Field - Neon Magenta)
const torusGeometry2 = new THREE.TorusGeometry(1.0, 0.05, 8, 40);
const torusMaterial2 = new THREE.MeshBasicMaterial({ 
    color: 0xFF00FF, // Neon Magenta
    wireframe: true,
    opacity: 0.7,
    transparent: true
});
const torus2 = new THREE.Mesh(torusGeometry2, torusMaterial2);
scene.add(torus2);


// --- Particle System (High-Speed Data Flow) ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 7000; // Increased particle count for richer background
const posArray = new Float32Array(particlesCount * 3); 

for(let i = 0; i < particlesCount * 3; i++) {
    // Increased spread for a deeper space feeling
    posArray[i] = (Math.random() - 0.5) * 150; 
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xFF00FF, // Matching the Magenta core and interface
    transparent: true,
    opacity: 0.6
});

const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleMesh);


camera.position.z = 5;

// --- Mouse Tracking Variables ---
const mouse = new THREE.Vector2();
const targetRotation = { x: 0, y: 0 };

// --- PARALLAX SCROLLING VARIABLE ---
// Parallax Strength: 0.4 means the background moves 40% as fast as the foreground content.
const PARALLAX_STRENGTH = 0.4; 


// --- MOUSE TRACKING FUNCTION ---
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    targetRotation.y = mouse.x * 0.4; // Slightly reduced sensitivity
    targetRotation.x = mouse.y * 0.4; 
});


// --- NEW: PARALLAX SCROLLING LOGIC ---
document.addEventListener('scroll', onScroll);

function onScroll() {
    // 1. Get the current scroll position
    const scrollTop = window.scrollY;
    
    // 2. Calculate the camera's new Y position
    // The camera moves up (positive Y) when scrolling down (positive scrollTop).
    // The factor 0.01 converts large pixel values (scrollTop) into suitable units for the camera.
    // PARALLAX_STRENGTH ensures slower movement for the background (depth illusion).
    camera.position.y = scrollTop * PARALLAX_STRENGTH * 0.01; 
}


// --- Animation Loop (Updated for Mouse Follow and Dual Torus) ---
function animate() {
    requestAnimationFrame(animate);

    // Mouse Follow Rotation - Outer Torus (Follows Cursor)
    torus1.rotation.y += (targetRotation.y - torus1.rotation.y) * 0.05;
    torus1.rotation.x += (targetRotation.x - torus1.rotation.x) * 0.05;
    torus1.rotation.z += 0.005; // Slightly faster spin

    // Inner Torus (Rotates independently)
    torus2.rotation.y += (-targetRotation.y - torus2.rotation.y) * 0.04; 
    torus2.rotation.x += (-targetRotation.x - torus2.rotation.x) * 0.04;
    torus2.rotation.z -= 0.015; // Faster counter-spin

    // Particle movement
    particleMesh.rotation.y += 0.0008; // Subtly increased background movement
    
    renderer.render(scene, camera);
}
animate();

// Handle window resize 
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
