import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(-1.882, 1.543, -3.822);
camera.rotation.set(THREE.Math.degToRad(0), THREE.Math.degToRad(180), THREE.Math.degToRad(0));


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.shadowMap.enabled = true;


renderer.antialias = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();


const loader = new GLTFLoader();

loader.load('assets/3d/objects.gltf', function (gltf) {

    gltf.parser.getDependencies('material').then((materials) => {

        console.log(materials);

    });

    gltf.scene.traverse(function (child) {

        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name == "Steak") {
            let map = child.material.map;
            child.material = new THREE.MeshToonMaterial({ color: 0xffffff, map: map });
        }
        if (child.name == "Retopo_Fork001") {
            let map = child.material.map;
            child.material = new THREE.MeshToonMaterial({ color: 0xffffff, map: map });
        }
        if (child.name == "Retopo_ForkBand") {
            let map = child.material.map;
            child.material = new THREE.MeshToonMaterial({ color: 0xffffff, map: map });
        }
        if (child.name == "Ground") {
            let map = child.material.map;
            child.material = new THREE.MeshToonMaterial({ color: 0xffffff, map: map });
        }
        if (child.name == "Retopo_Plate_Brk_1") {
            let map = child.material.map;
            child.material = new THREE.MeshToonMaterial({ color: 0xffffff, map: map });
        }
        if (child.name == "Retopo_Plate_Brk_2") {
            let map = child.material.map;
            child.material = new THREE.MeshToonMaterial({ color: 0xffffff, map: map });
        }
    });

    scene.add(gltf.scene);

}, undefined, function (error) {

    console.error(error);

});

const light = new THREE.SpotLight(0xfbffe0);
light.position.set(2.9, 5.18, -2.37);
light.distance = 8.25;
light.intensity = 400;
light.angle = 1.014;
light.decay = 1.72;
light.castShadow = true;

light.shadow.camera.left = -5
light.shadow.camera.right = 5
light.shadow.camera.top = 5
light.shadow.camera.bottom = -5
light.shadow.mapSize.width = 2048
light.shadow.mapSize.height = 2048

scene.add(light);

const ambientLight = new THREE.AmbientLight(0x222222);
ambientLight.intensity = 5.3;
ambientLight.castShadow = true;
scene.add(ambientLight);

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();