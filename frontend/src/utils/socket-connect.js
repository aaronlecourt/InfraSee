import { io } from "socket.io-client";

const socket = io("https://infrasee.onrender.com/", {
    transports: ["websocket", "polling"],
  });

export default socket;