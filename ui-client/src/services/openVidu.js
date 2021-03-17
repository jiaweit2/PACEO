import { OpenVidu } from "openvidu-browser";

const openVidu = new OpenVidu();

const session = openVidu.initSession();

export const connectToSession = async (token, username, options = {}) => {
  session.on("streamCreated", (event) => {
    const subscriber = session.subscribe(event.stream, "user-videos-container");

    subscriber.on("videoElementCreated", (event) => {
      // appendUserData(event.element, subscriber.stream.connection);
      console.log(event);
    });
  });
  await session.connect(token, { clientData: username });
  startUserVideo(session);
};

const startUserVideo = (session) => {
  const publisher = openVidu.initPublisher("user-videos-container", {
    publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
    publishVideo: true, // Whether you want to start publishing with your video enabled or not
    resolution: "640x480", // The resolution of your video
    frameRate: 30, // The frame rate of your video
    insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
    mirror: false, // Whether to mirror your local video or not
  });
  publisher.on("videoElementCreated", (event) => {
    console.log(event);
  });
  session.publish(publisher);
};
