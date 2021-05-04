import * as THREE from "three";
const cubeSize = 2.2;

export function createFaceCube(videoElement = null) {
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
  cubeFace.position.z -= cubeOffset;
  cubeFace.scale.set(cubeOffset, cubeOffset, cubeOffset);
  return cubeFace;

  /*cubeFace = new THREE.Mesh(geometry, materials);
    cubeFace.position.y += cubeSize;
    cubeFace.position.x = xOffset;
    scene.add(cubeFace);*/
}

/*
function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}*/
