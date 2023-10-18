import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

// Scene
const scene = new THREE.Scene();

// Textures
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envTexture = cubeTextureLoader.load([
  "/environmentMap/px.jpg",
  "/environmentMap/nx.jpg",
  "/environmentMap/py.jpg",
  "/environmentMap/ny.jpg",
  "/environmentMap/pz.jpg",
  "/environmentMap/nz.jpg",
]);
scene.background = envTexture;

// Lights
const ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1000);
pointLight.position.set(-5, 15, -5);
pointLight.castShadow = true;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.mapSize.width = 1024;
scene.add(pointLight);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  100
);
camera.position.set(3, 1.5, 3);

// Canvas
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.target.set(1, 0, 0);

// Material
const material = new THREE.MeshPhysicalMaterial({
  reflectivity: 1.0,
  transmission: 1.0,
  roughness: 0,
  metalness: 0,
  color: new THREE.Color(0xffffff),
});
material.thickness = 25;
material.envMap = envTexture;

// Object
const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
sphere.position.set(1, 0, 0);
sphere.castShadow = true;

const pivot = new THREE.Object3D();
scene.add(pivot);
pivot.add(sphere);

// Debug
const gui = new dat.GUI();
gui.add(material, "metalness", 0, 1, 0.01).name("metalness");
gui.add(material, "metalness", 0, 1, 0.01).name("metalness");
gui.add(material, "roughness", 0, 1, 0.01).name("roughness");
gui.add(material, "transmission", 0, 1, 0.01).name("transmission");
gui.add(material, "reflectivity", 0, 1, 0.01).name("reflectivity");
gui.add(material, "thickness", 0, 100, 0.1).name("thickness");

// Render loop
function animate() {
  requestAnimationFrame(animate);
  orbitControls.update();
  const sphereWorldPosition = new THREE.Vector3();
  sphere.getWorldPosition(sphereWorldPosition);
  render();
}

function render() {
  composer.render();
}

animate();
