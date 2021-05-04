import * as THREE from "three";

export function streamFaceOnto(target) {
    const videoElem = document.createElement("video");
    videoElem.autoplay = true;
    document.body.appendChild(videoElem);
    videoElem.classList.add("user-video");
    target.addVideoElement(videoElem);
    videoElem.onloadedmetadata = function () {
        return new THREE.VideoTexture(videoElem);
    };
}