"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export function useSocket() {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize connection
    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Helper to join room
  const joinRoom = (roomId, username) => {
    if (socketRef.current) {
      socketRef.current.emit("join-room", { roomId, username });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    joinRoom,
  };
}
