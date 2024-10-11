// Scene, camera, and renderer setup
import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let sphere1, sphere2;
let velocity1 = new THREE.Vector3(0.02, 0, 0); // Initial velocity for sphere1
let velocity2 = new THREE.Vector3(-0.01, 0, 0); // Initial velocity for sphere2
let mass1 = 1, mass2 = 1; // Default mass values
let sphere_group, plane_group;

function init() {
    // Initialize scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);
    document.getElementById('content').appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 10;

    sphere_group = new THREE.Group();
    plane_group = new THREE.Group();

    // Take user input for mass and velocity
    takeinput();  // This will set mass1, mass2, velocity1, and velocity2

    // Create ground plane
    const plane1geo = new THREE.PlaneGeometry(10, 10);
    const plane1mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const plane1 = new THREE.Mesh(plane1geo, plane1mat);
    plane1.position.set(0, -5, 0);
    plane1.rotation.x = -Math.PI / 2;
    plane_group.add(plane1);

    // Create wall1
    const wall1geo = new THREE.BoxGeometry(0.5, 10, 10);
    const wall1mat = new THREE.MeshBasicMaterial({ color: 0xf5f5f5 });
    const wall1 = new THREE.Mesh(wall1geo, wall1mat);
    wall1.position.set(-5, 0, 0);
    plane_group.add(wall1);

    // Create wall2
    const wall2geo = new THREE.BoxGeometry(0.5, 10, 10);
    const wall2mat = new THREE.MeshBasicMaterial({ color: 0xf5f5f5 });
    const wall2 = new THREE.Mesh(wall2geo, wall2mat);
    wall2.position.set(5, 0, 0);
    plane_group.add(wall2);

    // Create Sphere1
    const sphereGeo1 = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMat1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    sphere1 = new THREE.Mesh(sphereGeo1, sphereMat1);
    sphere1.position.set(-2, 0, 0);
    sphere_group.add(sphere1);

    // Create Sphere2
    const sphereGeo2 = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMat2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    sphere2 = new THREE.Mesh(sphereGeo2, sphereMat2);
    sphere2.position.set(2, 0, 0);
    sphere_group.add(sphere2);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    scene.add(sphere_group);
    scene.add(plane_group);

    animate(); // Start animation
}

function takeinput() {
    // Get input values
    const mass1Input = document.getElementById('redballemass').value;
    const mass2Input = document.getElementById('blueballemass').value;
    const speed1Input = document.getElementById('redballspeed').value;
    const speed2Input = document.getElementById('blueballspeed').value;

    // Assign default values if inputs are empty
    mass1 = mass1Input ? parseFloat(mass1Input) : 1; // Default mass = 1
    mass2 = mass2Input ? parseFloat(mass2Input) : 1; // Default mass = 1
    velocity1.set(speed1Input ? parseFloat(speed1Input) : 0.02, 0, 0); // Default velocity = 0.02
    velocity2.set(speed2Input ? parseFloat(speed2Input) : -0.01, 0, 0); // Default velocity = -0.01
}

// Call takeinput() when the 'Update Balls' button is clicked
document.getElementById('updateButton').addEventListener('click', () => {
    takeinput();  // Update mass and velocities based on user input
});




function handleSphereCollision() {
    const distance = sphere1.position.distanceTo(sphere2.position);
    const collisionDistance = 1; // Sum of radii of both spheres (0.5 + 0.5)

    if (distance <= collisionDistance) {
        // Calculate velocities after elastic collision (1D)
        const v1Final = velocity1.clone().multiplyScalar((mass1 - mass2) / (mass1 + mass2))
            .add(velocity2.clone().multiplyScalar((2 * mass2) / (mass1 + mass2)));
        const v2Final = velocity1.clone().multiplyScalar((2 * mass1) / (mass1 + mass2))
            .add(velocity2.clone().multiplyScalar((mass2 - mass1) / (mass1 + mass2)));

        // Update velocities
        velocity1 = v1Final;
        velocity2 = v2Final;
    }
}

function handleWallCollision() {
    // Check for collision between sphere1 and wall1
    if (sphere1.position.x - 0.75 <= -5 || sphere1.position.x + 0.75 >= 5) {  // Sphere radius is 0.5
        velocity1.x = -velocity1.x;  // Reverse velocity in the x-axis
    }
    if (sphere2.position.x - 0.75 <= -5 || sphere2.position.x + 0.75 >= 5) {  // Sphere radius is 0.5
        velocity2.x = -velocity2.x;  // Reverse velocity in the x-axis
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Move spheres
    sphere1.position.add(velocity1);
    sphere2.position.add(velocity2);

    // Check for sphere-sphere collision
    handleSphereCollision();

    // Check for sphere1-wall1 collision
    handleWallCollision();

    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();

