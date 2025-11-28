const { Server } = require("socket.io");

const PORT = 3001;

const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

console.log(
  `> SharePad Server (Rooms Enabled) ready on http://localhost:${PORT}`
);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // 1. Join a specific Room
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined room: ${roomId}`);

    // Notify others in the room
    socket.to(roomId).emit("user-joined", { username });
  });

  // 2. Handle Text Sync (Room specific)
  socket.on("text-update", ({ roomId, content }) => {
    socket.to(roomId).emit("text-update", content);
  });

  // 3. Handle Drawing Sync (Room specific)
  socket.on("draw-line", ({ roomId, drawData }) => {
    socket.to(roomId).emit("draw-line", drawData);
  });

  // 4. Handle Clear Canvas (Room specific)
  socket.on("clear-canvas", ({ roomId }) => {
    socket.to(roomId).emit("clear-canvas");
  });

  socket.on("disconnect", () => {
    // Standard cleanup
  });
});
