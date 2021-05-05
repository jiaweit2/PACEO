import * as THREE from "three";
import {
  addObjectToScene,
  getGameSceneProperties,
  setCameraPosition,
} from "./backgroundScene";
const cubeSize = 2.2;

const userCubes = {};

const CAMERA_Z_OFFSET = 10;

export const setUserCube = (username, cube) => (userCubes[username] = cube);
export const getUserCubes = () => userCubes;
export const setUserCubePositions = (userPositions, selfUser) => {
  console.log(userCubes);
  for (const username in userPositions) {
    if (username !== selfUser && userCubes[username]) {
      console.log(
        `Moving ${username} to x ${userPositions[username].x} z ${userPositions[username].y}`
      );
      userCubes[username].position.x = userPositions[username].x;
      userCubes[username].position.z = userPositions[username].y;
    }
  }
};

export const addNewUserFaceCube = (userVideoElement, userInformation) => {
  console.log("NEW_USER", userInformation);
  const joiningUserCube = createFaceCube(
    userVideoElement,
    userInformation.initialX,
    userInformation.initialY,
    false,
    userInformation.username
  );
  addObjectToScene(joiningUserCube);
  setUserCube(userInformation.username, joiningUserCube);
};

export function createFaceCube(
  videoElement = null,
  initialX = 0,
  initialY = 0,
  shouldSetCameraPosition,
  username
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
  console.log(
    `Adding new cube for ${username} at position X ${initialX} Y ${initialY}`
  );
  cubeFace.position.x = initialX;
  cubeFace.position.y += cubeOffset;
  cubeFace.position.z = initialY;
  cubeFace.scale.set(cubeOffset, cubeOffset, cubeOffset);
  if (shouldSetCameraPosition) {
    setCameraPosition(cubeFace.position.x, cubeFace.position.z);
  }
  return cubeFace;
}
