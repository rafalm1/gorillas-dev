import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Debug
const gui = new dat.GUI();

// Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;
camera.position.x = 1;
camera.position.y = 2;

const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(innerWidth, innerHeight);

// Custom shader for refraction
const customUniforms = {
  time: { value: 1.0 },
  resolution: { value: new THREE.Vector2() },
};

const customMaterial = new THREE.ShaderMaterial({
  uniforms: customUniforms,
  vertexShader: `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
  fragmentShader: `
      uniform vec2 resolution;
      uniform float time;

      void main() {
        vec2 p = (-1.0 + 2.0 * gl_FragCoord.xy / resolution.xy);
        float col = 0.2 + 0.2 * cos(40.0 * length(p + sin(time)));
        gl_FragColor = vec4(col, col, col, 1);
      }
    `,
});

// Objects
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  customMaterial
  // new THREE.MeshStandardMaterial()
);
scene.add(cube);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.25, 10, 100),
  new THREE.MeshStandardMaterial()
);
scene.add(torus);
torus.position.x = 4;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 30, 30),
  new THREE.MeshStandardMaterial()
);
scene.add(sphere);
sphere.position.x = 2;

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(3, 5, 3);
scene.add(light);
gui.add(light.position, "x", 1, 20, 2);
gui.add(light.position, "y", 1, 20, 2);
gui.add(light.position, "z", 1, 20, 2);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Render loop
function animate() {
  requestAnimationFrame(animate);

  // Update custom shader uniforms
  customUniforms.time.value += 0.01;
  customUniforms.resolution.value.x = window.innerWidth;
  customUniforms.resolution.value.y = window.innerHeight;

  renderer.render(scene, camera);
}

animate();
