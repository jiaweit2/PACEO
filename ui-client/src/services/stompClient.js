import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompSocket, stompClient;

export const getStompSocket = () => {
  if (!stompSocket) {
    stompSocket = SockJS("/sockjs");
  }
  return stompSocket;
};

export const getStompClient = () => {
  const socket = getStompSocket();
  if (!stompClient) {
    stompClient = Stomp.over(socket);
  }
  return stompClient;
};
