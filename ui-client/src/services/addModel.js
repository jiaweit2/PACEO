import * as THREE from "three";
const cubeSize = 2.2;

export function createFaceCube(videoTexture = null) {
    var geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    var material = new THREE.MeshLambertMaterial({
        map: videoTexture,
        shading: THREE.FlatShading,
    });
    var materialArray = [];
    materialArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    materialArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    materialArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    materialArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    materialArray.push(material);
    //materialArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    materialArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    var materials = new THREE.MeshFaceMaterial(materialArray);
    var cubeModel = new THREE.Mesh(geometry, materials);
    cubeModel.position.y += cubeSize;

    //let max = 5, min = 1;
    //let randomInt = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)
    //cubeModel.position.x += cubeSize * randomInt;

    return cubeModel;

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