import { OpenVidu } from "openvidu-browser";
import "./faceApi";
import { streamFaceOntoSurface } from "./threejs-obj-head/threejs_obj_head";

const VID_HEIGHT = 480;
const VID_WIDTH = 640;

const openVidu = new OpenVidu();

const session = openVidu.initSession();

export const connectToSession = async (token, username, options = {}) => {
  session.on("streamCreated", (event) => {
    const subscriber = session.subscribe(event.stream, "user-videos-container");
    subscriber.on("videoElementCreated", (event) => {});
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
    streamFaceOntoSurface(videoElement);
  });
  session.publish(publisher);
};
