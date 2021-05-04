import * as THREE from "three";
import {
  addObjectToScene,
  getGameSceneProperties,
  setCameraPosition,
} from "./backgroundScene";
const cubeSize = 2.2;

export const addNewUserFaceCube = (username, userInformation) => {
  const joiningUserCube = createFaceCube(
    username,
    userInformation.initialX,
    userInformation.initialY
  );
  addObjectToScene(joiningUserCube);
};

export function createFaceCube(
  videoElement = null,
  initialX = 0,
  initialY = 0,
  shouldSetCameraPosition
) {
  if (!videoElement) {
    return;
  }
  const texture = new THREE.VideoTexture(videoElement);
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
  var cubeOffset = 1;
  console.log(`Adding new cube at position X ${initialX} Y ${initialY}`);
  cubeFace.position.x = initialX;
  cubeFace.position.y += cubeOffset;
  cubeFace.position.z = initialY;
  cubeFace.scale.set(cubeOffset, cubeOffset, cubeOffset);
  if (shouldSetCameraPosition) {
    setCameraPosition(cubeFace.position.x, cubeFace.position.z - 10);
  }
  return cubeFace;
}
