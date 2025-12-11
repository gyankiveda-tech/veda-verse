// --- Three.js Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color(0x0a001a); // Deep Space Background

// **NEW: Enable Physically-Based Rendering for better lighting**
renderer.toneMapping = THREE.ACESFilmicToneMapping; 
renderer.toneMappingExposure = 0.5;

// --- GYAANVARDHAN AI DATA CORE ---

// **UPDATED MATERIALS: Added Emissive property for a glowing effect**
const torusMaterial1 = new THREE.MeshBasicMaterial({ 
    color: 0x00FFFF, // Neon Cyan
    wireframe: true,
    opacity: 0.8,
    transparent: true,
    // NEW: Emissive property (gets affected by the dynamic light)
    // emissive: 0x00FFFF, 
    // emissiveIntensity: 0.5
});
const torusGeometry1 = new THREE.TorusGeometry(1.5, 0.1, 10, 80); 
const torus1 = new THREE.Mesh(torusGeometry1, torusMaterial1);
scene.add(torus1);

const torusMaterial2 = new THREE.MeshBasicMaterial({ 
    color: 0xFF00FF, // Neon Magenta
    wireframe: true,
    opacity: 0.7,
    transparent: true,
    // NEW: Emissive property
    // emissive: 0xFF00FF, 
    // emissiveIntensity: 0.5
});
const torusGeometry2 = new THREE.TorusGeometry(1.0, 0.05, 8, 40);
const torus2 = new THREE.Mesh(torusGeometry2, torusMaterial2);
scene.add(torus2);

// --- LIGHTING SYSTEM (The source of dynamism) ---

// 1. **Ambient Light:** Basic background illumination
const ambientLight = new THREE.AmbientLight(0x404040, 5); // Brighter ambient light
scene.add(ambientLight);

// 2. **Dynamic Point Light (Follows Cursor):** This is the "real object" feeling
const dynamicLight = new THREE.PointLight(0x00FFFF, 1, 100, 2); // Cyan Light
dynamicLight.position.set(0, 0, 5);
scene.add(dynamicLight);

// --- Particle System (High-Speed Data Flow) ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 7000; 
const posArray = new Float32Array(particlesCount * 3); 

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 150; 
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xFF00FF, // Magenta 
    transparent: true,
    opacity: 0.6
});

const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleMesh);

camera.position.z = 5;

// --- Mouse Tracking Variables ---
const mouse = new THREE.Vector2();
const targetRotation = { x: 0, y: 0 };
// NEW: Target position for the camera and light
const targetCameraPos = { x: 0, y: 0, z: 5 };

const PARALLAX_STRENGTH = 0.4; 

// --- MOUSE TRACKING FUNCTION (Updated) ---
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Rotation targets (as before)
    targetRotation.y = mouse.x * 0.4; 
    targetRotation.x = mouse.y * 0.4; 

    // NEW: Camera and Light Position targets (Subtle Parallax on the object)
    targetCameraPos.x = mouse.x * -0.2; // Move camera slightly opposite to cursor for depth
    targetCameraPos.y = mouse.y * 0.2; // Move camera slightly towards cursor
});


// --- PARALLAX SCROLLING LOGIC ---
document.addEventListener('scroll', onScroll);

function onScroll() {
    const scrollTop = window.scrollY;
    
    // Y position is now calculated from scroll + mouse movement
    const mouseMovementY = targetCameraPos.y; 
    camera.position.y = (scrollTop * PARALLAX_STRENGTH * 0.01) + mouseMovementY; 
}


// --- Animation Loop (Updated for Light Follow, Camera Shift, and Dual Torus) ---
function animate() {
    requestAnimationFrame(animate);

    // 1. Smoothly Interpolate Camera Position (Creates the subtle 3D shift)
    camera.position.x += (targetCameraPos.x - camera.position.x) * 0.1;
    // Note: camera.position.y is updated in onScroll, but we apply the mouse effect here
    camera.position.y += (targetCameraPos.y - (camera.position.y - (window.scrollY * PARALLAX_STRENGTH * 0.01))) * 0.1;
    
    // 2. Dynamic Light Position (Makes the core look lit by your cursor)
    dynamicLight.position.x += (mouse.x * 3 - dynamicLight.position.x) * 0.15;
    dynamicLight.position.y += (mouse.y * 3 - dynamicLight.position.y) * 0.15;
    
    // 3. Torus Rotations
    // Outer Torus (Follows Cursor)
    torus1.rotation.y += (targetRotation.y - torus1.rotation.y) * 0.05;
    torus1.rotation.x += (targetRotation.x - torus1.rotation.x) * 0.05;
    torus1.rotation.z += 0.005; 

    // Inner Torus (Counter-Rotates)
    torus2.rotation.y += (-targetRotation.y - torus2.rotation.y) * 0.04; 
    torus2.rotation.x += (-targetRotation.x - torus2.rotation.x) * 0.04;
    torus2.rotation.z -= 0.015; 

    // Particle movement
    particleMesh.rotation.y += 0.0008; 
    
    renderer.render(scene, camera);
}
animate();

// Handle window resize 
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
