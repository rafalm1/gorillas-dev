import * as THREE from "three";
import * as dat from "lil-gui";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// paramFunction
function paramFunction(u, v, target) {
  u = u * 2 * Math.PI;
  v = v * 2 * Math.PI;
  const x = u * Math.sin(v);
  const y = u * Math.cos(v);
  const z = v * Math.cos(u);

  // https://threejs.org/docs/#api/en/math/Vector3.set
  target.set(x, y, z);
}

// Object
const params = {
  slices: 50,
  stacks: 50,
};
gui.add(params, "slices", 1, 100, 10);
gui.add(params, "stacks", 1, 100, 10);

const geometry = new ParametricGeometry(
  paramFunction,
  params.slices,
  params.stacks
);
const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
gui.add(material, "wireframe");

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);

camera.position.z = 30;
camera.position.x = 30;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(innerWidth, innerHeight);
renderer.render(scene, camera);

// Render loop
const animate = function () {
  requestAnimationFrame(animate);

  mesh.geometry = new ParametricGeometry(
    paramFunction,
    params.slices,
    params.stacks
  );

  renderer.render(scene, camera);
};

animate();
