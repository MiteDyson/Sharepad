"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "next-themes";
import { Button, cn } from "@/components/ui/design-system";
import {
  Copy,
  LogOut,
  Sun,
  Moon,
  Cat,
  Dog,
  Fish,
  Rabbit,
  Bird,
  Turtle,
  Github,
} from "lucide-react";
import { useSocket } from "@/hooks/use-socket";
import { Lobby } from "@/components/sharepad/lobby";
import { Room } from "@/components/sharepad/room";
import { toast } from "sonner"; // <--- NEW IMPORT

const IconMap = { Cat, Dog, Fish, Rabbit, Bird, Turtle };

export default function SharePad() {
  const { setTheme, theme } = useTheme();
  const { socket, joinRoom } = useSocket();

  const [status, setStatus] = useState("lobby");
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [textContent, setTextContent] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get("room");
      if (roomParam) setJoinCode(roomParam);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for new users and trigger a toast
    socket.on("room-users", (activeUsers) => {
      // Logic to detect NEW user could go here, for now we just sync list
      setUsers(activeUsers);
    });

    // We can add a specific event for joining to show a toast
    socket.on("user-joined", ({ username }) => {
      toast(`${username} joined the session`, { icon: "👋" });
    });

    return () => {
      socket.off("room-users");
      socket.off("user-joined");
    };
  }, [socket]);

  const handleCreateRoom = () => {
    if (!username) {
      toast.error("Please enter a nickname first!"); // <--- TOAST
      return;
    }
    const newRoomId = uuidv4().slice(0, 6).toUpperCase();
    joinRoom(newRoomId, username);
    setRoomId(newRoomId);
    setStatus("joined");
    window.history.pushState({}, "", `?room=${newRoomId}`);
    toast.success("Room created successfully!"); // <--- TOAST
  };

  const handleJoinRoom = () => {
    if (!username) {
      toast.error("Please enter a nickname first!"); // <--- TOAST
      return;
    }
    if (!joinCode) {
      toast.error("Please enter a Room ID!"); // <--- TOAST
      return;
    }
    const code = joinCode.toUpperCase();
    joinRoom(code, username);
    setRoomId(code);
    setStatus("joined");
    window.history.pushState({}, "", `?room=${code}`);
    toast.success("Joined room successfully!"); // <--- TOAST
  };

  const handleLeave = () => {
    setStatus("lobby");
    setRoomId("");
    window.history.pushState({}, "", window.location.pathname);
    toast("You left the session"); // <--- TOAST
  };

  const copyToClipboard = () => {
    const link = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(link);
    // REDDIT STYLE TOAST
    toast.success("Link copied to clipboard", {
      description: "Share it with your friends to collaborate.",
    });
  };

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-zinc-200 relative overflow-hidden transition-colors duration-200">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px] opacity-60 dark:opacity-20 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px] opacity-60 dark:opacity-20 animate-pulse delay-700" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div
            onClick={goHome}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background font-bold">
              S
            </div>
            <h1 className="text-xl font-bold tracking-tight">SharePad</h1>
          </div>

          <div className="flex items-center gap-3">
            {status === "joined" && (
              <div className="flex -space-x-2 mr-4">
                {users.map((user) => {
                  const Icon = IconMap[user.animal] || Cat;
                  return (
                    <div
                      key={user.id}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white shadow-sm",
                        user.color
                      )}
                      title={user.name}
                    >
                      <Icon size={14} />
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-full border shadow-sm transition-all",
                "bg-card border-border text-muted-foreground hover:text-foreground"
              )}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </button>

            {status === "joined" && (
              <>
                <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border border-border shadow-sm">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Code:
                  </span>
                  <span className="font-mono font-bold">{roomId}</span>
                  <button
                    onClick={copyToClipboard}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleLeave}
                  className="h-9 text-xs"
                >
                  <LogOut size={14} className="mr-2" /> Leave
                </Button>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
          {status === "lobby" ? (
            <Lobby
              username={username}
              setUsername={setUsername}
              joinCode={joinCode}
              setJoinCode={setJoinCode}
              textContent={textContent}
              setTextContent={setTextContent}
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
            />
          ) : (
            <Room
              socket={socket}
              roomId={roomId}
              textContent={textContent}
              setTextContent={setTextContent}
            />
          )}
        </div>
      </div>

      <a
        href="https://github.com/mitedyson/sharepad"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-full font-medium text-sm shadow-lg hover:opacity-90 transition-opacity z-50"
      >
        <Github size={16} />
        Star on GitHub
      </a>
    </div>
  );
}
