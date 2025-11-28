const { Server } = require("socket.io");

const PORT = 3001;

const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Store users per room: { roomId: [ { id, name, color, animal } ] }
const roomUsers = {};

const ANIMALS = ["Cat", "Dog", "Fish", "Rabbit", "Bird", "Turtle"];
const COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
];

const getRandomAvatar = () => ({
  animal: ANIMALS[Math.floor(Math.random() * ANIMALS.length)],
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
});

console.log(`> SharePad Server ready on http://localhost:${PORT}`);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    // Initialize room if not exists
    if (!roomUsers[roomId]) roomUsers[roomId] = [];

    // Add user with random avatar
    const user = { id: socket.id, name: username, ...getRandomAvatar() };
    roomUsers[roomId].push(user);

    // Broadcast updated user list to everyone in room
    io.to(roomId).emit("room-users", roomUsers[roomId]);

    console.log(`${username} joined ${roomId}`);
  });

  // Data Sync Events
  socket.on("text-update", ({ roomId, content }) =>
    socket.to(roomId).emit("text-update", content)
  );
  socket.on("draw-line", ({ roomId, drawData }) =>
    socket.to(roomId).emit("draw-line", drawData)
  );
  socket.on("clear-canvas", ({ roomId }) =>
    socket.to(roomId).emit("clear-canvas")
  );

  socket.on("disconnect", () => {
    // Remove user from all rooms
    for (const roomId in roomUsers) {
      const index = roomUsers[roomId].findIndex((u) => u.id === socket.id);
      if (index !== -1) {
        roomUsers[roomId].splice(index, 1);
        io.to(roomId).emit("room-users", roomUsers[roomId]); // Update remaining users
        if (roomUsers[roomId].length === 0) delete roomUsers[roomId]; // Cleanup empty rooms
      }
    }
  });
});
