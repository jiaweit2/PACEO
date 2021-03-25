import { OpenVidu } from "openvidu-browser";
import * as faceapi from "face-api.js";
import "./faceApi";

const VID_HEIGHT = 480;
const VID_WIDTH = 640;

const openVidu = new OpenVidu();

const session = openVidu.initSession();

export const connectToSession = async (token, username, options = {}) => {
  session.on("streamCreated", (event) => {
    const subscriber = session.subscribe(event.stream, "user-videos-container");
    subscriber.on("videoElementCreated", (event) => {
      streamFace(event.element);
    });
  });
  await session.connect(token, { clientData: username });
  startUserVideo(session);
};

const startUserVideo = (session) => {
  const publisher = openVidu.initPublisher("user-videos-container", {
    publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
    publishVideo: true, // Whether you want to start publishing with your video enabled or not
    resolution: `${VID_WIDTH}x${VID_HEIGHT}`, // The resolution of your video
    frameRate: 30, // The frame rate of your video
    insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
    mirror: false, // Whether to mirror your local video or not
  });
  publisher.on("videoElementCreated", async (event) => {
    const videoElement = event.element;
    streamFace(videoElement);
  });
  session.publish(publisher);
};

const streamFace = (videoElement) => {
  const userVidContainer = document.getElementById("user-videos-container");
  const individualUserVideoContainer = document.createElement("div");
  individualUserVideoContainer.classList.add("individual-user-face");
  const outputImage = document.createElement("img");
  outputImage.classList.add("individual-user-face__streamed-user-img");
  videoElement.addEventListener("loadeddata", () => {
    setInterval(async () => {
      await outputFaceFromVideo(videoElement, outputImage);
    }, 100);
    individualUserVideoContainer.appendChild(videoElement);
    individualUserVideoContainer.appendChild(outputImage);
    userVidContainer.appendChild(individualUserVideoContainer);
  });
};

const outputFaceFromVideo = async (videoElement, outputImage) => {
  const detections = await faceapi.detectAllFaces(
    videoElement,
    new faceapi.TinyFaceDetectorOptions()
  );
  if (detections.length > 0) {
    await extractFace(videoElement, detections[0].box, outputImage);
  }
};

const extractFace = async (videoElement, dimensionsBox, imageElement) => {
  const extractionRegion = [
    new faceapi.Rect(
      dimensionsBox.x,
      dimensionsBox.y,
      dimensionsBox.width,
      dimensionsBox.height
    ),
  ];
  const detectedFaces = await faceapi.extractFaces(
    videoElement,
    extractionRegion
  );
  if (detectedFaces.length == 0) {
    console.log("Face not found");
  } else if (detectedFaces.length > 1) {
    console.log("Can only stream one face at a time");
  } else {
    const faceImg = detectedFaces[0];
    imageElement.src = faceImg.toDataURL();
  }
};
