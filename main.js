import './style.css'

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import GUI from 'lil-gui'; 

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import Lenis from "lenis"

const lenis = new Lenis()
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

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

// ライトの作成
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

// GLTF Loader
let mixer, actions = []
let canClick = true;
const loader = new GLTFLoader();
loader.load('/three-animation//3d/box.glb', function (gltf) {
  const model = gltf.scene;
  model.scale.set(120, 120, 120);
  scene.add(model);
  
  const modelWrap = new THREE.Group();
  modelWrap.add(model);
  scene.add(modelWrap);
  
  // model.position.y = -200
  // model.position.x = -150
  model.rotation.z = -Math.PI / 5;

  mixer = new THREE.AnimationMixer(gltf.scene);
  
  gltf.animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.loop = THREE.LoopOnce; // アニメーションを1回だけ再生する
    action.clampWhenFinished = true; // アニメーションが終了した後に最後のフレームで停止する
    actions.push(action);
  });

  mixer.addEventListener('finished', function() {
    canClick = true; // アニメーションが終了したらクリックを有効にする
  });
  
  // Animate
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
    .to(model.rotation, {
      y: Math.PI * 2,
      z: 0,
    }, 'tl01')
    .to(model.position, {
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
    .to(model.position, {
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
    .to(model.rotation, {
      y: -Math.PI * 2 ,
      z: -Math.PI / 5,
    },'tl03')
    .to(model.position, {
      z: 350,
      x: 300,
      y: 200,
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
    .to(model.position, {
      x: -300,
      y: -200,
    },'tl05')

  let i = 0;
  const animate = () => {
    // Update controls
    controls.update();
    
    i += 0.015;
    modelWrap.position.y = Math.sin(i) * 5;
    modelWrap.rotation.y = Math.sin(i * 0.01) * 0.5;
  
    // Render
    renderer.render(scene, camera);
    
    mixer.update(0.01);
  
    window.requestAnimationFrame(animate);
  };
  animate();

});

document.addEventListener('click', function() {
  if (canClick && actions.length > 0) {
    canClick = false; // アニメーションが再生されている間はクリックを無効にする
    actions.forEach(action => {
      action.reset(); // アクションをリセットして最初から再生
      action.play(); // アニメーションを再生
    });
  }
});


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

// const lightHelper = new THREE.SpotLightHelper(directionalLight);
// scene.add(lightHelper);


