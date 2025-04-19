import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from "@/common/interfaces/socket";

export const setupSocket = (server: HTTPServer) => {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents
  >(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ A user connected : ${socket.id}`);
    socket.on("hello", (msg) => {
      console.log("👋 Message from client:", msg);
      socket.emit("basicEmit", {
        idx: new Date().getTime(),
        msg: "Hello From Server",
      });
    });
    socket.on("disconnect", () => {
      console.log("❌ User disconnected");
    });
  });

  return io;
};
