import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

// Create the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Declare skybox variable
let skybox;

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

//-skybox1-//
var create_skybox = function () {
    //box_gmt
    var geometryB = new THREE.BoxGeometry(100, 100, 100);

    //txt img size
    var front_side = new THREE.TextureLoader().load("img/sky/snowbg.jpg");
    var back_side = new THREE.TextureLoader().load("img/sky/snowbg.jpg");
    var up_side = new THREE.TextureLoader().load("img/sky/snowbg.jpg");
    var down_side = new THREE.TextureLoader().load("img/sky/snowbg.jpg");
    var right_side = new THREE.TextureLoader().load("img/sky/snowbg.jpg");
    var left_side = new THREE.TextureLoader().load("img/sky/snowbg.jpg");

    //add textures to mats array
    var materialB = [];
    materialB.push(new THREE.MeshBasicMaterial({ map: front_side }));
    materialB.push(new THREE.MeshBasicMaterial({ map: back_side }));
    materialB.push(new THREE.MeshBasicMaterial({ map: up_side }));
    materialB.push(new THREE.MeshBasicMaterial({ map: down_side }));
    materialB.push(new THREE.MeshBasicMaterial({ map: right_side }));
    materialB.push(new THREE.MeshBasicMaterial({ map: left_side }));

    for (var i = 0; i < 6; i++) {
        materialB[i].side = THREE.BackSide;
    }

    //create skybox
    skybox = new THREE.Mesh(geometryB, materialB);
    scene.add(skybox);
}

// Load object
var christMod = function () {
    const loader = new GLTFLoader();
    loader.load(
        'model/source/midprj1.glb',
        function (gltf) {
            gltf.scene.position.set(0, -10, 0);
            gltf.scene.scale.set(1.5, 1.5, 1.5);
            gltf.scene.rotation.set(0, 0, 0);

            scene.add(gltf.scene);
        },
        undefined,
        function (error) {
            console.error('Error loading the model', error);
        }
    );
}

// Create ambient light
var ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Call the function to create the skybox
create_skybox();

// Call the function to load the .glb object
christMod();

// Create directional lights shining at the center of the 3D object
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight1.position.set(0, 10, 0);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(0, -10, 0);
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight3.position.set(10, 0, 0);
scene.add(directionalLight3);

const directionalLight4 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight4.position.set(-10, 0, 0);
scene.add(directionalLight4);

// Add a global variable for the audio element
let audio;

// Function to create and play background music
function playBackgroundMusic() {
    // Create an audio element
    audio = new Audio('bms.mp3');
    audio.loop = true; // Set the loop property to true for continuous playback

    // Create an audio listener and add it to the camera
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // Create an audio source and connect it to the listener
    const sound = new THREE.Audio(listener);
    sound.setMediaElementSource(audio);

    // Add the audio source to the scene
    scene.add(sound);

    // Start playing the music
    audio.play().catch(error => {
        console.error('Error playing the background music:', error);
    });
}

// Call the function to play background music
playBackgroundMusic();

// Set initial camera position
camera.position.z = 10;

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // Rotate the scene around the center of the camera
    scene.rotation.y += 0.005;

    // Render the scene
    renderer.render(scene, camera);
}

animate();