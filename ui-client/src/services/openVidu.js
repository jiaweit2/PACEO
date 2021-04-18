import { OpenVidu } from "openvidu-browser";
import "./faceApi";
import { streamFaceOnto } from "./threejs-obj-head/threejs_obj_head";

const VID_HEIGHT = 480;
const VID_WIDTH = 640;

const openVidu = new OpenVidu();

const session = openVidu.initSession();

export const connectToSession = async (token, username, options = {}) => {
  session.on("streamCreated", (event) => {
    const subscriber = session.subscribe(event.stream, undefined);
    streamFaceOnto(subscriber, true);
  });
  await session.connect(token, { clientData: username });
  startUserVideo();
};

export const startUserVideo = () => {
  const publisher = openVidu.initPublisher(undefined);
  streamFaceOnto(publisher, false, true);
  session.publish(publisher);
};
