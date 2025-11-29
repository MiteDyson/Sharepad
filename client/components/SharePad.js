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
import { toast } from "sonner";

const IconMap = { Cat, Dog, Fish, Rabbit, Bird, Turtle };

const AVATAR_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
];

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
    socket.on("room-users", setUsers);
    socket.on("user-joined", ({ username }) =>
      toast(`${username} joined`, { icon: "👋" })
    );
    return () => {
      socket.off("room-users");
      socket.off("user-joined");
    };
  }, [socket]);

  const handleCreateRoom = () => {
    if (!username) return toast.error("Enter a nickname!");
    const newId = uuidv4().slice(0, 6).toUpperCase();
    joinRoom(newId, username);
    setRoomId(newId);
    setStatus("joined");
    window.history.pushState({}, "", `?room=${newId}`);
    toast.success("Room created!");
  };

  const handleJoinRoom = () => {
    if (!username) return toast.error("Enter a nickname!");
    if (!joinCode) return toast.error("Enter a Room ID!");
    const code = joinCode.toUpperCase();
    joinRoom(code, username);
    setRoomId(code);
    setStatus("joined");
    window.history.pushState({}, "", `?room=${code}`);
    toast.success("Joined room!");
  };

  const handleLeave = () => {
    setStatus("lobby");
    setRoomId("");
    window.history.pushState({}, "", window.location.pathname);
    toast("Left session");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}?room=${roomId}`);
    toast.success("Link copied!");
  };

  return (
    // FIX: Use h-[100dvh] for mobile browsers to handle address bar resizing correctly
    // FIX: Removed 'min-h-screen' and added 'flex flex-col' to ensure full height usage
    <div className="h-[100dvh] w-full bg-background text-foreground font-sans selection:bg-zinc-200 relative overflow-hidden transition-colors duration-200 flex flex-col">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 dark:bg-purple-500 rounded-full blur-[120px] opacity-80 dark:opacity-20 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 dark:bg-blue-500 rounded-full blur-[120px] opacity-80 dark:opacity-20 animate-pulse delay-700" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col w-full max-w-5xl mx-auto h-full overflow-hidden">
        {/* Header: shrink-0 ensures it doesn't get squished, static height */}
        <header className="shrink-0 flex items-center justify-between px-4 py-4 md:py-6">
          <div
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-2xl shadow-sm transition-colors duration-200 bg-black text-white dark:bg-white dark:text-black">
              S
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              SharePad
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {status === "joined" && (
              <div className="flex -space-x-2 mr-2 md:mr-4">
                {users.slice(0, 4).map((user) => {
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
                {users.length > 4 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-muted-foreground">
                    +{users.length - 4}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 flex items-center justify-center rounded-full border shadow-sm bg-card border-border text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            {status === "joined" && (
              <>
                <div className="flex items-center gap-2 bg-card px-2 md:px-3 py-1.5 rounded-full border border-border shadow-sm max-w-[120px] md:max-w-none">
                  <span className="hidden md:inline text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Code:
                  </span>
                  <span className="font-mono font-bold text-sm truncate">
                    {roomId}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleLeave}
                  className="h-9 px-3 text-xs"
                >
                  <LogOut size={14} className="md:mr-2" />
                  <span className="hidden md:inline">Leave</span>
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Content Area: flex-1 allows it to fill space, min-h-0 allows internal scrolling */}
        <div className="flex-1 flex flex-col w-full min-h-0 overflow-y-auto px-4 pb-20 md:pb-8">
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
        className="fixed bottom-4 left-4 md:left-auto md:bottom-6 md:right-6 flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-full font-medium text-xs md:text-sm shadow-lg hover:opacity-90 transition-opacity z-50"
      >
        <Github size={16} />
        <span className="hidden md:inline">Star on GitHub</span>
      </a>
    </div>
  );
}
