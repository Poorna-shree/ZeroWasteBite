import { io } from "socket.io-client";

let socket;

export const initChatSocket = () => {
  if (!socket) {
    socket = io("http://localhost:8000", { withCredentials: true });
  }
  return socket;
};

export const joinChatRoom = (shopOrderId) => {
  socket?.emit("join-room", shopOrderId);
};

export const leaveChatRoom = (shopOrderId) => {
  socket?.emit("leave-room", shopOrderId);
};

export const sendMessageSocket = ({ shopOrderId, senderId, text }) => {
  socket?.emit("send-message", { shopOrderId, senderId, text });
};

export const onReceiveMessage = (callback) => {
  socket?.on("receive-message", callback);
};
