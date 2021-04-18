import * as THREE from "three";

import { OBJLoader } from "./OBJLoader.js";
import headObj from "./basic_head.obj";
import { startUserVideo } from "../openVidu";

let container;

let camera, scene, renderer, texture, meshFloor;
let keyboard = {};
let player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let object;

//init();
//animate();

export function streamFaceOnto(target, shouldLoadModel) {
  const videoElem = document.createElement("video");
  videoElem.autoplay = true;
  document.body.appendChild(videoElem);
  videoElem.classList.add("user-video");
  target.addVideoElement(videoElem);
  videoElem.onloadedmetadata = function () {
    texture = new THREE.VideoTexture(videoElem);
    if (!object) {
      init(shouldLoadModel);
      animate();
    }
    if (shouldLoadModel && object) {
      loadModel(10);
    }
  };
}

function init(shouldLoadModel) {
  container = document.createElement("div");
  const app = document.querySelector(".App");
  app.appendChild(container);

  camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);

  // scene
  scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);

  var floorSize = 100;
  meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(floorSize, floorSize, floorSize, floorSize),
    new THREE.MeshBasicMaterial({ color: 0x1a7026 })
  );
  meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
  scene.add(meshFloor);

  camera.position.set(0, player.height, -5);
  camera.lookAt(new THREE.Vector3(0, player.height, 0));

  const manager = new THREE.LoadingManager(loadModel);
  manager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total);
  };

  // texture
  const textureLoader = new THREE.TextureLoader(manager);
  //const texture = textureLoader.load( 'linkedin.jpg' );

  // model
  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log("model " + Math.round(percentComplete, 2) + "% downloaded");
    }
  }

  function onError() {}

  const loader = new OBJLoader(manager);
  loader.load(
    headObj,
    function (obj) {
      //loader.load( 'head.obj', function ( obj ) {
      console.log("OBJ", obj);
      object = obj;
      if (shouldLoadModel) {
        loadModel(10);
      }
    },
    onProgress,
    onError
  );

  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  if (keyboard[87]) {
    // W key
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard[83]) {
    // S key
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard[65]) {
    // A key
    // Redirect motion by 90 degrees
    camera.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
  }
  if (keyboard[68]) {
    // D key
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }

  // Keyboard turn inputs
  if (keyboard[37]) {
    // left arrow key
    camera.rotation.y -= player.turnSpeed;
  }
  if (keyboard[39]) {
    // right arrow key
    camera.rotation.y += player.turnSpeed;
  }

  texture.needsUpdate = true;
  renderer.render(scene, camera);
}

function loadModel(xOffset = 0) {
  object.traverse(function (child) {
    //if ( child.isMesh ) child.material.map = texture; // video texture
  });
  object.position.x = xOffset;
  object.rotation.y = Math.PI;
  object.scale.set(0.075, 0.075, 0.075);
  scene.add(object);

  createOriginalCube(texture, xOffset);
}

function createOriginalCube(texture, xOffset = 0) {
  var cubeSize = 3;
  var geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  var material = new THREE.MeshLambertMaterial({
    map: texture,
    shading: THREE.FlatShading,
  });
  var materialArray = [];
  materialArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  materialArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  materialArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  materialArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  materialArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  materialArray.push(material);
  var materials = new THREE.MeshFaceMaterial(materialArray);
  var cubeFace = new THREE.Mesh(geometry, materials);
  cubeFace.position.y += cubeSize / 2;
  cubeFace.position.x = xOffset;
  var cubeOffset = 0.35;
  cubeFace.position.z -= cubeOffset;
  cubeFace.scale.set(cubeOffset, cubeOffset, cubeOffset);
  //cubeFace.position.x = 10;
  scene.add(cubeFace);
}

function keyDown(event) {
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
