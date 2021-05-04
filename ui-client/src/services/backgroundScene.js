import * as THREE from "three";
import grass from "./threejs-obj-head/textures/grass.jpg";
import sky from "./threejs-obj-head/textures/sky.jpg";
import { OBJLoader } from "./threejs-obj-head/OBJLoader";
import { getStompClient } from "./stompClient";

let keyboard = {};
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let scene, camera, renderer, userName;
let player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };

let manager = new THREE.LoadingManager();
let textureLoader = new THREE.TextureLoader(manager);
let loader = new OBJLoader(manager);

export const getGameSceneProperties = () => {
  return [scene, camera, renderer];
};

export const addObjectToScene = (object) => {
  if (scene) {
    scene.add(object);
  }
};

export const setCameraPosition = (x, z) => {
  if (camera) {
    camera.position.x = x;
    camera.position.z = z;
  }
};

export function initScene(username, users) {
  // users = cubes
  userName = username;
  var container = document.createElement("div");
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

  backgroundScene();

  camera.position.set(0, player.height, -5); // set z to -0.1 to match face //
  camera.lookAt(new THREE.Vector3(0, player.height, 0));

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
  animate();

  //for (let user in users) {
  //    console.log("USERS: ", users, user, users[user]);
  //    scene.add(users[user])
  //}
}

function backgroundScene() {
  var floorTexture = textureLoader.load(grass);
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(100, 100);
  var skyTexture = textureLoader.load(sky);
  skyTexture.wrapS = THREE.RepeatWrapping;
  skyTexture.wrapT = THREE.RepeatWrapping;
  skyTexture.repeat.set(1, 1);

  var floorSize = 500;
  var meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(floorSize, floorSize, floorSize, floorSize),
    new THREE.MeshLambertMaterial({ map: floorTexture })
  );
  meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
  scene.add(meshFloor);

  var frontWall = new THREE.Mesh( // North Wall
    new THREE.PlaneGeometry(floorSize, floorSize, floorSize, floorSize),
    new THREE.MeshLambertMaterial({ map: skyTexture })
  );
  frontWall.position.y += floorSize / 2; // Put Wall on Top of Floor
  frontWall.position.z += floorSize / 2; // Put Wall in Front of Start
  frontWall.rotation.y += Math.PI;
  scene.add(frontWall);
  var backWall = new THREE.Mesh( // South Wall
    new THREE.PlaneGeometry(floorSize, floorSize, floorSize, floorSize),
    new THREE.MeshLambertMaterial({ map: skyTexture })
  );
  backWall.position.y += floorSize / 2; // Put Wall on Top of Floor
  backWall.position.z -= floorSize / 2; // Put Wall Behind Start
  scene.add(backWall);
  var leftWall = new THREE.Mesh( // North Wall
    new THREE.PlaneGeometry(floorSize, floorSize, floorSize, floorSize),
    new THREE.MeshLambertMaterial({ map: skyTexture })
  );
  leftWall.position.y += floorSize / 2; // Put Wall on Top of Floor
  leftWall.position.x += floorSize / 2; // Put Wall Left of Start
  leftWall.rotation.y -= Math.PI / 2;
  scene.add(leftWall);
  var rightWall = new THREE.Mesh( // North Wall
    new THREE.PlaneGeometry(floorSize, floorSize, floorSize, floorSize),
    new THREE.MeshLambertMaterial({ map: skyTexture })
  );
  rightWall.position.y += floorSize / 2; // Put Wall on Top of Floor
  rightWall.position.x -= floorSize / 2; // Put Wall Right of Start
  rightWall.rotation.y += Math.PI / 2;
  scene.add(rightWall);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  if (keyboard[87]) {
    // W key
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    sendPosition();
  }
  if (keyboard[83]) {
    // S key
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    sendPosition();
  }
  if (keyboard[65]) {
    // A key
    // Redirect motion by 90 degrees
    camera.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    sendPosition();
  }
  if (keyboard[68]) {
    // D key
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    sendPosition();
  }

  // Keyboard turn inputs
  if (keyboard[37]) {
    // left arrow key
    camera.rotation.y -= player.turnSpeed;
    sendPosition();
  }
  if (keyboard[39]) {
    // right arrow key
    camera.rotation.y += player.turnSpeed;
    sendPosition();
  }
  renderer.render(scene, camera);
}

function sendPosition() {
  const stompClient = getStompClient();
  if (stompClient != null) {
    let x = camera.position.x;
    let y = camera.position.z; // y == z (y = up-down)
    let response = userName + "\t" + x + "\t" + y;
    stompClient.send("/app/pos", {}, response);
  }
}

function keyDown(event) {
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
