import * as THREE from "three";

import { OBJLoader } from "./OBJLoader.js";
import headObj from "./basic_head.obj";
import grass from "./textures/grass.jpg";
import sky from "./textures/sky.jpg";
import { startUserVideo } from "../openVidu";

let container;

let camera;
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer();
let texture;

let keyboard = {};
let player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let object, cubeFace;
let manager = new THREE.LoadingManager();
let textureLoader = new THREE.TextureLoader(manager);
let loader = new OBJLoader(manager);

//init();
//animate();

export function streamFaceOnto(
  target,
  shouldLoadModel,
  isInitialLoad,
  videoElement
) {
  target.addVideoElement(videoElement);
  return new Promise((resolve, reject) => {
    videoElement.onloadedmetadata = function () {
      resolve(videoElement);
    };
  });
}

/*
function loadObject(shouldLoadModel) {
  // model
  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log("model " + Math.round(percentComplete, 2) + "% downloaded");
    }
  }

  function onError() {}

  manager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total);
  };


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
}
 */

function init() {
  container = document.createElement("div");
  const app = document.querySelector(".App");
  app.appendChild(container);

  camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);

  backgroundScene();

  camera.position.set(0, player.height, -5); // set z to -0.1 to match face //
  camera.lookAt(new THREE.Vector3(0, player.height, 0));

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
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
    cubeFace.position.x -= Math.sin(camera.rotation.y) * player.speed;
    cubeFace.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    /*object.position.x -= Math.sin(camera.rotation.y) * player.speed;
    object.position.z -= -Math.cos(camera.rotation.y) * player.speed;*/
  }
  if (keyboard[83]) {
    // S key
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    cubeFace.position.x += Math.sin(camera.rotation.y) * player.speed;
    cubeFace.position.z += -Math.cos(camera.rotation.y) * player.speed;
    /*object.position.x += Math.sin(camera.rotation.y) * player.speed;
    object.position.z += -Math.cos(camera.rotation.y) * player.speed;*/
  }
  if (keyboard[65]) {
    // A key
    // Redirect motion by 90 degrees
    camera.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    cubeFace.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    cubeFace.position.z +=
      -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    /*object.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
    object.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;*/
  }
  if (keyboard[68]) {
    // D key
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    cubeFace.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    cubeFace.position.z +=
      -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    /*object.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
    object.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;*/
  }

  // Keyboard turn inputs
  if (keyboard[37]) {
    // left arrow key
    camera.rotation.y -= player.turnSpeed;
    cubeFace.rotation.y += player.turnSpeed;
    //object.rotation.y += player.turnSpeed;
  }
  if (keyboard[39]) {
    // right arrow key
    camera.rotation.y += player.turnSpeed;
    cubeFace.rotation.y -= player.turnSpeed;
    //object.rotation.y -= player.turnSpeed;
  }

  texture.needsUpdate = true;
  renderer.render(scene, camera);
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

/*
function loadModel(xOffset = 0) {
  object.traverse(function (child) {
    //if ( child.isMesh ) child.material.map = texture; // video texture
  });
  object.position.x = xOffset;
  //object.rotation.y = Math.PI;
  object.scale.set(0.1, 0.1, 0.1);
  scene.add(object);

  createOriginalCube(texture, xOffset);
}
*/

function createOriginalCube(texture, xOffset = 0) {
  var cubeSize = 2.2;
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
  materialArray.push(material);
  materialArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  var materials = new THREE.MeshFaceMaterial(materialArray);
  cubeFace = new THREE.Mesh(geometry, materials);
  cubeFace.position.y += cubeSize;
  cubeFace.position.x = xOffset;
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
