import './style.css'

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import GUI from 'lil-gui'; 

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// shaderを使用するのであれば下記をコメントアウト
// import vertexShader from "./shader/vertexShader";
// import fragmentShader from "./shader/fragmentShader";

// Debug
const dat = new GUI();

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector("#canvas");

// Scene
const scene = new THREE.Scene();

// Textures
const textureLoader = new THREE.TextureLoader();

// Camera
const fov = 60; // 任意の数値
const fovRad = (fov / 2) * (Math.PI / 180);
let dist = (window.innerHeight / 2) / Math.tan(fovRad);
const camera = new THREE.PerspectiveCamera(
  fov,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.z = dist;

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.enableZoom = false; // ズームを無効化
// controls.enablePan = false; // ドラッグ移動を無効化
// controls.enableRotate = false; // 回転を無効化

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Mesh
const geometry = new THREE.CylinderGeometry( 20, 20, 500, 16 );
const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

mesh.position.y = 250

const cylinder = new THREE.Group();
cylinder.add(mesh);
const cylinderWrap = new THREE.Group();
cylinderWrap.add(cylinder);
scene.add(cylinderWrap);


// let axis = new THREE.Vector3(0, -1, -1).normalize();
// let angle = Math.PI / 4;
// let q = new THREE.Quaternion();
// q.setFromAxisAngle(axis, angle);
// mesh.quaternion.copy(q);

// Animate
cylinder.position.y = -200
cylinder.position.x = -150
cylinder.rotation.z = -Math.PI / 5;

// tl01
const tl01 = gsap.timeline({
  scrollTrigger: {
    trigger: '.sec01',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    // markers: true,
  }
});

tl01
  .to(cylinder.rotation, {
    y: Math.PI * 2,
    z: 0,
  }, 'tl01')
  .to(cylinder.position, {
    x: -300
  },'tl01')

// tl02
const tl02 = gsap.timeline({
  scrollTrigger: {
    trigger: '.sec02',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    // markers: true,
  }
});

tl02  
  .to(cylinder.position, {
    z: 300,
    x: -250,
    y: -100,
  },'tl02')


// tl03
const tl03 = gsap.timeline({
  scrollTrigger: {
    trigger: '.sec03',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    // markers: true,
  }
});

tl03
  .to(cylinder.rotation, {
    y: -Math.PI * 2 ,
    z: -Math.PI / 5,
  },'tl03')
  .to(cylinder.position, {
    z: 450,
    x: 100,
    y: 0,
  },'tl03')

// tl04

// tl05
const tl05 = gsap.timeline({
  scrollTrigger: {
    trigger: '.sec05',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    // markers: true,
  }
});

tl05
  .to(cylinder.position, {
    x: -300,
    y: -200,
  },'tl05')

  
let i = 0;
const animate = () => {
  // Update controls
  controls.update();
  
  i += 0.015;
  cylinderWrap.position.y = Math.sin(i) * 5;
  cylinderWrap.rotation.y = Math.sin(i * 0.01) * 0.5;

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};
animate();


// Resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// const axesHelper = new THREE.AxesHelper( 300 );
// scene.add( axesHelper );
