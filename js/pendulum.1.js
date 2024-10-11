import * as THREE from 'three';
import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);
document.getElementById('content2').appendChild(renderer.domElement);

// Add controls
const controls = new OrbitControls(camera, renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);

// Group to hold pendulums
const pendulumGroup = new THREE.Group();
scene.add(pendulumGroup);
scene.background = new THREE.Color(256, 256, 256);

// Double pendulum parameters
let theta1 = Math.PI / 2;  // Initial angle for first pendulum
let theta2 = Math.PI / 4;  // Initial angle for second pendulum
let omega1 = 0;            // Angular velocity for first pendulum
let omega2 = 0;            // Angular velocity for second pendulum
const l1 = 3;              // Length of the first rod
const l2 = 2;              // Length of the second rod
const g = 9.81;            // Gravitational constant

// Create the first rod
const rod1Geometry = new THREE.CylinderGeometry(0.05, 0.05, l1, 32);
const rod1Material = new THREE.MeshPhongMaterial({ color: 0xffffff });
const rod1 = new THREE.Mesh(rod1Geometry, rod1Material);
rod1.position.y = -l1 / 2;
pendulumGroup.add(rod1);

// Create the first bob
const bob1Geometry = new THREE.SphereGeometry(0.2, 32, 32);
const bob1Material = new THREE.MeshPhongMaterial({ color: 0xff7555 });
const bob1 = new THREE.Mesh(bob1Geometry, bob1Material);
bob1.position.set(0, -l1, 0);
pendulumGroup.add(bob1);

// Create the second rod
const rod2Geometry = new THREE.CylinderGeometry(0.05, 0.05, l2, 32);
const rod2Material = new THREE.MeshPhongMaterial({ color: 0xffffff });
const rod2 = new THREE.Mesh(rod2Geometry, rod2Material);
rod2.position.y = -l2 / 2;
pendulumGroup.add(rod2);

// Create the second bob
const bob2Geometry = new THREE.SphereGeometry(0.2, 32, 32);
const bob2Material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const bob2 = new THREE.Mesh(bob2Geometry, bob2Material);
bob2.position.set(0, -l1 - l2, 0);
pendulumGroup.add(bob2);

// Camera positioning
camera.position.z = 8;
camera.position.y = -2;
controls.target.set(0, 0, 0);

// Helper function to update positions of rods and bobs
const updatePendulumPositions = () => {
    const x1 = l1 * Math.sin(theta1);
    const y1 = -l1 * Math.cos(theta1);
    const x2 = x1 + l2 * Math.sin(theta2);
    const y2 = y1 - l2 * Math.cos(theta2);

    // Update the positions of the rods and bobs
    rod1.position.set(x1 / 2, y1 / 2, 0);  // Midpoint of rod1
    rod1.rotation.z = theta1;

    bob1.position.set(x1, y1, 0);  // Position of the first bob

    rod2.position.set((x1 + x2) / 2, (y1 + y2) / 2, 0);  // Midpoint of rod2
    rod2.rotation.z = theta2;

    bob2.position.set(x2, y2, 0);  // Position of the second bob
};

// Double pendulum physics calculations
const updatePendulumPhysics = (dt) => {
    const m1 = 1;  // Mass of the first bob
    const m2 = 1;  // Mass of the second bob
//update this with your own codes
    const num1 = -g * (2 * m1 + m2) * Math.sin(theta1);
    const num2 = -m2 * g * Math.sin(theta1 - 2 * theta2);
    const num3 = -2 * Math.sin(theta1 - theta2) * m2 * (omega2 ** 2 * l2 + omega1 ** 2 * l1 * Math.cos(theta1 - theta2));
    const denom1 = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2));
    const acceleration1 = (num1 + num2 + num3) / denom1;

    const num4 = 2 * Math.sin(theta1 - theta2);
    const num5 = omega1 ** 2 * l1 * (m1 + m2);
    const num6 = g * (m1 + m2) * Math.cos(theta1);
    const num7 = omega2 ** 2 * l2 * m2 * Math.cos(theta1 - theta2);
    const denom2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2));
    const acceleration2 = (num4 * (num5 + num6 + num7)) / denom2;

    // Update the angular velocities
    omega1 += acceleration1 * dt;
    omega2 += acceleration2 * dt;

    // Update the angles
    theta1 += omega1 * dt;
    theta2 += omega2 * dt;
};

// Animate the pendulum
const animatePendulum = () => {
    updatePendulumPhysics(0.02);  // Update physics
    updatePendulumPositions();     // Update positions based on the angles

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
