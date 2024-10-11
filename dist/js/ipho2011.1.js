import * as THREE from 'three';
import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";

let scene;
let camera;
let renderer;
let controls;
let sphere_group;
let tube_group;
let tube;
let selectedSphere = null;
let originalCameraPosition = { x: 0, y: 0, z: 50 };

function scene_setup() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
    renderer = new THREE.WebGLRenderer({ antialias: true });

    // Set initial renderer size to fill the window
    renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);

    // Append renderer's canvas to the container div
    document.getElementById('output1').appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablepan = false;
    sphere_group = new THREE.Group();
    tube_group = new THREE.Group();

    const s1geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const s1material = new THREE.MeshBasicMaterial({
        color: 0x00ff05
    });
    const s1sphere = new THREE.Mesh(s1geometry, s1material);
    s1sphere.position.set(-10, 0, -20);
    sphere_group.add(s1sphere);

    const s2geometry = new THREE.SphereGeometry(1, 32, 32);
    const s2material = new THREE.MeshBasicMaterial({
        color: 0x00ff50
    });
    const s2sphere = new THREE.Mesh(s2geometry, s2material);
    s2sphere.position.set(5, 0, -20);
    sphere_group.add(s2sphere);

    const scgeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const scmaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });
    const scsphere = new THREE.Mesh(scgeometry, scmaterial);
    scsphere.position.set(0, 0, -20);
    sphere_group.add(scsphere);

    controls.target.set(0, 0, -20);

    camera.position.z = 50;
    scene.add(sphere_group);
    scene.add(tube_group);
    console.log("scene added");

    createTubeBetweenSpheres(s1sphere.position, s2sphere.position);

    
    console.log(sphere_group.children[0])
    animate();

    // Event listeners for buttons
    document.getElementById('sphere1').addEventListener('click', selectSphere1);
    document.getElementById('sphere2').addEventListener('click', selectSphere2);
    document.getElementById('reset').addEventListener('click', resetView);

}

function createTubeBetweenSpheres(pos1, pos2) {
    const path = new THREE.LineCurve3(new THREE.Vector3(pos1.x, pos1.y, pos1.z), 
                                      new THREE.Vector3(pos2.x, pos2.y, pos2.z));

    // Create tube geometry along the path
    const tubeGeometry = new THREE.TubeGeometry(path, 20, 0.1, 8, false);
    const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    tube = new THREE.Mesh(tubeGeometry, tubeMaterial);

    // Add the tube to the scene
    tube_group.add(tube);
}

function selectSphere1() {

    
        selectedSphere = sphere_group.children[0]
        console.log('Sphere clicked');

        // Move the camera to the selected sphere's frame of reference
        // Parent the camera to the clicked sphere
        selectedSphere.add(camera);

        // Position the camera relative to the sphere
        camera.position.set(selectSphere1.position.copy()); // Distance behind the sphere
        camera.lookAt(sphere_group.children[3]);

        controls.target.set(selectedSphere.position.x, selectedSphere.position.y, selectedSphere.position.z)
        
    
}

function selectSphere2() {

    
    selectedSphere = sphere_group.children[1]
    console.log('Sphere clicked');

    // Move the camera to the selected sphere's frame of reference
    // Parent the camera to the clicked sphere
    selectedSphere.add(camera);

    // Position the camera relative to the sphere
    camera.position.set(selectSphere2.position.copy()); // Distance behind the sphere
    camera.lookAt(sphere_group.children[3]);

    controls.target.set(selectedSphere.position.x, selectedSphere.position.y, selectedSphere.position.z)
    

}

// Reset the camera to the original position
function resetView() {
    if (selectedSphere) {
        selectedSphere.remove(camera);  // Detach the camera from the sphere
    }
    selectedSphere = null;

    // Reset the camera position and controls target
    camera.position.set(originalCameraPosition.x, originalCameraPosition.y, originalCameraPosition.z);
    controls.target.set(0, 0, -20);
    camera.lookAt(controls.target);  // Look at the original scene center
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the entire sphere group
    const rot_axis = new THREE.Vector3(0, 0, -20).normalize(); // Default rotation axis
    sphere_group.rotateOnWorldAxis(rot_axis, -0.005);
    tube_group.rotateOnWorldAxis(rot_axis, -0.005);

    // If a sphere is clicked (and camera is parented), rotate the clicked sphere
    if (selectedSphere) {
        // Apply a small rotation to the selected sphere
        selectedSphere.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0).normalize(), 0.005);
    }

    renderer.render(scene, camera);
}


document.addEventListener("DOMContentLoaded", scene_setup());
