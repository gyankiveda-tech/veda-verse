// --- Three.js Setup (No change) ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color(0x0a001a); // Darker, more intense background

// --- Cube Setup (More Aggressive Glitch Look) ---
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5); // Slightly larger cube
const material = new THREE.MeshBasicMaterial({ 
    color: 0x00FFFF, // Neon Cyan
    wireframe: true, // Digital lines
    opacity: 0.8,
    transparent: true
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// --- Particle System (The Multiverse Stars/Noise) ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3); // 3 (x, y, z) coordinates per particle

for(let i = 0; i < particlesCount * 3; i++) {
    // Random spread of particles over a large area
    posArray[i] = (Math.random() - 0.5) * 100; 
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Particle material (small dots)
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xFF00FF, // Magenta for contrast
    transparent: true,
    opacity: 0.7
});

const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleMesh);


camera.position.z = 5;

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    // Dynamic Cube Rotation - faster and slightly erratic
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.02;
    cube.rotation.z += 0.005;

    // Move particles to simulate depth and motion
    particleMesh.rotation.y += 0.0005;
    
    renderer.render(scene, camera);
}
animate();

// Handle window resize (No Change)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
