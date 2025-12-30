import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.io and attach to global for API access
  const io = new Server(httpServer);
  global.io = io; 

  io.on("connection", (socket) => {
    console.log(`📡 Device Connected: ${socket.id}`);

    // Donors join a 'room' based on their blood group (e.g., 'O-plus')
    socket.on("join-blood-group", (group) => {
      const roomName = group.replace("+", "-plus").replace("-", "-minus");
      socket.join(roomName);
      console.log(`🩸 User subscribed to alerts for: ${roomName}`);
    });

    socket.on("disconnect", () => console.log("❌ Device Disconnected"));
  });

  httpServer.listen(port, () => {
    console.log(`> 🚀 Ready on http://${hostname}:${port}`);
  });
});