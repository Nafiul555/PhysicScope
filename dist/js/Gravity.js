import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.112/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let projectile;
let velocity = new THREE.Vector3(10, 10, 0); // Initial velocity (10 units in x and y directions)
let gravity = new THREE.Vector3(0, -9.81, 0); // Gravitational acceleration (downwards)
let launchAngle = 45; // Launch angle in degrees
let time = 0;

function init() {
    // Initialize the scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);
    document.getElementById('content').appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 50;

    // Create the ground plane
    const planeGeo = new THREE.PlaneGeometry(100, 100);
    const planeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;
    scene.add(plane);

    // Create the projectile (sphere)
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    projectile = new THREE.Mesh(sphereGeo, sphereMat);
    projectile.position.set(0, 0, 0);
    scene.add(projectile);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    animate();
}

// Function to update the position of the projectile
function updateProjectilePosition() {
    const deltaTime = 0.02; // Time step (seconds)

    // Update velocity with gravity
    velocity.add(gravity.clone().multiplyScalar(deltaTime));

    // Update position with velocity
    projectile.position.add(velocity.clone().multiplyScalar(deltaTime));

    // Check if the projectile hits the ground
    if (projectile.position.y <= 0) {
        velocity.set(0, 0, 0); // Stop the motion when it hits the ground
        projectile.position.y = 0; // Reset the position to ground level
    }
}

// Function to animate the scene
function animate() {
    requestAnimationFrame(animate);

    updateProjectilePosition(); // Update projectile's position based on physics

    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
