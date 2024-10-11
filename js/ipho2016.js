
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.112/examples/jsm/controls/OrbitControls.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth/1.5, window.innerHeight/1.5);
document.getElementById('content').appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement)

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.95);
scene.add(ambientLight);

// Add a point light
const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);

// Create a pendulum
const pendulumGroup = new THREE.Group();
const thread_group = new THREE.Group();
scene.add(pendulumGroup);
scene.add(thread_group);
scene.background = new THREE.Color(256, 256, 256);

// Create the rod of the pendulum
// Create the first rod
const rodGeometry = new THREE.CylinderGeometry(0.04, 0.04, 4, 32);
const rodMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd });
const rod = new THREE.Mesh(rodGeometry, rodMaterial);
rod.position.set(0, 2, 0); // Position the rod above the plane
thread_group.add(rod);


// Create the bob of the pendulum
const diskGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32); // Disk geometry (radius top, radius bottom, height, radial segments)
const diskMaterial = new THREE.MeshPhongMaterial({ color: 0xff7555 });
const disk = new THREE.Mesh(diskGeometry, diskMaterial);
disk.position.set(0, -0.3, 0); // Position the disk at the end of the first rod
disk.rotation.x = Math.PI / 2; // Rotate the disk to be flat along the x-axis
pendulumGroup.add(disk);
//thread_group.add(camera);

// Create the bob of the pendulum for rod2
const bobGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const bobMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
const bob = new THREE.Mesh(bobGeometry, bobMaterial);
bob.position.set(0, -0.7, 0); // Position the bob at the end of the second rod
pendulumGroup.add(bob);

// Create a path from the disk to the bob
const path = new THREE.LineCurve3(disk.position.clone(), bob.position.clone());

const tubeGeometry = new THREE.TubeGeometry(path, 20, 0.06, 8, false); // Use proper parameters: segments, radius, radial segments, closed
const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd }); // Add color or material properties if needed
const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
pendulumGroup.add(tube);





camera.position.z = 8;
camera.position.y = 2;

controls.target.set(0, 0, 0)

// Animate the pendulum
let pendulumAngle = 0; 
let threadAngle = 0;// Current angle of the pendulum
let swingDirection = 1;
let swingDirection2 = 1; // 1 for right, -1 for left

const animatePendulum = () => {
    pendulumAngle += 0.02 * swingDirection; // Change the angle
    if (pendulumAngle > Math.PI / 3) swingDirection = -1; // Swing to the left
    if (pendulumAngle < -Math.PI / 3) swingDirection = 1; // Swing to the right

    pendulumGroup.rotation.z = pendulumAngle; // Apply rotation to pendulum group

    threadAngle += 0.0011965 * swingDirection2;
    if (threadAngle > Math.PI/50) swingDirection2 = -1;
    if (threadAngle < -Math.PI/50) swingDirection2 = 1;

    thread_group.rotation.z = threadAngle;

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
    