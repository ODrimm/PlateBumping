import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';



const scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0x000000, 2.7, 10 );

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(-1.882, 1.543, -3.822);
camera.rotation.set(THREE.Math.degToRad(0), THREE.Math.degToRad(180), THREE.Math.degToRad(0));

const clock = new THREE.Clock();




const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);


renderer.physicallyCorrectLights = false;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.antialias = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;


const composer = new EffectComposer(renderer);
const renderPass = new RenderPass( scene, camera );
composer.addPass(renderPass);

const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / (window.innerWidth * window.devicePixelRatio);
composer.addPass(fxaaPass);

const unrealBloomPass = new UnrealBloomPass();
unrealBloomPass.strength = 0.2;
unrealBloomPass.threshold = 0.1;
unrealBloomPass.renderToScreen = true;
composer.addPass(unrealBloomPass);

const rgbShiftShader = new ShaderPass(RGBShiftShader);
rgbShiftShader.uniforms[ 'amount' ].value = 0.0009;
composer.addPass(rgbShiftShader);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.mouseButtons = {
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
}


controls.maxDistance = 4.6;
controls.minDistance = 2;

controls.maxPolarAngle = THREE.Math.degToRad(80);
controls.minPolarAngle = THREE.Math.degToRad(50);

controls.maxAzimuthAngle = THREE.Math.degToRad(-90);
controls.minAzimuthAngle = THREE.Math.degToRad(155);

controls.enableDamping = true;
controls.dampingFactor = 0.01;

controls.enablePan = false;

controls.update();


const loader = new GLTFLoader();

let plateBounce;
let forkBounce;
let plate2Bounce;
let steakBounce;
let steakBounceSK;

let plateBounceAction;
let forkBounceAction;
let plate2BounceAction;
let steakBounceAction;
let steakBounceSKAction;


let mixer;

loader.load('assets/3d/objects.gltf', function (gltf) {

    for (let i = 0; i < gltf.animations.length; i++) {
        if (gltf.animations[i].name == "Plate_bounce.002") {

            plateBounce = gltf.animations[i];

        } else if (gltf.animations[i].name == "Fork_Bounce.002") {

            forkBounce = gltf.animations[i];

        } else if (gltf.animations[i].name == "Plate2_bounce.002") {

            plate2Bounce = gltf.animations[i];

        } else if (gltf.animations[i].name == "Steak_Bounce.002") {

            steakBounce = gltf.animations[i];

        } else if (gltf.animations[i].name == "SteakBounce_SK") {

            steakBounceSK = gltf.animations[i];
        }
    }

    mixer = new THREE.AnimationMixer(gltf.scene);

    plateBounceAction = mixer.clipAction(plateBounce);
    forkBounceAction = mixer.clipAction(forkBounce);
    plate2BounceAction = mixer.clipAction(plate2Bounce);
    steakBounceAction = mixer.clipAction(steakBounce);
    steakBounceSKAction = mixer.clipAction(steakBounceSK);
    plateBounceAction.setLoop(THREE.LoopOnce);
    forkBounceAction.setLoop(THREE.LoopOnce);
    plate2BounceAction.setLoop(THREE.LoopOnce);
    steakBounceAction.setLoop(THREE.LoopOnce);
    steakBounceSKAction.setLoop(THREE.LoopOnce);

    playAnimation();


    gltf.scene.traverse(function (child) {


        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name == "Steak") {
            let map = child.material.map;
            child.material = new THREE.MeshToonMaterial({ color: 0xffffff, map: map });
            child.material.side = THREE.FrontSide;
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
light.position.set(3.220, 4.980, -2.546);
light.distance = 10;
light.intensity = 45;
light.angle = 0.914;
light.decay = 2;
light.castShadow = true;

light.shadow.camera.left = -5
light.shadow.camera.right = 5
light.shadow.camera.top = 5
light.shadow.camera.bottom = -5
light.shadow.mapSize.width = 2048
light.shadow.mapSize.height = 2048

scene.add(light);

const ambientLight = new THREE.AmbientLight(0x222222);
ambientLight.intensity = 2.5;
scene.add(ambientLight);


const geometry = new THREE.BoxGeometry(1, 1, 5);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0 });
const cube1 = new THREE.Mesh(geometry, material);
cube1.position.set(1.2, 3.568, -0.724);
cube1.rotation.set(THREE.Math.degToRad(0), THREE.Math.degToRad(38.29), THREE.Math.degToRad(0));
cube1.castShadow = true;
const cube2 = new THREE.Mesh(geometry, material);
cube2.position.set(1.481, 3.167, -2.233);
cube2.rotation.set(THREE.Math.degToRad(-180), THREE.Math.degToRad(53.41), THREE.Math.degToRad(-180));
cube2.castShadow = true;
const cube3 = new THREE.Mesh(geometry, material);
cube3.position.set(3.247, 3.587, -2.605);
cube3.rotation.set(THREE.Math.degToRad(0), THREE.Math.degToRad(38.46), THREE.Math.degToRad(0));
cube3.castShadow = true;
const cube4 = new THREE.Mesh(geometry, material);
cube4.position.set(2.598, 3.691, -0.802);
cube4.rotation.set(THREE.Math.degToRad(0), THREE.Math.degToRad(132.96), THREE.Math.degToRad(0));
cube4.castShadow = true;

scene.add(cube1, cube2, cube3, cube4);




function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
        mixer.update(clock.getDelta())
    }

    controls.update();

    composer.render();
    // renderer.render(scene, camera);
}

animate();

function playAnimation() {
    plateBounceAction.play();
    forkBounceAction.play();
    plate2BounceAction.play();
    steakBounceAction.play();
    steakBounceSKAction.play();
}

function click() {
    steakBounceSKAction.stop();
    plateBounceAction.stop();
    forkBounceAction.stop();
    plate2BounceAction.stop();
    steakBounceAction.stop();

    let audio = new Audio('./assets/Audio/plateBump.mp3');
    audio.volume = 0.5;
    audio.play();

    cameraShake();

    playAnimation();
}

function cameraShake() {
    console.log(controls.getDistance())
    let shakeIntensity = 0.04;
    let shakeDuration = 0.09;

    let tl = gsap.timeline();

    tl.to(camera.position, { duration: shakeDuration, x: camera.position.x * (1 - shakeIntensity), y: camera.position.y * (1 - shakeIntensity), z: camera.position.z * (1 - shakeIntensity) });
    tl.to(camera.position, { duration: shakeDuration, x: camera.position.x * (1 + shakeIntensity * 2), y: camera.position.y * (1 + shakeIntensity * 2), z: camera.position.z * (1 + shakeIntensity * 2) });
    tl.to(camera.position, { duration: shakeDuration, x: camera.position.x * (1 - shakeIntensity * 2), y: camera.position.y * (1 - shakeIntensity * 2), z: camera.position.z * (1 - shakeIntensity * 2) });
    tl.to(camera.position, { duration: shakeDuration, x: camera.position.x * (1 + shakeIntensity), y: camera.position.y * (1 + shakeIntensity), z: camera.position.z * (1 + shakeIntensity) });
}

window.addEventListener('click', click, false);


window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}