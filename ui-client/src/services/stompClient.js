import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompSocket, stompClient;

export const getStompSocket = () => {
  if (!stompSocket) {
    console.log("Initializing socket...");
    stompSocket = SockJS("/sockjs");
  }
  return stompSocket;
};

export const getStompClient = () => {
  const socket = getStompSocket();
  if (!stompClient) {
    console.log("Initializing socket client...");
    stompClient = Stomp.over(socket);
  }
  return stompClient;
};
