
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.112/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let projectile;
let velocity = new THREE.Vector3(1, 1, 0); // Initial velocity (10 units in x and y directions)
let gravity = new THREE.Vector3(0, -9.81, 0); // Gravitational acceleration (downwards)
let angle; // Launch angle in degrees
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
    const planeGeo = new THREE.PlaneGeometry(200, 200);
    const planeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;
    scene.add(plane);

    // Listen to the "Launch" button click
    // Listen to the "Launch" button click
    document.getElementById('launchButton').addEventListener('click', function() {
        // Get input values
        const velocityInput = document.getElementById('initialVelocity').value; // Input for velocity magnitude
        const angleInput = document.getElementById('angle').value; // Input for angle in degrees

        // Convert inputs to numbers
        const initialVelocity = velocityInput ? parseFloat(velocityInput) : 1; // Default to 1 if input is empty
        const angleInDegrees = angleInput ? parseFloat(angleInput) : 0; // Default to 0 degrees if input is empty

        // Convert angle from degrees to radians
        const angleInRadians = angleInDegrees * (Math.PI / 180);

        // Decompose the initial velocity into x and y components
        const velocityX = initialVelocity * Math.cos( angleInRadians); // Horizontal component
        const velocityY = initialVelocity * Math.sin(angleInRadians); // Vertical component

        // Update the global velocity vector
        velocity.set(velocityX, velocityY, 0); // Assuming 2D motion in x-y plane

        // Log velocity for debugging
        console.log(`Updated velocity vector: ${velocity.x}, ${velocity.y}, ${velocity.z}`);
    });



    // Create the projectile (sphere)
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    projectile = new THREE.Mesh(sphereGeo, sphereMat);
    projectile.position.set(0, 1, 0);
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
    if (projectile.position.y <= 0.45) {
        velocity.set(0, 0, 0); // Stop the motion when it hits the ground
        projectile.position.y = 0.5; // Reset the position to ground level
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