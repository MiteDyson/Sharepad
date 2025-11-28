const { Server } = require("socket.io");

const PORT = 3001;

const io = new Server(PORT, {
  cors: {
    // Allow the frontend to connect
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

console.log(`> Socket.io Server ready on http://localhost:${PORT}`);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Handle Text Sync
  socket.on("text-update", (data) => {
    socket.broadcast.emit("text-update", data);
  });

  // Handle Drawing Sync
  socket.on("draw-line", ({ prevPoint, currentPoint, color }) => {
    socket.broadcast.emit("draw-line", { prevPoint, currentPoint, color });
  });

  // Handle Clear Canvas
  socket.on("clear-canvas", () => {
    socket.broadcast.emit("clear-canvas");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
