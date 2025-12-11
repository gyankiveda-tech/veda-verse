// --- Three.js Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set the background color to match the dark theme
scene.background = new THREE.Color(0x0d001a); 

// --- Cube Setup (The Glitchy Digital Portal) ---
const geometry = new THREE.BoxGeometry(1, 1, 1);
// We use MeshStandardMaterial for better lighting effects
const material = new THREE.MeshStandardMaterial({ 
    color: 0x00ffff, // Neon Cyan color
    wireframe: true // To give it a digital, code-like look
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// --- Lighting Setup (Crucial for 3D depth) ---
// Ambient light for general scene illumination
const ambientLight = new THREE.AmbientLight(0x404040, 5); // soft white light, increased intensity
scene.add(ambientLight);

// Point light to make the cube glow
const pointLight = new THREE.PointLight(0x00ffcc, 5, 50); // Neon light color, high intensity
pointLight.position.set(0, 0, 5);
scene.add(pointLight);


camera.position.z = 5;

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    // Cube rotation and movement to give a glitch/portal feel
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    // Subtle movement based on time
    const time = Date.now() * 0.001;
    cube.position.y = Math.sin(time) * 0.1; // Gentle up and down movement
    
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});