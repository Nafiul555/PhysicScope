
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.112/examples/jsm/controls/OrbitControls.js';




let scene, camera;
let renderer;
let controls;
let world_group;
let tilted_group;
let rotate_group;

function scene_setup() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    renderer = new THREE.WebGLRenderer({ antialilas: true});
    renderer.setSize(window.innerWidth / 1.2, window.innerHeight / 1.2);
    document.getElementById('content').appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);

    world_group = new THREE.Group();
    tilted_group = new THREE.Group();
    rotate_group = new THREE.Group();

    // Add lighting (ambient + point light)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1); // Stronger point light
    pointLight.position.set(10, 10, 10); // Position the light in front of the objects
    scene.add(pointLight);

    const diskGeometry = new THREE.CylinderGeometry(4, 4, 1, 12);
    const diskMaterial = new THREE.MeshPhongMaterial({ color: 0xff7555 });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.position.set(0, 0, 0);
    disk.rotation.x = Math.PI / 2; 
    rotate_group.add(disk);

    const bobGeo = new THREE.CylinderGeometry(1, 1, 1.5, 30);
    const bobMat = new THREE.MeshBasicMaterial({
        color: 0x222222
    })
    const bob = new THREE.Mesh(bobGeo, bobMat);
    bob.position.set(0, -1.75, 0);
    bob.rotation.x = -Math.PI / 2;
    rotate_group.add(bob);
    controls.target.copy(disk.position);

    // Create a path from the disk to the bob
    const path = new THREE.LineCurve3(disk.position.clone(), bob.position.clone());

    const tubeGeometry = new THREE.TubeGeometry(path, 20, 0.51, 8, false); // Use proper parameters: segments, radius, radial segments, closed
    const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd }); // Add color or material properties if needed
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    rotate_group.add(tube);
    

    //plane
    const plankGeometry = new THREE.BoxGeometry(20, 1, 3);
    const plankMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brownish color for wood
    const plank = new THREE.Mesh(plankGeometry, plankMaterial);
    plank.position.set(2, -4.4, 0);
    //plane.rotation.x = Math.PI / 2;

    tilted_group.add(plank);

    //tilted group angle
    const tiltedAngle = -Math.PI/9;
    tilted_group.rotation.z = tiltedAngle;

    camera.lookAt(disk.position)
    camera.position.z = -15
    camera.position.y = 5;

    tilted_group.add(rotate_group);
    scene.add(tilted_group);
    scene.background = new THREE.Color(256, 256, 256);


    animate();
}

const phi = -0.365 * Math.PI;
let  angle = 0;
let swingingfactor = 1;
function animate() {
    requestAnimationFrame(animate);
    angle += 0.02 * swingingfactor;
    if (angle > phi) {
        swingingfactor = -1;
        rotate_group.position.x += 0.04;
    }
    else swingingfactor = 0;

    rotate_group.rotation.z = angle;
    

    controls.update();

    renderer.render(scene, camera);
}

document.addEventListener("DOMContentLoaded", scene_setup());