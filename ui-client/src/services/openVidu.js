import { OpenVidu } from "openvidu-browser";
import "./faceApi";

const VID_HEIGHT = 480;
const VID_WIDTH = 640;

const openVidu = new OpenVidu();

const session = openVidu.initSession();

export const connectToSession = async (token, username, options = {}) => {
  session.on("streamCreated", (event) => {
    const subscriber = session.subscribe(event.stream, undefined);
    // streamFaceOnto(subscriber, true);
  });
  await session.connect(token, { clientData: username });
  const videoElement = createUserVideoElement(username);
  await startUserVideo(videoElement);
  return videoElement;
};

export const startUserVideo = (videoElement) => {
  const publisher = openVidu.initPublisher(undefined);
  publisher.addVideoElement(videoElement);
  session.publish(publisher);
  return new Promise((resolve) => {
    videoElement.onloadedmetadata = function () {
      resolve();
    };
  });
};

const createUserVideoElement = (username) => {
  const videoElement = document.createElement("video");
  videoElement.id = username;
  videoElement.autoplay = true;
  document.body.appendChild(videoElement);
  videoElement.classList.add("user-video");
  return videoElement;
};
