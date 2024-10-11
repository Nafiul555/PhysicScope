
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.112/examples/jsm/controls/OrbitControls.js';

// Initialize the scene, camera, renderer, and controls
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);
document.getElementById('content').appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.95);
scene.add(ambientLight);

// Add a point light
`const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);`

// Create a pendulum group
const pendulumGroup = new THREE.Group();
scene.add(pendulumGroup);


const barGeometry = new THREE.CylinderGeometry(5, 5, 15, 32);
const barMaterial = new THREE.MeshPhongMaterial({ color: 0x000000});
const bar = new THREE.Mesh(barGeometry, barMaterial);
bar.rotation.x =  -Math.PI / 2;
bar.position.set(0, 2, 5)
scene.add(bar);
// Store pendulum data
const pendulums = [];

// Create multiple pendulums
for (let i = 0; i < 10; i++) {
    // Create the rod of the pendulum
    const rodGeometry = new THREE.CylinderGeometry(0.04, 0.04, 12, 32);
    const rodMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const rod = new THREE.Mesh(rodGeometry, rodMaterial);
    rod.position.set(0, -3, i); // Position the rod above the plane
    pendulumGroup.add(rod);

    // Create the bob of the pendulum
    const bobGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const bobMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const bob = new THREE.Mesh(bobGeometry, bobMaterial);
    bob.position.set(0, -6, i); // Position the bob at the end of the rod
    pendulumGroup.add(bob);
    console.log('rod', rod.position.y);
    console.log('bob', bob.position.y);

    // Store pendulum frequency, angle, and bob
    pendulums.push({
        angle: 0,
        swingDirection: 1,
        frequency: Math.random() * 0.05 + 0.01, // Random frequency between 0.01 and 0.06
        rod: rod,
        bob: bob
    });
}


// Create the ground plane
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -10; // Position the plane below the pendulum
//scene.add(plane);

// Set camera position
//camera.position.z = 18;
camera.position.set(10, -6, 20);
controls.target.set(0, 0, 0);

// Animate the pendulum
const animatePendulum = () => {
    // Update each pendulum's angle based on its frequency
    pendulums.forEach((pendulum) => {
        pendulum.angle += pendulum.frequency * pendulum.swingDirection; // Change the angle based on frequency
        if (pendulum.angle > Math.PI / 4) pendulum.swingDirection = -1; // Swing to the left
        if (pendulum.angle < -Math.PI / 4) pendulum.swingDirection = 1; // Swing to the right

        // Apply rotation to each rod based on its angle
        pendulum.rod.rotation.z = pendulum.angle; // Update rod rotation

        // Update bob position based on rod's angle
        const rodLength = 6; // Length of the rod (adjust as needed)
        pendulum.bob.position.set(
            rodLength * Math.sin(pendulum.angle), // x position based on angle
            -3 - rodLength * Math.cos(pendulum.angle), // y position below the rod's pivot
            pendulum.rod.position.z // keep the same z position
        ); 
    });

    requestAnimationFrame(animatePendulum);
    renderer.render(scene, camera);
};

// Start the animation
animatePendulum();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
