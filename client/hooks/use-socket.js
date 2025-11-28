"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export function useSocket() {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Use Environment Variable for URL
    const url = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

    // 2. Initialize connection
    socketRef.current = io(url);

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

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
